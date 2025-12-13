import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private readonly API_BASE = 'http://localhost:3000'; // json-server
  constructor(private http: HttpClient) {}

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.API_BASE}/users/:id`);
  }


  getUserTransactions(userId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      `${this.API_BASE}/transactions`,
      {
        params: {
          user_id: userId,
        },
      }
    );
  }
}
