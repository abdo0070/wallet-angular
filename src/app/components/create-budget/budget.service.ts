import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SharedService } from '../../shared.service';

export interface BudgetCategory {
    name: string;
    limit: number;
}

export interface Budget {
    id?: string;
    month: string;
    year: number;
    categories: BudgetCategory[];
    totalAmount: number;
    user_id?: string;
    created_at?: string;
    updated_at?: string;
}

@Injectable({
    providedIn: 'root'
})
export class BudgetService {
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

    // Get all budgets for the current user
    getAllBudgets(): Observable<Budget[]> {
        return this.http.get<{ msg: string; data: any[] }>(
            `${this.API_BASE}/budgets/${this.userId}`,
            { headers: this.getHeaders() }
        ).pipe(
            map(response => response.data.map(budget => ({
                id: budget._id,
                month: budget.month,
                year: budget.year,
                categories: budget.categories,
                totalAmount: budget.totalAmount,
                user_id: budget.user_id,
                created_at: budget.created_at,
                updated_at: budget.updated_at
            })))
        );
    }

    // Get single budget by ID
    getBudget(id: string): Observable<Budget> {
        return this.http.get<{ msg: string; data: any }>(
            `${this.API_BASE}/budgets/single/${id}`,
            { headers: this.getHeaders() }
        ).pipe(
            map(response => ({
                id: response.data._id,
                month: response.data.month,
                year: response.data.year,
                categories: response.data.categories,
                totalAmount: response.data.totalAmount,
                user_id: response.data.user_id,
                created_at: response.data.created_at,
                updated_at: response.data.updated_at
            }))
        );
    }

    // Get budget by month and year
    getBudgetByMonth(month: string, year: number): Observable<Budget | null> {
        return this.http.get<{ msg: string; data: any | null }>(
            `${this.API_BASE}/budgets/${this.userId}/${month}/${year}`,
            { headers: this.getHeaders() }
        ).pipe(
            map(response => {
                if (!response.data) {
                    return null;
                }
                return {
                    id: response.data._id,
                    month: response.data.month,
                    year: response.data.year,
                    categories: response.data.categories,
                    totalAmount: response.data.totalAmount,
                    user_id: response.data.user_id,
                    created_at: response.data.created_at,
                    updated_at: response.data.updated_at
                };
            })
        );
    }

    // Create new budget
    createBudget(budget: { user_id: string; month: string; year: number; categories: BudgetCategory[]; totalAmount: number }): Observable<Budget> {
        return this.http.post<{ msg: string; data: any }>(
            `${this.API_BASE}/budgets`,
            budget,
            { headers: this.getHeaders() }
        ).pipe(
            map(response => ({
                id: response.data._id,
                month: response.data.month,
                year: response.data.year,
                categories: response.data.categories,
                totalAmount: response.data.totalAmount,
                user_id: response.data.user_id,
                created_at: response.data.created_at,
                updated_at: response.data.updated_at
            }))
        );
    }

    // Update budget
    updateBudget(id: string, budget: { month: string; year: number; categories: BudgetCategory[]; totalAmount: number }): Observable<Budget> {
        return this.http.put<{ msg: string; data: any }>(
            `${this.API_BASE}/budgets/${id}`,
            budget,
            { headers: this.getHeaders() }
        ).pipe(
            map(response => ({
                id: response.data._id,
                month: response.data.month,
                year: response.data.year,
                categories: response.data.categories,
                totalAmount: response.data.totalAmount,
                user_id: response.data.user_id,
                created_at: response.data.created_at,
                updated_at: response.data.updated_at
            }))
        );
    }

    // Delete budget
    deleteBudget(id: string): Observable<void> {
        return this.http.delete<{ msg: string; data: any }>(
            `${this.API_BASE}/budgets/${id}`,
            { headers: this.getHeaders() }
        ).pipe(
            map(() => void 0)
        );
    }
}

