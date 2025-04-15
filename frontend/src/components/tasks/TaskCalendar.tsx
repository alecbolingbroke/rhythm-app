import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Task } from "@/hooks/useTasks";
import DayView from "./calendarViews/DayView";
import WeekView from "./calendarViews/WeekView";
import MonthView from "./calendarViews/MonthView";
import {
  format,
  isToday,
  isTomorrow,
  isYesterday,
  addDays,
  addMonths,
} from "date-fns";

type ViewType = "day" | "week" | "month";

type Props = {
  tasks: Task[];
};

export default function TaskCalendar({ tasks }: Props) {
  const [view, setView] = useState<ViewType>("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrev = () => {
    setCurrentDate((prev) =>
      view === "day"
        ? addDays(prev, -1)
        : view === "week"
        ? addDays(prev, -7)
        : addMonths(prev, -1)
    );
  };

  const handleNext = () => {
    setCurrentDate((prev) =>
      view === "day"
        ? addDays(prev, 1)
        : view === "week"
        ? addDays(prev, 7)
        : addMonths(prev, 1)
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [view, handlePrev, handleNext]);

  let displayDate = "";

  if (view === "day") {
    if (isToday(currentDate)) {
      displayDate = "Today";
    } else if (isTomorrow(currentDate)) {
      displayDate = "Tomorrow";
    } else if (isYesterday(currentDate)) {
      displayDate = "Yesterday";
    } else {
      displayDate = format(currentDate, "MMMM d");
    }
  } else if (view === "week") {
    displayDate = `Week of ${format(currentDate, "MMMM d")}`;
  } else if (view === "month") {
    displayDate = format(currentDate, "MMMM yyyy");
  }

  return (
    <div className="rounded-xl border border-stone-300 p-4 bg-background shadow-sm w-full overflow-x-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex flex-wrap gap-2 items-center">
          <Button variant="outline" onClick={handlePrev}>
            ←
          </Button>
          <h2 className="text-lg font-semibold text-muted-foreground">
            {displayDate}
          </h2>
          <Button variant="outline" onClick={handleNext}>
            →
          </Button>
        </div>

        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(val) => val && setView(val as ViewType)}
        >
          <ToggleGroupItem value="day">Day</ToggleGroupItem>
          <ToggleGroupItem value="week">Week</ToggleGroupItem>
          <ToggleGroupItem value="month">Month</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="min-h-[200px]">
        {view === "day" && <DayView date={currentDate} tasks={tasks} />}
        {view === "week" && (
          <WeekView
            date={currentDate}
            tasks={tasks}
            onDayClick={(clickedDate) => {
              setCurrentDate(clickedDate);
              setView("day");
            }}
          />
        )}
        {view === "month" && (
          <MonthView
            date={currentDate}
            tasks={tasks}
            onDayClick={(clickedDate) => {
              setCurrentDate(clickedDate);
              setView("day");
            }}
          />
        )}
      </div>
    </div>
  );
}
