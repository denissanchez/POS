import { NgModule } from "@angular/core";
import { SharedModule } from "@app/shared/shared.module";
import { TransactionsRoutingModule } from "./transactions-routing.module";
import { TransactionsService } from "./transactions.service";
import { TransactionsComponent } from "./transactions.component";
import { FiltersComponent } from "./filters/filters.component";
import { GeneralStatsComponent } from "./general-stats/general-stats.component";

@NgModule({
    declarations: [TransactionsComponent, FiltersComponent, GeneralStatsComponent],
    providers: [TransactionsService],
    imports: [SharedModule, TransactionsRoutingModule],
})
export class TransactionsModule {
}
