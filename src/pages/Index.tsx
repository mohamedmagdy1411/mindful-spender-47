import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";

const mockExpenseData = [
  { name: "Housing", value: 1200, color: "#3B82F6" },
  { name: "Food", value: 400, color: "#10B981" },
  { name: "Transport", value: 200, color: "#F59E0B" },
  { name: "Entertainment", value: 150, color: "#6366F1" },
];

const mockTransactions = [
  {
    id: "1",
    type: "expense" as const,
    amount: 120,
    category: "Groceries",
    date: "2024-03-10",
  },
  {
    id: "2",
    type: "income" as const,
    amount: 2500,
    category: "Salary",
    date: "2024-03-09",
  },
  {
    id: "3",
    type: "expense" as const,
    amount: 50,
    category: "Transport",
    date: "2024-03-08",
  },
];

const Index = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Smart Money Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BalanceCard balance={3430} income={2500} expenses={370} />
        <ExpenseChart data={mockExpenseData} />
        <RecentTransactions transactions={mockTransactions} />
      </div>
    </div>
  );
};

export default Index;