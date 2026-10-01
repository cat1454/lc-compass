import { EventCandidate, EventItem, EventItemSchema, EventsCatalog } from "../../contracts/event";

const normalize = (value: string) => value.normalize("NFC").toLocaleLowerCase("vi").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
export const eventIdentity = (event: EventItem) => [event.title, event.organizer, new Date(event.startAt).toISOString(), event.venueName, event.address].map(normalize).join("|");

/** Editorial approval is necessary; a successful Zod parse is not verification. */
export function publicationIssues(candidate: EventCandidate, window: { from: string; through: string }): string[] {
  const issues: string[] = [];
  if (candidate.reviewStatus !== "approved") issues.push("Chưa được duyệt");
  if (candidate.reasons.length) issues.push("Còn lý do chưa đạt");
  const parsed = EventItemSchema.safeParse(candidate.proposed);
  if (!parsed.success) return [...issues, ...parsed.error.issues.map(i => `Thiếu/sai trường ${i.path.join(".")}`)];
  const e = parsed.data;
  if (/bach khoa|\bdut\b/.test(normalize(`${e.title} ${e.organizer} ${e.venueName} ${e.address}`).normalize("NFD").replace(/[\u0300-\u036f]/g, "")) || /(^|\.)dut\.udn\.vn$/.test(new URL(e.sourceUrl).hostname)) issues.push("Hoạt động Bách khoa ngoài phạm vi sự kiện cộng đồng đã chọn");
  if (!e.image) issues.push("Thiếu ảnh sự kiện hoặc ảnh địa điểm đã xác minh");
  if (e.coordinatePrecision !== "venue") issues.push("Cần tọa độ địa điểm tổ chức, không dùng điểm đại diện khuôn viên chung");
  if (!Number.isFinite(Date.parse(e.startAt)) || (e.endAt && (!Number.isFinite(Date.parse(e.endAt)) || Date.parse(e.endAt) < Date.parse(e.startAt)))) issues.push("Khoảng thời gian không hợp lệ");
  if (e.startAt.slice(0, 10) > window.through || (e.endAt || e.startAt).slice(0, 10) < window.from) issues.push("Ngoài khoảng thu thập");
  if (e.status === "postponed" || e.status === "cancelled") issues.push("Đã hoãn/hủy; lưu hồ sơ, không nhập lịch đang diễn ra");
  if (!e.coordinatePrecision || !e.coordinateNote) issues.push("Thiếu độ chính xác và giải thích tọa độ");
  const read = candidate.sources.filter(s => s.accessStatus === "read");
  const primary = read.find(s => s.url === e.sourceUrl && ["organizer", "government"].includes(s.kind) && s.supports.includes("time") && s.supports.includes("venue") && s.supports.includes("organizer"));
  if (!primary || new URL(primary.url).pathname === "/") issues.push("Thiếu bài/lịch cụ thể của đơn vị tổ chức");
  for (const field of ["ward", "coordinates"] as const) if (!read.some(s => s.supports.includes(field))) issues.push(`Thiếu bằng chứng ${field}`);
  if (e.datePrecision === "recurring") {
    if (!e.recurrence || !read.some(s => s.supports.includes("recurrence"))) issues.push("Thiếu lịch định kỳ có bằng chứng");
    else if (e.recurrence.dates.some(d => d < e.startAt.slice(0, 10) || d > (e.endAt || e.startAt).slice(0, 10)) || !e.recurrence.dates.some(d => d >= window.from && d <= window.through)) issues.push("Ngày định kỳ ngoài hiệu lực");
  }
  if (/miễn phí|free/i.test(e.priceText) && !read.some(s => s.supports.includes("price"))) issues.push("Chưa có bằng chứng miễn phí");
  return issues;
}

export function importEventCandidates(candidates: EventCandidate[], window: { from: string; through: string }, checkedAt: string) {
  const groups = new Map<string, EventItem>();
  const excluded: { id: string; reasons: string[] }[] = [];
  const duplicates: string[] = [];
  const ids = new Set<string>();
  for (const candidate of candidates) {
    const issues = publicationIssues(candidate, window);
    if (issues.length) { excluded.push({ id: candidate.id, reasons: [...candidate.reasons, ...issues] }); continue; }
    const event = EventItemSchema.parse({ ...candidate.proposed, checkedAt: candidate.checkedAt, sources: candidate.sources, verificationStatus: "source_verified" });
    const key = eventIdentity(event), previous = groups.get(key);
    if (previous) {
      // Conflicting duration/coordinates must be reviewed, never silently overwritten.
      if (previous.endAt !== event.endAt || JSON.stringify(previous.coordinates) !== JSON.stringify(event.coordinates)) throw new Error(`Bản trùng mâu thuẫn: ${event.id}`);
      previous.sources = [...new Map([...(previous.sources || []), ...(event.sources || [])].map(s => [s.url, s])).values()];
      duplicates.push(candidate.id);
    } else {
      if (ids.has(event.id)) throw new Error(`Trùng ID: ${event.id}`);
      ids.add(event.id); groups.set(key, event);
    }
  }
  const events = [...groups.values()].sort((a, b) => a.startAt.localeCompare(b.startAt) || a.id.localeCompare(b.id));
  const catalog: EventsCatalog = { version: "2.0.0", asOfDate: checkedAt.slice(0, 10), ward: "Phường Liên Chiểu", totalEvents: events.length, events };
  return { catalog, excluded, duplicates };
}
