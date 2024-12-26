import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

interface GoalTrackerProps {
  totalSavings: number;
}

export const GoalTracker = ({ totalSavings }: GoalTrackerProps) => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      name: "Emergency Fund",
      targetAmount: 10000,
      currentAmount: 2500,
    },
    {
      id: "2",
      name: "Vacation",
      targetAmount: 5000,
      currentAmount: 1000,
    },
  ]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: "", targetAmount: "" });

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount) {
      toast.error("Please fill in all fields");
      return;
    }

    const goal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      name: newGoal.name,
      targetAmount: Number(newGoal.targetAmount),
      currentAmount: 0,
    };

    setGoals((prev) => [...prev, goal]);
    setNewGoal({ name: "", targetAmount: "" });
    setIsAddDialogOpen(false);
    toast.success("Goal added successfully");
  };

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Financial Goals</CardTitle>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-secondary hover:bg-secondary/90"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="space-y-2 animate-fade-in"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{goal.name}</span>
                <span className="text-sm text-muted-foreground">
                  ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                </span>
              </div>
              <Progress
                value={(goal.currentAmount / goal.targetAmount) * 100}
                className="h-2"
              />
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Goal Name</label>
              <Input
                value={newGoal.name}
                onChange={(e) => setNewGoal((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., New Car"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Target Amount ($)</label>
              <Input
                type="number"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal((prev) => ({ ...prev, targetAmount: e.target.value }))}
                placeholder="5000"
              />
            </div>
            <Button onClick={handleAddGoal} className="w-full">
              Add Goal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};