import { Routes } from '@angular/router';
import { canViewTransactions } from './shared/guards/can-view-transactions.guard';

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
        canActivate: [canViewTransactions]
    }
];
