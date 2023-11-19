import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./pos/pos.module').then((m) => m.PosModule)
    }
];
