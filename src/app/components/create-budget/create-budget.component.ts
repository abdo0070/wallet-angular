import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../shared.service';
import { BudgetService, BudgetCategory } from './budget.service';
import { IncomeService } from '../income/income.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-create-budget',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './create-budget.component.html',
  styleUrl: './create-budget.component.css',
})
export class CreateBudgetComponent implements OnInit {
  get userId() { return this.sharedService.userId; }

  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  selectedMonth: string = this.months[new Date().getMonth()];
  currentYear: number = new Date().getFullYear();

  addedCategories: BudgetCategory[] = [];
  existingBudgetId: string | null = null;

  isAdding: boolean = false;
  newCategoryName: string = '';
  newCategoryLimit: number | null = null;

  totalBudget: number = 0;
  totalIncome: number = 0;
  remaining: number = 0;

  isLoading: boolean = false;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private budgetService: BudgetService,
    private incomeService: IncomeService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadTotalIncome();
    this.loadBudgetForMonth();
  }

  loadTotalIncome() {
    this.incomeService.getTotalIncome().subscribe({
      next: (totalIncome: number) => {
        this.totalIncome = Number(totalIncome) || 0;
        this.updateSummary();
      },
      error: (err) => {
        console.error('Failed to load total income', err);
        this.totalIncome = 0;
        this.updateSummary();
      }
    });
  }

  loadBudgetForMonth() {
    this.isLoading = true;
    this.budgetService.getBudgetByMonth(this.selectedMonth, this.currentYear).subscribe({
      next: (budget) => {
        if (budget) {
          this.existingBudgetId = budget.id || null;
          this.addedCategories = budget.categories || [];
          this.updateSummary();
          this.messageService.add({
            severity: 'info',
            summary: 'Budget Found',
            detail: `Loaded existing budget for ${this.selectedMonth} ${this.currentYear}`
          });
        } else {
          this.existingBudgetId = null;
          this.addedCategories = [];
          this.updateSummary();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load budget', err);
        this.existingBudgetId = null;
        this.addedCategories = [];
        this.updateSummary();
        this.isLoading = false;
      }
    });
  }

  onMonthChange() {
    this.loadBudgetForMonth();
  }

  enableAddMode() {
    this.isAdding = true;
  }

  cancelAdd() {
    this.isAdding = false;
    this.newCategoryName = '';
    this.newCategoryLimit = null;
  }

  saveNewCategory() {
    if (this.newCategoryName && this.newCategoryLimit && this.newCategoryLimit > 0) {
      this.addedCategories.push({
        name: this.newCategoryName.trim(),
        limit: this.newCategoryLimit,
      });

      this.updateSummary();
      this.cancelAdd();
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please enter a valid category name and limit amount'
      });
    }
  }

  updateSummary() {
    this.totalBudget = this.addedCategories.reduce(
      (sum, item) => sum + item.limit,
      0
    );
    this.remaining = this.totalIncome - this.totalBudget;
  }

  deleteCategory(index: number) {
    this.addedCategories.splice(index, 1);
    this.updateSummary();
  }

  saveBudget() {
    if (!this.selectedMonth) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please select a month'
      });
      return;
    }

    if (this.addedCategories.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please add at least one budget category'
      });
      return;
    }

    this.isLoading = true;

    const budgetData = {
      user_id: this.userId,
      month: this.selectedMonth,
      year: this.currentYear,
      categories: this.addedCategories,
      totalAmount: this.totalBudget,
    };

    if (this.existingBudgetId) {
      // Update existing budget
      this.budgetService.updateBudget(this.existingBudgetId, {
        month: budgetData.month,
        year: budgetData.year,
        categories: budgetData.categories,
        totalAmount: budgetData.totalAmount,
      }).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Budget for ${this.selectedMonth} ${this.currentYear} updated successfully!`
          });
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to update budget:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update budget. Please try again.'
          });
          this.isLoading = false;
        }
      });
    } else {
      // Create new budget
      this.budgetService.createBudget(budgetData).subscribe({
        next: (budget) => {
          this.existingBudgetId = budget.id || null;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Budget for ${this.selectedMonth} ${this.currentYear} saved successfully!`
          });
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to create budget:', error);
          const errorMsg = error.error?.msg || 'Failed to save budget. Please try again.';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMsg
          });
          this.isLoading = false;
        }
      });
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}

