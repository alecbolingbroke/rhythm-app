/**
 * Converts an ISO date string from the database to local date and time for display
 */
export function convertUTCToLocalDate(isoDateStr: string): {
  localDate: string;
  localTime: string;
  period: "AM" | "PM";
} {
  if (!isoDateStr) {
    return { localDate: "", localTime: "", period: "AM" };
  }

  // Parse the ISO date string into a Date object
  const date = new Date(isoDateStr);

  // Format the date part - keep as ISO for internal use
  const localDateStr = date.toISOString();

  // Format the time part for display
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  const localTimeStr = `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;

  return {
    localDate: localDateStr,
    localTime: localTimeStr,
    period: period as "AM" | "PM"
  };
}