import { NgModule } from "@angular/core";
import { SharedModule } from "@app/shared/shared.module";
import { UsersComponent } from "./users.component";
import { UsersRoutingModule } from "./users-routing.module";
import { RegisterComponent } from "./register/register.component";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [UsersComponent, RegisterComponent],
    imports: [SharedModule, UsersRoutingModule, ReactiveFormsModule],
    exports: [],
    providers: [],
})
export class UsersModule { }
