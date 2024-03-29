import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { PosService } from "../pos.service";
import { Observable, take } from "rxjs";
import { DraftTransaction, Item, Transaction, TransactionType } from "@app/shared/models/transaction";
import { Product } from "@app/shared/models";
import { Socket, io } from 'socket.io-client';
import NoSleep from 'nosleep.js';
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('searchCode', { static: false }) private searchCode!: ElementRef;

    @Output() onRegisterSuccess: EventEmitter<void> = new EventEmitter<void>();

    private _noSleep = new NoSleep();
    private socket!: Socket;

    currentTransaction$: Observable<DraftTransaction>;

    constructor(private posService: PosService, private route: ActivatedRoute, private changeDetector: ChangeDetectorRef) {
        this.currentTransaction$ = this.posService.currentTransaction$;
    }

    ngOnInit(): void {
        const quotation = this.route.snapshot.queryParams['quotation'];

        console.log(quotation)

        if (quotation) {
            this.posService.getTransactionById(quotation).pipe(take(1)).subscribe({
                next: (transaction: Transaction) => {
                    this.posService.loadTransaction(transaction);
                }
            })
        }
    }

    ngAfterViewInit(): void {
        this._noSleep.enable();

        this.socket = io('/');

        this.socket.on('summary:capture', (product) => {
            setTimeout(() => {
                this.searchCode.nativeElement.focus();
            }, 50);
        });

        this.socket.on('summary:cancel', (product) => {
            this.onCancelTransaction();
            this.socket.emit('summary:sync', this.posService.currentTransaction.json());
        });

        this.socket.on('summary:sync_request', () => {
            this.socket.emit('summary:sync', this.posService.currentTransaction.json());
        })

        this.socket.on('summary:plus_one', (productId: string) => {
            this.posService.plusOne(productId);
            this.socket.emit('summary:sync', this.posService.currentTransaction.json());
        })

        this.socket.on('summary:minus_one', (productId: string) => {
            this.posService.minusOne(productId);
            this.socket.emit('summary:sync', this.posService.currentTransaction.json());
        })

        this.socket.on('summary:remove', (productId: string) => {
            this.posService.removeProduct(productId);
            this.socket.emit('summary:sync', this.posService.currentTransaction.json());
        })

        this.searchCode.nativeElement.addEventListener('keydown', this.onCodeSubmitted.bind(this));
    }

    ngOnDestroy(): void {
        this.socket.disconnect();
        this._noSleep.disable();
        this.searchCode.nativeElement.removeEventListener('keydown', this.onCodeSubmitted.bind(this));
        this.posService.restartCurrentTransaction();
    }

    onCodeSubmitted(e?: KeyboardEvent) {
        if (!!e && e.code !== 'Enter') {
            return;
        }

        const productId = this.searchCode.nativeElement.value.trim().toUpperCase();

        if (productId === "") {
            return
        }

        this.searchCode.nativeElement.value = "";

        this.posService.getProductById(productId, true).subscribe({
            next: (product: Product) => {
                this.posService.addProduct(product)

                this.searchCode.nativeElement.value = ""
            },
            error: console.error
        })
    }

    onDelete(productId: string) {
        this.posService.removeProduct(productId)
    }

    changeType(type: TransactionType) {
        this.changeDetector.detach();
        this.posService.changeType(type);
        this.changeDetector.detectChanges();
        this.changeDetector.reattach();
    }

    onCancelTransaction() {
        this.posService.restartCurrentTransaction();
    }
}
