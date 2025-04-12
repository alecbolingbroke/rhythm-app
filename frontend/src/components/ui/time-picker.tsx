import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TimePickerProps = {
  value?: string;
  onChange: (val: string) => void;
};

export function TimePicker({ value, onChange }: TimePickerProps) {
  const hourInputRef = useRef<HTMLInputElement>(null);
  const minuteInputRef = useRef<HTMLInputElement>(null);

  // Get current time formatted as "HH:MM AM/PM"
  const getDefaultTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return {
      hour: hours.toString().padStart(2, "0"),
      minute: minutes.toString().padStart(2, "0"),
      period,
    };
  };

  // Parse incoming value or fallback to now
  const {
    hour: defaultHour,
    minute: defaultMinute,
    period: defaultPeriod,
  } = value
    ? (() => {
        const match = value.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
        return match
          ? {
              hour: match[1].padStart(2, "0"),
              minute: match[2].padStart(2, "0"),
              period: match[3].toUpperCase(),
            }
          : getDefaultTime();
      })()
    : getDefaultTime();

  const [hour, setHour] = useState(defaultHour);
  const [minute, setMinute] = useState(defaultMinute);
  const [period, setPeriod] = useState(defaultPeriod);
  const [hourFocused, setHourFocused] = useState(false);
  const [minuteFocused, setMinuteFocused] = useState(false);

  useEffect(() => {
    onChange(`${hour}:${minute} ${period}`);
  }, [hour, minute, period]);

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const cleaned = val.replace(/\D/g, "").slice(-2);
    if (!cleaned) {
      setHour("");
      return;
    }
    const num = parseInt(cleaned);
    if (isNaN(num)) {
      setHour(cleaned);
      return;
    }
    const clamped = Math.min(num, 12);
    setHour(clamped.toString()); // Don't pad here, do it on blur if needed
    if (cleaned.length === 2 && num <= 12) {
      minuteInputRef.current?.focus();
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const cleaned = val.replace(/\D/g, "").slice(-2);
    if (!cleaned) {
      setMinute("");
      return;
    }
    const num = parseInt(cleaned);
    if (isNaN(num)) {
      setMinute(cleaned);
      return;
    }
    const clamped = Math.min(num, 59);
    setMinute(clamped.toString()); // Don't pad here, do it on blur if needed
    if (cleaned.length === 2 && num <= 59) {
      // Optionally move focus to AM/PM if desired
    }
  };

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
  };

  const handleHourFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setHourFocused(true);
    e.target.select();
  };

  const handleHourBlur = () => {
    setHourFocused(false);
    if (hour.length === 1 && hour !== "") {
      setHour(`0${hour}`);
    } else if (hour === "") {
      setHour(getDefaultTime().hour);
    }
  };

  const handleMinuteFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setMinuteFocused(true);
    e.target.select();
  };

  const handleMinuteBlur = () => {
    setMinuteFocused(false);
    if (minute.length === 1 && minute !== "") {
      setMinute(`0${minute}`);
    } else if (minute === "") {
      setMinute(getDefaultTime().minute);
    }
  };

  useEffect(() => {
    // Set initial focus to the hour input (optional)
    // hourInputRef.current?.focus();
  }, []);

  return (
    <div className="flex items-center gap-1 w-full max-w-[200px]">
      <Input
        ref={hourInputRef}
        value={hour}
        onChange={handleHourChange}
        onFocus={handleHourFocus}
        onBlur={handleHourBlur}
        type="text"
        className={`w-10 text-center text-sm ${hourFocused ? 'bg-gray-100' : ''}`}
        maxLength={2}
        inputMode="numeric"
        aria-label="Hour"
        placeholder="HH"
      />
      <span className="text-base font-medium">:</span>
      <Input
        ref={minuteInputRef}
        value={minute}
        onChange={handleMinuteChange}
        onFocus={handleMinuteFocus}
        onBlur={handleMinuteBlur}
        type="text"
        className={`w-10 text-center text-sm ${minuteFocused ? 'bg-gray-100' : ''}`}
        maxLength={2}
        inputMode="numeric"
        aria-label="Minute"
        placeholder="MM"
      />
      <Select value={period} onValueChange={handlePeriodChange}>
        <SelectTrigger className="w-14 h-8 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AM">AM</SelectItem>
          <SelectItem value="PM">PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}