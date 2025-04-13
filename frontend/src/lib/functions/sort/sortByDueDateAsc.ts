import { Task } from "@/hooks/useTasks";

export const sortByDueDateAsc = (tasks: Task[]) =>
  tasks.sort((a, b) => {
    const aTime = new Date(a.due_date || 0).getTime();
    const bTime = new Date(b.due_date || 0).getTime();
    return aTime - bTime;
  });
