import * as React from "react";
import { TimePickerInput } from "./time-picker-input";
import { TimePeriodInput } from "./period-select";
import { Period } from "./time-picker-utils";

interface TimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function TimePicker({ date, setDate }: TimePickerProps) {
  const [period, setPeriod] = React.useState<Period>("PM");
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const periodRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center justify-between w-full max-w-[280px] gap-1">
      <TimePickerInput
        picker="12hours"
        period={period}
        date={date}
        setDate={setDate}
        ref={hourRef}
        onRightFocus={() => minuteRef.current?.focus()}
      />
      <span className="text-muted-foreground text-sm">:</span>

      <TimePickerInput
        picker="minutes"
        id="minutes12"
        date={date}
        setDate={setDate}
        ref={minuteRef}
        onLeftFocus={() => hourRef.current?.focus()}
        onRightFocus={() => periodRef.current?.focus()}
      />
      <TimePeriodInput
        value={period}
        setValue={setPeriod}
        onLeftFocus={() => minuteRef.current?.focus()}
        ref={periodRef}
      />
    </div>
  );
}
