import { motion } from "framer-motion";
import TaskCalendar from "@/components/tasks/TaskCalendar";
import { useTasksContext } from "@/context/tasksProvider";

export default function CalendarPage() {
  const { tasks } = useTasksContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
    >
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Calendar</h1>
      <TaskCalendar tasks={tasks} />
    </motion.div>
  );
}
