import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    parseISO,
    format,
    isToday,
  } from "date-fns";
  import { cn } from "@/lib/utils";
  import type { Task } from "@/hooks/useTasks";
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
  
  type Props = {
    date: Date;
    tasks: Task[];
    onDayClick: (date: Date) => void;
  };
  
  export default function MonthView({ date, tasks, onDayClick }: Props) {
    const start = startOfWeek(startOfMonth(date), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(date), { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start, end });
  
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
    return (
      <div className="space-y-2 overflow-x-auto">
        {/* Days of the week header */}
        <div className="hidden sm:grid grid-cols-7 text-xs text-muted-foreground font-medium px-1">
          {weekdays.map((day) => (
            <div key={day} className="text-center">
              {day}
            </div>
          ))}
        </div>
  
        <TooltipProvider>
          <div className="grid grid-cols-7 min-w-[640px] sm:min-w-0 gap-px border rounded overflow-hidden bg-border">
            {days.map((day) => {
              const tasksForDay = tasks.filter(
                (task) =>
                  task.due_date !== undefined &&
                  isSameDay(day, parseISO(task.due_date))
              );
  
              return (
                <div
                  key={day.toISOString()}
                  onClick={() => onDayClick(day)}
                  className={cn(
                    "relative p-2 sm:p-2 min-h-[72px] sm:min-h-[72px] cursor-pointer transition-colors bg-background hover:bg-muted text-left",
                    isToday(day) &&
                      "bg-stone-100 dark:bg-stone-800 shadow-[inset_0_0_0_2px_theme('colors.primary.DEFAULT')] rounded",
                    !isSameMonth(day, date) && "bg-stone-100 dark:bg-stone-900"
                  )}
                >
                  <p className="text-sm sm:text-xs font-medium">
                    {format(day, "d")}
                  </p>
  
                  {tasksForDay.map((task) => (
                    <Tooltip key={task.id}>
                      <TooltipTrigger asChild>
                        <div className="text-[11px] sm:text-[10px] text-muted-foreground truncate cursor-default">
                          • {task.title}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[250px] text-left">
                        <p className="font-medium">{task.title}</p>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.description}
                          </p>
                        )}
                        {task.due_date && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Due: {format(new Date(task.due_date), "PPPp")}
                          </p>
                        )}
                        <p className="text-xs mt-1">
                          {task.is_complete ? "✅ Complete" : "❌ Incomplete"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              );
            })}
          </div>
        </TooltipProvider>
      </div>
    );
  }
  