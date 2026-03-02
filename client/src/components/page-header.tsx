import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description?: string;
  date?: Date;
  onPrevDate?: () => void;
  onNextDate?: () => void;
  dateLabel?: string;
}

export function PageHeader({ title, description, date, onPrevDate, onNextDate, dateLabel }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-8 border-b border-border/50">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">{title}</h1>
        {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
      </div>
      
      {date && onPrevDate && onNextDate && (
        <div className="flex items-center gap-3 bg-card px-2 py-1.5 rounded-xl border border-border shadow-sm">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50" onClick={onPrevDate}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 min-w-[140px] justify-center px-2">
            <CalendarIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium whitespace-nowrap">
              {dateLabel || format(date, "MMM d, yyyy")}
            </span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50" onClick={onNextDate}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
