import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardHeaderComponent } from '../dashboard-header/dashboard-header.component';
import { GoalSettingComponent } from '../goal-setting/goal-setting.component';
import { SharedService } from '../../shared.service';
import { GoalService } from '../../services/goal.service';
import { Goal } from '../../models/goal.model';
import { IncomeService } from '../../components/income/income.service';
import { ExpenseService } from '../../components/expense/expense.service';
import { BudgetService } from '../../components/create-budget/budget.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardHeaderComponent, GoalSettingComponent, CommonModule],
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
  Math = Math; // Make Math available in template
  get userId() { return this.sharedService.userId; } // Dynamic access

  transactions: any[] = [];
  incomes: any[] = [];
  expenses: any[] = [];
  goals: Goal[] = [];
  totalGoals = 0;
  completedGoals = 0;
  pendingGoals = 0;
  loading = false;
  error: string | null = null;
  
  // Insights
  spendingRate: number = 0;
  savingsRate: number = 0;
  topExpenseCategory: string = 'N/A';
  budgetStatus: string = 'On Track';
  averageDailySpending: number = 0;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private goalService: GoalService,
    private incomeService: IncomeService,
    private expenseService: ExpenseService,
    private budgetService: BudgetService
  ) {}

  ngOnInit(): void {
    this.currentMonth = this.getCurrentMonth();
    this.fetchTotalIncome();
    this.fetchTotalExpenses();
    this.fetchCurrentBudget();
    this.loadGoals();
    this.loadTransactions();
  }

  loadGoals(): void {
    this.goalService.getGoals(this.userId).subscribe({
      next: (response) => {
        this.goals = response.data || [];
        this.calculateGoalStats();
      },
      error: (err) => {
        console.error('Failed to load goals', err);
      }
    });
  }

  private calculateGoalStats(): void {
    this.totalGoals = this.goals.length;
    this.completedGoals = this.goals.filter(g => (g.savedAmount || 0) >= g.targetAmount).length;
    this.pendingGoals = this.totalGoals - this.completedGoals;
  }

  fetchTotalExpenses() {
    this.expenseService.getTotalExpenses().subscribe({
      next: (totalExpense: number) => {
        this.totalExpenses = Number(totalExpense) || 0;
        this.calculateBalance();
        this.calculateInsights();
      },
      error: (err) => {
        console.error('Failed to load total expenses', err);
        this.totalExpenses = 0;
        this.calculateBalance();
        this.calculateInsights();
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
        this.calculateInsights();
      },
      error: (err) => {
        console.error('Failed to load current budget', err);
        this.currentBudget = 0;
        this.budgetRemaining = this.totalIncome;
        this.calculateInsights();
      }
    });
  }

  fetchTotalIncome() {
    this.incomeService.getTotalIncome().subscribe({
      next: (totalIncome: number) => {
        this.totalIncome = Number(totalIncome) || 0;
        this.calculateBalance();
        this.budgetRemaining = this.totalIncome - this.currentBudget;
        this.calculateInsights();
      },
      error: (err) => {
        console.error('Failed to load total income', err);
        this.totalIncome = 0;
        this.calculateBalance();
        this.budgetRemaining = this.totalIncome - this.currentBudget;
        this.calculateInsights();
      }
    });
  }

  loadTransactions() {
    // Load incomes
    this.incomeService.getAllIncomes().subscribe({
      next: (incomes) => {
        this.incomes = incomes;
        this.combineTransactions();
      },
      error: (err) => {
        console.error('Failed to load incomes', err);
        this.incomes = [];
        this.combineTransactions();
      }
    });

    // Load expenses
    this.expenseService.getAllExpenses().subscribe({
      next: (expenses) => {
        this.expenses = expenses;
        this.combineTransactions();
      },
      error: (err) => {
        console.error('Failed to load expenses', err);
        this.expenses = [];
        this.combineTransactions();
      }
    });
  }

  combineTransactions() {
    const incomeTransactions = this.incomes.map(income => ({
      id: income.id || `income_${Date.now()}`,
      name: income.name,
      type: 'Income',
      category: income.category,
      amount: income.amount,
      date: income.created_at ? new Date(income.created_at) : new Date(),
      created_at: income.created_at || new Date().toISOString()
    }));

    const expenseTransactions = this.expenses.map(expense => ({
      id: expense.id || `expense_${Date.now()}`,
      name: expense.name,
      type: 'Expense',
      category: expense.category,
      amount: expense.amount,
      date: expense.created_at ? new Date(expense.created_at) : new Date(),
      created_at: expense.created_at || new Date().toISOString()
    }));

    // Combine and sort by date (newest first)
    this.transactions = [...incomeTransactions, ...expenseTransactions]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10); // Show only last 10 transactions

    this.calculateInsights();
  }

  calculateInsights() {
    // Spending Rate (Expenses / Income * 100)
    if (this.totalIncome > 0) {
      this.spendingRate = (this.totalExpenses / this.totalIncome) * 100;
      this.savingsRate = ((this.totalIncome - this.totalExpenses) / this.totalIncome) * 100;
    } else {
      this.spendingRate = 0;
      this.savingsRate = 0;
    }

    // Top Expense Category
    if (this.expenses.length > 0) {
      const categoryTotals: { [key: string]: number } = {};
      this.expenses.forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
      });
      const topCategory = Object.entries(categoryTotals)
        .sort(([, a], [, b]) => b - a)[0];
      this.topExpenseCategory = topCategory ? this.formatCategoryName(topCategory[0]) : 'N/A';
    } else {
      this.topExpenseCategory = 'N/A';
    }

    // Budget Status
    if (this.currentBudget > 0) {
      const budgetUsage = (this.totalExpenses / this.currentBudget) * 100;
      if (budgetUsage >= 100) {
        this.budgetStatus = 'Over Budget';
      } else if (budgetUsage >= 80) {
        this.budgetStatus = 'Warning';
      } else {
        this.budgetStatus = 'On Track';
      }
    } else {
      this.budgetStatus = 'No Budget Set';
    }

    // Average Daily Spending (for current month)
    const daysInMonth = new Date(this.currentYear, new Date().getMonth() + 1, 0).getDate();
    const currentDay = new Date().getDate();
    if (currentDay > 0) {
      this.averageDailySpending = this.totalExpenses / currentDay;
    } else {
      this.averageDailySpending = 0;
    }
  }

  formatCategoryName(category: string): string {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
