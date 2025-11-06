import { format, toZonedTime } from "date-fns-tz";

export function formatMexicoDate(
  date: Date | string | number,
  pattern: string = "yyyy-MM-dd HH:mm:ss"
): string {
  const timeZone = "America/Mazatlan";
  const zonedDate = toZonedTime(date, timeZone);
  return format(zonedDate, pattern, { timeZone });
}

export  const formattedDate = (date: string) =>
    date.split("T")[0].split("-").reverse().join("/");
