import { convertTo24Hour } from "./convertTo24Hour";

/**
 * Creates an ISO string from a date string and time string with period (AM/PM)
 * Sets seconds to 0 for consistency
 */
export function createUTCDateFromLocal(dateStr: string, timeStr: string, period: "AM" | "PM"): string {
  // Convert time to 24-hour format
  const timeWith24Hour = `${timeStr} ${period}`;
  const time24 = convertTo24Hour(timeWith24Hour);

  // Extract hours and minutes
  const [hours, minutes] = time24.split(":").map(Number);

  // Create a date object from the date string
  const date = new Date(dateStr);

  // Set the hours and minutes, with seconds and milliseconds set to 0
  date.setHours(hours, minutes, 0, 0);

  // Return the ISO string
  return date.toISOString();
}