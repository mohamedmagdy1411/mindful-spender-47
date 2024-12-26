import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, DollarSign } from "lucide-react";

interface BalanceCardProps {
  balance: number;
  income: number;
  expenses: number;
}

export const BalanceCard = ({ balance, income, expenses }: BalanceCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Current Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-primary" />
            <span className="text-4xl font-bold ml-2">{formatCurrency(balance)}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <ArrowUpIcon className="h-4 w-4 text-secondary" />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Income</p>
                <p className="text-lg font-medium">{formatCurrency(income)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ArrowDownIcon className="h-4 w-4 text-destructive" />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Expenses</p>
                <p className="text-lg font-medium">{formatCurrency(expenses)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};