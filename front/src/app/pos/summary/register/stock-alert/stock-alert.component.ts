import { ChangeDetectionStrategy, Component, Input, Output } from "@angular/core";
import { DraftTransaction } from "@app/shared/models";


@Component({
    selector: 'app-stock-alert',
    templateUrl: './stock-alert.component.html',
    styleUrls: [
        './stock-alert.component.scss'
    ],
    changeDetection: ChangeDetectionStrategy.Default
})
export class StockAlertComponent {
    @Input({
        required: true
    }) transaction: DraftTransaction = new DraftTransaction(); 

    constructor() {
    }

}