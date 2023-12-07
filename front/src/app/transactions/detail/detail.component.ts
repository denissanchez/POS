import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from "@angular/core";
import { TransactionsService } from "../transactions.service";
import { Observable, tap, timeout } from "rxjs";
import { Transaction } from "@app/shared/models/transaction";
import { ActivatedRoute } from "@angular/router";

declare const bootstrap: any;


@Component({
    selector: 'app-transaction-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionDetailComponent {
    private modal: any;

    @ViewChild('transactionDetail', { static: false }) transactionDetailRef!: ElementRef<HTMLDivElement>;

    transaction$: Observable<Transaction>;

    constructor(private transactionsService: TransactionsService, private route: ActivatedRoute) {
        this.transaction$ = this.transactionsService.getById(this.route.snapshot.params['id']).pipe(
            timeout(250),
            tap(_ => this.showModal())
        );
    }

    showModal(): void {
        this.modal = new bootstrap.Modal(this.transactionDetailRef.nativeElement, {
            backdrop: 'static',
            keyboard: false
        })
        this.modal.show()
    }

    onClose() {
        this.modal.hide();
    }
}
