import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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
        private http: HttpClient,
        private sharedservice: SharedService,
        private incomeService: IncomeService
    ) { }

    ngOnInit(): void {
        this.loadIncomesFromFirebase();
    }

    loadIncomesFromFirebase() {
        const url = `https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData/${this.userId}/incomes.json`;

        this.http.get<any>(url).subscribe(data => {
            if (data) {
                this.incomes = [];
                Object.keys(data).forEach(category => {
                    Object.keys(data[category]).forEach(item => {
                        const amount = data[category][item].amount;
                        this.incomes.push({ name: item, category, amount });
                    });
                });
                this.updateTotalIncomeAmount();
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
        this.selectedCategory = this.categories.find(c => c.name === income.category);
        this.editingIncome = income;
        this.isEditMode = true;
        this.showDialog = true;
    }

    onSubmit(incomeForm: NgForm) {
        if (incomeForm.valid && this.selectedCategory) {
            const { name, amount } = incomeForm.value;

            // If Edit Mode: Delete original if it exists
            if (this.isEditMode && this.editingIncome) {
                const index = this.incomes.findIndex(i => i.name === this.editingIncome!.name && i.category === this.editingIncome!.category);
                if (index !== -1) {
                    this.incomes.splice(index, 1);
                    // Fire and forget delete on backend (since we will overwrite or create new)
                    this.http.delete(`https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData/${this.userId}/incomes/${this.editingIncome.category}/${this.editingIncome.name}.json`).subscribe();
                }
            }

            // Create new Income object
            const formData = {
                name: name,
                category: this.selectedCategory.name,
                amount: amount
            };

            this.incomes.push(formData);

            this.http.put(`https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData/${this.userId}/incomes/${this.selectedCategory.name}/${name}.json`, formData)
                .subscribe(res => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: this.isEditMode ? 'Income updated successfully' : 'Income added successfully' });
                    this.updateTotalIncomeAmount();
                });

            this.showDialog = false;
            incomeForm.resetForm();
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields' });
        }
    }

    updateTotalIncomeAmount(): void {
        this.totalIncomeAmount = this.getTotalIncomeAmount();
        this.incomeService.updateIncomeInDatabase(this.totalIncomeAmount);
    }

    deleteIncome(income: Income) {
        const index = this.incomes.findIndex(i => i.name === income.name && i.category === income.category);
        if (index !== -1) {
            this.incomes.splice(index, 1);

            this.http.delete(`https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData/${this.userId}/incomes/${income.category}/${income.name}.json`)
                .subscribe(res => {
                    this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Income deleted successfully' });
                    this.updateTotalIncomeAmount();
                });
        }
    }

    getTotalIncomeAmount(): number {
        let totalAmount = 0;
        for (const income of this.incomes) {
            totalAmount += income.amount;
        }
        return totalAmount;
    }
}
