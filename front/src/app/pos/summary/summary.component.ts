import { Component, OnInit } from "@angular/core";
import { PosService } from "../pos.service";
import { Observable } from "rxjs";
import { DraftTransaction, Item } from "@app/shared/models/transaction";

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
    currentTransaction$: Observable<DraftTransaction>;

    constructor(private posService: PosService) {
        this.currentTransaction$ = this.posService.currentTransaction$;
    }

    ngOnInit(): void {
    }

    onCancelTransaction() {
        this.posService.restartCurrentTransaction();
    }

    trackByProductId(index: number, item: Item) {
        return item.product._id;
    }
}
