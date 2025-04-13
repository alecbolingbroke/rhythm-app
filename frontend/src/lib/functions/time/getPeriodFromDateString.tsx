export function getPeriodFromDateString(dateString: string): "AM" | "PM" {
    const hours = new Date(dateString).getHours();
    return hours >= 12 ? "PM" : "AM";
  }
  