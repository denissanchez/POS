import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { PosService } from "../pos.service";
import { Observable } from "rxjs";
import { DraftTransaction, Item } from "@app/shared/models/transaction";
import { Product } from "@app/shared/models";

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit, AfterViewInit, OnDestroy {
    // @ts-ignore
    @ViewChild('searchCode', { static: false }) private searchCode: ElementRef;

    currentTransaction$: Observable<DraftTransaction>;

    constructor(private posService: PosService) {
        this.currentTransaction$ = this.posService.currentTransaction$;
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.searchCode.nativeElement.addEventListener('keydown', this.onCodeSubmitted.bind(this));
    }

    ngOnDestroy(): void {
        this.searchCode.nativeElement.removeEventListener('keydown', this.onCodeSubmitted.bind(this));
    }

    onCodeSubmitted(e?: KeyboardEvent) {
        if (!!e && e.code !== 'Enter') {
            return;
        }

        const productId = this.searchCode.nativeElement.value.trim();

        if (productId === "") {
            return
        }

        this.posService.getProductById(productId).subscribe({
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

    onCancelTransaction() {
        this.posService.restartCurrentTransaction();
    }

    trackByProductId(index: number, item: Item) {
        return item.product._id;
    }
}
