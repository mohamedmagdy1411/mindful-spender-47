import { useState } from "react";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { GoalTracker } from "@/components/dashboard/GoalTracker";
import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { Transaction } from "@/types/props";
import { useLanguageStore, translations } from "@/stores/languageStore";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "@/hooks/useTransactions";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguageStore();
  const t = translations[language];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const {
    transactions,
    isLoading: transactionsLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    calculateTotals,
    getExpenseData
  } = useTransactions();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      toast.success("Check your email for the confirmation link");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F2FCE2] to-[#D3E4FD] dark:from-[#1A1F2C] dark:to-[#2C1A2F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F2FCE2] to-[#D3E4FD] dark:from-[#1A1F2C] dark:to-[#2C1A2F] flex items-center justify-center">
        <div className="w-full max-w-md space-y-8 p-8 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg backdrop-blur-sm">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-center">Welcome</h2>
            <form className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Button
                  onClick={handleSignIn}
                  className="w-full"
                  type="button"
                >
                  Sign In
                </Button>
                <Button
                  onClick={handleSignUp}
                  className="w-full"
                  variant="outline"
                  type="button"
                >
                  Sign Up
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const { income, expenses, balance } = calculateTotals();

  return (
    <DashboardLayout>
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
              onAddTransaction={addTransaction}
              className="backdrop-blur-sm bg-white/60 dark:bg-gray-800/40 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl border border-white/20 hover:translate-y-[-4px] group"
            />
          </div>
          
          <div className="md:col-span-12 animate-fade-in [animation-delay:1000ms]">
            <RecentTransactions
              transactions={transactions}
              onAddTransaction={addTransaction}
              onUpdateTransaction={updateTransaction}
              onDeleteTransaction={deleteTransaction}
              className="backdrop-blur-sm bg-white/60 dark:bg-gray-800/40 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl border border-white/20 hover:translate-y-[-4px] group"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;