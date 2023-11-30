import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Category, Client, Product } from "@app/shared/models";
import { DraftTransaction, Item } from "@app/shared/models/transaction";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import { BehaviorSubject, Observable, map, of } from "rxjs";
import { SweetAlertResult } from "sweetalert2";

@Injectable({
    providedIn: 'platform'
})
export class PosService {
    private _currentTransaction: BehaviorSubject<DraftTransaction>= new BehaviorSubject<DraftTransaction>(new DraftTransaction());

    private _lowStockSwal: SwalComponent | undefined;
    private _exceededStockSwal: SwalComponent | undefined;

    public set lowStockSwal(swal: SwalComponent) {
        this._lowStockSwal = swal;
    }

    public set exceededStockSwal(swal: SwalComponent) {
        this._exceededStockSwal = swal;
    }

    public get currentTransaction(): DraftTransaction {
        return this._currentTransaction.value;
    }

    public get currentTransaction$(): Observable<DraftTransaction> {
        return this._currentTransaction.asObservable();
    }

    constructor(private http: HttpClient) {
    }

    searchClient(document: string): Observable<Client> {
        return this.http.get<Client>(`/api/v1/clients/${document}`).pipe(
            map((res: any) => Client.fromJson(res))
        );
    }

    getCategories(): Observable<Category[]> {
        return this.http.get<Array<Record<string, string>>>(`/api/v1/categories`).pipe(
            map((res) => [new Category('', 'TODAS'), ...Category.fromList(res)])
        )
    }

    getProductById(_id: string, scanned: boolean = false): Observable<Product> {
        return this.http.get<Record<string, string | number>>(`/api/v1/products/${_id}?scanned=${Number(scanned)}`).pipe(
            map((res) => Product.fromJson(res))
        )
    }

    getAvailableProducts(search: string = "", category: string = ""): Observable<Product[]> {
        return this.http.get<Array<Record<string, string | number>>>(`/api/v1/products?q=${search}&category=${category}`).pipe(
            map((res) => Product.fromList(res))
        );
    }

    async addProduct(product: Product) {
        if (product.quantity == 0) {
            if (this._lowStockSwal) {
                const result: SweetAlertResult = await this._lowStockSwal.fire();

                if (!result.isConfirmed) {
                    return;
                }
            } else {
                const confirmed = confirm("Producto sin stock. Desea agregarlo?")

                if (!confirmed) {
                    return;
                }
            }
        }

        const currentIndex = this._currentTransaction.value.items.findIndex(x => x.product._id === product._id);

        let items = this._currentTransaction.value.items;

        if (currentIndex >= 0) {
            if (product.quantity < items[currentIndex].quantity + 1) {

                if (this._exceededStockSwal) {
                    const result: SweetAlertResult = await this._exceededStockSwal.fire();

                    if (!result.isConfirmed) {
                        return;
                    }
                } else { 
                    const confirmed = confirm("No hay más unidades en stock. Desea agregar de todas maneras?")

                    if (!confirmed) {
                        return;
                    }
                }
            }

            items[currentIndex].quantity = items[currentIndex].quantity + 1;
        } else {
            items = [...items, new Item(product.clone())]
        }

        const transaction = new DraftTransaction(items);
        this._currentTransaction.next(transaction);
    }

    removeProduct(productId: string) {
        const items = this._currentTransaction.value.items.filter(x => x.product._id !== productId);
        const transaction = new DraftTransaction(items);
        this._currentTransaction.next(transaction);
    }

    restartCurrentTransaction() {
        this._currentTransaction.next(new DraftTransaction());
    }

    register(transaction: DraftTransaction) {
        return this.http.post<void>(`/api/v1/transactions`, transaction.json());
    }
}
