import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, TemplateRef, ViewChild } from "@angular/core";
import { Client } from "@app/shared/models";
import { DraftTransaction } from "@app/shared/models/transaction";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import { PosService } from "app/pos/pos.service";
import { tap } from "rxjs";

declare const bootstrap: any;

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements AfterViewInit, OnDestroy {
    // @ts-ignore
    @ViewChild('successRegistrationAlert', { static: false }) private successRegistrationAlert: SwalComponent;

    @Input({ required: true }) transaction: DraftTransaction = new DraftTransaction();
    @Input({ required: true }) disabled: boolean = false;

    @Output() onRegisterSuccess: EventEmitter<void> = new EventEmitter<void>();
    @Output() onRegisterFail: EventEmitter<void> = new EventEmitter<void>();

    warnings: string[] = [];

    private _currentModal: any | undefined = undefined;

    get confirmationLabel(): string {
        if (this.transaction.type === 'COBRADO') {
            return 'Confirmar';
        };

        return 'Continuar'
    }

    constructor(private posService: PosService) {}

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
    }

    searchClient(document: string): void {
        const value = document.trim();
        if (!value.match(/^\d{8,11}$/)) {
            return;
        }

        this.posService.searchClient(value).subscribe({
            next: (client: Client) => {
                this.transaction.client = client;
            },
            error: console.error
        })
    }

    launchModal(modal: HTMLDivElement): void {
        const client = new Client();
        client.name = "";
        this.transaction.client = client;

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
        this.posService.register(this.transaction).pipe(tap(() => setTimeout(() => this.onRegisterSuccess.emit(), 1_500))).subscribe({
            next: () => {
                this.successRegistrationAlert.fire()
                    .then(() => this.posService.restartCurrentTransaction())
            },
            complete: () => {
                this.closeModal();
            }
        })
    }
}
