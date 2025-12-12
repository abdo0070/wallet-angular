import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';

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
    private readonly apiBase = 'https://api.example.com';

    constructor(private http: HttpClient) { }

    // Mocked auth for UI testing without backend
    login(payload: { email: string; password: string }): Observable<AuthResponse> {
        return of({
            userId: 'demo-user',
            name: 'Demo User',
            token: 'demo-token'
        }).pipe(delay(300));
    }

    register(payload: { name: string; email: string; password: string }): Observable<AuthResponse> {
        return of({
            userId: 'demo-user',
            name: payload.name || 'Demo User',
            token: 'demo-token'
        }).pipe(delay(300));
    }
}

