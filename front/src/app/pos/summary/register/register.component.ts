import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from "@angular/core";
import { Client } from "@app/shared/models";
import { DraftTransaction } from "@app/shared/models/transaction";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import { PosService } from "app/pos/pos.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, map, of, take, tap } from "rxjs";

declare const bootstrap: any;

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('successRegistrationAlert', { static: false }) private successRegistrationAlert!: SwalComponent;

    @Input({ required: true }) transaction: DraftTransaction = new DraftTransaction();
    @Input({ required: true }) disabled: boolean = false;

    @Output() onRegisterSuccess: EventEmitter<void> = new EventEmitter<void>();
    @Output() onRegisterFail: EventEmitter<void> = new EventEmitter<void>();

    warnings: string[] = [];

    private _currentModal: any | undefined = undefined;

    private _clients: Client[] = [];

    get confirmationLabel(): string {
        if (this.transaction.type === 'COBRADO') {
            return 'Confirmar';
        };

        return 'Continuar'
    }

    constructor(private posService: PosService, private ngxSpinner: NgxSpinnerService) {}

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
    }

    onChangeClient(event: { label: string } | Client) {
        if (typeof event === 'string') {
            this.transaction.client = new Client(event);
            return;
        }

        if (!event) {
            this.transaction.client = new Client();
            return;
        }

        if (typeof event === 'object' && '_id' in event) {
            this.transaction.client = event;
        } else {
            this.transaction.client = new Client(event.label);
        }
    }

    onUpdateClientDoc(doc: string) {
      if (doc.length !== 8 && doc.length !== 11) {
        return
      }

      const client = this._clients.find((x) => x._id === doc)

      if (client) {
        this.transaction.client = Client.fromJson(client.json())
      } else {
        this.transaction.client = new Client(doc)
      }
    }

    launchModal(modal: HTMLDivElement): void {
        const client = new Client();
        client.name = "";
        this.transaction.client = client;

        this._currentModal = new bootstrap.Modal(modal, { backdrop: 'static', keyboard: false, focus: true });
        this._currentModal.show();

        this.posService.getAllClients().pipe(take(1)).subscribe({
          next: (clients) => {
            this._clients = [...clients]
          }
        })

        setTimeout(() => {
            modal.querySelector<HTMLInputElement>('#clientName')?.focus();
        }, 500)
    }

    closeModal(): void {
        this._currentModal?.hide();
    }

    register(): void {
        this.ngxSpinner.show();

        this.posService.register(this.transaction).pipe(tap(() => setTimeout(() => this.onRegisterSuccess.emit(), 1_500))).subscribe({
            next: (response: { _id: string }) => {
                this.successRegistrationAlert.fire()
                    .then(() => {
                        if (this.transaction.type === 'COTIZACION') {
                            window.open(`/api/v1/transactions/print/${response._id}`, '_blank');
                        }
                    })
                    .then(() => this.posService.restartCurrentTransaction())
            },
            complete: () => {
                this.closeModal();
                this.ngxSpinner.hide();
            }
        })
    }
}
