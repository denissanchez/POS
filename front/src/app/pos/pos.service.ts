import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Category, Product } from "@app/shared/models";
import { DraftTransaction, Item } from "@app/shared/models/transaction";
import { BehaviorSubject, Observable, map } from "rxjs";

@Injectable({
    providedIn: 'platform'
})
export class PosService {
    private _currentTransaction: BehaviorSubject<DraftTransaction>= new BehaviorSubject<DraftTransaction>(new DraftTransaction());

    public get currentTransaction$(): Observable<DraftTransaction> {
        return this._currentTransaction.asObservable();
    }

    constructor(private http: HttpClient) {
    }

    getCategories(): Observable<Category[]> {
        return this.http.get<Array<Record<string, string>>>(`/api/v1/categories`).pipe(
            map((res) => [new Category('', 'TODAS'), ...Category.fromList(res)])
        )
    }

    getAvailableProducts(search: string = "", category: string = ""): Observable<Product[]> {
        return this.http.get<Array<Record<string, string | number>>>(`/api/v1/products?q=${search}&category=${category}`).pipe(
            map((res) => Product.fromList(res))
        );
    }

    addProduct(product: Product) {
        const currentIndex = this._currentTransaction.value.items.findIndex(x => x.product._id === product._id);

        let items = this._currentTransaction.value.items;

        if (currentIndex >= 0) {
            items[currentIndex].quantity = items[currentIndex].quantity + 1;
        } else {
            items = [...items, new Item(product)]
        }

        const transaction = new DraftTransaction(items);
        this._currentTransaction.next(transaction);
    }

    restartCurrentTransaction() {
        this._currentTransaction.next(new DraftTransaction());
    }
}
