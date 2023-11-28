import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";

declare const bootstrap: any;


@Component({
    selector: 'app-transaction-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
})
export class TransactionDetailComponent implements AfterViewInit {
    private modal: any;

    @ViewChild('transactionDetail', { static: false }) transactionDetailRef!: ElementRef<HTMLDivElement>;

    ngAfterViewInit(): void {
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
