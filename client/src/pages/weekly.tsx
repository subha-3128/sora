import { useState, useEffect } from "react";
import { format, startOfWeek, addWeeks, subWeeks } from "date-fns";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useWeeklyReview, useUpsertWeeklyReview } from "@/hooks";

export default function WeeklyPage() {
  const [currentDate, setCurrentDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const dateStr = format(currentDate, "yyyy-MM-dd");
  const { toast } = useToast();

  const { data: review, isLoading } = useWeeklyReview(dateStr);
  const upsertReview = useUpsertWeeklyReview();

  const [formData, setFormData] = useState({
    totalStudyHours: "",
    topicsCompleted: "",
    weakSubjects: "",
    wins: "",
    improvements: "",
    nextWeekPlan: ""
  });

  useEffect(() => {
    if (review) {
      setFormData({
        totalStudyHours: review.totalStudyHours.toString(),
        topicsCompleted: review.topicsCompleted,
        weakSubjects: review.weakSubjects,
        wins: review.wins,
        improvements: review.improvements,
        nextWeekPlan: review.nextWeekPlan
      });
    } else {
      setFormData({
        totalStudyHours: "", topicsCompleted: "", weakSubjects: "", wins: "", improvements: "", nextWeekPlan: ""
      });
    }
  }, [review, dateStr]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertReview.mutate({
      weekStartDate: dateStr,
      totalStudyHours: parseInt(formData.totalStudyHours) || 0,
      topicsCompleted: formData.topicsCompleted,
      weakSubjects: formData.weakSubjects,
      wins: formData.wins,
      improvements: formData.improvements,
      nextWeekPlan: formData.nextWeekPlan
    }, {
      onSuccess: () => toast({ title: "Weekly review saved!" })
    });
  };

  const handlePrev = () => setCurrentDate(prev => subWeeks(prev, 1));
  const handleNext = () => setCurrentDate(prev => addWeeks(prev, 1));
  
  const weekLabel = `Week of ${format(currentDate, "MMM d")}`;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto w-full pb-24">
      <PageHeader 
        title="Weekly Review" 
        description="Reflect on the past 7 days and plan ahead."
        date={currentDate}
        dateLabel={weekLabel}
        onPrevDate={handlePrev}
        onNextDate={handleNext}
      />

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-muted rounded-xl"></div>
          <div className="h-40 bg-muted rounded-xl"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
          <Card className="premium-card">
            <CardContent className="p-5 md:p-6 space-y-6">
              
              <div className="space-y-2">
                <Label htmlFor="totalHours" className="text-base">Total Study Hours</Label>
                <Input 
                  id="totalHours" type="number" 
                  placeholder="e.g. 24"
                  value={formData.totalStudyHours}
                  onChange={e => setFormData({...formData, totalStudyHours: e.target.value})}
                  className="max-w-[200px]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="topics">Topics Completed</Label>
                  <Textarea 
                    id="topics" 
                    placeholder="List the main topics you finished..."
                    className="min-h-[100px]"
                    value={formData.topicsCompleted}
                    onChange={e => setFormData({...formData, topicsCompleted: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weak">Areas to Improve (Weak Subjects)</Label>
                  <Textarea 
                    id="weak" 
                    placeholder="Where did you struggle?"
                    className="min-h-[100px]"
                    value={formData.weakSubjects}
                    onChange={e => setFormData({...formData, weakSubjects: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                <div className="space-y-2">
                  <Label htmlFor="wins" className="text-emerald-600 dark:text-emerald-400">Top 3 Wins</Label>
                  <Textarea 
                    id="wins" 
                    placeholder="1. \n2. \n3."
                    className="min-h-[120px]"
                    value={formData.wins}
                    onChange={e => setFormData({...formData, wins: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="improvements" className="text-amber-600 dark:text-amber-400">3 Things to Improve</Label>
                  <Textarea 
                    id="improvements" 
                    placeholder="1. \n2. \n3."
                    className="min-h-[120px]"
                    value={formData.improvements}
                    onChange={e => setFormData({...formData, improvements: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border/50 space-y-2">
                <Label htmlFor="plan" className="text-primary text-lg font-display">Plan for Next Week</Label>
                <Textarea 
                  id="plan" 
                  placeholder="Set your main intentions and focus areas..."
                  className="min-h-[150px] text-base"
                  value={formData.nextWeekPlan}
                  onChange={e => setFormData({...formData, nextWeekPlan: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button size="lg" type="submit" disabled={upsertReview.isPending} className="w-full sm:w-auto px-8 shadow-lg shadow-primary/20">
              {upsertReview.isPending ? "Saving..." : "Save Weekly Review"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
