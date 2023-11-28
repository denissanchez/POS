import { NgModule } from "@angular/core";
import { SharedModule } from "@app/shared/shared.module";
import { TransactionsRoutingModule } from "./transactions-routing.module";
import { TransactionsService } from "./transactions.service";
import { TransactionsComponent } from "./transactions.component";
import { FiltersComponent } from "./filters/filters.component";
import { GeneralStatsComponent } from "./general-stats/general-stats.component";
import { AgGridModule } from "ag-grid-angular";
import { BtnTransactionDetailRenderer } from "./renderers/transaction-detail.renderer";
import { TransactionDetailComponent } from "./detail/detail.component";

@NgModule({
    declarations: [TransactionsComponent, FiltersComponent, TransactionDetailComponent, GeneralStatsComponent, BtnTransactionDetailRenderer],
    providers: [TransactionsService],
    imports: [SharedModule, TransactionsRoutingModule, AgGridModule],
})
export class TransactionsModule {
}
