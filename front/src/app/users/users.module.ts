import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { RegisterComponent } from "./register/register.component";
import { UsersRoutingModule } from "./users-routing.module";
import { UsersComponent } from "./users.component";
import { UsersService } from "./users.service";
import { AgGridModule } from "ag-grid-angular";

@NgModule({
    declarations: [UsersComponent, RegisterComponent],
    imports: [SharedModule, UsersRoutingModule, AgGridModule, ReactiveFormsModule],
    exports: [],
    providers: [UsersService],
})
export class UsersModule { }
