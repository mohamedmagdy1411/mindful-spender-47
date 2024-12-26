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

export type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
};

export interface RecentTransactionsProps extends BaseProps {
  transactions: Transaction[];
  onAddTransaction: (newTransaction: Omit<Transaction, "id" | "date">) => void;
  onUpdateTransaction: (
    id: string,
    updatedTransaction: Omit<Transaction, "id" | "date">
  ) => void;
  onDeleteTransaction: (id: string) => void;
}