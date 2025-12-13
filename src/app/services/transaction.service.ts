import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { IncomeService, Income } from '../components/income/income.service';
import { ExpenseService, Expense } from '../components/expense/expense.service';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(
    private incomeService: IncomeService,
    private expenseService: ExpenseService
  ) {}

  getAll(): Observable<Transaction[]> {
    return forkJoin({
      incomes: this.incomeService.getAllIncomes(),
      expenses: this.expenseService.getAllExpenses()
    }).pipe(
      map(({ incomes, expenses }) => {
        const incomeTransactions: Transaction[] = incomes.map(income => ({
          _id: income.id || `income_${Date.now()}`,
          id: income.id,
          name: income.name,
          description: income.name,
          type: 'income' as const,
          category: income.category,
          balance: income.amount,
          amount: income.amount,
          user_id: income.user_id,
          created_at: income.created_at
        }));

        const expenseTransactions: Transaction[] = expenses.map(expense => ({
          _id: expense.id || `expense_${Date.now()}`,
          id: expense.id,
          name: expense.name,
          description: expense.name,
          type: 'expense' as const,
          category: expense.category,
          balance: expense.amount,
          amount: expense.amount,
          user_id: expense.user_id,
          created_at: expense.created_at
        }));

        return [...incomeTransactions, ...expenseTransactions].sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
      })
    );
  }
}

