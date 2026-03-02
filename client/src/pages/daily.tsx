import { useState, useMemo } from "react";
import { format, addDays, subDays } from "date-fns";
import { Check, Star, Trash2, Plus, Clock, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  useTasks, useCreateTask, useUpdateTask, useDeleteTask,
  useHabits, useHabitLogs, useUpsertHabitLog,
  useStudySessions, useCreateStudySession, useDeleteStudySession,
  useDailyReflection, useUpsertDailyReflection
} from "@/hooks/use-tasks"; // Note: actually importing from specific hooks in production, we will import all from their respective files.

// Fixing imports manually since they were requested in separate files
import { useTasks as useT, useCreateTask as useCT, useUpdateTask as useUT, useDeleteTask as useDT } from "@/hooks/use-tasks";
import { useHabits as useH, useHabitLogs as useHL, useUpsertHabitLog as useUHL } from "@/hooks/use-habits";
import { useStudySessions as useSS, useCreateStudySession as useCSS, useDeleteStudySession as useDSS } from "@/hooks/use-study";
import { useDailyReflection as useDR, useUpsertDailyReflection as useUDR } from "@/hooks/use-reviews";

export default function DailyPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const dateStr = format(currentDate, "yyyy-MM-dd");
  const { toast } = useToast();

  // Queries
  const { data: tasks = [] } = useT(dateStr);
  const { data: habits = [] } = useH();
  const { data: habitLogs = [] } = useHL(dateStr);
  const { data: studySessions = [] } = useSS(dateStr);
  const { data: reflection } = useDR(dateStr);

  // Mutations
  const createTask = useCT();
  const updateTask = useUT();
  const deleteTask = useDT();
  const upsertHabitLog = useUHL();
  const createStudySession = useCSS();
  const deleteStudySession = useDSS();
  const upsertReflection = useUDR();

  // Local State
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isPriority, setIsPriority] = useState(false);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("");
  const [reflectionContent, setReflectionContent] = useState(reflection?.content || "");

  // Sync reflection content when data loads
  useMemo(() => {
    if (reflection) setReflectionContent(reflection.content);
    else setReflectionContent("");
  }, [reflection]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    createTask.mutate({ title: newTaskTitle, date: dateStr, isPriority, completed: false }, {
      onSuccess: () => {
        setNewTaskTitle("");
        setIsPriority(false);
      }
    });
  };

  const handleCreateStudySession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !topic.trim() || !duration) return;
    createStudySession.mutate({ 
      subject, topic, durationMinutes: parseInt(duration), date: dateStr 
    }, {
      onSuccess: () => {
        setSubject("");
        setTopic("");
        setDuration("");
      }
    });
  };

  const saveReflection = () => {
    upsertReflection.mutate({ date: dateStr, content: reflectionContent }, {
      onSuccess: () => toast({ title: "Reflection saved", description: "Your daily thoughts have been recorded." })
    });
  };

  const totalStudyMinutes = studySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const hours = Math.floor(totalStudyMinutes / 60);
  const minutes = totalStudyMinutes % 60;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full pb-24">
      <PageHeader 
        title="Daily Focus" 
        description="Win the day. One task at a time."
        date={currentDate}
        onPrevDate={() => setCurrentDate(prev => subDays(prev, 1))}
        onNextDate={() => setCurrentDate(prev => addDays(prev, 1))}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Actionables */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* TASKS */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-semibold flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-primary" /> Tasks
              </h2>
            </div>
            
            <Card className="premium-card p-1">
              <div className="p-4 border-b border-border/50 bg-secondary/20 rounded-t-xl">
                <form onSubmit={handleCreateTask} className="flex items-center gap-2">
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    className={`shrink-0 ${isPriority ? 'text-amber-500 hover:text-amber-600' : 'text-muted-foreground'}`}
                    onClick={() => setIsPriority(!isPriority)}
                    title="Mark as Priority"
                  >
                    <Star className="w-4 h-4" fill={isPriority ? "currentColor" : "none"} />
                  </Button>
                  <Input 
                    placeholder="Add a new task..." 
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="border-none shadow-none focus-visible:ring-0 bg-transparent px-0"
                  />
                  <Button type="submit" size="sm" disabled={!newTaskTitle.trim() || createTask.isPending} className="rounded-lg shadow-sm">
                    {createTask.isPending ? "..." : "Add"}
                  </Button>
                </form>
              </div>
              
              <div className="p-2 space-y-1">
                <AnimatePresence>
                  {tasks.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 text-center text-muted-foreground text-sm">
                      No tasks for this day. Enjoy your free time!
                    </motion.div>
                  )}
                  {tasks.sort((a, b) => (b.isPriority ? 1 : 0) - (a.isPriority ? 1 : 0)).map(task => (
                    <motion.div 
                      key={task.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`group flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-colors ${task.completed ? 'opacity-60' : ''}`}
                    >
                      <Checkbox 
                        checked={task.completed} 
                        onCheckedChange={(c) => updateTask.mutate({ id: task.id, completed: !!c })}
                        className="rounded-md w-5 h-5"
                      />
                      <span className={`flex-1 text-sm font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {task.title}
                      </span>
                      {task.isPriority && <Star className="w-4 h-4 text-amber-500" fill="currentColor" />}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover:opacity-100 h-8 w-8 text-muted-foreground hover:text-destructive transition-opacity"
                        onClick={() => deleteTask.mutate(task.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Card>
          </section>

          {/* HABITS */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-semibold flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-500" /> Daily Habits
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {habits.length === 0 ? (
                <div className="col-span-full p-4 bg-card rounded-xl border border-dashed text-center text-sm text-muted-foreground">
                  No habits defined. Go to Configuration to add some.
                </div>
              ) : (
                habits.map(habit => {
                  const log = habitLogs.find(l => l.habitId === habit.id);
                  const isCompleted = log?.completed ?? false;
                  
                  return (
                    <button
                      key={habit.id}
                      onClick={() => upsertHabitLog.mutate({ habitId: habit.id, date: dateStr, completed: !isCompleted })}
                      className={`relative overflow-hidden p-4 rounded-xl border transition-all duration-300 text-left flex flex-col gap-2 ${
                        isCompleted 
                          ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]' 
                          : 'bg-card border-border hover:border-primary/40 hover:shadow-sm'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                        isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-border/80 bg-background'
                      }`}>
                        {isCompleted && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className={`text-sm font-medium ${isCompleted ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground'}`}>
                        {habit.name}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </section>

        </div>

        {/* Right Column: Tracking & Reflection */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* STUDY LOG */}
          <section>
             <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-semibold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500" /> Study Log
              </h2>
              <div className="text-sm font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full">
                {hours}h {minutes}m total
              </div>
            </div>
            
            <Card className="premium-card overflow-hidden">
              <div className="p-4 bg-muted/30 border-b border-border/50">
                <form onSubmit={handleCreateStudySession} className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input 
                      placeholder="Subject" 
                      value={subject} onChange={e => setSubject(e.target.value)}
                      className="bg-background"
                    />
                    <div className="relative">
                      <Clock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                      <Input 
                        type="number" 
                        placeholder="Minutes" 
                        value={duration} onChange={e => setDuration(e.target.value)}
                        className="bg-background pl-9"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Input 
                      placeholder="Topic covered" 
                      value={topic} onChange={e => setTopic(e.target.value)}
                      className="bg-background flex-1"
                    />
                    <Button type="submit" size="icon" disabled={createStudySession.isPending || !subject || !topic || !duration} className="shrink-0 rounded-xl">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </div>
              
              <div className="p-0">
                <AnimatePresence>
                  {studySessions.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 text-center text-muted-foreground text-sm">
                      No study sessions logged today.
                    </motion.div>
                  )}
                  {studySessions.map(session => (
                    <motion.div 
                      key={session.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group flex items-center justify-between p-4 border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-sm text-foreground">{session.subject}</p>
                        <p className="text-xs text-muted-foreground">{session.topic}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium bg-secondary px-2 py-1 rounded-md text-secondary-foreground">{session.durationMinutes}m</span>
                        <Button 
                          variant="ghost" size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteStudySession.mutate(session.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Card>
          </section>

          {/* REFLECTION */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-semibold">End of Day Reflection</h2>
            </div>
            <Card className="premium-card p-1">
              <Textarea 
                placeholder="What went well today? What could be better tomorrow?"
                className="min-h-[150px] border-none shadow-none focus-visible:ring-0 resize-none rounded-t-xl"
                value={reflectionContent}
                onChange={e => setReflectionContent(e.target.value)}
              />
              <div className="p-2 flex justify-end border-t border-border/50 bg-secondary/20 rounded-b-xl">
                <Button 
                  size="sm" 
                  onClick={saveReflection} 
                  disabled={upsertReflection.isPending || reflectionContent === reflection?.content}
                  className="rounded-lg shadow-sm"
                >
                  {upsertReflection.isPending ? "Saving..." : "Save Reflection"}
                </Button>
              </div>
            </Card>
          </section>

        </div>
      </div>
    </div>
  );
}

// Ensure icons are correctly imported. I used CheckSquare in DailyPage but imported Check. Fixing inside the component.
import { CheckSquare as LucideCheckSquare } from "lucide-react";
const CheckSquare = LucideCheckSquare;
