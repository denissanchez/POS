import { Component, ViewChild } from "@angular/core";
import { AuthService } from "@app/auth.service";
import { Transaction } from "@app/shared/models/transaction";
import { CAN_REMOVE_USERS } from "@app/shared/models/user";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";
import { UsersService } from "../users.service";
import { Router } from "@angular/router";

@Component({
    selector: 'btn-user-remove-renderer',
    template: `
    <swal
        #confirmationAlert
        title="¿Está seguro de eliminar este usuario?"
        text="Esta acción no se puede deshacer"
        icon="warning"
        confirmButtonText="Eliminar"
        cancelButtonText="Cancelar"
        [showCancelButton]="true">
    </swal>

    <swal
        #completeAlert
        title="Se completó la acción"
        icon="success"
        confirmButtonText="Aceptar">
    </swal>

    <swal
        #errorAlert
        title="Algo salió mal"
        text="No se pudo eliminar el usuario"
        icon="error"
        confirmButtonText="Aceptar">
    </swal>

    <button *ngIf="canRemove" type="button" class="btn btn-sm btn-warning mb-2" (click)="onClick()">
        <i class="bi bi-person-dash"></i> Eliminar
    </button>`
})
export class BtnUserRemoveRenderer implements ICellRendererAngularComp {
    // @ts-ignore
    public params: ICellRendererParams<User, User>;

    public canRemove: boolean = false;
    @ViewChild('confirmationAlert', { static: false }) private confirmationAlertRef!: SwalComponent;
    @ViewChild('completeAlert', { static: false }) private completeAlertRef!: SwalComponent;
    @ViewChild('errorAlert', { static: false }) private errorAlertRef!: SwalComponent;

    constructor(private authService: AuthService, private usersService: UsersService, private router: Router) {
    }

    agInit(params: ICellRendererParams<Transaction, Transaction>): void {
        this.params = params;
        this.authService.can(CAN_REMOVE_USERS).subscribe(can => this.canRemove = can);
    }

    onClick() {
        this.confirmationAlertRef.fire().then((result) => {
            if (result.isConfirmed) {
                this.usersService.remove(this.params.data._id).subscribe({
                    next: () => {
                        this.completeAlertRef.fire().then(() => window.location.reload());
                    },
                    error: () => {
                        this.errorAlertRef.fire();
                    }
                })
            }
        });
    }

    refresh(params: any): boolean {
        return false;
    }
}
