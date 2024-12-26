import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ExpenseData {
  name: string;
  value: number;
  color: string;
}

interface TrendData {
  date: string;
  expenses: number;
  income: number;
}

interface ExpenseChartProps {
  data: ExpenseData[];
}

const trendData: TrendData[] = [
  { date: 'Jan', expenses: 3000, income: 4500 },
  { date: 'Feb', expenses: 2800, income: 4500 },
  { date: 'Mar', expenses: 3200, income: 4700 },
  { date: 'Apr', expenses: 2900, income: 4600 },
  { date: 'May', expenses: 3100, income: 4800 },
  { date: 'Jun', expenses: 2700, income: 4900 },
];

export const ExpenseChart = ({ data }: ExpenseChartProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Financial Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="breakdown" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="breakdown">Expense Breakdown</TabsTrigger>
            <TabsTrigger value="trends">Income vs Expenses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="breakdown" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    padding: '8px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="trends" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    padding: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#colorExpenses)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};