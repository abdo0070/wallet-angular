import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../shared.service';
import { ExpenseService } from './expense.service';
import { MessageService } from 'primeng/api';

// PrimeNG Imports
import { DialogModule } from 'primeng/dialog';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

export interface Expense {
    id?: string;
    name: string;
    category: string;
    amount: number;
}
export interface Category {
    name: string;
    value: any;
}

@Component({
    selector: 'app-expense',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        DataViewModule,
        DropdownModule,
        ButtonModule,
        InputTextModule,
        ToastModule,
        RippleModule,
        TooltipModule
    ],
    providers: [MessageService],
    templateUrl: './expense.component.html',
    styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {
    get userId() { return this.sharedservice.userId; }

    // UI State
    showDialog: boolean = false;
    isEditMode: boolean = false;
    layout: 'list' | 'grid' = 'list';

    // Data State
    expenses: Expense[] = [];
    categories: Category[] = [
        { name: 'Food', value: 'food' },
        { name: 'Transport', value: 'transport' },
        { name: 'Shopping', value: 'shopping' },
        { name: 'Bills', value: 'bills' },
        { name: 'Entertainment', value: 'entertainment' },
        { name: 'Other', value: 'other' }
    ];

    selectedCategory: Category | undefined;
    totalExpenseAmount: number | undefined;

    // Edit Form Data
    expenseData: { name: string; amount: number | null } = { name: '', amount: null };
    editingExpense: Expense | null = null; // Track original expense during edit

    constructor(
        private messageService: MessageService,
        private router: Router,
        private sharedservice: SharedService,
        private expenseService: ExpenseService
    ) { }

    navigateTo(path: string) {
        this.router.navigate([path]);
    }

    ngOnInit(): void {
        this.loadExpenses();
    }

    loadExpenses() {
        this.expenseService.getAllExpenses().subscribe({
            next: (expenses) => {
                this.expenses = expenses;
                this.updateTotalExpenseAmount();
            },
            error: (error) => {
                console.error('Failed to load expenses:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load expenses. Please try again.'
                });
            }
        });
    }

    openNew() {
        this.expenseData = { name: '', amount: null };
        this.selectedCategory = undefined;
        this.isEditMode = false;
        this.editingExpense = null;
        this.showDialog = true;
    }

    editExpense(expense: Expense) {
        this.expenseData = { name: expense.name, amount: expense.amount };
        // Find category by value (backend stores lowercase like 'food', 'transport')
        this.selectedCategory = this.categories.find(c =>
            c.value.toLowerCase() === expense.category.toLowerCase()
        );
        this.editingExpense = expense;
        this.isEditMode = true;
        this.showDialog = true;
    }

    onSubmit(expenseForm: NgForm) {
        if (expenseForm.valid && this.selectedCategory) {
            const { name, amount } = expenseForm.value;

            const expenseData = {
                user_id: this.userId,
                name: name,
                category: this.selectedCategory.value, // Use value (lowercase: 'food', 'transport', etc.)
                amount: amount
            };

            if (this.isEditMode && this.editingExpense?.id) {
                // Update existing expense
                this.expenseService.updateExpense(this.editingExpense.id, {
                    name: expenseData.name,
                    category: expenseData.category,
                    amount: expenseData.amount
                }).subscribe({
                    next: (updatedExpense) => {
                        const index = this.expenses.findIndex(e => e.id === updatedExpense.id);
                        if (index !== -1) {
                            this.expenses[index] = updatedExpense;
                        }
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Expense updated successfully'
                        });
                        this.updateTotalExpenseAmount();
                        this.showDialog = false;
                        expenseForm.resetForm();
                    },
                    error: (error) => {
                        console.error('Failed to update expense:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to update expense. Please try again.'
                        });
                    }
                });
            } else {
                // Create new expense
                this.expenseService.createExpense(expenseData).subscribe({
                    next: (newExpense) => {
                        this.expenses.push(newExpense);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Expense added successfully'
                        });
                        this.updateTotalExpenseAmount();
                        this.showDialog = false;
                        expenseForm.resetForm();
                    },
                    error: (error) => {
                        console.error('Failed to create expense:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to add expense. Please try again.'
                        });
                    }
                });
            }
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill all required fields'
            });
        }
    }

    updateTotalExpenseAmount(): void {
        this.totalExpenseAmount = this.getTotalExpenseAmount();
        this.expenseService.updateExpenseInDatabase(this.totalExpenseAmount);
    }

    deleteExpense(expense: Expense) {
        if (!expense.id) {
            console.error('Cannot delete expense without ID');
            return;
        }

        this.expenseService.deleteExpense(expense.id).subscribe({
            next: () => {
                this.expenses = this.expenses.filter(e => e.id !== expense.id);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Deleted',
                    detail: 'Expense deleted successfully'
                });
                this.updateTotalExpenseAmount();
            },
            error: (error) => {
                console.error('Failed to delete expense:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete expense. Please try again.'
                });
            }
        });
    }

    getTotalExpenseAmount(): number {
        let totalAmount = 0;
        for (const expense of this.expenses) {
            totalAmount += expense.amount;
        }
        return totalAmount;
    }

    getCategoryDisplayName(category: string): string {
        const categoryObj = this.categories.find(c =>
            c.value.toLowerCase() === category.toLowerCase()
        );
        return categoryObj ? categoryObj.name : category.charAt(0).toUpperCase() + category.slice(1);
    }
}

