const now: Date = new Date();
const nextMonth: Date = new Date();
nextMonth.setMonth(now.getMonth() + 1);

// Type annotation for the function
const formatDate = (date: Date): string => date.toISOString().split("T")[0];

export const minDate: string = formatDate(now);
export const maxDate: string = formatDate(nextMonth);

const hours: string = String(now.getHours()).padStart(2, "0");
const minutes: string = String(now.getMinutes()).padStart(2, "0");

// HH:MM format
export const currentTime: string = `${hours}:${minutes}`;
