import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DashboardHeaderComponent } from "../dashboard-header/dashboard-header.component";
import { GoalSettingComponent } from '../goal-setting/goal-setting.component';
import { SharedService } from '../../shared.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { User } from '../../models/user.model';
import { UserDataService } from '../../service/user-data.service';
import { GoalService } from '../../services/goal.service';
import { Goal } from '../../models/goal.model';
import { IncomeService } from '../../components/income/income.service';
import { ExpenseService } from '../../components/expense/expense.service';
import { BudgetService } from '../../components/create-budget/budget.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardHeaderComponent, GoalSettingComponent, CommonModule],
  providers: [DecimalPipe],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  totalIncome: number = 0;
  totalExpenses: number = 0;
  totalBalance: number = 0;
  currentBudget: number = 0;
  budgetRemaining: number = 0;
  currentMonth: string = '';
  currentYear: number = new Date().getFullYear();
  get userId() { return this.sharedService.userId; } // Dynamic access

  user!: User;
  transactions: any = [];
  goals: Goal[] = [];
  totalGoals = 0;
  completedGoals = 0;
  pendingGoals = 0;
  loading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private sharedService: SharedService,
    private userDataService: UserDataService,
    private goalService: GoalService,
    private incomeService: IncomeService,
    private expenseService: ExpenseService,
    private budgetService: BudgetService
  ) { }

  ngOnInit(): void {
    this.currentMonth = this.getCurrentMonth();
    this.fetchTotalIncome();
    this.fetchTotalExpenses();
    this.fetchCurrentBudget();
    this.loadGoals();

    // Static transactions text (demo data for now)
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

  loadGoals(): void {
    this.goalService.getGoals(this.userId).subscribe({
      next: (response) => {
        // Handle possible response format (data array vs direct array)
        this.goals = response.data || response;
        this.calculateGoalStats();
      },
      error: (err) => {
        console.error('Failed to load goals', err);
      }
    });
  }

  private calculateGoalStats(): void {
    if (!this.goals) {
      this.totalGoals = 0;
      this.completedGoals = 0;
      this.pendingGoals = 0;
      return;
    }
    this.totalGoals = this.goals.length;
    this.completedGoals = this.goals.filter(g => g.isCompleted === true).length;
    this.pendingGoals = this.totalGoals - this.completedGoals;
  }

  fetchTotalExpenses() {
    this.expenseService.getTotalExpenses().subscribe({
      next: (totalExpense: number) => {
        this.totalExpenses = Number(totalExpense) || 0;
        this.calculateBalance();
      },
      error: (err) => {
        console.error('Failed to load total expenses', err);
        this.totalExpenses = 0;
        this.calculateBalance();
      }
    });
  }

  calculateBalance() {
    this.totalBalance = this.totalIncome - this.totalExpenses;
  }

  getCurrentMonth(): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[new Date().getMonth()];
  }

  fetchCurrentBudget() {
    this.budgetService.getBudgetByMonth(this.currentMonth, this.currentYear).subscribe({
      next: (budget) => {
        if (budget) {
          this.currentBudget = budget.totalAmount || 0;
        } else {
          this.currentBudget = 0;
        }
        this.budgetRemaining = this.totalIncome - this.currentBudget;
      },
      error: (err) => {
        console.error('Failed to load current budget', err);
        this.currentBudget = 0;
        this.budgetRemaining = this.totalIncome;
      }
    });
  }

  fetchTotalIncome() {
    this.incomeService.getTotalIncome().subscribe({
      next: (totalIncome: number) => {
        this.totalIncome = Number(totalIncome) || 0;
        this.calculateBalance();
        this.budgetRemaining = this.totalIncome - this.currentBudget;
      },
      error: (err) => {
        console.error('Failed to load total income', err);
        this.totalIncome = 0;
        this.calculateBalance();
        this.budgetRemaining = this.totalIncome - this.currentBudget;
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

  addMoney(): void { console.log('Add Money clicked'); }
  sendMoney(): void { console.log('Send Money clicked'); }
  payBills(): void { console.log('Pay Bills clicked'); }
  withdraw(): void { console.log('Withdraw clicked'); }
  exchange(): void { console.log('Exchange clicked'); }
}
