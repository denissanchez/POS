import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Transaction } from "@app/shared/models/transaction";
import { map } from "rxjs";

@Injectable({
    providedIn: 'any'
})
export class TransactionsService {
    constructor(private http: HttpClient) { }

    getAll(from: Date, to: Date) {
        return this.http.get<Transaction[]>('/api/v1/transactions').pipe(
            map(x => Transaction.fromList(x))
        )
    }
}
