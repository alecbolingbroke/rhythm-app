import * as React from "react";
import { TimePickerInput } from "./time-picker-input";
import { TimePeriodInput } from "./period-select";
import { Period } from "./time-picker-utils";

interface TimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  initialTime?: string;
  period?: Period;
  onPeriodChange?: (period: Period) => void;
}

export function TimePicker({ date, setDate, initialTime, period: externalPeriod, onPeriodChange }: TimePickerProps) {
  const [period, setPeriod] = React.useState<Period>(() => {
    if (externalPeriod) return externalPeriod;
    if (initialTime) {
      return initialTime.includes('PM') ? 'PM' : 'AM';
    }
    return new Date().getHours() >= 12 ? "PM" : "AM";
  });
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const periodRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (initialTime && !date) {
      const now = new Date();
      const [time, period] = initialTime.split(' ');
      const [hours, minutes] = time.split(':');
      now.setHours(
        period === 'PM' ? parseInt(hours) + 12 : parseInt(hours),
        parseInt(minutes),
        0, // Set seconds to 0
        0  // Set milliseconds to 0
      );
      setDate(now);
    }
  }, [initialTime, date, setDate]);

  React.useEffect(() => {
    if (externalPeriod && externalPeriod !== period) {
      setPeriod(externalPeriod);
    }
  }, [externalPeriod]);

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
    onPeriodChange?.(newPeriod);
  
    if (date) {
      const newDate = new Date(date);
      const hours = newDate.getHours();
  
      const isCurrentlyPM = hours >= 12;
      if ((newPeriod === "AM" && isCurrentlyPM) || (newPeriod === "PM" && !isCurrentlyPM)) {
        // Flip AM/PM
        newDate.setHours((hours + 12) % 24);
        setDate(newDate);
      }
    }
  };
  

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
        setValue={handlePeriodChange}
        onLeftFocus={() => minuteRef.current?.focus()}
        ref={periodRef}
      />
    </div>
  );
}
