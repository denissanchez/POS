import { Component } from "@angular/core";
import { AuthService } from "@app/auth.service";
import { CAN_CREATE_USERS, User } from "@app/shared/models/user";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";

@Component({
    selector: 'btn-user-detail-renderer',
    template: `<a *ngIf="canEdit" type="button" class="btn btn-sm btn-info mb-2" [routerLink]="['/usuarios', 'editar', params.value?._id]">
        <i class="bi bi-person-fill-gear"></i> Editar
    </a>`
})
export class BtnUserEditRenderer implements ICellRendererAngularComp {
    // @ts-ignore
    public params: ICellRendererParams<User, User>;
    public canEdit: boolean = false;

    constructor(private authService: AuthService) {
    }

    agInit(params: ICellRendererParams<User, User>): void {
        this.params = params;
        this.authService.can(CAN_CREATE_USERS).subscribe(can => this.canEdit = can);
    }

    refresh(params: any): boolean {
        return false;
    }
}
