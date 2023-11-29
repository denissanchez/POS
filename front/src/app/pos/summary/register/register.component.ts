import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { DraftTransaction } from "@app/shared/models/transaction";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import { PosService } from "app/pos/pos.service";
import { Subscription, debounceTime, fromEvent, map, tap } from "rxjs";
import { SweetAlertResult } from "sweetalert2";

declare const bootstrap: any;

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements AfterViewInit {
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

    searchClientSubscription: Subscription | undefined;

    constructor(private posService: PosService) {}

    ngAfterViewInit(): void {
        this.searchClientSubscription = fromEvent(this.clientDocumentRef.nativeElement, 'input')
            .pipe(
                map((t: any) => t.target.value.trim()),
                debounceTime(500),
            ).subscribe({
                next: () => {
                    this.currentTransaction.client.name = "DERCO S.A.";
                    this.currentTransaction.client.phone = "950462729";
                },
                error: console.error    
            })
    }

    onShowRegisterForm() {
        this.currentTransaction = this.posService.currentTransaction;
        this.warnings = this.currentTransaction.getUnsatisfiedProducts();        
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
