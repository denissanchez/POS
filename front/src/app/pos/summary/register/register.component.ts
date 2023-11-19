import { Component, ViewChild } from "@angular/core";
import { DraftTransaction } from "@app/shared/models/transaction";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import { PosService } from "app/pos/pos.service";

declare const bootstrap: any;

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
    // @ts-ignore
    @ViewChild('successRegistrationAlert', { static: false }) private successRegistrationAlert: SwalComponent;
    // @ts-ignore
    @ViewChild('errorRegistrationAlert', { static: false }) private errorRegistrationAlert: SwalComponent;

    private _currentTransaction: DraftTransaction = new DraftTransaction();
    warnings: string[] = [];

    constructor(private posService: PosService) {}

    onShowRegisterForm() {
        this._currentTransaction = this.posService.currentTransaction;
        this.warnings = this._currentTransaction.getUnsatisfiedProducts();
    }

    onRegister() {
        this.errorRegistrationAlert.fire();
    }
}
