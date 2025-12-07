import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../../shared.service';

@Injectable({
    providedIn: 'root'
})
export class IncomeService {

    constructor(private http: HttpClient, private sharedService: SharedService) { }

    get userId() {
        return this.sharedService.userId;
    }

    // Method to update income in the database
    updateIncomeInDatabase(income: number): void {
        // Make HTTP request to update income in the database
        this.http.patch(`https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData/${this.userId}/income.json`, { income }).subscribe(response => {
            console.log('Income updated in the database:', response);
        });
    }

    // Method to fetch income from the database
    getIncomeFromDatabase() {
        const url = `https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData/${this.userId}/income.json`;

        // Make HTTP GET request to fetch income from the database
        return this.http.get(url);
    }

}
