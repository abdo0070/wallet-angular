import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    userId = '';
    userName = 'Wallet User';
    token = '';

    constructor() {
        if (typeof localStorage !== 'undefined') {
            this.userId = localStorage.getItem('userId') || '';
            this.userName = localStorage.getItem('userName') || 'Wallet User';
            this.token = localStorage.getItem('token') || '';
        }
    }

    setUser(userId: string, name?: string, token?: string): void {
        this.userId = userId;
        localStorage.setItem('userId', userId);

        if (name) {
            this.userName = name;
            localStorage.setItem('userName', name);
        }

        if (token) {
            this.token = token;
            localStorage.setItem('token', token);
        }
    }

    clearUser(): void {
        this.userId = '';
        this.userName = 'Wallet User';
        this.token = '';

        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('token');
    }
}
