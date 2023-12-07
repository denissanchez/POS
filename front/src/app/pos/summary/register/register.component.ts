import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, TemplateRef, ViewChild } from "@angular/core";
import { Client } from "@app/shared/models";
import { DraftTransaction, TransactionType } from "@app/shared/models/transaction";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import { PosService } from "app/pos/pos.service";
import { tap } from "rxjs";
import { SweetAlertResult } from "sweetalert2";

declare const bootstrap: any;

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements AfterViewInit, OnDestroy {
    // @ts-ignore
    @ViewChild('successRegistrationAlert', { static: false }) private successRegistrationAlert: SwalComponent;
    // @ts-ignore
    @ViewChild('errorRegistrationAlert', { static: false }) private errorRegistrationAlert: SwalComponent;
    // @ts-ignore
    @ViewChild('cleanDetailConfirmation', { static: false }) private cleanDetailConfirmation: SwalComponent;
    // @ts-ignore
    @ViewChild('clientDocument', { static: false }) private clientDocumentRef: ElementRef;

    @Input({ required: true }) disabled: boolean = false;
    @Input({ required: true }) type: TransactionType = 'COBRADO';

    @Output() onRegisterSuccess: EventEmitter<void> = new EventEmitter<void>();
    @Output() onRegisterFail: EventEmitter<void> = new EventEmitter<void>();

    currentTransaction: DraftTransaction = new DraftTransaction();
    warnings: string[] = [];

    private _currentModal: any | undefined = undefined;

    get confirmationLabel(): string {
        if (this.type === 'COBRADO') {
            return 'Confirmar';
        };

        return 'Continuar'
    }

    constructor(private posService: PosService) {}

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
    }

    onShowRegisterForm() {
        this.currentTransaction = this.posService.currentTransaction;
        this.warnings = this.currentTransaction.getUnsatisfiedProducts();        
    }

    searchClient(document: string): void {
        const value = document.trim();
        if (!value.match(/^\d{8,11}$/)) {
            return;
        }

        this.posService.searchClient(value).subscribe({
            next: (client: Client) => {
                this.currentTransaction.client = client;
            },
            error: console.error
        })
    }

    onChangeValidUntil(e: string) {
        try {
            this.currentTransaction.validUntil = new Date(e);
        } catch (e) {
            console.error(e)
            this.currentTransaction.validUntil = new Date();
        }
    }

    launchModal(modal: HTMLDivElement): void {
        const client = new Client();
        client.name = "";
        this.currentTransaction.client = client;

        this._currentModal = new bootstrap.Modal(modal, { backdrop: 'static', keyboard: false, focus: true });
        this._currentModal.show();

        setTimeout(() => {
            modal.querySelector<HTMLInputElement>('#clientName')?.focus();
        }, 500)
    }

    closeModal(): void {
        this._currentModal.hide();
    }

    register(): void {
        this.posService.register(this.currentTransaction).pipe(tap(() => setTimeout(() => this.onRegisterSuccess.emit(), 1_500))).subscribe({
            next: () => {
                this.successRegistrationAlert.fire()
                    .then(() => this.posService.restartCurrentTransaction())
            }
        })
    }

    onRegister() {
        this.posService.register(this.currentTransaction).pipe(tap(() => setTimeout(() => this.onRegisterSuccess.emit(), 1_500))).subscribe({
            next: () => {
                this.successRegistrationAlert.fire()
                    .then(() => this.cleanDetailConfirmation.fire())
                    .then((result: SweetAlertResult) => {
                        if (result.isConfirmed) {
                            this.posService.restartCurrentTransaction();
                        }
                    });
            },
            error: () => {
                this.errorRegistrationAlert.fire();
            }
        })
    }
}
