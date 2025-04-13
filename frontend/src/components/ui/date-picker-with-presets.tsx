import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimePicker } from "@/components/ui/timepicker/time-picker";
import { Period } from "./timepicker/time-picker-utils";

type Props = {
  date?: Date;
  onChange: (date: Date | undefined) => void;
  time?: string;
  onTimeChange?: (time: string) => void;
  period?: Period;
  onPeriodChange: (period: Period) => void;
};

export function DatePickerWithPresets({ date, onChange, time, onTimeChange, period, onPeriodChange }: Props) {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal bg-transparent border-0 px-2 py-1.5",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP 'at' h:mm a") : <span>Pick a due date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex w-[280px] flex-col space-y-2"
        data-ignore-outside-click
      >
        <div className="flex flex-row gap-2 justify-between">
          <div className="">
            <Select
              onValueChange={(value) => {
                if (value === "clear") {
                  onChange(undefined);
                } else {
                  const newDate = addDays(new Date(), parseInt(value));
                  onChange(newDate);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Quick pick" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="0">Today</SelectItem>
                <SelectItem value="1">Tomorrow</SelectItem>
                <SelectItem value="3">In 3 days</SelectItem>
                <SelectItem value="7">In a week</SelectItem>
                <SelectItem value="clear" className="text-red-500">Clear date</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {onTimeChange && (
            <div className="flex items-center justify-between w-full max-w-[280px] gap-1">
              <TimePicker date={date} setDate={onChange} initialTime={time} period={period} onPeriodChange={onPeriodChange} />
            </div>
          )}
        </div>

        <div className="rounded-md border">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onChange}
            initialFocus
          />
        </div>
        {date && (
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
            onClick={() => onChange(undefined)}
          >
            Clear date
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}
