import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState, KeyboardEvent, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DatePickerWithPresets } from "@/components/ui/date-picker-with-presets";
import { createUTCDateFromLocal } from "@/lib/functions/date/createUTCDateFromLocal";
import { fireConfetti } from "@/lib/functions/effects/fireConfetti";
import { toast } from "sonner";
import { useClickOutside } from "@/hooks/useClickOutside";
import { Period } from "@/components/ui/timepicker/time-picker-utils";
import { convertUTCToLocalDate } from "@/lib/functions/date/convertUTCToLocalDate";

type TaskItemProps = {
  id?: string;
  initialTitle?: string;
  initialDescription?: string;
  initialDueDate?: string;
  isComplete?: boolean;
  onSave: (task: {
    title: string;
    description?: string;
    due_date?: string;
    is_complete: boolean;
  }) => void;
  onDelete?: () => void;
  showTopBorder?: boolean;

  // Only used for the "new task" row
  title?: string;
  setTitle?: React.Dispatch<React.SetStateAction<string>>;
  description?: string;
  dueDate?: string;
  setDescription?: React.Dispatch<React.SetStateAction<string>>;
  setDueDate?: React.Dispatch<React.SetStateAction<string>>;
  isNew?: boolean;
};

export default function TaskItem({
  id: _id,
  initialTitle = "",
  initialDescription = "",
  initialDueDate = "",
  isComplete = false,
  onSave,
  onDelete,
  title,
  setTitle,
  description,
  dueDate,
  setDescription,
  setDueDate,
  isNew = false,
}: TaskItemProps) {
  // State to track if the task is being edited
  const [isEditing, setIsEditing] = useState(false);

  // Ref for click outside detection
  const taskRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useClickOutside(
    taskRef,
    () => {
      if (isDatePickerOpen) {
        setIsDatePickerOpen(false);
      } else if (isEditing && !isNew) {
        setIsEditing(false);
        setInternalTitle(initialTitle);
        setInternalDescription(initialDescription);
        setInternalDueDate(initialDueDate);
      }
    },
    []
  );

  const [internalTitle, setInternalTitle] = useState(initialTitle);
  const [complete, setComplete] = useState(isComplete);
  const [internalDescription, setInternalDescription] =
    useState(initialDescription);
  const [internalDueDate, setInternalDueDate] = useState(initialDueDate);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Update internal state when props change (for bulk actions)
  useEffect(() => {
    setComplete(isComplete);
  }, [isComplete]);

  const currentTitle = isNew ? title ?? "" : internalTitle;
  const setCurrentTitle = isNew ? setTitle ?? (() => {}) : setInternalTitle;
  const currentDescription = isNew ? description ?? "" : internalDescription;
  const setCurrentDescription = isNew
    ? setDescription ?? (() => {})
    : setInternalDescription;
  const currentDueDate = isNew ? dueDate ?? "" : internalDueDate;
  const setCurrentDueDate = isNew
    ? setDueDate ?? (() => {})
    : setInternalDueDate;
  // Function to get current time with seconds set to 0
  const getCurrentTimeString = () => {
    const now = new Date();
    now.setSeconds(0, 0); // Set seconds and milliseconds to 0
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const period = now.getHours() >= 12 ? "PM" : "AM";
    return `${hours}:${minutes} ${period}`;
  };

  // For existing tasks, get time from the due date or use current time
  const [internalTime, setInternalTime] = useState<string>(() => {
    if (initialDueDate) {
      const { localTime } = convertUTCToLocalDate(initialDueDate);
      return localTime;
    }
    return getCurrentTimeString();
  });

  // For new tasks, always use current time with seconds set to 0
  const [time, setTime] = useState<string>(getCurrentTimeString());
  const currentTime = isNew ? time : internalTime;
  const setCurrentTime = isNew ? setTime : setInternalTime;
  const [period, setPeriod] = useState<Period>(() => {
    if (initialDueDate) {
      const { period } = convertUTCToLocalDate(initialDueDate);
      return period;
    }
    return new Date().getHours() >= 12 ? "PM" : "AM";
  });

  useEffect(() => {
    if (currentDueDate) {
      const date = new Date(currentDueDate);
      setPeriod(date.getHours() >= 12 ? "PM" : "AM");
    }
  }, [currentDueDate]);

  // Calculate the full due date as ISO string, or empty string if not set
  // Backend will convert empty string to null
  const fullDueDate: string =
    currentDueDate && currentDueDate.trim() !== "" && currentTime
      ? createUTCDateFromLocal(currentDueDate, currentTime, period)
      : "";

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey && currentTitle.trim()) {
      if (!currentTitle.trim()) {
        toast.error("Task title is required");
        return;
      }
      e.preventDefault();
      onSave({
        title: currentTitle,
        description: currentDescription,
        due_date: fullDueDate,
        is_complete: complete,
      });
      if (isNew) {
        setCurrentTitle("");
        setCurrentDescription("");
        setCurrentDueDate("");
      } else if (isEditing) {
        setIsEditing(false);
      }
    } else if (e.key === "Escape" && isEditing) {
      // Cancel editing when pressing Escape
      e.preventDefault();
      setIsEditing(false);
      // Reset to initial values
      setInternalTitle(initialTitle);
      setInternalDescription(initialDescription);
      setInternalDueDate(initialDueDate);
    }
  };

  // For backward compatibility
  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e);

  // Animation variants for task completion
  // Check if dark mode is active
  const isDarkMode =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Animation variants for task completion
  const taskVariants = {
    incomplete: {
      backgroundColor: "transparent",
      borderLeft: "0px solid transparent",
      transition: { duration: 0.3 },
    },
    complete: {
      backgroundColor: isDarkMode
        ? "rgba(255, 255, 255, 0.03)"
        : "rgba(0, 0, 0, 0.03)",
      borderLeft: "0px solid transparent",
      transition: { duration: 0.3 },
    },
    hover: {
      backgroundColor: isDarkMode
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.02)",
      transition: { duration: 0.2 },
    },
  };

  const timeRef = useRef(currentTime);

  return (
    <motion.div
      ref={taskRef}
      className={`group flex flex-col p-2 rounded-md overflow-hidden relative ${
        isEditing ? "bg-gray-50/30 dark:bg-gray-800/10" : ""
      }`}
      initial={complete ? "complete" : "incomplete"}
      animate={complete ? "complete" : "incomplete"}
      variants={taskVariants}
      layoutId={
        isNew && currentTitle.trim().length > 0 ? "editing-task" : undefined
      }
      {...(!isNew && { whileHover: "hover" })}
    >
      {/* Row 1: Checkbox, Title, Delete */}
      <div className="flex items-center gap-3">
        <motion.div
          whileTap={{ scale: isNew ? 1 : 0.9 }}
          animate={{
            scale: complete ? [1, 1.2, 1] : 1,
            opacity: isNew ? 0.5 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <Checkbox
            checked={complete}
            disabled={isNew}
            onCheckedChange={(checked) => {
              if (isNew) return;

              const newComplete = Boolean(checked);
              setComplete(newComplete);

              if (isEditing) setIsEditing(false);
              if (newComplete) fireConfetti();

              setTimeout(() => {
                onSave({
                  title: currentTitle,
                  description: currentDescription,
                  due_date: fullDueDate,
                  is_complete: newComplete,
                });
              }, 1000);
            }}
          />
        </motion.div>
        <motion.input
          className={cn(
            "bg-transparent border-none outline-none text-base w-full",
            complete && "line-through text-muted-foreground"
          )}
          value={currentTitle}
          onChange={(e) => setCurrentTitle(e.target.value)}
          onKeyDown={handleEnter}
          onClick={() => !isNew && !complete && setIsEditing(true)}
          placeholder="Type to start..."
          animate={{
            scale: complete ? 0.98 : 1,
            opacity: complete ? 0.8 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
        {onDelete && (
          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 transition-all p-1 rounded
                     bg-white group-hover:bg-white hover:bg-red-500 z-20"
            aria-label="Delete task"
          >
            <Trash2
              size={16}
              className="transition-colors text-red-500 group-hover:text-red-500 hover:text-white"
            />
          </button>
        )}
      </div>

      {/* Animated Description & Due Date Fields (for new task or when editing) */}
      <AnimatePresence>
        {((isNew && currentTitle.trim().length > 0) || isEditing) && (
          <motion.div
            className="flex flex-col gap-2 w-full pr-8 ml-8 mt-2"
            initial={{ opacity: 0, height: 0, position: "relative" }}
            animate={{ opacity: 1, height: "auto", position: "relative" }}
            exit={{ opacity: 0, height: 0, position: "relative" }}
            transition={{ duration: 0.2 }}
            layoutId={isNew ? "editing-task-details" : `editing-task-${_id}`}
          >
            <textarea
              className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-md p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-400 w-full"
              rows={2}
              placeholder="Add a description (optional)"
              value={currentDescription}
              onChange={(e) => setCurrentDescription(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div
              ref={calendarRef}
              className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"
            >
              <DatePickerWithPresets
                date={
                  currentDueDate
                    ? new Date(convertUTCToLocalDate(currentDueDate).localDate)
                    : undefined
                }
                onChange={(newDate) => {
                  if (!newDate) {
                    setCurrentDueDate("");
                    return;
                  }
                  setCurrentDueDate(newDate.toISOString());
                }}
                time={currentTime}
                onTimeChange={(updatedTime) => {
                  const extractedPeriod = updatedTime.split(" ")[1] as Period;
                  setCurrentTime(updatedTime);
                  timeRef.current = updatedTime;
                  setPeriod(extractedPeriod);
                }}
                period={period}
                onPeriodChange={(updatedPeriod) => {
                  setPeriod(updatedPeriod);
                  const [hhmm] = currentTime.split(" ");
                  const updated = `${hhmm} ${updatedPeriod}`;
                  timeRef.current = updated;
                  // setCurrentTime(`${hhmm} ${updatedPeriod}`);
                }}
              />
            </div>

            <div className="flex justify-end gap-2 mt-2">
              {!isNew && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                >
                  Cancel
                </Button>
              )}
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  if (!currentTitle.trim()) {
                    toast.error("Task title is required");
                    return;
                  }

                  const dateObject = currentDueDate
                    ? new Date(currentDueDate)
                    : null;
                  const computedDueDate = dateObject
                    ? dateObject.toISOString()
                    : "";


                  onSave({
                    title: currentTitle,
                    description: currentDescription,
                    due_date: computedDueDate,
                    is_complete: complete,
                  });

                  toast.success(isNew ? "Task created!" : "Changes saved.");


                  if (!isNew) setIsEditing(false);
                }}
                className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-200 dark:hover:bg-zinc-300 dark:text-zinc-900"
              >
                {isNew ? "Save" : "Save Changes"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
