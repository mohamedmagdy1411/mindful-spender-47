import { ReactNode } from 'react';

export interface BaseProps {
  className?: string;
}

export interface BalanceCardProps extends BaseProps {
  balance: number;
  income: number;
  expenses: number;
}

export interface ExpenseChartProps extends BaseProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export interface GoalTrackerProps extends BaseProps {
  totalSavings: number;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  user_id?: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  created_at?: string;
}

export interface RecentTransactionsProps extends BaseProps {
  transactions: Transaction[];
  onAddTransaction: (newTransaction: Omit<Transaction, "id" | "date" | "user_id" | "created_at">) => void;
  onUpdateTransaction: (
    id: string,
    updatedTransaction: Omit<Transaction, "id" | "date" | "user_id" | "created_at">
  ) => void;
  onDeleteTransaction: (id: string) => void;
}