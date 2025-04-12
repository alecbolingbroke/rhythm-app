import { useState, useEffect } from "react";
import TaskList from "@/components/tasks/TaskList";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function Dashboard() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [filter, setFilter] = useState<"pending" | "completed" | "all">(
    "pending"
  );

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setShowWelcome(true);
      const timer = setTimeout(() => {
        setShowWelcome(false);
        localStorage.setItem("hasSeenWelcome", "true");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="w-full max-w-2xl py-8 px-4 space-y-6">
      <AnimatePresence mode="wait">
        {showWelcome ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-2xl font-bold">Welcome to Rhythm 🥁</h1>
            <p className="text-muted-foreground">
              You’re logged in and ready to build.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="tasks"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Your Tasks</h1>
              <div className="flex gap-2">
                <Select
                  onValueChange={(value) => setFilter(value as typeof filter)}
                  value={filter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter tasks" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <TaskList filter={filter} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
