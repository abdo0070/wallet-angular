import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DashboardHeaderComponent } from "../dashboard-header/dashboard-header.component";
import { GoalSettingComponent } from '../goal-setting/goal-setting.component';
import { SharedService } from '../../shared.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { User } from '../../models/user.model';
import { UserDataService } from '../../service/user-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardHeaderComponent, GoalSettingComponent, CommonModule],
  providers: [DecimalPipe],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  totalIncome: number = 0;
  userId = this.sharedService.userId;
  user!: User;
  transactions: any = [];
  loading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private sharedService: SharedService,
    private userDataService: UserDataService
  ) { }

  ngOnInit(): void {
    this.fetchTotalIncome();
    // this.transactions = this.userDataService.getUserTransactions();
    this.transactions = [
      {
        id: 'tx_001',
        name: 'Amazon Purchase',
        description: 'Online shopping - electronics',
        user_id: 1,
        balance: 200,
        created_at: '2025-12-12T10:45:30Z',
      },
      {
        id: 'tx_002',
        name: 'Salary Payment',
        description: 'Monthly salary credited',
        balance: 200,
        user_id: 1,
        created_at: '2025-12-10T08:00:00Z',
      },
    ];
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

  loadData(): void {
    this.loading = true;

    this.userDataService.getUser().subscribe({
      next: (user) => {
        this.user = user;

        this.userDataService.getUserTransactions().subscribe({
          next: (transactions) => {
            this.transactions = transactions;
            this.loading = false;
          },
          error: () => {
            this.error = 'Failed to load transactions';
            this.loading = false;
          },
        });
      },
      error: () => {
        this.error = 'Failed to load user';
        this.loading = false;
      },
    });
  }

  addMoney(): void {
    // new page 
    console.log('Add Money clicked');
  }

  sendMoney(): void {
    console.log('Send Money clicked');
  }

  payBills(): void {
    console.log('Pay Bills clicked');
  }

  withdraw(): void {
    console.log('Withdraw clicked');
  }

  exchange(): void {
    console.log('Exchange clicked');
  }
}
