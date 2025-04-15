import { isSameDayUTC } from "@/lib/functions/date/date";
import { format } from "date-fns";
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
};

export default function DayView({ date, tasks }: Props) {
  const tasksForDay = tasks.filter(
    (task) =>
      task.due_date !== undefined && isSameDayUTC(date, task.due_date)
  );

  return (
    <TooltipProvider>
      <div className="space-y-3">
        {tasksForDay.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tasks for today.</p>
        ) : (
          tasksForDay.map((task) => (
            <Tooltip key={task.id}>
              <TooltipTrigger asChild>
                <div className="p-4 sm:p-3 border rounded bg-stone-100 dark:bg-stone-800 cursor-default">
                  <p className="text-base sm:text-sm font-medium">{task.title}</p>
                  <p className="text-sm sm:text-xs text-muted-foreground">
                    Due at {format(new Date(task.due_date!), "hh:mm a")}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[260px] sm:max-w-[250px] text-left">
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
          ))
        )}
      </div>
    </TooltipProvider>
  );
}
