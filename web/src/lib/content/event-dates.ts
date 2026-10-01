import type { EventItem } from "../../contracts/event";

export function eventOnDate(event: EventItem, date: string): boolean {
  if (event.status === "cancelled" || event.status === "postponed") return false;
  if (event.datePrecision === "recurring") return event.recurrence?.dates.includes(date) ?? false;
  const startDay = eventDay(new Date(event.startAt));
  const endDay = eventDay(new Date(event.endAt || event.startAt));
  return date >= startDay && date <= endDay;
}

export function eventDay(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

export function eventDateLabel(event: EventItem): string {
  const options: Intl.DateTimeFormatOptions = { timeZone: "Asia/Ho_Chi_Minh", day: "2-digit", month: "2-digit", year: "numeric" };
  const date = (value: string) => new Date(value).toLocaleDateString("vi-VN", options);
  const time = (value: string) => new Date(value).toLocaleTimeString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit" });
  if (event.datePrecision === "recurring") return `Định kỳ: ${event.recurrence?.dates.map(date).join(", ") || "Chưa công bố lịch"}`;
  const endDate = event.endAt && eventDay(new Date(event.endAt)) !== eventDay(new Date(event.startAt)) ? ` – ${date(event.endAt)}` : "";
  if (event.datePrecision === "date_only") return `${date(event.startAt)}${endDate} · Chưa công bố giờ`;
  return `${date(event.startAt)} lúc ${time(event.startAt)}${event.endAt ? ` – ${endDate ? date(event.endAt) + " " : ""}${time(event.endAt)}` : ""} (giờ Việt Nam)`;
}

/**
 * Bộ lọc thời gian cho sự kiện (Hôm nay, Ngày mai, Cuối tuần, Tháng này)
 */
export function filterEventsByDateFilter(
  events: EventItem[],
  dateFilter: "all" | "today" | "tomorrow" | "weekend" | "this_month",
  referenceDate = new Date()
): EventItem[] {
  if (dateFilter === "all") return events;
  const today = eventDay(referenceDate);
  const base = new Date(`${today}T12:00:00+07:00`);
  const day = (offset: number) => eventDay(new Date(base.getTime() + offset * 86400000));
  if (dateFilter === "today") return events.filter(e => eventOnDate(e, today));
  if (dateFilter === "tomorrow") return events.filter(e => eventOnDate(e, day(1)));
  if (dateFilter === "weekend") {
    const weekday = new Date(`${today}T00:00:00Z`).getUTCDay();
    const saturday = weekday === 0 ? -1 : (6 - weekday + 7) % 7;
    return events.filter(e => eventOnDate(e, day(saturday)) || eventOnDate(e, day(saturday + 1)));
  }
  const prefix = today.slice(0, 7);
  const count = new Date(Date.UTC(Number(today.slice(0, 4)), Number(today.slice(5, 7)), 0)).getUTCDate();
  const dates = Array.from({ length: count }, (_, i) => `${prefix}-${String(i + 1).padStart(2, "0")}`);
  return events.filter(e => dates.some(d => eventOnDate(e, d)));
}
