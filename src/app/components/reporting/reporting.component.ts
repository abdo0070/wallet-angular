import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction.model';
import { SharedService } from '../../shared.service';

interface CategorySummary {
  category: string;
  income: number;
  expense: number;
  net: number;
}

interface MonthlySummary {
  month: string;
  income: number;
  expense: number;
  net: number;
  date: Date;
}

@Component({
  selector: 'app-reporting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reporting.component.html',
  styleUrl: './reporting.component.css'
})
export class ReportingComponent implements OnInit {
  transactions: Transaction[] = [];
  totalIncome: number = 0;
  totalExpense: number = 0;
  balance: number = 0;
  loading = false;
  error: string | null = null;
  
  categorySummaries: CategorySummary[] = [];
  monthlySummaries: MonthlySummary[] = [];
  
  selectedPeriod: 'all' | 'month' | 'year' = 'all';
  selectedType: 'all' | 'income' | 'expense' = 'all';

  constructor(
    private transactionService: TransactionService,
    private sharedService: SharedService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    this.transactionService.getAll().subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.calculateFinancials();
        this.calculateCategorySummaries();
        this.calculateMonthlySummaries();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load transactions';
        this.loading = false;
        console.error(err);
      }
    });
  }

  calculateFinancials(): void {
    this.totalIncome = 0;
    this.totalExpense = 0;

    this.transactions.forEach(t => {
      const amount = Number(t.balance || t.amount || 0);
      if (t.type === 'income') {
        this.totalIncome += amount;
      } else if (t.type === 'expense') {
        this.totalExpense += amount;
      }
    });
    this.balance = this.totalIncome - this.totalExpense;
  }

  calculateCategorySummaries(): void {
    const categoryMap = new Map<string, { income: number; expense: number }>();

    this.transactions.forEach(t => {
      const amount = Number(t.balance || t.amount || 0);
      const category = t.category || 'Uncategorized';
      
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { income: 0, expense: 0 });
      }
      
      const summary = categoryMap.get(category)!;
      if (t.type === 'income') {
        summary.income += amount;
      } else if (t.type === 'expense') {
        summary.expense += amount;
      }
    });

    this.categorySummaries = Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        income: data.income,
        expense: data.expense,
        net: data.income - data.expense
      }))
      .sort((a, b) => Math.abs(b.net) - Math.abs(a.net));
  }

  calculateMonthlySummaries(): void {
    const monthlyMap = new Map<string, { income: number; expense: number; date: Date }>();

    this.transactions.forEach(t => {
      if (!t.created_at) return;
      
      const date = new Date(t.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const amount = Number(t.balance || t.amount || 0);
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { income: 0, expense: 0, date: new Date(date.getFullYear(), date.getMonth(), 1) });
      }
      
      const summary = monthlyMap.get(monthKey)!;
      if (t.type === 'income') {
        summary.income += amount;
      } else if (t.type === 'expense') {
        summary.expense += amount;
      }
    });

    this.monthlySummaries = Array.from(monthlyMap.entries())
      .map(([monthKey, data]) => ({
        month: data.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        income: data.income,
        expense: data.expense,
        net: data.income - data.expense,
        date: data.date
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  getFilteredTransactions(): Transaction[] {
    let filtered = [...this.transactions];

    if (this.selectedType !== 'all') {
      filtered = filtered.filter(t => t.type === this.selectedType);
    }

    if (this.selectedPeriod === 'month') {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      filtered = filtered.filter(t => {
        if (!t.created_at) return false;
        return new Date(t.created_at) >= firstDay;
      });
    } else if (this.selectedPeriod === 'year') {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), 0, 1);
      filtered = filtered.filter(t => {
        if (!t.created_at) return false;
        return new Date(t.created_at) >= firstDay;
      });
    }

    return filtered.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
