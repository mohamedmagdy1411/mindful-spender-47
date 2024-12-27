import { create } from "zustand";

type Language = "en" | "ar" | "es" | "fr";

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
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
    addTransaction: "Add Transaction",
    updateTransaction: "Update Transaction",
    deleteTransaction: "Delete Transaction",
    transactionAdded: "Transaction added successfully",
    transactionUpdated: "Transaction updated successfully",
    transactionDeleted: "Transaction deleted successfully",
    dashboard: "Dashboard",
    reports: "Reports",
    menu: "Menu",
    categories: "Categories",
    addCategory: "Add Category",
    hello: "Hello",
    today: "Today",
    learningPlan: "Learning Plan"
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
    addTransaction: "إضافة معاملة",
    updateTransaction: "تحديث المعاملة",
    deleteTransaction: "حذف المعاملة",
    transactionAdded: "تمت إضافة المعاملة بنجاح",
    transactionUpdated: "تم تحديث المعاملة بنجاح",
    transactionDeleted: "تم حذف المعاملة بنجاح",
    dashboard: "لوحة التحكم",
    reports: "التقارير",
    menu: "القائمة",
    categories: "الفئات",
    addCategory: "إضافة فئة",
    hello: "مرحباً",
    today: "اليوم",
    learningPlan: "خطة التعلم"
  },
  es: {
    currentBalance: "Saldo Actual",
    income: "Ingresos",
    expenses: "Gastos",
    financialAnalytics: "Análisis Financiero",
    expenseBreakdown: "Desglose de Gastos",
    incomeVsExpenses: "Ingresos vs Gastos",
    financialGoals: "Metas Financieras",
    addGoal: "Agregar Meta",
    addNewGoal: "Agregar Nueva Meta",
    goalName: "Nombre de la Meta",
    targetAmount: "Monto Objetivo",
    currentAmount: "Monto Actual",
    deadline: "Fecha Límite",
    addTransaction: "Agregar Transacción",
    updateTransaction: "Actualizar Transacción",
    deleteTransaction: "Eliminar Transacción",
    transactionAdded: "Transacción agregada con éxito",
    transactionUpdated: "Transacción actualizada con éxito",
    transactionDeleted: "Transacción eliminada con éxito",
    dashboard: "Tablero",
    reports: "Informes",
    menu: "Menú",
    categories: "Categorías",
    addCategory: "Agregar Categoría",
    hello: "Hola",
    today: "Hoy",
    learningPlan: "Plan de Aprendizaje"
  },
  fr: {
    currentBalance: "Solde Actuel",
    income: "Revenu",
    expenses: "Dépenses",
    financialAnalytics: "Analyse Financière",
    expenseBreakdown: "Répartition des Dépenses",
    incomeVsExpenses: "Revenus vs Dépenses",
    financialGoals: "Objectifs Financiers",
    addGoal: "Ajouter un Objectif",
    addNewGoal: "Ajouter un Nouvel Objectif",
    goalName: "Nom de l'Objectif",
    targetAmount: "Montant Cible",
    currentAmount: "Montant Actuel",
    deadline: "Date Limite",
    addTransaction: "Ajouter une Transaction",
    updateTransaction: "Mettre à Jour la Transaction",
    deleteTransaction: "Supprimer la Transaction",
    transactionAdded: "Transaction ajoutée avec succès",
    transactionUpdated: "Transaction mise à jour avec succès",
    transactionDeleted: "Transaction supprimée avec succès",
    dashboard: "Tableau de Bord",
    reports: "Rapports",
    menu: "Menu",
    categories: "Catégories",
    addCategory: "Ajouter une Catégorie",
    hello: "Bonjour",
    today: "Aujourd'hui",
    learningPlan: "Plan d'Apprentissage"
  }
};

export const useLanguageStore = create<LanguageState>((set) => ({
  language: "en",
  setLanguage: (language) => set({ language }),
}));

export const formatNumber = (number: number, language: string) => {
  return new Intl.NumberFormat(language === "ar" ? "ar-SA" : "en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
};
