import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    userId = 'user1';
    userName = 'Wallet User';

    setUser(userId: string, name?: string): void {
        this.userId = userId;
        if (name) {
            this.userName = name;
        }
    }

    clearUser(): void {
        this.userId = '';
        this.userName = 'Wallet User';
    }
}
