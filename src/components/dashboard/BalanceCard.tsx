import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, DollarSign } from "lucide-react";
import { BaseProps } from "@/types/props";
import { useLanguageStore, translations, formatNumber } from "@/stores/languageStore";

interface BalanceCardProps extends BaseProps {
  balance: number;
  income: number;
  expenses: number;
}

export const BalanceCard = ({ balance, income, expenses, className }: BalanceCardProps) => {
  const { language } = useLanguageStore();
  const t = translations[language];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{t.currentBalance}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-primary" />
            <span className="text-4xl font-bold mr-2">{formatNumber(balance, language)}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <ArrowUpIcon className="h-4 w-4 text-secondary" />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t.income}</p>
                <p className="text-lg font-medium">{formatNumber(income, language)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ArrowDownIcon className="h-4 w-4 text-destructive" />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t.expenses}</p>
                <p className="text-lg font-medium">{formatNumber(expenses, language)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};