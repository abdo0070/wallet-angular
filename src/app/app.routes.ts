import { Routes } from '@angular/router';

import { IncomeComponent } from './components/income/income.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { CreateBudgetComponent } from './components/create-budget/create-budget.component';
import { ReportingComponent } from './components/reporting/reporting.component';

import { GoalSettingComponent } from './components/goal-setting/goal-setting.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'income', component: IncomeComponent },
    { path: 'expense', component: ExpenseComponent },
    { path: 'budget', component: CreateBudgetComponent },
    { path: 'goals', component: GoalSettingComponent },
    { path: 'reporting', component: ReportingComponent },
    { path: '**', redirectTo: 'login' }
];
