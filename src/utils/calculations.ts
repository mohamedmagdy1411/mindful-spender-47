import { Transaction } from "@/types/props";

export const calculateTotals = (transactions: Transaction[]) => {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  return { income, expenses, balance: income - expenses };
};

export const getExpenseData = (transactions: Transaction[]) => {
  const expensesByCategory: { [key: string]: number } = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((transaction) => {
      expensesByCategory[transaction.category] = (expensesByCategory[transaction.category] || 0) + transaction.amount;
    });

  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"];
  return Object.entries(expensesByCategory).map(([name, value], index) => ({
    name,
    value,
    color: colors[index % colors.length],
  }));
};