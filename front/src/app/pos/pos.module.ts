import { NgModule } from "@angular/core";
import { PosComponent } from "./pos.component";
import { PosRoutingModule } from "./pos-routing.module";
import { ProductsComponent } from "./products/products.component";
import { SummaryComponent } from "./summary/summary.component";
import { ItemComponent } from "./summary/item/item.component";
import { CommonModule } from "@angular/common";
import { ProductComponent } from "./products/product/product.component";

@NgModule({
    declarations: [
        PosComponent,
        ProductsComponent,
        SummaryComponent,
        ItemComponent,
        ProductComponent,
    ],
    providers: [],
    imports: [
        CommonModule,
        PosRoutingModule
    ],
})
export class PosModule {
}

