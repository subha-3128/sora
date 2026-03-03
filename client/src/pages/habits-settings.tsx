import { useState } from "react";
import { Trash2, Plus, GripVertical, CheckSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useHabits, useCreateHabit, useDeleteHabit } from "@/hooks";

export default function HabitsSettingsPage() {
  const { data: habits = [], isLoading } = useHabits();
  const createHabit = useCreateHabit();
  const deleteHabit = useDeleteHabit();
  
  const [newHabit, setNewHabit] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    createHabit.mutate({ name: newHabit }, {
      onSuccess: () => setNewHabit("")
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto w-full pb-24">
      <PageHeader 
        title="Habit Configuration" 
        description="Define the daily habits you want to track consistently."
      />

      <Card className="premium-card overflow-hidden">
        <div className="p-5 md:p-6 bg-secondary/20 border-b border-border/50">
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
            <Input 
              placeholder="E.g. Drink 2L water, Read 30 mins..." 
              value={newHabit}
              onChange={e => setNewHabit(e.target.value)}
              className="bg-background shadow-sm"
            />
            <Button type="submit" disabled={createHabit.isPending || !newHabit.trim()} className="shadow-sm w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" /> Add Habit
            </Button>
          </form>
        </div>

        <div className="p-2">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading habits...</div>
          ) : habits.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <CheckSquare className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No habits yet</h3>
              <p className="text-muted-foreground max-w-sm mt-2 text-sm">Add habits above to start tracking them daily on your Focus dashboard.</p>
            </div>
          ) : (
            <div className="space-y-1">
              <AnimatePresence>
                {habits.map(habit => (
                  <motion.div 
                    key={habit.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/30 group transition-colors border border-transparent hover:border-border/50"
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground/30 cursor-grab" />
                    <span className="flex-1 font-medium">{habit.name}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => deleteHabit.mutate(habit.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
