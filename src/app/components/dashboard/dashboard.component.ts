import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DashboardHeaderComponent } from "../dashboard-header/dashboard-header.component";
import { GoalSettingComponent } from '../goal-setting/goal-setting.component';
import { SharedService } from '../../shared.service';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardHeaderComponent, GoalSettingComponent, CommonModule],
  providers: [DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalIncome: number = 0;
  userId = this.sharedService.userId;

  constructor(
    private router: Router,
    private http: HttpClient,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.fetchTotalIncome();
  }

  fetchTotalIncome() {
    const url = `https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData/${this.userId}/incomes.json`;
    this.http.get<any>(url).subscribe(data => {
      if (data) {
        let total = 0;
        Object.keys(data).forEach(category => {
          Object.keys(data[category]).forEach(item => {
            total += data[category][item].amount;
          });
        });
        this.totalIncome = total;
      }
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
