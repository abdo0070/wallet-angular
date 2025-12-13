import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SharedService } from '../../shared.service';

export interface Income {
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
export class IncomeService {
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

    // Get all incomes for the current user
    getAllIncomes(): Observable<Income[]> {
        return this.http.get<{ msg: string; data: any[] }>(
            `${this.API_BASE}/incomes/${this.userId}`,
            { headers: this.getHeaders() }
        ).pipe(
            map(response => response.data.map(income => ({
                id: income._id,
                name: income.name,
                category: income.category,
                amount: income.amount,
                user_id: income.user_id,
                created_at: income.created_at
            })))
        );
    }

    // Get total income for the current user
    getTotalIncome(): Observable<number> {
        return this.http.get<{ msg: string; data: { totalIncome: number } }>(
            `${this.API_BASE}/incomes/total/${this.userId}`,
            { headers: this.getHeaders() }
        ).pipe(
            map(response => response.data.totalIncome)
        );
    }

    // Create new income
    createIncome(income: { user_id: string; name: string; category: string; amount: number }): Observable<Income> {
        return this.http.post<{ msg: string; data: any }>(
            `${this.API_BASE}/incomes`,
            income,
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

    // Update income
    updateIncome(id: string, income: { name: string; category: string; amount: number }): Observable<Income> {
        return this.http.put<{ msg: string; data: any }>(
            `${this.API_BASE}/incomes/${id}`,
            income,
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

    // Delete income
    deleteIncome(id: string): Observable<void> {
        return this.http.delete<{ msg: string; data: any }>(
            `${this.API_BASE}/incomes/${id}`,
            { headers: this.getHeaders() }
        ).pipe(
            map(() => void 0)
        );
    }

    // Legacy method for backward compatibility (now uses backend)
    updateIncomeInDatabase(income: number): void {
        // This method can be updated later to sync total income
        console.log('Total income:', income);
    }
}
