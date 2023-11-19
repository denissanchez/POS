import { Component, Input, ViewChild } from "@angular/core";
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
    @Input({ required: true }) disabled: boolean = false;

    currentTransaction: DraftTransaction = new DraftTransaction();
    warnings: string[] = [];

    constructor(private posService: PosService) {}

    onShowRegisterForm() {
        this.currentTransaction = this.posService.currentTransaction;
        this.warnings = this.currentTransaction.getUnsatisfiedProducts();
    }

    onRegister() {
        this.errorRegistrationAlert.fire();
    }
}
