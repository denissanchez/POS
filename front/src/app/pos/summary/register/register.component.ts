import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from "@angular/core";
import { Client } from "@app/shared/models";
import { DraftTransaction } from "@app/shared/models/transaction";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import { PosService } from "app/pos/pos.service";
import { Subscription, debounceTime, fromEvent, map, mergeMap, of, tap, throwError } from "rxjs";
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

    @Output() onRegisterSuccess: EventEmitter<void> = new EventEmitter<void>();
    @Output() onRegisterFail: EventEmitter<void> = new EventEmitter<void>();

    currentTransaction: DraftTransaction = new DraftTransaction();
    warnings: string[] = [];

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
