import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types/props";
import { toast } from "sonner";
import { translations } from "@/stores/languageStore";

export const useTransactions = (language: string) => {
  const queryClient = useQueryClient();
  const t = translations[language];

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data as Transaction[];
    },
  });

  const addTransactionMutation = useMutation({
    mutationFn: async (newTransaction: Omit<Transaction, "id" | "date">) => {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          ...newTransaction,
          date: new Date().toISOString().split('T')[0],
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success(t.transactionAdded);
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: async ({ id, transaction }: { id: string, transaction: Omit<Transaction, "id" | "date"> }) => {
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
      toast.success(t.transactionUpdated);
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success(t.transactionDeleted);
    },
  });

  return {
    transactions,
    isLoading,
    addTransaction: addTransactionMutation.mutate,
    updateTransaction: updateTransactionMutation.mutate,
    deleteTransaction: deleteTransactionMutation.mutate,
  };
};