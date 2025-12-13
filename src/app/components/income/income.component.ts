import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../shared.service';
import { IncomeService } from './income.service';
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

export interface Income {
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
    selector: 'app-income',
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
    templateUrl: './income.component.html',
    styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {
    userId = this.sharedservice.userId;

    // UI State
    showDialog: boolean = false;
    isEditMode: boolean = false;
    layout: 'list' | 'grid' = 'list';

    // Data State
    incomes: Income[] = [];
    categories: Category[] = [
        { name: 'Salary', value: 'salary' },
        { name: 'Freelance', value: 'freelance' },
        { name: 'Investments', value: 'investments' },
        { name: 'Other', value: 'other' }
    ];

    selectedCategory: Category | undefined;
    totalIncomeAmount: number | undefined;

    // Edit Form Data
    incomeData: { name: string; amount: number | null } = { name: '', amount: null };
    editingIncome: Income | null = null; // Track original income during edit

    constructor(
        private messageService: MessageService,
        private router: Router,
        private sharedservice: SharedService,
        private incomeService: IncomeService
    ) { }

    navigateTo(path: string) {
        this.router.navigate([path]);
    }

    ngOnInit(): void {
        this.loadIncomes();
    }

    loadIncomes() {
        this.incomeService.getAllIncomes().subscribe({
            next: (incomes) => {
                this.incomes = incomes;
                this.updateTotalIncomeAmount();
            },
            error: (error) => {
                console.error('Failed to load incomes:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load incomes. Please try again.'
                });
            }
        });
    }

    openNew() {
        this.incomeData = { name: '', amount: null };
        this.selectedCategory = undefined;
        this.isEditMode = false;
        this.editingIncome = null;
        this.showDialog = true;
    }

    editIncome(income: Income) {
        this.incomeData = { name: income.name, amount: income.amount };
        // Find category by value (backend stores lowercase like 'salary', 'freelance')
        this.selectedCategory = this.categories.find(c => 
            c.value.toLowerCase() === income.category.toLowerCase()
        );
        this.editingIncome = income;
        this.isEditMode = true;
        this.showDialog = true;
    }

    onSubmit(incomeForm: NgForm) {
        if (incomeForm.valid && this.selectedCategory) {
            const { name, amount } = incomeForm.value;

            const incomeData = {
                user_id: this.userId,
                name: name,
                category: this.selectedCategory.value, // Use value (lowercase: 'salary', 'freelance', etc.)
                amount: amount
            };

            if (this.isEditMode && this.editingIncome?.id) {
                // Update existing income
                this.incomeService.updateIncome(this.editingIncome.id, {
                    name: incomeData.name,
                    category: incomeData.category,
                    amount: incomeData.amount
                }).subscribe({
                    next: (updatedIncome) => {
                        const index = this.incomes.findIndex(i => i.id === updatedIncome.id);
                        if (index !== -1) {
                            this.incomes[index] = updatedIncome;
                        }
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Income updated successfully'
                        });
                        this.updateTotalIncomeAmount();
                        this.showDialog = false;
                        incomeForm.resetForm();
                    },
                    error: (error) => {
                        console.error('Failed to update income:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to update income. Please try again.'
                        });
                    }
                });
            } else {
                // Create new income
                this.incomeService.createIncome(incomeData).subscribe({
                    next: (newIncome) => {
                        this.incomes.push(newIncome);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Income added successfully'
                        });
                        this.updateTotalIncomeAmount();
                        this.showDialog = false;
                        incomeForm.resetForm();
                    },
                    error: (error) => {
                        console.error('Failed to create income:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to add income. Please try again.'
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

    updateTotalIncomeAmount(): void {
        this.totalIncomeAmount = this.getTotalIncomeAmount();
        this.incomeService.updateIncomeInDatabase(this.totalIncomeAmount);
    }

    deleteIncome(income: Income) {
        if (!income.id) {
            console.error('Cannot delete income without ID');
            return;
        }

        this.incomeService.deleteIncome(income.id).subscribe({
            next: () => {
                this.incomes = this.incomes.filter(i => i.id !== income.id);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Deleted',
                    detail: 'Income deleted successfully'
                });
                this.updateTotalIncomeAmount();
            },
            error: (error) => {
                console.error('Failed to delete income:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete income. Please try again.'
                });
            }
        });
    }

    getTotalIncomeAmount(): number {
        let totalAmount = 0;
        for (const income of this.incomes) {
            totalAmount += income.amount;
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
