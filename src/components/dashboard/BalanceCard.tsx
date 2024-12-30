import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, WalletIcon } from "lucide-react";
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
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <WalletIcon className="h-6 w-6 text-[#33C3F0] animate-bounce" />
          {t.currentBalance}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-center">
            <span className="text-4xl font-bold mr-2 bg-gradient-to-r from-[#33C3F0] to-[#0EA5E9] bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
              {formatNumber(balance, language)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#F2FCE2] dark:bg-[#1A1F2C]/50 group-hover:scale-105 transition-transform duration-300">
              <ArrowUpIcon className="h-4 w-4 text-[#0EA5E9]" />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t.income}</p>
                <p className="text-lg font-medium">{formatNumber(income, language)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#FDE1D3] dark:bg-[#2C1A2F]/50 group-hover:scale-105 transition-transform duration-300">
              <ArrowDownIcon className="h-4 w-4 text-[#F97316]" />
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