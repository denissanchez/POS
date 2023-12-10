import { Component } from "@angular/core";
import { Transaction } from "@app/shared/models/transaction";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";

@Component({
    selector: 'btn-user-detail-renderer',
    template: `<a type="button" class="btn btn-sm btn-success mb-2" [routerLink]="['/usuarios', params.value?._id]">
        <i class="bi bi-check"></i> Detalle
    </a>`
})
export class BtnUserDetailRenderer implements ICellRendererAngularComp {
    // @ts-ignore
    public params: ICellRendererParams<Transaction, Transaction>;

    agInit(params: ICellRendererParams<Transaction, Transaction>): void {
        this.params = params;
    }

    refresh(params: any): boolean {
        return false;
    }
}
