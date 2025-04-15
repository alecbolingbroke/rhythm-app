import { useState, useEffect, useRef } from "react";
import TaskList from "@/components/tasks/TaskList";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/useUser";
import { TaskTracker } from "@/components/tasks/TaskTracker";
import { useTasksContext } from "@/context/tasksProvider";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TasksPage() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [filter, setFilter] = useState<"pending" | "completed" | "all">(
    "pending"
  );
  const { fullName } = useUser();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const [showHello, setShowHello] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");

    if (!hasSeenWelcome) {
      setShowWelcome(true);
      const welcomeTimer = setTimeout(() => {
        setShowWelcome(false);
        setShowHello(true);
        localStorage.setItem("hasSeenWelcome", "true");

        const helloTimer = setTimeout(() => setShowHello(false), 2000); // show hello briefly
        return () => clearTimeout(helloTimer);
      }, 1500);

      return () => clearTimeout(welcomeTimer);
    } else {
      setShowHello(true);
      const helloTimer = setTimeout(() => setShowHello(false), 2000);
      return () => clearTimeout(helloTimer);
    }
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  return (
    <div className="w-full px-4 py-8 lg:px-6 lg:py-10">
      <AnimatePresence mode="wait">
        {showWelcome ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-2xl font-bold">Welcome to Rhythm 🏃‍♂️</h1>
            <p className="text-muted-foreground">
              You’re logged in and ready to get on pace.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="tasks"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:flex-row lg:items-start lg:gap-8 max-w-6xl mx-auto"
          >
            <div className="flex-1 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <AnimatePresence mode="wait">
                  {showHello ? (
                    <motion.h1
                      key="hello"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                      className="text-2xl font-bold"
                    >
                      Hey {fullName ?? "friend"}! 👋
                    </motion.h1>
                  ) : (
                    <motion.h1
                      key="tasks"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                      className="text-2xl font-bold"
                    >
                      Your Tasks
                    </motion.h1>
                  )}
                </AnimatePresence>

                <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end sm:flex-wrap">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSearchOpen((prev) => !prev)}
                      className="shrink-0"
                      aria-label="Toggle search"
                    >
                      <Search className="h-4 w-4" />
                    </Button>

                    <AnimatePresence initial={false}>
                      {searchOpen && (
                        <motion.div
                          key="search"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <Input
                            ref={searchRef}
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:w-[200px]"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Select
                    onValueChange={(value) => setFilter(value as typeof filter)}
                    value={filter}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
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

              <TaskList filter={filter} searchQuery={searchQuery} />
            </div>

            {/* Tracker only on desktop */}
            <div className="hidden lg:block mt-10 lg:mt-0">
              <TaskTracker tasks={useTasksContext().tasks} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
