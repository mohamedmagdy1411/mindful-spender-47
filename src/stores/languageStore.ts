import { create } from "zustand"

type Language = "en" | "ar"

interface LanguageState {
  language: Language
  setLanguage: (language: Language) => void
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
    menu: "Menu",
    categories: "Categories",
    addCategory: "Add Category",
    dashboard: "Dashboard",
    reports: "Reports",
    hello: "Hello",
    today: "Today",
    learningPlan: "Learning Plan",
    recentTransactions: "Recent Transactions"
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
    menu: "القائمة",
    categories: "الفئات",
    addCategory: "إضافة فئة",
    dashboard: "لوحة التحكم",
    reports: "التقارير",
    hello: "مرحباً",
    today: "اليوم",
    learningPlan: "خطة التعلم",
    recentTransactions: "المعاملات الأخيرة"
  }
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: "ar",
  setLanguage: (language) => set({ language }),
}))