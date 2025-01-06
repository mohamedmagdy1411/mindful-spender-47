import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";

interface TransactionFormProps {
  onSubmit: (transaction: {
    type: 'income' | 'expense';
    amount: number;
    category: string;
  }) => void;
  initialValues?: {
    type: 'income' | 'expense';
    amount: number;
    category: string;
  };
  onCancel?: () => void;
}

export const TransactionForm = ({ onSubmit, initialValues, onCancel }: TransactionFormProps) => {
  const [type, setType] = useState<'income' | 'expense'>(initialValues?.type || 'expense');
  const [amount, setAmount] = useState(initialValues?.amount?.toString() || '');
  const [category, setCategory] = useState(initialValues?.category || '');
  
  // Debounce the form values to prevent too many saves
  const debouncedType = useDebounce(type, 1000);
  const debouncedAmount = useDebounce(amount, 1000);
  const debouncedCategory = useDebounce(category, 1000);

  // Auto-save effect
  useEffect(() => {
    if (debouncedAmount && debouncedCategory) {
      handleSubmit();
      toast.success("Changes saved automatically");
    }
  }, [debouncedType, debouncedAmount, debouncedCategory]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!amount || !category) {
      toast.error("Please fill in all fields");
      return;
    }

    onSubmit({
      type,
      amount: parseFloat(amount),
      category,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div className="space-y-2">
        <Select
          value={type}
          onValueChange={(value: 'income' | 'expense') => setType(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="flex space-x-2">
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
          {initialValues ? 'Update' : 'Add'} Transaction
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};