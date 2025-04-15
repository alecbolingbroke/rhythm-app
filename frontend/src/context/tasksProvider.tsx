// context/TasksContext.tsx
import { createContext, useContext } from "react";
import { useTasks } from "@/hooks/useTasks";

type TasksContextType = ReturnType<typeof useTasks>;

const TasksContext = createContext<TasksContextType | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const tasksContext = useTasks();
  return (
    <TasksContext.Provider value={tasksContext}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasksContext() {
  const context = useContext(TasksContext);
  if (!context) throw new Error("useTasksContext must be used within TasksProvider");
  return context;
}
