import { Routes } from '@angular/router';

import { IncomeComponent } from './components/income/income.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'income', component: IncomeComponent },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
