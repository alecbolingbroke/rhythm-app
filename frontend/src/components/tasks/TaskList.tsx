import TaskItem from "@/components/tasks/TaskItem";
import { Task, useTasks } from "@/hooks/useTasks";
import { toast } from "sonner";
import supabase from "@/lib/supabaseClient";
import { CalendarClock, ChevronDown, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  format,
  isToday,
  isTomorrow,
  addDays,
  isWithinInterval,
  startOfDay,
} from "date-fns";
import TaskRow from "@/components/tasks/TaskRow";
import { sortByDueDateAsc } from "@/lib/functions/sort/sortByDueDateAsc";

const headerColorClasses = {
  overdue: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50",
  today: "bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-50",
  tomorrow:
    "bg-zinc-100/60 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100",
  thisWeek:
    "bg-zinc-100/40 dark:bg-zinc-800/40 text-zinc-900 dark:text-zinc-200",
  later: "bg-zinc-100/20 dark:bg-zinc-800/20 text-zinc-900 dark:text-zinc-300",
  noDueDate:
    "bg-zinc-100/10 dark:bg-zinc-800/10 text-zinc-900 dark:text-zinc-400",
};

export default function TaskList({
  filter,
}: {
  filter: "pending" | "completed" | "all";
}) {
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks();
  // const inputRef = useRef<HTMLInputElement | null>(null);
  const [newTaskText, setNewTaskText] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  // State to track which sections are expanded
  const [expandedSections, setExpandedSections] = useState<{
    overdue: boolean;
    dueToday: boolean;
    dueTomorrow: boolean;
    dueThisWeek: boolean;
    later: boolean;
    noDueDate: boolean;
  }>({
    overdue: true,
    dueToday: true,
    dueTomorrow: true,
    dueThisWeek: true,
    later: true,
    noDueDate: true,
  });

  // Check if all sections are expanded
  const allExpanded = Object.values(expandedSections).every(
    (value) => value === true
  );

  // First filter tasks based on completion status
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "pending") return !task.is_complete;
    if (filter === "completed") return task.is_complete;
  });

  // Group tasks by due date categories
  const categorizeTasksByDueDate = (tasks: Task[]) => {
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
      overdue: sortByDueDateAsc(overdue),
      dueToday: sortByDueDateAsc(dueToday),
      dueTomorrow: sortByDueDateAsc(dueTomorrow),
      dueThisWeek: sortByDueDateAsc(dueThisWeek),
      later: sortByDueDateAsc(later),
      noDueDate: noDueDate
    };
  };

  const categorizedTasks = categorizeTasksByDueDate(filteredTasks);

  // Function to toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Function to expand or collapse all sections
  const toggleAllSections = (expand: boolean) => {
    setExpandedSections({
      overdue: expand,
      dueToday: expand,
      dueTomorrow: expand,
      dueThisWeek: expand,
      later: expand,
      noDueDate: expand,
    });
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteTask(id);

    if (error) {
      toast.error("Delete failed", {
        description: (error as Error).message || "Unknown error",
      });
    } else {
      toast.success("Task deleted");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <TaskItem
            key="new"
            title={newTaskText}
            setTitle={setNewTaskText}
            isComplete={false}
            description={description}
            dueDate={dueDate}
            setDescription={setDescription}
            setDueDate={setDueDate}
            isNew={true}
            onSave={async ({ title }) => {
              if (!title.trim()) return;

              const {
                data: { user },
                error: userError,
              } = await supabase.auth.getUser();

              if (userError || !user) {
                toast.error("Not logged in");
                return;
              }

              const { error } = await createTask({
                title,
                description,
                due_date: dueDate,
                is_complete: false,
                user_id: user.id,
              });

              if (error) {
                toast.error("Task creation failed", {
                  description: (error as Error).message || "Unknown error",
                });
              } else {
                setNewTaskText("");
                setDescription("");
                setDueDate("");
              }
            }}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading tasks...</p>
      ) : filteredTasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">No tasks to show.</p>
      ) : (
        <div className="space-y-6">
          {/* Expand/Collapse All Toggle */}
          {filteredTasks.length > 0 && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-muted-foreground">
                {filteredTasks.length}{" "}
                {filteredTasks.length === 1 ? "task" : "tasks"}{" "}
                {filter !== "all" ? `(${filter})` : ""}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleAllSections(!allExpanded)}
                className="text-xs px-3 flex items-center gap-1 transition-colors"
              >
                {allExpanded ? (
                  <>
                    <ChevronRight className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Collapse
                    </span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Expand All
                    </span>
                  </>
                )}
              </Button>
            </div>
          )}
          {/* Overdue Tasks */}
          {categorizedTasks.overdue.length > 0 && (
            <div className="space-y-1">
              <motion.div
                className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer ${headerColorClasses.overdue}`}
                onClick={() => toggleSection("overdue")}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.1 }}
              >
                {expandedSections.overdue ? (
                  <ChevronDown className="h-4 w-4 text-zinc-900 dark:text-zinc-50 transition-transform" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-zinc-900 dark:text-zinc-50 transition-transform" />
                )}
                <CalendarClock className="h-4 w-4 text-zinc-900 dark:text-zinc-50" />
                <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  Overdue
                </h3>
                <span className="text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 px-1.5 py-0.5 rounded-full">
                  {categorizedTasks.overdue.length}
                </span>
              </motion.div>
              <AnimatePresence>
                {expandedSections.overdue && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, overflow: "hidden" }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                      overflow: "visible",
                    }}
                    exit={{ height: 0, opacity: 0, overflow: "hidden" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    layout={false}
                  >
                    {categorizedTasks.overdue.map((task, index) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        updateTask={updateTask}
                        handleDelete={handleDelete}
                        showTopBorder={
                          categorizedTasks.later.length > 2 && index > 0
                        }
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Due Today Tasks */}
          {categorizedTasks.dueToday.length > 0 && (
            <div className="space-y-1">
              <motion.div
                className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer ${headerColorClasses.today}`}
                onClick={() => toggleSection("dueToday")}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.1 }}
              >
                {expandedSections.dueToday ? (
                  <ChevronDown className="h-4 w-4 text-zinc-900 dark:text-zinc-100 transition-transform" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-zinc-900 dark:text-zinc-100 transition-transform" />
                )}
                <CalendarClock className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  Today
                </h3>
                <span className="text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 px-1.5 py-0.5 rounded-full">
                  {categorizedTasks.dueToday.length}
                </span>
              </motion.div>
              <AnimatePresence>
                {expandedSections.dueToday && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, overflow: "hidden" }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                      overflow: "visible",
                    }}
                    exit={{ height: 0, opacity: 0, overflow: "hidden" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    layout={false}
                  >
                    {categorizedTasks.dueToday.map((task, index) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        updateTask={updateTask}
                        handleDelete={handleDelete}
                        showTopBorder={
                          categorizedTasks.later.length > 2 && index > 0
                        }
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Due Tomorrow Tasks */}
          {categorizedTasks.dueTomorrow.length > 0 && (
            <div className="space-y-1">
              <motion.div
                className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer ${headerColorClasses.tomorrow}`}
                onClick={() => toggleSection("dueTomorrow")}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.1 }}
              >
                {expandedSections.dueTomorrow ? (
                  <ChevronDown className="h-4 w-4 text-zinc-800 dark:text-zinc-200 transition-transform" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-zinc-800 dark:text-zinc-200 transition-transform" />
                )}
                <CalendarClock className="h-4 w-4 text-zinc-800 dark:text-zinc-200" />
                <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Tomorrow
                </h3>
                <span className="text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 px-1.5 py-0.5 rounded-full">
                  {categorizedTasks.dueTomorrow.length}
                </span>
              </motion.div>
              <AnimatePresence>
                {expandedSections.dueTomorrow && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, overflow: "hidden" }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                      overflow: "visible",
                    }}
                    exit={{ height: 0, opacity: 0, overflow: "hidden" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    layout={false}
                  >
                    {categorizedTasks.dueTomorrow.map((task, index) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        updateTask={updateTask}
                        handleDelete={handleDelete}
                        showTopBorder={
                          categorizedTasks.later.length > 2 && index > 0
                        }
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Due This Week Tasks */}
          {categorizedTasks.dueThisWeek.length > 0 && (
            <div className="space-y-1">
              <motion.div
                className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer ${headerColorClasses.thisWeek}`}
                onClick={() => toggleSection("dueThisWeek")}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.1 }}
              >
                {expandedSections.dueThisWeek ? (
                  <ChevronDown className="h-4 w-4 text-zinc-700 dark:text-zinc-300 transition-transform" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-zinc-700 dark:text-zinc-300 transition-transform" />
                )}
                <CalendarClock className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
                <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Next Week ({format(addDays(new Date(), 2), "MMM d")} -{" "}
                  {format(addDays(new Date(), 7), "MMM d")})
                </h3>
                <span className="text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-1.5 py-0.5 rounded-full">
                  {categorizedTasks.dueThisWeek.length}
                </span>
              </motion.div>
              <AnimatePresence>
                {expandedSections.dueThisWeek && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, overflow: "hidden" }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                      overflow: "visible",
                    }}
                    exit={{ height: 0, opacity: 0, overflow: "hidden" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    layout={false}
                  >
                    {categorizedTasks.dueThisWeek.map((task, index) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        updateTask={updateTask}
                        handleDelete={handleDelete}
                        showTopBorder={
                          categorizedTasks.later.length > 2 && index > 0
                        }
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Later Tasks */}
          {categorizedTasks.later.length > 0 && (
            <div className="space-y-1">
              <motion.div
                className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer ${headerColorClasses.later}`}
                onClick={() => toggleSection("later")}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.1 }}
              >
                {expandedSections.later ? (
                  <ChevronDown className="h-4 w-4 text-zinc-600 dark:text-zinc-400 transition-transform" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-zinc-600 dark:text-zinc-400 transition-transform" />
                )}
                <CalendarClock className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Later (After {format(addDays(new Date(), 7), "MMM d")})
                </h3>
                <span className="text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.5 rounded-full">
                  {categorizedTasks.later.length}
                </span>
              </motion.div>
              <AnimatePresence>
                {expandedSections.later && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, overflow: "hidden" }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                      overflow: "visible",
                    }}
                    exit={{ height: 0, opacity: 0, overflow: "hidden" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    layout={false}
                  >
                    {categorizedTasks.later.map((task, index) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        updateTask={updateTask}
                        handleDelete={handleDelete}
                        showTopBorder={
                          categorizedTasks.later.length > 2 && index > 0
                        }
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* No Due Date Tasks */}
          {categorizedTasks.noDueDate.length > 0 && (
            <div className="space-y-1">
              <motion.div
                className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer ${headerColorClasses.noDueDate}`}
                onClick={() => toggleSection("noDueDate")}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.1 }}
              >
                {expandedSections.noDueDate ? (
                  <ChevronDown className="h-4 w-4 text-zinc-500 dark:text-zinc-500 transition-transform" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-zinc-500 dark:text-zinc-500 transition-transform" />
                )}
                <Clock className="h-4 w-4 text-zinc-500 dark:text-zinc-500" />
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-500">
                  No Due Date
                </h3>
                <span className="text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-500 px-1.5 py-0.5 rounded-full">
                  {categorizedTasks.noDueDate.length}
                </span>
              </motion.div>
              <AnimatePresence>
                {expandedSections.noDueDate && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, overflow: "hidden" }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                      overflow: "visible",
                    }}
                    exit={{ height: 0, opacity: 0, overflow: "hidden" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    layout={false}
                  >
                    {categorizedTasks.noDueDate.map((task, index) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        updateTask={updateTask}
                        handleDelete={handleDelete}
                        showTopBorder={
                          categorizedTasks.later.length > 2 && index > 0
                        }
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Show a message if no tasks match the current filter */}
          {/* {Object.values(categorizedTasks).every(category => category.length === 0) && (
            <p className="text-sm text-muted-foreground">No tasks to show.</p>
          )} */}
        </div>
      )}
    </div>
  );
}
