import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    // Hardcoded for now as per requirements/mocking
    userId = 'user1';

    constructor() { }
}
