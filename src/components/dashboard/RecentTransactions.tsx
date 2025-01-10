import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon, ArrowUpIcon, PencilIcon, TrashIcon, PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransactionForm } from "./TransactionForm";
import { toast } from "sonner";
import { BaseProps } from "@/types/props";
import { useLanguageStore, translations, formatNumber } from "@/stores/languageStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
}

interface RecentTransactionsProps extends BaseProps {
  transactions: Transaction[];
}

const LOCAL_STORAGE_KEY = 'transactions';

export const RecentTransactions = ({
  transactions: initialTransactions,
  className,
}: RecentTransactionsProps) => {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const queryClient = useQueryClient();

  // Function to load transactions from localStorage
  const loadTransactions = () => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialTransactions;
  };

  // Function to save transactions to localStorage
  const saveTransactions = (transactions: Transaction[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(transactions));
  };

  // Fetch transactions using React Query with localStorage
  const { data: transactions = initialTransactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: loadTransactions,
  });

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (transactions) {
      saveTransactions(transactions);
    }
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return formatNumber(amount, language);
  };

  const handleAdd = async (transaction: Omit<Transaction, 'id' | 'date'>) => {
    try {
      const newTransaction = {
        ...transaction,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
      };

      const updatedTransactions = [...transactions, newTransaction];
      saveTransactions(updatedTransactions);
      setIsAddDialogOpen(false);
      toast.success(t.transactionAdded);
      queryClient.setQueryData(['transactions'], updatedTransactions);
    } catch (error) {
      console.error('Add transaction error:', error);
      toast.error("Failed to add transaction");
    }
  };

  const handleUpdate = async (transaction: Omit<Transaction, 'id' | 'date'>) => {
    if (editingTransaction) {
      try {
        const updatedTransactions = transactions.map((t) =>
          t.id === editingTransaction.id
            ? { ...t, ...transaction }
            : t
        );
        saveTransactions(updatedTransactions);
        setEditingTransaction(null);
        toast.success(t.transactionUpdated);
        queryClient.setQueryData(['transactions'], updatedTransactions);
      } catch (error) {
        console.error('Update transaction error:', error);
        toast.error("Failed to update transaction");
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const updatedTransactions = transactions.filter((t) => t.id !== id);
      saveTransactions(updatedTransactions);
      toast.success(t.transactionDeleted);
      queryClient.setQueryData(['transactions'], updatedTransactions);
    } catch (error) {
      console.error('Delete transaction error:', error);
      toast.error("Failed to delete transaction");
    }
  };

  return (
    <>
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">{t.recentTransactions}</CardTitle>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-secondary hover:bg-secondary/90"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            {t.addTransaction}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors animate-fade-in"
              >
                <div className="flex items-center space-x-4">
                  {transaction.type === 'income' ? (
                    <ArrowUpIcon className="h-5 w-5 text-secondary" />
                  ) : (
                    <ArrowDownIcon className="h-5 w-5 text-destructive" />
                  )}
                  <div>
                    <p className="font-medium">{transaction.category}</p>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`font-medium ${
                    transaction.type === 'income' ? 'text-secondary' : 'text-destructive'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingTransaction(transaction)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(transaction.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.addTransaction}</DialogTitle>
          </DialogHeader>
          <TransactionForm
            onSubmit={handleAdd}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingTransaction} onOpenChange={() => setEditingTransaction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.updateTransaction}</DialogTitle>
          </DialogHeader>
          {editingTransaction && (
            <TransactionForm
              initialValues={{
                type: editingTransaction.type,
                amount: editingTransaction.amount,
                category: editingTransaction.category,
              }}
              onSubmit={handleUpdate}
              onCancel={() => setEditingTransaction(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};