import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { RegisterComponent } from "./register/register.component";
import { UsersRoutingModule } from "./users-routing.module";
import { UsersComponent } from "./users.component";
import { UsersService } from "./users.service";
import { AgGridModule } from "ag-grid-angular";
import { BtnUserDetailRenderer } from "./renderers/user-detail.renderer";
import { DetailComponent } from "./detail/detail.component";
import { BtnUserRemoveRenderer } from "./renderers/user-remove.renderer";

@NgModule({
    declarations: [UsersComponent, RegisterComponent, BtnUserDetailRenderer, DetailComponent, BtnUserRemoveRenderer],
    imports: [SharedModule, UsersRoutingModule, AgGridModule, ReactiveFormsModule],
    exports: [],
    providers: [UsersService],
})
export class UsersModule { }
