import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Goal } from '../models/goal.model';

@Injectable({
  providedIn: 'root',
})
export class GoalService {
  private readonly API_BASE = 'http://localhost:3000';
  private token = ''; // Should be set from auth service or localStorage

  constructor(private http: HttpClient) {
    // Get token from localStorage or auth service
    this.token = localStorage.getItem('token') || '';
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
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
          deadline: goal.deadline,
          createdAt: goal.createdAt
        }))
      }))
    );
  }

  createGoal(goal: { user_id: string; name: string; targetAmount: number; savedAmount?: number; deadline: string }): Observable<{ msg: string; data: Goal }> {
    return this.http.post<{ msg: string; data: any }>(`${this.API_BASE}/goals`, goal, {
      headers: this.getHeaders()
    }).pipe(
      map(response => ({
        msg: response.msg,
        data: {
          id: response.data._id,
          name: response.data.name,
          targetAmount: response.data.targetAmount,
          savedAmount: response.data.savedAmount,
          deadline: response.data.deadline,
          createdAt: response.data.createdAt
        }
      }))
    );
  }

  updateGoal(id: string, goal: Partial<{ name: string; targetAmount: number; savedAmount: number; deadline: string }>): Observable<{ msg: string; data: Goal }> {
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