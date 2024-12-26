import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PlusIcon, PencilIcon, TrashIcon, CheckCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { BaseProps } from "@/types/props";
import { useLanguageStore, translations } from "@/stores/languageStore";

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  description?: string;
  targetDate?: string;
}

interface GoalTrackerProps extends BaseProps {
  totalSavings: number;
}

export const GoalTracker = ({ totalSavings, className }: GoalTrackerProps) => {
  const { language } = useLanguageStore();
  const t = translations[language];
  
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      name: "Emergency Fund",
      targetAmount: 10000,
      currentAmount: 2500,
      category: "savings",
      description: "Emergency fund for unexpected expenses",
      targetDate: "2024-12-31"
    },
    {
      id: "2",
      name: "Vacation",
      targetAmount: 5000,
      currentAmount: 1000,
      category: "leisure",
      description: "Summer vacation fund",
      targetDate: "2024-08-01"
    },
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    category: "",
    description: "",
    targetDate: ""
  });

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.category) {
      toast.error(language === 'ar' ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }

    const goal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      name: newGoal.name,
      targetAmount: Number(newGoal.targetAmount),
      currentAmount: 0,
      category: newGoal.category,
      description: newGoal.description,
      targetDate: newGoal.targetDate,
    };

    setGoals((prev) => [...prev, goal]);
    setNewGoal({ name: "", targetAmount: "", category: "", description: "", targetDate: "" });
    setIsAddDialogOpen(false);
    toast.success(language === 'ar' ? "تمت إضافة الهدف بنجاح" : "Goal added successfully");
  };

  const handleUpdateGoal = () => {
    if (!editingGoal) return;
    
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === editingGoal.id ? editingGoal : goal
      )
    );
    setEditingGoal(null);
    toast.success(language === 'ar' ? "تم تحديث الهدف بنجاح" : "Goal updated successfully");
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
    toast.success(language === 'ar' ? "تم حذف الهدف بنجاح" : "Goal deleted successfully");
  };

  const calculateProgress = (currentAmount: number, targetAmount: number) => {
    return Math.min((currentAmount / targetAmount) * 100, 100);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    return "bg-primary";
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">{t.financialGoals}</CardTitle>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-secondary hover:bg-secondary/90"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          {t.addGoal}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            return (
              <div
                key={goal.id}
                className="space-y-2 animate-fade-in p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium">{goal.name}</span>
                    {goal.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {goal.description}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingGoal(goal)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteGoal(goal.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                  </span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress
                  value={progress}
                  className={`h-2 ${getProgressColor(progress)}`}
                />
                {goal.targetDate && (
                  <div className="text-sm text-muted-foreground mt-2">
                    {language === 'ar' ? "تاريخ الهدف: " : "Target Date: "}
                    {new Date(goal.targetDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.addNewGoal}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">{t.goalName}</label>
              <Input
                value={newGoal.name}
                onChange={(e) => setNewGoal((prev) => ({ ...prev, name: e.target.value }))}
                placeholder={language === 'ar' ? "مثال: شراء سيارة" : "e.g., New Car"}
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t.targetAmount}</label>
              <Input
                type="number"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal((prev) => ({ ...prev, targetAmount: e.target.value }))}
                placeholder="5000"
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                {language === 'ar' ? "الفئة" : "Category"}
              </label>
              <Select
                value={newGoal.category}
                onValueChange={(value) => setNewGoal((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === 'ar' ? "اختر فئة" : "Select category"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="savings">
                    {language === 'ar' ? "مدخرات" : "Savings"}
                  </SelectItem>
                  <SelectItem value="investment">
                    {language === 'ar' ? "استثمار" : "Investment"}
                  </SelectItem>
                  <SelectItem value="debt">
                    {language === 'ar' ? "ديون" : "Debt"}
                  </SelectItem>
                  <SelectItem value="leisure">
                    {language === 'ar' ? "ترفيه" : "Leisure"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">
                {language === 'ar' ? "الوصف (اختياري)" : "Description (Optional)"}
              </label>
              <Textarea
                value={newGoal.description}
                onChange={(e) => setNewGoal((prev) => ({ ...prev, description: e.target.value }))}
                placeholder={language === 'ar' ? "أضف وصفاً لهدفك" : "Add a description for your goal"}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                {language === 'ar' ? "تاريخ الهدف (اختياري)" : "Target Date (Optional)"}
              </label>
              <Input
                type="date"
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal((prev) => ({ ...prev, targetDate: e.target.value }))}
              />
            </div>
            <Button onClick={handleAddGoal} className="w-full">
              {t.addGoal}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingGoal} onOpenChange={() => setEditingGoal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'ar' ? "تعديل الهدف" : "Edit Goal"}
            </DialogTitle>
          </DialogHeader>
          {editingGoal && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t.goalName}</label>
                <Input
                  value={editingGoal.name}
                  onChange={(e) => setEditingGoal({ ...editingGoal, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">{t.targetAmount}</label>
                <Input
                  type="number"
                  value={editingGoal.targetAmount}
                  onChange={(e) =>
                    setEditingGoal({ ...editingGoal, targetAmount: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  {language === 'ar' ? "المبلغ الحالي" : "Current Amount"}
                </label>
                <Input
                  type="number"
                  value={editingGoal.currentAmount}
                  onChange={(e) =>
                    setEditingGoal({ ...editingGoal, currentAmount: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  {language === 'ar' ? "الفئة" : "Category"}
                </label>
                <Select
                  value={editingGoal.category}
                  onValueChange={(value) => setEditingGoal({ ...editingGoal, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="savings">
                      {language === 'ar' ? "مدخرات" : "Savings"}
                    </SelectItem>
                    <SelectItem value="investment">
                      {language === 'ar' ? "استثمار" : "Investment"}
                    </SelectItem>
                    <SelectItem value="debt">
                      {language === 'ar' ? "ديون" : "Debt"}
                    </SelectItem>
                    <SelectItem value="leisure">
                      {language === 'ar' ? "ترفيه" : "Leisure"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">
                  {language === 'ar' ? "الوصف" : "Description"}
                </label>
                <Textarea
                  value={editingGoal.description}
                  onChange={(e) =>
                    setEditingGoal({ ...editingGoal, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  {language === 'ar' ? "تاريخ الهدف" : "Target Date"}
                </label>
                <Input
                  type="date"
                  value={editingGoal.targetDate}
                  onChange={(e) =>
                    setEditingGoal({ ...editingGoal, targetDate: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleUpdateGoal} className="w-full">
                {language === 'ar' ? "تحديث الهدف" : "Update Goal"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
