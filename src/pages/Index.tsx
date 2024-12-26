import { useState } from "react";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { GoalTracker } from "@/components/dashboard/GoalTracker";

const initialTransactions = [
  {
    id: "1",
    type: "expense" as const,
    amount: 120,
    category: "Groceries",
    date: "2024-03-10",
  },
  {
    id: "2",
    type: "income" as const,
    amount: 2500,
    category: "Salary",
    date: "2024-03-09",
  },
  {
    id: "3",
    type: "expense" as const,
    amount: 50,
    category: "Transport",
    date: "2024-03-08",
  },
];

const Index = () => {
  const [transactions, setTransactions] = useState(initialTransactions);

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

  const handleAddTransaction = (newTransaction: Omit<typeof transactions[0], "id" | "date">) => {
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
    updatedTransaction: Omit<typeof transactions[0], "id" | "date">
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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Smart Money Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BalanceCard
          balance={balance}
          income={income}
          expenses={expenses}
        />
        <ExpenseChart data={getExpenseData()} />
        <GoalTracker totalSavings={balance} />
        <RecentTransactions
          transactions={transactions}
          onAddTransaction={handleAddTransaction}
          onUpdateTransaction={handleUpdateTransaction}
          onDeleteTransaction={handleDeleteTransaction}
        />
      </div>
    </div>
  );
};

export default Index;