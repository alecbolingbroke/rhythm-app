import { addDays, startOfWeek, format, isSameDay, parseISO } from "date-fns";
import type { Task } from "@/hooks/useTasks";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { isToday } from "date-fns";

type Props = {
  date: Date;
  tasks: Task[];
  onDayClick: (date: Date) => void;
};

export default function WeekView({ date, tasks, onDayClick }: Props) {
  const start = startOfWeek(date, { weekStartsOn: 0 });

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 sm:grid-cols-7 sm:gap-2 gap-4 overflow-x-auto sm:overflow-visible whitespace-nowrap sm:whitespace-normal">
        {Array.from({ length: 7 }).map((_, i) => {
          const day = addDays(start, i);

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
                "min-w-[280px] sm:min-w-0 p-4 sm:p-2 min-h-[200px] flex flex-col cursor-pointer transition-colors bg-stone-50 dark:bg-stone-900 hover:bg-muted rounded",
                isToday(day) &&
                  "shadow-[inset_0_0_0_2px_theme('colors.primary.DEFAULT')] bg-stone-100 dark:bg-stone-800"
              )}
            >
              <p className="text-base sm:text-sm font-semibold">
                {format(day, "EEE dd")}
              </p>
              <div className="mt-2 space-y-1">
                {tasksForDay.map((task) => (
                  <Tooltip key={task.id}>
                    <TooltipTrigger asChild>
                      <div className="text-sm sm:text-xs text-muted-foreground truncate cursor-default">
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
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
