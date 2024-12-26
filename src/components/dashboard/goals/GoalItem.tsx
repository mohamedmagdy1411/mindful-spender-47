import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useLanguageStore, translations, formatNumber } from "@/stores/languageStore";
import { GoalProgressBar } from "./GoalProgressBar";

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  description?: string;
  targetDate?: string;
}

interface GoalItemProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

export const GoalItem = ({ goal, onEdit, onDelete }: GoalItemProps) => {
  const { language } = useLanguageStore();
  const t = translations[language];
  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);

  return (
    <div className="space-y-2 animate-fade-in p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-all">
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
            onClick={() => onEdit(goal)}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(goal.id)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">
          {formatNumber(goal.currentAmount, language)} / {formatNumber(goal.targetAmount, language)}
        </span>
        <span className="font-medium">{Math.round(progress)}%</span>
      </div>
      <GoalProgressBar progress={progress} />
      {goal.targetDate && (
        <div className="text-sm text-muted-foreground mt-2">
          {language === 'ar' ? "تاريخ الهدف: " : "Target Date: "}
          {new Date(goal.targetDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};