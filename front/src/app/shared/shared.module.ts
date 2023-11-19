import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        SweetAlert2Module
    ],
    exports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        SweetAlert2Module
    ],
})
export class SharedModule {
}
