import { Routes } from '@angular/router';

import { IncomeComponent } from './components/income/income.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'income', component: IncomeComponent },
    { path: '**', redirectTo: 'login' }
];
