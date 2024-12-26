import { useState } from "react";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { GoalTracker } from "@/components/dashboard/GoalTracker";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Transaction } from "@/types/props";

const initialTransactions: Transaction[] = [
  {
    id: "1",
    type: "expense",
    amount: 120,
    category: "Groceries",
    date: "2024-03-10",
  },
  {
    id: "2",
    type: "income",
    amount: 2500,
    category: "Salary",
    date: "2024-03-09",
  },
  {
    id: "3",
    type: "expense",
    amount: 50,
    category: "Transport",
    date: "2024-03-08",
  },
];

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const calculateTotals = () => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  };

  const getExpenseData = () => {
    const expensesByCategory = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const colors = [
      "#3B82F6", // Blue
      "#10B981", // Green
      "#F59E0B", // Yellow
      "#6366F1", // Indigo
      "#EC4899", // Pink
      "#8B5CF6", // Purple
      "#14B8A6", // Teal
      "#F43F5E", // Rose
    ];

    return Object.entries(expensesByCategory).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  };

  const handleAddTransaction = (newTransaction: Omit<Transaction, "id" | "date">) => {
    setTransactions((prev) => [
      {
        ...newTransaction,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString().split("T")[0],
      },
      ...prev,
    ]);
  };

  const handleUpdateTransaction = (
    id: string,
    updatedTransaction: Omit<Transaction, "id" | "date">
  ) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, ...updatedTransaction }
          : t
      )
    );
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const { income, expenses, balance } = calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Smart Money Dashboard
          </h1>
          <LanguageSwitcher />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BalanceCard
            balance={balance}
            income={income}
            expenses={expenses}
            className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 shadow-xl hover:shadow-2xl transition-all duration-300"
          />
          <ExpenseChart 
            data={getExpenseData()} 
            className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 shadow-xl hover:shadow-2xl transition-all duration-300"
          />
          <GoalTracker 
            totalSavings={balance}
            className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 shadow-xl hover:shadow-2xl transition-all duration-300"
          />
          <RecentTransactions
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            onUpdateTransaction={handleUpdateTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 shadow-xl hover:shadow-2xl transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
