import { Checkbox } from "@/components/ui/checkbox";
import { useState, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DatePickerWithPresets } from "@/components/ui/date-picker-with-presets";

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

  // Only used for the "new task" row
  title?: string;
  setTitle?: React.Dispatch<React.SetStateAction<string>>;
  description?: string;
  dueDate?: string;
  setDescription?: React.Dispatch<React.SetStateAction<string>>;
  setDueDate?: React.Dispatch<React.SetStateAction<string>>;
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
}: TaskItemProps) {
  const isNew = !_id;

  const [internalTitle, setInternalTitle] = useState(initialTitle);
  const [complete, setComplete] = useState(isComplete);
  const [internalDescription, setInternalDescription] =
    useState(initialDescription);
  const [internalDueDate, setInternalDueDate] = useState(initialDueDate);

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
  const [internalTime, setInternalTime] = useState<string>("");
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes() < 30 ? "00" : "30";
    return `${hours}:${minutes}`;
  };

  const [time, setTime] = useState<string>(getCurrentTime());
  const currentTime = isNew ? time ?? "" : internalTime;
  const setCurrentTime = isNew ? setTime ?? (() => {}) : setInternalTime;

  function convertTo24Hour(time12: string): string {
    const [time, modifier] = time12.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  }

  function createUTCDateFromLocal(dateStr: string, timeStr: string): string {
    const [hours, minutes] = convertTo24Hour(timeStr).split(":").map(Number);
    const localDate = new Date(dateStr);
    localDate.setHours(hours, minutes, 0, 0);

    // Convert to UTC date
    const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);

    // Format date without seconds
    // YYYY-MM-DDThh:mm:00.000Z format
    const isoString = utcDate.toISOString();
    return isoString.substring(0, 17) + '00.000Z';
  }

  // Calculate the full due date, or empty string if not set
  // Backend will convert empty string to null
  const fullDueDate: string =
    currentDueDate && currentDueDate.trim() !== "" && currentTime
      ? createUTCDateFromLocal(currentDueDate, currentTime)
      : currentDueDate && currentDueDate.trim() !== "" ? currentDueDate : "";

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentTitle.trim()) {
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
      }
    }
  };

  // Animation variants for task completion
  // Check if dark mode is active
  const isDarkMode = typeof window !== 'undefined' &&
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Animation variants for task completion
  const taskVariants = {
    incomplete: {
      backgroundColor: "transparent",
      borderLeft: "0px solid transparent",
      transition: { duration: 0.3 }
    },
    complete: {
      backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)",
      borderLeft: "4px solid #10b981", // Green border for completed tasks
      transition: { duration: 0.3 }
    },
    hover: {
      backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      className="group flex flex-col p-2 border-b dark:border-zinc-800 rounded-md overflow-hidden relative"
      initial={complete ? "complete" : "incomplete"}
      animate={complete ? "complete" : "incomplete"}
      whileHover="hover"
      variants={taskVariants}
      layout
    >
      {/* Row 1: Checkbox, Title, Delete */}
      <div className="flex items-center gap-3">
        <motion.div
          whileTap={{ scale: isNew ? 1 : 0.9 }}
          animate={{ scale: complete ? [1, 1.2, 1] : 1, opacity: isNew ? 0.5 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <Checkbox
            checked={complete}
            disabled={isNew}
            onCheckedChange={(checked) => {
              if (isNew) return; // Extra safety check
              setComplete(Boolean(checked));
              onSave({
                title: currentTitle,
                description: currentDescription,
                due_date: fullDueDate,
                is_complete: Boolean(checked),
              });
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
          placeholder="Start typing your task..."
          animate={{
            scale: complete ? 0.98 : 1,
            opacity: complete ? 0.8 : 1
          }}
          transition={{ duration: 0.3 }}
        />
        {onDelete && (
          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 transition-all p-1 rounded
                     bg-white group-hover:bg-white hover:bg-red-500"
          >
            <Trash2
              size={16}
              className="transition-colors text-red-500 group-hover:text-red-500 hover:text-white"
            />
          </button>
        )}
      </div>

      {/* Animated Description & Due Date Fields (for new task only) */}
      <AnimatePresence>
        {isNew && currentTitle.trim().length > 0 && (
          <motion.div
            className="flex flex-col gap-2 w-full max-w-[85%] ml-8 mt-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <textarea
              className="bg-transparent border rounded p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Add a description (optional)"
              value={currentDescription}
              onChange={(e) => setCurrentDescription(e.target.value)}
            />
            <DatePickerWithPresets
              date={currentDueDate ? new Date(currentDueDate) : undefined}
              onChange={(newDate) => {
                if (!newDate) {
                  setCurrentDueDate(""); // Set to empty string when cleared
                  return;
                }
                setCurrentDueDate(newDate.toISOString());
              }}
              time={currentTime}
              onTimeChange={(time) => setCurrentTime(time)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
