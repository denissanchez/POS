import { Component, OnInit } from "@angular/core";
import { Transaction } from "@app/shared/models/transaction";
import { Observable, of } from "rxjs";
import { TransactionsService } from "./transactions.service";
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridReadyEvent } from 'ag-grid-community';

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

    public transactions$: Observable<Transaction[]> = of([]);

    constructor(private transactionsService: TransactionsService) {
    }

    ngOnInit(): void {
        this.transactions$ = this.transactionsService.getAll(new Date(), new Date());
    }


}
