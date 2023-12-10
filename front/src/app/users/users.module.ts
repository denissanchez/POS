import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { RegisterComponent } from "./register/register.component";
import { UsersRoutingModule } from "./users-routing.module";
import { UsersComponent } from "./users.component";
import { UsersService } from "./users.service";

@NgModule({
    declarations: [UsersComponent, RegisterComponent],
    imports: [SharedModule, UsersRoutingModule, ReactiveFormsModule],
    exports: [],
    providers: [UsersService],
})
export class UsersModule { }
