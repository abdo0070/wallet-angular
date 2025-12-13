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

  totalIncome = 0;
  totalExpenses = 0;
  totalBalance = 0;

  currentBudget = 0;
  budgetRemaining = 0;

  currentMonth = '';
  currentYear = new Date().getFullYear();

  goals: Goal[] = [];
  totalGoals = 0;
  completedGoals = 0;
  pendingGoals = 0;

  get userId() {
    return this.sharedService.userId;
  }

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
  }

  loadGoals(): void {
    this.goalService.getGoals(this.userId).subscribe({
      next: (response) => {
        this.goals = response.data || [];
        this.calculateGoalStats();
      }
    });
  }

  private calculateGoalStats(): void {
    this.totalGoals = this.goals.length;
    this.completedGoals = this.goals.filter(g => g.isCompleted).length;
    this.pendingGoals = this.totalGoals - this.completedGoals;
  }

  fetchTotalIncome(): void {
    this.incomeService.getTotalIncome().subscribe({
      next: (totalIncome: number) => {
        this.totalIncome = Number(totalIncome) || 0;
        this.calculateBalance();
        this.budgetRemaining = this.totalIncome - this.currentBudget;
      }
    });
  }

  fetchTotalExpenses(): void {
    this.expenseService.getTotalExpenses().subscribe({
      next: (totalExpense: number) => {
        this.totalExpenses = Number(totalExpense) || 0;
        this.calculateBalance();
      }
    });
  }

  fetchCurrentBudget(): void {
    this.budgetService.getBudgetByMonth(this.currentMonth, this.currentYear).subscribe({
      next: (budget) => {
        this.currentBudget = budget?.totalAmount || 0;
        this.budgetRemaining = this.totalIncome - this.currentBudget;
      }
    });
  }

  calculateBalance(): void {
    this.totalBalance = this.totalIncome - this.totalExpenses;
  }

  getCurrentMonth(): string {
    const months = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December'
    ];
    return months[new Date().getMonth()];
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
