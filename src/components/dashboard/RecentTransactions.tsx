import { useState } from "react";
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

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
}

interface RecentTransactionsProps extends BaseProps {
  transactions: Transaction[];
  onAddTransaction?: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  onUpdateTransaction?: (id: string, transaction: Omit<Transaction, 'id' | 'date'>) => void;
  onDeleteTransaction?: (id: string) => void;
}

export const RecentTransactions = ({
  transactions,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
  className,
}: RecentTransactionsProps) => {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const formatCurrency = (amount: number) => {
    return formatNumber(amount, language);
  };

  const handleAdd = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    onAddTransaction?.(transaction);
    setIsAddDialogOpen(false);
    toast.success(t.transactionAdded);
  };

  const handleUpdate = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    if (editingTransaction) {
      onUpdateTransaction?.(editingTransaction.id, transaction);
      setEditingTransaction(null);
      toast.success(t.transactionUpdated);
    }
  };

  const handleDelete = (id: string) => {
    onDeleteTransaction?.(id);
    toast.success(t.transactionDeleted);
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