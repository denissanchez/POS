import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { AgGridModule } from "ag-grid-angular";
import { DetailComponent } from "./detail/detail.component";
import { EditComponent } from "./edit/edit.component";
import { RegisterComponent } from "./register/register.component";
import { BtnUserDetailRenderer } from "./renderers/user-detail.renderer";
import { BtnUserEditRenderer } from "./renderers/user-edit.renderer";
import { BtnUserRemoveRenderer } from "./renderers/user-remove.renderer";
import { UsersRoutingModule } from "./users-routing.module";
import { UsersComponent } from "./users.component";
import { UsersService } from "./users.service";

@NgModule({
    declarations: [UsersComponent, RegisterComponent, BtnUserDetailRenderer, DetailComponent, BtnUserRemoveRenderer, BtnUserEditRenderer, EditComponent],
    imports: [SharedModule, UsersRoutingModule, AgGridModule, ReactiveFormsModule],
    exports: [],
    providers: [UsersService],
})
export class UsersModule { }
