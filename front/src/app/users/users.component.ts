import { Component, OnInit } from "@angular/core";
import { CAN_CREATE_USERS, User } from "@app/shared/models/user";
import { ColDef } from "ag-grid-community";
import { Observable, of } from "rxjs";
import { UsersService } from "./users.service";
import { AuthService } from "@app/auth.service";
import { BtnUserDetailRenderer } from "./renderers/user-detail.renderer";
import { BtnUserRemoveRenderer } from "./renderers/user-remove.renderer";


@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss',]
})
export class UsersComponent implements OnInit {
    public canRegisterUsers = false;

    public columnDefs: ColDef[] = [
        { field: 'username', headerName: 'Nombre de usuario' },
        { field: 'name', headerName: 'Nombres y apellidos' },
        {
            field: 'detail',
            headerName: '',
            cellRenderer: BtnUserDetailRenderer,
            valueGetter: (params) => params.data,
        },
        {
            field: 'remove',
            headerName: '',
            cellRenderer: BtnUserRemoveRenderer,
            valueGetter: (params) => params.data,
        }
    ];
    public users$: Observable<User[]> = of([]);

    constructor(private authService: AuthService, private usersService: UsersService) { }

    ngOnInit(): void {
        this.authService.can(CAN_CREATE_USERS).subscribe(can => this.canRegisterUsers = can)
        this.users$ = this.usersService.getAll();
    }
}