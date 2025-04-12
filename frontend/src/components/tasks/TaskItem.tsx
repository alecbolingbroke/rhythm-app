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

    return new Date(
      localDate.getTime() - localDate.getTimezoneOffset() * 60000
    ).toISOString();
  }

  const fullDueDate =
    currentDueDate && currentTime
      ? createUTCDateFromLocal(currentDueDate, currentTime)
      : currentDueDate;

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

  return (
    <div className="group flex flex-col p-2 border-b dark:border-zinc-800">
      {/* Row 1: Checkbox, Title, Delete */}
      <div className="flex items-center gap-3">
        <Checkbox
          checked={complete}
          onCheckedChange={(checked) => {
            setComplete(Boolean(checked));
            onSave({
              title: currentTitle,
              description: currentDescription,
              due_date: fullDueDate,
              is_complete: Boolean(checked),
            });
          }}
        />
        <input
          className={cn(
            "bg-transparent border-none outline-none text-base w-full",
            complete && "line-through text-muted-foreground"
          )}
          value={currentTitle}
          onChange={(e) => setCurrentTitle(e.target.value)}
          onKeyDown={handleEnter}
          placeholder="Start typing your task..."
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
                if (!newDate) return;
                setCurrentDueDate(newDate.toISOString());
              }}
              time={currentTime}
              onTimeChange={(time) => setCurrentTime(time)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
