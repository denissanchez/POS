import { Component, OnInit } from "@angular/core";
import { Transaction } from "@app/shared/models/transaction";
import { ColDef } from 'ag-grid-community';
import { Observable, of } from "rxjs";
import { TransactionsService } from "./transactions.service";
import { UserService } from "@app/shared/services/user.service";
import { CAN_VIEW_METRICS } from "@app/shared/models/user";

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
    public columnDefs: ColDef[] = [
        { field: 'client.name', headerName: 'Cliente' },
        { field: 'type', headerName: 'Tipo' },
        { field: 'note', headerName: 'Nota' },
        { field: 'total', headerName: 'Total', valueFormatter: (params) => `S/ ${params.value.toFixed(2)}` },
        { field: 'validUntil', headerName: 'Válido hasta', valueFormatter: (params) => new Date(params.value).toLocaleDateString()},
        { field: 'createdAt', headerName: 'Fecha de registro', valueFormatter: (params) => new Date(params.value).toLocaleDateString()},
    ];
    public defaultColDef: ColDef = {
        sortable: true,
        filter: true,
    };

    public canShowMetrics: boolean = false;

    public transactions$: Observable<Transaction[]> = of([]);

    constructor(private userService: UserService, private transactionsService: TransactionsService) {
    }

    ngOnInit(): void {
        this.canShowMetrics = this.userService.can(CAN_VIEW_METRICS);
        this.transactions$ = this.transactionsService.getAll(new Date(), new Date());
    }
}
