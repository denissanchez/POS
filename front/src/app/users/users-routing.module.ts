import { NgModule, inject } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UsersComponent } from "./users.component";
import { RegisterComponent } from "./register/register.component";
import { AuthService } from "@app/auth.service";
import { CAN_CREATE_USERS, CAN_VIEW_USERS } from "@app/shared/models/user";


const routes: Routes = [
    {
        path: '',
        component: UsersComponent,
        canActivate: [() => inject(AuthService).can(CAN_VIEW_USERS)],
        children: [
            {
                path: 'registrar',
                component: RegisterComponent,
                canActivate: [() => inject(AuthService).can(CAN_CREATE_USERS)]
            }
        ]
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [],
})
export class UsersRoutingModule { }
