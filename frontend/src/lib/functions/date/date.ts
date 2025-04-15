import { isSameDay, isSameWeek, isSameMonth, parseISO } from "date-fns";

export function isSameDayUTC(date1: Date, isoString: string): boolean {
  return isSameDay(date1, parseISO(isoString));
}

export function isSameWeekUTC(date1: Date, isoString: string): boolean {
  return isSameWeek(date1, parseISO(isoString), { weekStartsOn: 0 });
}

export function isSameMonthUTC(date1: Date, isoString: string): boolean {
  return isSameMonth(date1, parseISO(isoString));
}
