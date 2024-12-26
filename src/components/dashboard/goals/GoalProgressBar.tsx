import { Progress } from "@/components/ui/progress";

interface GoalProgressBarProps {
  progress: number;
}

export const getProgressColor = (progress: number) => {
  if (progress >= 100) return "bg-green-500";
  if (progress >= 75) return "bg-blue-500";
  if (progress >= 50) return "bg-yellow-500";
  return "bg-gray-500";
};

export const GoalProgressBar = ({ progress }: GoalProgressBarProps) => {
  return (
    <Progress
      value={progress}
      className={`h-2 ${getProgressColor(progress)}`}
    />
  );
};