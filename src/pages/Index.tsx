import { useState } from "react";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { GoalTracker } from "@/components/dashboard/GoalTracker";
import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { Transaction } from "@/types/props";
import { useLanguageStore, translations } from "@/stores/languageStore";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

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
  const [transactions] = useState<Transaction[]>(initialTransactions);
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

  const { income, expenses, balance } = calculateTotals();

  const handleAddTransaction = (transaction: {
    type: 'income' | 'expense';
    amount: number;
    category: string;
  }) => {
    // This is now handled by React Query in the RecentTransactions component
    console.log('Transaction added:', transaction);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2FCE2] to-[#D3E4FD] dark:from-[#1A1F2C] dark:to-[#2C1A2F]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#33C3F0] to-[#0EA5E9] bg-clip-text text-transparent animate-fade-in">
            {t.smartMoneyDashboard}
          </h1>
          <LanguageSwitcher />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 animate-fade-in [animation-delay:200ms]">
            <BalanceCard
              balance={balance}
              income={income}
              expenses={expenses}
              className="backdrop-blur-sm bg-white/60 dark:bg-gray-800/40 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl border border-white/20 hover:translate-y-[-4px] group"
            />
          </div>
          
          <div className="md:col-span-4 animate-fade-in [animation-delay:400ms]">
            <ExpenseChart 
              data={getExpenseData()} 
              className="backdrop-blur-sm bg-white/60 dark:bg-gray-800/40 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl border border-white/20 hover:translate-y-[-4px] group"
            />
          </div>
          
          <div className="md:col-span-4 animate-fade-in [animation-delay:600ms]">
            <GoalTracker 
              totalSavings={balance}
              className="backdrop-blur-sm bg-white/60 dark:bg-gray-800/40 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl border border-white/20 hover:translate-y-[-4px] group"
            />
          </div>
          
          <div className="md:col-span-12 animate-fade-in [animation-delay:800ms]">
            <AIAssistant
              onAddTransaction={handleAddTransaction}
              className="backdrop-blur-sm bg-white/60 dark:bg-gray-800/40 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl border border-white/20 hover:translate-y-[-4px] group"
            />
          </div>
          
          <div className="md:col-span-12 animate-fade-in [animation-delay:1000ms]">
            <RecentTransactions
              transactions={transactions}
              className="backdrop-blur-sm bg-white/60 dark:bg-gray-800/40 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl border border-white/20 hover:translate-y-[-4px] group"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;