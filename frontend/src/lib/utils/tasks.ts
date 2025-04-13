  import { Task } from "@/hooks/useTasks";
  import {
    isToday,
    isTomorrow,
    addDays,
    isWithinInterval,
    startOfDay,
  } from "date-fns";
  
  // Group tasks by due date categories
  export const categorizeTasksByDueDate = (tasks: Task[]) => {
    const today = startOfDay(new Date());
    const tomorrow = startOfDay(addDays(today, 1));
    const nextWeekEnd = startOfDay(addDays(today, 7));

    const overdue: Task[] = [];
    const dueToday: Task[] = [];
    const dueTomorrow: Task[] = [];
    const dueThisWeek: Task[] = [];
    const later: Task[] = [];
    const noDueDate: Task[] = [];

    tasks.forEach((task) => {
      if (!task.due_date) {
        noDueDate.push(task);
        return;
      }

      const dueDate = new Date(task.due_date);

      // Check if the task is overdue (due date is before today)
      if (dueDate < today) {
        overdue.push(task);
      }
      // Check if the task is due today
      else if (isToday(dueDate)) {
        dueToday.push(task);
      }
      // Check if the task is due tomorrow
      else if (isTomorrow(dueDate)) {
        dueTomorrow.push(task);
      }
      // Check if the task is due within the next week
      else if (
        isWithinInterval(dueDate, { start: tomorrow, end: nextWeekEnd })
      ) {
        dueThisWeek.push(task);
      }
      // Task is due later
      else {
        later.push(task);
      }
    });

    return {
      overdue,
      dueToday,
      dueTomorrow,
      dueThisWeek,
      later,
      noDueDate,
    };
  };