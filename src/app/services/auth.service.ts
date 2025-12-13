import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, map } from 'rxjs';

export interface AuthResponse {
    token?: string;
    userId?: string;
    name?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // Replace with your backend base URL
    private readonly apiBase = 'http://localhost:3000';

    constructor(private http: HttpClient) { }

    login(payload: { email: string; password: string }): Observable<AuthResponse> {
        return this.http.post<any>(`${this.apiBase}/login`, payload).pipe(
            map(res => ({
                token: res.token,
                userId: res.user._id,
                name: res.user.name
            }))
        );
    }

    register(payload: { name: string; email: string; password: string }): Observable<AuthResponse> {
        // Backend requires address and Balance
        const backendPayload = {
            ...payload,
            address: 'Not Provided',
            Balance: 0
        };

        return this.http.post<any>(`${this.apiBase}/register`, backendPayload).pipe(
            map(res => ({
                token: res.token,
                userId: res.data._id,
                name: res.data.name
            }))
        );
    }
}

