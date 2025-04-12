// import * as React from "react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Period, display12HourValue, setDateByType } from "./time-picker-utils";
 
// export interface PeriodSelectorProps {
//     period: Period;
//     setPeriod: (m: Period) => void;
//     date: Date | undefined;
//     setDate: (date: Date | undefined) => void;
//     onRightFocus?: () => void;
//     onLeftFocus?: () => void;
// }
 
// export const TimePeriodSelect = React.forwardRef<HTMLButtonElement, PeriodSelectorProps>(({ period, setPeriod, date, setDate, onLeftFocus, onRightFocus }, ref) => {
//     const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
//         if (e.key === "ArrowRight") onRightFocus?.();
//         if (e.key === "ArrowLeft") onLeftFocus?.();
//     };
 
//     const handleValueChange = (value: Period) => {
//         setPeriod(value);
 
//         /**
//          * trigger an update whenever the user switches between AM and PM;
//          * otherwise user must manually change the hour each time
//          */
//         if (date) {
//             const tempDate = new Date(date);
//             const hours = display12HourValue(date.getHours());
//             setDate(setDateByType(tempDate, hours.toString(), "12hours", period === "AM" ? "PM" : "AM"));
//         }
//     };
 
//     return (
//         <div className="flex h-10 items-center">
//             <Select value={period} onValueChange={(value: Period) => handleValueChange(value)}>
//                 <SelectTrigger ref={ref} className="w-full focus:bg-accent focus:text-accent-foreground" onKeyDown={handleKeyDown}>
//                     <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent position="item-aligned">
//                     <SelectItem value="AM">AM</SelectItem>
//                     <SelectItem value="PM">PM</SelectItem>
//                 </SelectContent>
//             </Select>
//         </div>
//     );
// });
 
// TimePeriodSelect.displayName = "TimePeriodSelect";

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import * as React from "react"
import { Period } from "./time-picker-utils"

interface TimePeriodInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: Period
  setValue: (val: Period) => void
  onLeftFocus?: () => void
  onRightFocus?: () => void
}

export const TimePeriodInput = React.forwardRef<HTMLInputElement, TimePeriodInputProps>(
  ({ value, setValue, onLeftFocus, onRightFocus, className, ...props }, ref) => {
    const toggle = () => {
      setValue(value === "AM" ? "PM" : "AM")
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowRight") onRightFocus?.()
      if (e.key === "ArrowLeft") onLeftFocus?.()
      if (["ArrowUp", "ArrowDown", "Enter", " "].includes(e.key)) {
        e.preventDefault()
        toggle()
      }
      if (e.key.toUpperCase() === "A") setValue("AM")
      if (e.key.toUpperCase() === "P") setValue("PM")
    }

    return (
      <Input
        ref={ref}
        className={cn(
          "w-[36px] h-9 text-center text-sm font-normal px-1 py-1 tabular-nums",
          "caret-transparent select-none",
          className
        )}
        type="text"
        inputMode="none"
        value={value}
        onKeyDown={handleKeyDown}
        readOnly
        {...props}
      />
    )
  }
)

TimePeriodInput.displayName = "TimePeriodInput"


