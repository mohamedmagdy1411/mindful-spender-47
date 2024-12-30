import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Transaction, TransactionType } from "@/types/props";
import { useLanguageStore, translations } from "@/stores/languageStore";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const useTransactions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { language } = useLanguageStore();
  const t = translations[language];

  // Fetch transactions
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        toast.error(t.errorLoadingTransactions);
        throw error;
      }

      return (data || []) as Transaction[];
    },
    enabled: !!user,
  });

  // Add transaction mutation
  const addTransactionMutation = useMutation({
    mutationFn: async (newTransaction: Omit<Transaction, 'id' | 'date' | 'user_id' | 'created_at'>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          ...newTransaction,
          user_id: user.id,
          date: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] });
      toast.success(t.transactionAdded);
    },
    onError: () => {
      toast.error(t.transactionError);
    },
  });

  // Update transaction mutation
  const updateTransactionMutation = useMutation({
    mutationFn: async ({ id, transaction }: { id: string, transaction: Omit<Transaction, 'id' | 'date' | 'user_id' | 'created_at'> }) => {
      if (!user) throw new Error('User not authenticated');
      
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
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] });
      toast.success(t.transactionUpdated);
    },
    onError: () => {
      toast.error(t.transactionError);
    },
  });

  // Delete transaction mutation
  const deleteTransactionMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] });
      toast.success(t.transactionDeleted);
    },
    onError: () => {
      toast.error(t.transactionError);
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

  const getExpenseData = () => {
    const expensesByCategory = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const colors = [
      "#3B82F6", "#10B981", "#F59E0B", "#6366F1", 
      "#EC4899", "#8B5CF6", "#14B8A6", "#F43F5E"
    ];

    return Object.entries(expensesByCategory).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  };

  return {
    transactions,
    isLoading,
    addTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'user_id' | 'created_at'>) => 
      addTransactionMutation.mutate(transaction),
    updateTransaction: (id: string, transaction: Omit<Transaction, 'id' | 'date' | 'user_id' | 'created_at'>) => 
      updateTransactionMutation.mutate({ id, transaction }),
    deleteTransaction: (id: string) => deleteTransactionMutation.mutate(id),
    calculateTotals,
    getExpenseData,
  };
};