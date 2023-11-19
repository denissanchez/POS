import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Category, Product } from "@app/shared/models";
import { Observable, map } from "rxjs";

@Injectable({
    providedIn: 'platform'
})
export class PosService {
    constructor(private http: HttpClient) {
    }

    getCategories(): Observable<Category[]> {
        return this.http.get<Array<Record<string, string>>>(`/api/v1/categories`).pipe(
            map((res) => Category.fromList(res))
        )
    }

    getAvailableProducts(search: string = ""): Observable<Product[]> {
        return this.http.get<Array<Record<string, string | number>>>(`/api/v1/products?q=${search}`).pipe(
            map((res) => Product.fromList(res))
        );
    }
}
