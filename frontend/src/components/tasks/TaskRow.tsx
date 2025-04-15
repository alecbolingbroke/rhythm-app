import { DueBadge } from "../ui/due-badge";
import { Task } from "@/hooks/useTasks";
import { Clock, CalendarClock } from "lucide-react";
import {
  isToday,
  isTomorrow,
  addDays,
  isWithinInterval,
  startOfDay,
} from "date-fns";
import TaskItem from "./TaskItem";
import { motion } from "framer-motion";

type TaskRowProps = {
  task: Task;
  updateTask: (
    id: string,
    updates: any
  ) => Promise<{ data?: any; error?: any }>;
  handleDelete: (id: string) => Promise<void>;
  showTopBorder?: boolean;
};

export default function TaskRow({
  task,
  updateTask,
  handleDelete,
  showTopBorder,
}: TaskRowProps) {
  const today = startOfDay(new Date());
  const tomorrow = startOfDay(addDays(today, 1));
  const nextWeekEnd = startOfDay(addDays(today, 7));

  const getTaskCategory = () => {
    if (!task.due_date) return "noDueDate";

    const dueDate = new Date(task.due_date);

    if (dueDate < today) return "overdue";
    if (isToday(dueDate)) return "today";
    if (isTomorrow(dueDate)) return "tomorrow";
    if (isWithinInterval(dueDate, { start: tomorrow, end: nextWeekEnd }))
      return "thisWeek";
    return "later";
  };

  const taskCategory = getTaskCategory();
  const isLaterTask = taskCategory === "later";
  const isThisWeekTask = taskCategory === "thisWeek";
  const isTodayTask = taskCategory === "today";
  const isTomorrowTask = taskCategory === "tomorrow";
  const isOverdueTask = taskCategory === "overdue";

  // Format time for display
  function formatTimeForDisplay(isoString: string): string {
    const localDate = new Date(isoString);

    // Format time as locale string with hours and minutes only
    return localDate.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  function formatDateTimeForDisplay(isoString: string): string {
    const localDate = new Date(isoString);

    // Format date and time as locale string
    return localDate.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="relative group"
      // Disable layout animations for existing tasks
      layout={false}
    >
      <div>
        <div className="hidden sm:block">
        {isTodayTask && task.due_date && (
          <DueBadge icon={Clock} text={`Today at ${formatTimeForDisplay(task.due_date)}`}/>
        )}

        {isTomorrowTask && task.due_date && (
          <DueBadge icon={Clock} text={`Tomorrow at ${formatTimeForDisplay(task.due_date)}`} />
        )}

        {isThisWeekTask && task.due_date && (
          <DueBadge
            icon={CalendarClock}
            text={formatDateTimeForDisplay(task.due_date)}
          />
        )}

        {isLaterTask && task.due_date && (
          <DueBadge
            icon={CalendarClock}
            text={formatDateTimeForDisplay(task.due_date)}
          />
        )}

        {isOverdueTask && task.due_date && (
          <DueBadge
            icon={Clock}
            text={formatDateTimeForDisplay(task.due_date)}
          />
        )}
        </div>

        <TaskItem
          id={task.id}
          initialTitle={task.title}
          initialDescription={task.description}
          initialDueDate={task.due_date}
          isComplete={task.is_complete}
          onSave={({ title, description, due_date, is_complete }) =>
            updateTask(task.id, { title, description, due_date, is_complete })
          }
          onDelete={() => handleDelete(task.id)}
          isNew={false}
          showTopBorder={showTopBorder}
        />
      </div>
    </motion.div>
  );
}