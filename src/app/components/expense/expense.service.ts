import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SharedService } from '../../shared.service';

export interface Expense {
    id?: string;
    name: string;
    category: string;
    amount: number;
    user_id?: string;
    created_at?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ExpenseService {
    private readonly API_BASE = 'http://localhost:3000';
    constructor(
        private http: HttpClient,
        private sharedService: SharedService
    ) { }

    get userId() {
        return this.sharedService.userId;
    }

    private getHeaders(): HttpHeaders {
        const token = this.sharedService.token || localStorage.getItem('token') || '';
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    // Get all expenses for the current user
    getAllExpenses(): Observable<Expense[]> {
        return this.http.get<{ msg: string; data: any[] }>(
            `${this.API_BASE}/expenses/${this.userId}`,
            { headers: this.getHeaders() }
        ).pipe(
            map(response => response.data.map(expense => ({
                id: expense._id,
                name: expense.name,
                category: expense.category,
                amount: expense.amount,
                user_id: expense.user_id,
                created_at: expense.created_at
            })))
        );
    }

    // Get total expenses for the current user
    getTotalExpenses(): Observable<number> {
        return this.http.get<{ msg: string; data: { totalExpense: number } }>(
            `${this.API_BASE}/expenses/total/${this.userId}`,
            { headers: this.getHeaders() }
        ).pipe(
            map(response => response.data.totalExpense)
        );
    }

    // Create new expense
    createExpense(expense: { user_id: string; name: string; category: string; amount: number }): Observable<Expense> {
        return this.http.post<{ msg: string; data: any }>(
            `${this.API_BASE}/expenses`,
            expense,
            { headers: this.getHeaders() }
        ).pipe(
            map(response => ({
                id: response.data._id,
                name: response.data.name,
                category: response.data.category,
                amount: response.data.amount,
                user_id: response.data.user_id,
                created_at: response.data.created_at
            }))
        );
    }

    // Update expense
    updateExpense(id: string, expense: { name: string; category: string; amount: number }): Observable<Expense> {
        return this.http.put<{ msg: string; data: any }>(
            `${this.API_BASE}/expenses/${id}`,
            expense,
            { headers: this.getHeaders() }
        ).pipe(
            map(response => ({
                id: response.data._id,
                name: response.data.name,
                category: response.data.category,
                amount: response.data.amount,
                user_id: response.data.user_id,
                created_at: response.data.created_at
            }))
        );
    }

    // Delete expense
    deleteExpense(id: string): Observable<void> {
        return this.http.delete<{ msg: string; data: any }>(
            `${this.API_BASE}/expenses/${id}`,
            { headers: this.getHeaders() }
        ).pipe(
            map(() => void 0)
        );
    }

    // Legacy method for backward compatibility
    updateExpenseInDatabase(expense: number): void {
        console.log('Total expense:', expense);
    }
}

