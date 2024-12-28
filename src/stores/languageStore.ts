import { create } from 'zustand';

interface LanguageState {
  language: 'en' | 'ar';
  setLanguage: (language: 'en' | 'ar') => void;
}

export const translations = {
  en: {
    currentBalance: "Current Balance",
    income: "Income",
    expenses: "Expenses",
    financialAnalytics: "Financial Analytics",
    expenseBreakdown: "Expense Breakdown",
    incomeVsExpenses: "Income vs Expenses",
    financialGoals: "Financial Goals",
    addGoal: "Add Goal",
    addNewGoal: "Add New Goal",
    goalName: "Goal Name",
    targetAmount: "Target Amount",
    currentAmount: "Current Amount",
    deadline: "Deadline",
    save: "Save",
    cancel: "Cancel",
    smartMoneyDashboard: "Smart Money Dashboard",
    recentTransactions: "Recent Transactions",
    addTransaction: "Add Transaction",
    updateTransaction: "Update Transaction",
    deleteTransaction: "Delete Transaction",
    transactionAdded: "Transaction added successfully",
    transactionUpdated: "Transaction updated successfully",
    transactionDeleted: "Transaction deleted successfully"
  },
  ar: {
    currentBalance: "الرصيد الحالي",
    income: "الدخل",
    expenses: "المصروفات",
    financialAnalytics: "التحليلات المالية",
    expenseBreakdown: "تفصيل المصروفات",
    incomeVsExpenses: "الدخل مقابل المصروفات",
    financialGoals: "الأهداف المالية",
    addGoal: "إضافة هدف",
    addNewGoal: "إضافة هدف جديد",
    goalName: "اسم الهدف",
    targetAmount: "المبلغ المستهدف",
    currentAmount: "المبلغ الحالي",
    deadline: "الموعد النهائي",
    save: "حفظ",
    cancel: "إلغاء",
    smartMoneyDashboard: "لوحة تحكم المال الذكية",
    recentTransactions: "المعاملات الأخيرة",
    addTransaction: "إضافة معاملة",
    updateTransaction: "تحديث المعاملة",
    deleteTransaction: "حذف المعاملة",
    transactionAdded: "تمت إضافة المعاملة بنجاح",
    transactionUpdated: "تم تحديث المعاملة بنجاح",
    transactionDeleted: "تم حذف المعاملة بنجاح"
  }
};

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'ar',
  setLanguage: (language) => set({ language }),
}));