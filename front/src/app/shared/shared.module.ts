import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { LabelizePermissionPipe } from "./pipes/labelize-permission.pipe";


@NgModule({
    declarations: [
        LabelizePermissionPipe,
    ],
    providers: [],
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
        SweetAlert2Module,
        LabelizePermissionPipe,
    ],
})
export class SharedModule {
}
