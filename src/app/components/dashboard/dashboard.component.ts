import { Component, OnInit } from '@angular/core';
import { DashboardHeaderComponent } from '../dashboard-header/dashboard-header.component';
import { User } from '../../models/user.model';
import { UserDataService } from '../../service/user-data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, DashboardHeaderComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  user!: User;
  transactions: any = [];
  loading = false;
  error: string | null = null;

  constructor(private userDataService: UserDataService) {}

  ngOnInit(): void {
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
