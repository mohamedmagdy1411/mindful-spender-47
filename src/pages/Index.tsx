import { useState, useEffect } from "react";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { GoalTracker } from "@/components/dashboard/GoalTracker";
import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { Transaction } from "@/types/props";
import { useLanguageStore, translations } from "@/stores/languageStore";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuthStore } from "@/stores/authStore";
import { AuthUI } from "@/components/auth/AuthUI";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";

const Index = () => {
  const [showAuthChoice, setShowAuthChoice] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const { language } = useLanguageStore();
  const t = translations[language];
  const { isAuthRequired, setAuthRequired } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check for session changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch transactions from Supabase
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      if (!session?.user) {
        return [];
      }
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!session?.user, // Only run query if user is authenticated
  });

  // Add transaction mutation
  const addTransactionMutation = useMutation({
    mutationFn: async (newTransaction: Omit<Transaction, "id" | "date">) => {
      if (!session?.user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          ...newTransaction,
          user_id: session.user.id, // Add user_id to match RLS policy
          date: new Date().toISOString().split('T')[0],
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: t.transactionAdded,
      });
    },
  });

  // Update transaction mutation
  const updateTransactionMutation = useMutation({
    mutationFn: async ({ id, transaction }: { id: string, transaction: Omit<Transaction, "id" | "date"> }) => {
      if (!session?.user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('transactions')
        .update(transaction)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: t.transactionUpdated,
      });
    },
  });

  // Delete transaction mutation
  const deleteTransactionMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: t.transactionDeleted,
      });
    },
  });

  const calculateTotals = () => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  };

  const handleAuthChoice = (required: boolean) => {
    setAuthRequired(required);
    setShowAuthChoice(false);
    toast({
      title: required ? t.useWithAccount : t.useWithoutAccount,
      description: required ? "يمكنك الآن تسجيل الدخول لحفظ بياناتك" : "يمكنك استخدام التطبيق بدون تسجيل دخول",
    });
  };

  const handleAddTransaction = (newTransaction: Omit<Transaction, "id" | "date">) => {
    addTransactionMutation.mutate(newTransaction);
  };

  const handleUpdateTransaction = (id: string, updatedTransaction: Omit<Transaction, "id" | "date">) => {
    updateTransactionMutation.mutate({ id, transaction: updatedTransaction });
  };

  const handleDeleteTransaction = (id: string) => {
    deleteTransactionMutation.mutate(id);
  };

  const getExpenseData = () => {
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

  const { income, expenses, balance } = calculateTotals();

  if (showAuthChoice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F2FCE2] to-[#D3E4FD] dark:from-[#1A1F2C] dark:to-[#2C1A2F] flex items-center justify-center">
        <div className="bg-white/80 dark:bg-gray-800/80 p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-center mb-6">{t.chooseAppUsage}</h2>
          <div className="space-y-4">
            <Button 
              className="w-full text-lg py-6"
              variant="outline"
              onClick={() => handleAuthChoice(true)}
            >
              {t.useWithAccount}
            </Button>
            <Button 
              className="w-full text-lg py-6"
              variant="outline"
              onClick={() => handleAuthChoice(false)}
            >
              {t.useWithoutAccount}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthRequired && !session) {
    return <AuthUI />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F2FCE2] to-[#D3E4FD] dark:from-[#1A1F2C] dark:to-[#2C1A2F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#33C3F0]"></div>
      </div>
    );
  }

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
              onAddTransaction={handleAddTransaction}
              onUpdateTransaction={handleUpdateTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              className="backdrop-blur-sm bg-white/60 dark:bg-gray-800/40 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl border border-white/20 hover:translate-y-[-4px] group"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;