import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { GoalTracker } from "@/components/dashboard/GoalTracker";
import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { useLanguageStore, translations } from "@/stores/languageStore";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTransactions } from "@/hooks/useTransactions";
import { calculateTotals, getExpenseData } from "@/utils/calculations";

const Index = () => {
  const { language } = useLanguageStore();
  const t = translations[language];
  
  const {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions(language);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F2FCE2] to-[#D3E4FD] dark:from-[#1A1F2C] dark:to-[#2C1A2F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#33C3F0]"></div>
      </div>
    );
  }

  const { income, expenses, balance } = calculateTotals(transactions);

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
              data={getExpenseData(transactions)} 
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
              onAddTransaction={addTransaction}
              className="backdrop-blur-sm bg-white/60 dark:bg-gray-800/40 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl border border-white/20 hover:translate-y-[-4px] group"
            />
          </div>
          
          <div className="md:col-span-12 animate-fade-in [animation-delay:1000ms]">
            <RecentTransactions
              transactions={transactions}
              onAddTransaction={addTransaction}
              onUpdateTransaction={(id, transaction) => updateTransaction({ id, transaction })}
              onDeleteTransaction={deleteTransaction}
              className="backdrop-blur-sm bg-white/60 dark:bg-gray-800/40 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl border border-white/20 hover:translate-y-[-4px] group"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;