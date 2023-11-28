import { NgModule } from "@angular/core";
import { SharedModule } from "@app/shared/shared.module";
import { UsersComponent } from "./users.component";
import { UsersRoutingModule } from "./users-routing.module";
import { RegisterComponent } from "./register/register.component";

@NgModule({
    declarations: [UsersComponent, RegisterComponent],
    imports: [SharedModule, UsersRoutingModule],
    exports: [],
    providers: [],
})
export class UsersModule { }
