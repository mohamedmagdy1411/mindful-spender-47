import { useState } from "react";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { GoalTracker } from "@/components/dashboard/GoalTracker";
import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { Transaction } from "@/types/props";
import { useLanguageStore, translations } from "@/stores/languageStore";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Avatar } from "@/components/ui/avatar";
import { Bell } from "lucide-react";

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
  const { language } = useLanguageStore();
  const t = translations[language];

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
      "#3B82F6",
      "#10B981",
      "#F59E0B",
      "#6366F1",
      "#EC4899",
      "#8B5CF6",
      "#14B8A6",
      "#F43F5E",
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
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12 ring-2 ring-primary/20">
              <img src="/lovable-uploads/3d0e0b87-8556-4156-9e02-c585c9994d2e.png" alt="Profile" />
            </Avatar>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{t.hello}</span>
                <span className="text-yellow-400">👋</span>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">John Doe</h2>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <LanguageSwitcher />
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <button className="px-6 py-2 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors">
            {t.today}
          </button>
          <button className="px-6 py-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
            {t.learningPlan}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BalanceCard
            balance={balance}
            income={income}
            expenses={expenses}
            className="bg-gradient-to-br from-card to-card/80 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl border border-border/50 hover:scale-105 animate-fade-in"
          />
          <ExpenseChart 
            data={getExpenseData()} 
            className="bg-gradient-to-br from-card to-card/80 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl border border-border/50 hover:scale-105 animate-fade-in delay-100"
          />
          <GoalTracker 
            totalSavings={balance}
            className="bg-gradient-to-br from-card to-card/80 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl border border-border/50 hover:scale-105 animate-fade-in delay-200"
          />
          <AIAssistant
            onAddTransaction={handleAddTransaction}
            className="bg-gradient-to-br from-card to-card/80 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl border border-border/50 hover:scale-105 animate-fade-in delay-300 md:col-span-3"
          />
          <RecentTransactions
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            onUpdateTransaction={handleUpdateTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            className="bg-gradient-to-br from-card to-card/80 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl border border-border/50 hover:scale-105 animate-fade-in delay-400 md:col-span-3"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;