import { Component, OnInit } from "@angular/core";
import { Transaction } from "@app/shared/models/transaction";
import { ColDef } from 'ag-grid-community';
import { Observable, of } from "rxjs";
import { TransactionsService } from "./transactions.service";
import { CAN_VIEW_METRICS } from "@app/shared/models/user";
import { BtnTransactionDetailRenderer } from "./renderers/transaction-detail/transaction-detail.renderer";
import { AuthService } from "@app/auth.service";


declare const bootstrap: any;

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
    public columnDefs: ColDef[] = [
        { field: 'createdAt', headerName: 'Fecha de registro', valueFormatter: (params) => new Date(params.value).toLocaleDateString()},
        { field: 'client.name', headerName: 'Cliente' },
        { field: 'type', headerName: 'Tipo' },
        { field: 'note', headerName: 'Nota' },
        { field: 'total', headerName: 'Total', valueFormatter: (params) => `S/ ${params.value.toFixed(2)}` },
        { field: 'validUntil', headerName: 'Válido hasta', valueFormatter: (params) => new Date(params.value).toLocaleDateString()},
        {
            field: 'detail',
            headerName: '',
            cellRenderer: BtnTransactionDetailRenderer,
            valueGetter: (params) => params.data,
            cellRendererParams: {
                clicked: (e: any) => {
                    const modal = new bootstrap.Modal(document.getElementById('transactionDetail'), {
                        keyboard: false
                    })
                    modal.show()
                }
            }
        }
    ];
    public defaultColDef: ColDef = {
        sortable: true,
        filter: true,
    };

    public canViewMetrics: boolean = false;

    public transactions$: Observable<Transaction[]> = of([]);

    constructor(private authService: AuthService, private transactionsService: TransactionsService) {
    }

    ngOnInit(): void {
        this.authService.getCurrentUser().subscribe((user) => {this.canViewMetrics = user.can(CAN_VIEW_METRICS)})
        this.transactions$ = this.transactionsService.getAll(new Date(), new Date());
    }
}
