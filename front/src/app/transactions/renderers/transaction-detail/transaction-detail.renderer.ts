import { Component } from "@angular/core";
import { DraftTransaction, Transaction } from "@app/shared/models/transaction";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";

@Component({
    selector: 'btn-cell-renderer',
    templateUrl: './transaction-detail.renderer.html',
})
export class BtnTransactionDetailRenderer implements ICellRendererAngularComp {
    // @ts-ignore
    public params: any;

    agInit(params: any): void {
        this.params = params;
    }

    refresh(params: any): boolean {
        return false;
    }

    onClick() {
        this.params.clicked(this.params.value);
    }
}
