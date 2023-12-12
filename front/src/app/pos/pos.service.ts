import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Category, Client, Product } from "@app/shared/models";
import { DraftTransaction, Item, TransactionType } from "@app/shared/models/transaction";
import { BehaviorSubject, Observable, map, tap } from "rxjs";

@Injectable({
    providedIn: 'platform'
})
export class PosService {
    private _currentTransaction: BehaviorSubject<DraftTransaction>= new BehaviorSubject<DraftTransaction>(new DraftTransaction());

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
        const currentIndex = this._currentTransaction.value.items.findIndex(x => x.product._id === product._id);

        let items = this._currentTransaction.value.items;

        if (currentIndex >= 0) {
            items[currentIndex].quantity = items[currentIndex].quantity + 1;
        } else {
            items = [...items, new Item(product.clone())]
        }

        const transaction = DraftTransaction.fromJson(<any>{...this._currentTransaction.value.json(), items: items.map(x => x.json())});
        this._currentTransaction.next(transaction);
    }

    removeProduct(productId: string) {
        const items = this._currentTransaction.value.items.filter(x => x.product._id !== productId);
        const transaction = new DraftTransaction(items);
        this._currentTransaction.next(transaction);
    }

    changeType(type: TransactionType) {
        const transaction = this._currentTransaction.value.json();
        this._currentTransaction.next(DraftTransaction.fromJson(<any>{...transaction, type}));
    }

    plusOne(productId: string) {
        const items = this.currentTransaction.items.map((item) => {
            if (item.product._id === productId) {
                item.quantity = item.quantity + 1;
            }

            return item;
        });

        this._currentTransaction.next(DraftTransaction.fromJson(<any>{...this._currentTransaction.value.json(), items: items.map(x => x.json())}));
    }

    minusOne(productId: string) {
        const items = this.currentTransaction.items.map((item) => {
            if (item.product._id === productId && item.quantity > 1) {
                item.quantity = item.quantity - 1;
            }

            return item;
        });

        this._currentTransaction.next(DraftTransaction.fromJson(<any>{...this._currentTransaction.value.json(), items: items.map(x => x.json())}));
    }

    removeItem(productId: string) {
        const items = this.currentTransaction.items.filter(x => x.product._id !== productId);
        this._currentTransaction.next(DraftTransaction.fromJson(<any>{...this._currentTransaction.value.json(), items: items.map(x => x.json())}));
    }

    restartCurrentTransaction() {
        this._currentTransaction.next(new DraftTransaction());
    }

    register(transaction: DraftTransaction): Observable<{ _id: string }> {
        return this.http.post<{ _id: string }>(`/api/v1/transactions`, transaction.json());
    }

    getAllClients(): Observable<Client[]> {
        return this.http.get<Client[]>(`/api/v1/clients`).pipe(
            map((res: any[]) => Client.fromList(res))
        );
    }
}
