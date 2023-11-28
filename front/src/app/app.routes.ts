import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { CAN_VIEW_TRANSACTIONS, CAN_VIEW_USERS } from './shared/models/user';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'pos',
        pathMatch: 'full'
    },
    {
        path: 'pos',
        loadChildren: () => import('./pos/pos.module').then((m) => m.PosModule)
    },
    {
        path: 'transacciones',
        loadChildren: () => import('./transactions/transactions.module').then((m) => m.TransactionsModule),
        canActivate: [() => inject(AuthService).can(CAN_VIEW_TRANSACTIONS)]
    },
    {
        path: 'usuarios',
        loadChildren: () => import('./users/users.module').then((m) => m.UsersModule),
        canActivate: [() => inject(AuthService).can(CAN_VIEW_USERS)]
    }
];
