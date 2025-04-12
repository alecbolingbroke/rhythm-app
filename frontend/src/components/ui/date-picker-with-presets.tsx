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

type Props = {
  date?: Date;
  onChange: (date: Date | undefined) => void;
  time?: string;
  onTimeChange?: (time: string) => void;
};

export function DatePickerWithPresets({ date, onChange, onTimeChange }: Props) {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a due date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex w-[280px] flex-col space-y-2"
      >
        <div className="flex flex-row gap-2">
          <div className="">
            <Select
              onValueChange={(value) => {
                const newDate = addDays(new Date(), parseInt(value));
                onChange(newDate);
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
              </SelectContent>
            </Select>
          </div>

          {onTimeChange && (
            <div className="flex items-center justify-between w-full max-w-[280px] gap-1">
              <TimePicker date={date} setDate={onChange} />
            </div>
          )}
        </div>

        <div className="rounded-md border">
          <Calendar mode="single" selected={date} onSelect={onChange} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
