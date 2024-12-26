import { create } from 'zustand';

type Language = 'en' | 'es' | 'fr' | 'ar';

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
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
    smartMoneyDashboard: "Smart Money Dashboard",
    tellMeAboutYourDay: "Tell me about your day",
    processText: "Process Text",
    targetDate: "Target Date",
    description: "Description",
    category: "Category",
    savings: "Savings",
    investment: "Investment",
    debt: "Debt",
    leisure: "Leisure",
    optional: "Optional",
    updateGoal: "Update Goal",
    remaining: "Remaining",
    achieved: "Achieved",
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
    smartMoneyDashboard: "لوحة تحكم الأموال الذكية",
    tellMeAboutYourDay: "أخبرني عن يومك",
    processText: "معالجة النص",
    targetDate: "تاريخ الهدف",
    description: "الوصف",
    category: "الفئة",
    savings: "مدخرات",
    investment: "استثمار",
    debt: "ديون",
    leisure: "ترفيه",
    optional: "اختياري",
    updateGoal: "تحديث الهدف",
    remaining: "المتبقي",
    achieved: "تم تحقيق",
  },
  es: {
    currentBalance: "Balance Actual",
    income: "Ingresos",
    expenses: "Gastos",
    financialAnalytics: "Análisis Financiero",
    expenseBreakdown: "Desglose de Gastos",
    incomeVsExpenses: "Ingresos vs Gastos",
    financialGoals: "Objetivos Financieros",
    addGoal: "Añadir Objetivo",
    addNewGoal: "Añadir Nuevo Objetivo",
    goalName: "Nombre del Objetivo",
    targetAmount: "Cantidad Objetivo",
    smartMoneyDashboard: "Panel de Control Financiero",
    tellMeAboutYourDay: "Cuéntame sobre tu día",
    processText: "Procesar Texto",
  },
  fr: {
    currentBalance: "Solde Actuel",
    income: "Revenus",
    expenses: "Dépenses",
    financialAnalytics: "Analyses Financières",
    expenseBreakdown: "Répartition des Dépenses",
    incomeVsExpenses: "Revenus vs Dépenses",
    financialGoals: "Objectifs Financiers",
    addGoal: "Ajouter un Objectif",
    addNewGoal: "Ajouter un Nouvel Objectif",
    goalName: "Nom de l'Objectif",
    targetAmount: "Montant Cible",
    smartMoneyDashboard: "Tableau de Bord Financier",
    tellMeAboutYourDay: "Racontez-moi votre journée",
    processText: "Traiter le Texte",
  }
};

export const formatNumber = (number: number, language: Language) => {
  const formatter = new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
    style: 'currency',
    currency: 'USD',
  });
  
  return formatter.format(number);
};

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: 'ar',
  setLanguage: (lang) => set({ language: lang }),
}));
