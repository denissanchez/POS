import { NgModule } from "@angular/core";
import { PosComponent } from "./pos.component";
import { PosRoutingModule } from "./pos-routing.module";
import { ProductsComponent } from "./products/products.component";
import { SummaryComponent } from "./summary/summary.component";
import { ItemComponent } from "./summary/item/item.component";
import { ProductComponent } from "./products/product/product.component";
import { PosService } from "./pos.service";
import { SharedModule } from "@app/shared/shared.module";
import { CategoryBtnComponent } from "./products/category-btn/category-btn.component";
import { RegisterComponent } from "./summary/register/register.component";

@NgModule({
    declarations: [
        PosComponent,
        ProductsComponent,
        SummaryComponent,
        ItemComponent,
        ProductComponent,
        CategoryBtnComponent,
        RegisterComponent
    ],
    providers: [
        PosService
    ],
    imports: [
        SharedModule,
        PosRoutingModule
    ],
})
export class PosModule {
}

