import { useState, useEffect } from "react";
import { format, startOfMonth, addMonths, subMonths } from "date-fns";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMonthlyReview, useUpsertMonthlyReview } from "@/hooks";

export default function MonthlyPage() {
  const [currentDate, setCurrentDate] = useState(startOfMonth(new Date()));
  const monthStr = format(currentDate, "yyyy-MM");
  const { toast } = useToast();

  const { data: review, isLoading } = useMonthlyReview(monthStr);
  const upsertReview = useUpsertMonthlyReview();

  const [formData, setFormData] = useState({
    totalStudyHours: "",
    subjectSummary: "",
    habitConsistency: "",
    insight: "",
    nextMonthFocus: ""
  });

  useEffect(() => {
    if (review) {
      setFormData({
        totalStudyHours: review.totalStudyHours.toString(),
        subjectSummary: review.subjectSummary,
        habitConsistency: review.habitConsistency.toString(),
        insight: review.insight,
        nextMonthFocus: review.nextMonthFocus
      });
    } else {
      setFormData({
        totalStudyHours: "", subjectSummary: "", habitConsistency: "", insight: "", nextMonthFocus: ""
      });
    }
  }, [review, monthStr]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertReview.mutate({
      month: monthStr,
      totalStudyHours: parseInt(formData.totalStudyHours) || 0,
      subjectSummary: formData.subjectSummary,
      habitConsistency: parseInt(formData.habitConsistency) || 0,
      insight: formData.insight,
      nextMonthFocus: formData.nextMonthFocus
    }, {
      onSuccess: () => toast({ title: "Monthly review saved!" })
    });
  };

  const handlePrev = () => setCurrentDate(prev => subMonths(prev, 1));
  const handleNext = () => setCurrentDate(prev => addMonths(prev, 1));
  
  const monthLabel = format(currentDate, "MMMM yyyy");

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto w-full pb-24">
      <PageHeader 
        title="Monthly Overview" 
        description="Zoom out. Look at the big picture of your progress."
        date={currentDate}
        dateLabel={monthLabel}
        onPrevDate={handlePrev}
        onNextDate={handleNext}
      />

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-muted rounded-xl"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
          <Card className="premium-card">
            <CardContent className="p-5 md:p-6 space-y-7 md:space-y-8">
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="totalHours" className="text-base">Total Study Hours</Label>
                  <div className="relative">
                    <Input 
                      id="totalHours" type="number" 
                      placeholder="e.g. 120"
                      value={formData.totalStudyHours}
                      onChange={e => setFormData({...formData, totalStudyHours: e.target.value})}
                      className="text-2xl h-14 pl-4"
                    />
                    <span className="absolute right-4 top-4 text-muted-foreground font-medium">hrs</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consistency" className="text-base">Habit Consistency</Label>
                  <div className="relative">
                    <Input 
                      id="consistency" type="number" max="100" min="0"
                      placeholder="e.g. 85"
                      value={formData.habitConsistency}
                      onChange={e => setFormData({...formData, habitConsistency: e.target.value})}
                      className="text-2xl h-14 pl-4"
                    />
                    <span className="absolute right-4 top-4 text-muted-foreground font-medium">%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Subject Progress Summary</Label>
                <Textarea 
                  id="summary" 
                  placeholder="Summarize your progress across all subjects..."
                  className="min-h-[120px]"
                  value={formData.subjectSummary}
                  onChange={e => setFormData({...formData, subjectSummary: e.target.value})}
                />
              </div>

              <div className="space-y-2 pt-4 border-t border-border/50">
                <Label htmlFor="insight" className="text-primary text-lg">Biggest Insight / Lesson Learned</Label>
                <Textarea 
                  id="insight" 
                  placeholder="What was your profound realization this month?"
                  className="min-h-[100px] text-base bg-primary/5 border-primary/20"
                  value={formData.insight}
                  onChange={e => setFormData({...formData, insight: e.target.value})}
                />
              </div>

              <div className="space-y-2 pt-4 border-t border-border/50">
                <Label htmlFor="focus" className="text-lg">Next Month's Core Focus</Label>
                <Textarea 
                  id="focus" 
                  placeholder="What is the ONE thing you need to nail next month?"
                  className="min-h-[100px] text-base"
                  value={formData.nextMonthFocus}
                  onChange={e => setFormData({...formData, nextMonthFocus: e.target.value})}
                />
              </div>

            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button size="lg" type="submit" disabled={upsertReview.isPending} className="w-full sm:w-auto px-8 shadow-lg shadow-primary/20">
              {upsertReview.isPending ? "Saving..." : "Lock in Monthly Review"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
