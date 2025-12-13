import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Goal } from '../models/goal.model';

@Injectable({
  providedIn: 'root',
})
export class GoalService {
  private readonly API_BASE = 'http://localhost:3000';
  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getGoals(userId: string): Observable<{ data: Goal[] }> {
    return this.http.get<{ data: any[] }>(`${this.API_BASE}/goals/${userId}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => ({
        data: response.data.map(goal => ({
          id: goal._id,
          name: goal.name,
          targetAmount: goal.targetAmount,
          savedAmount: goal.savedAmount,
          isCompleted: goal.isCompleted || false,
          deadline: goal.deadline,
          createdAt: goal.createdAt
        }))
      }))
    );
  }

  createGoal(goal: { user_id: string; name: string; targetAmount: number; savedAmount?: number; deadline: string }): Observable<{ msg: string; data: Goal }> {
    console.log('[GoalService] createGoal called with:', goal);
    console.log('[GoalService] API endpoint:', `${this.API_BASE}/goals`);
    console.log('[GoalService] Headers:', this.getHeaders());
    
    return this.http.post<{ msg: string; data: any }>(`${this.API_BASE}/goals`, goal, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        console.log('[GoalService] Raw response:', response);
        if (!response || !response.data) {
          console.error('[GoalService] Invalid response structure:', response);
          throw new Error('Invalid response structure from server');
        }
        const mappedData = {
          msg: response.msg,
          data: {
            id: response.data._id || response.data.id,
            name: response.data.name,
            targetAmount: response.data.targetAmount,
            savedAmount: response.data.savedAmount || 0,
            isCompleted: response.data.isCompleted || false,
            deadline: response.data.deadline,
            createdAt: response.data.createdAt || new Date().toISOString()
          }
        };
        console.log('[GoalService] Mapped response:', mappedData);
        return mappedData;
      }),
      catchError(error => {
        console.error('[GoalService] Error in createGoal:', error);
        return throwError(() => error);
      })
    );
  }

  updateGoal(id: string, goal: Partial<{ name: string; targetAmount: number; savedAmount: number; deadline: string; isCompleted: boolean }>): Observable<{ msg: string; data: Goal }> {
    return this.http.put<{ msg: string; data: any }>(`${this.API_BASE}/goals/${id}`, goal, {
      headers: this.getHeaders()
    }).pipe(
      map(response => ({
        msg: response.msg,
        data: {
          id: response.data._id,
          name: response.data.name,
          targetAmount: response.data.targetAmount,
          savedAmount: response.data.savedAmount,
          isCompleted: response.data.isCompleted || false,
          deadline: response.data.deadline,
          createdAt: response.data.createdAt
        }
      }))
    );
  }

  deleteGoal(id: string): Observable<{ data: Goal }> {
    return this.http.delete<{ data: Goal }>(`${this.API_BASE}/goals/${id}`, {
      headers: this.getHeaders()
    });
  }
}