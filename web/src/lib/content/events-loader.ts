import fs from "node:fs";
import { eventDay, eventOnDate } from "./event-dates";
import { publicationIssues } from "./event-import";
import path from "node:path";
import { EventItem, EventsCatalog, EventsCatalogSchema } from "../../contracts/event";

/**
 * Đọc và thẩm định danh mục sự kiện từ content/data/events.json
 */
export async function loadEventsCatalog(): Promise<EventsCatalog> {
  const filePath = process.env.EVENTS_PREVIEW_CATALOG || path.join(process.cwd(), "content", "data", "events.json");
  if (!fs.existsSync(filePath)) {
    return {
      version: "1.0.0",
      asOfDate: new Date().toISOString().split("T")[0],
      ward: "Phường Liên Chiểu",
      totalEvents: 0,
      events: [],
    };
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw);
  const validated = EventsCatalogSchema.safeParse(parsed);

  if (!validated.success) {
    console.error("Lỗi xác thực events.json:", validated.error.issues);
    throw new Error(`Dữ liệu sự kiện không hợp lệ: ${validated.error.issues.map((i) => i.message).join(", ")}`);
  }

  const isPreview = Boolean(process.env.EVENTS_PREVIEW_CATALOG);
  const events = validated.data.events.filter(e => {
    if (!isPreview) {
      if (
        validated.data.version === "test-only" ||
        e.id.startsWith("fixture-") ||
        e.sourceUrl.includes("example.invalid") ||
        /fixture|mô phỏng|kiểm thử/i.test(e.evidenceText || "") ||
        e.sources?.some(s => s.url.includes("example.invalid") || /kiểm thử|mô phỏng/i.test(s.evidence || ""))
      ) {
        return false;
      }
    }
    return (
      e.checkedAt &&
      e.sources &&
      e.verificationStatus !== "unverified" &&
      !publicationIssues(
        {
          id: e.id,
          origin: "discovered",
          proposed: e,
          sources: e.sources,
          checkedAt: e.checkedAt,
          reviewStatus: "approved",
          reasons: [],
        },
        { from: "1900-01-01", through: "2999-12-31" }
      ).length
    );
  });
  return { ...validated.data, events, totalEvents: events.length };
}

/**
 * Xuất dữ liệu Sự kiện theo chuẩn GeoJSON FeatureCollection (tọa độ [lng, lat])
 * Tuân thủ mục 10 của LIEN_CHIEU_DISCOVERY_ANTIGRAVITY_SPEC.md
 */
export function convertEventsToGeoJson(events: EventItem[]) {
  return {
    type: "FeatureCollection" as const,
    features: events.map((event) => ({
      type: "Feature" as const,
      id: event.id,
      geometry: {
        type: "Point" as const,
        coordinates: [event.coordinates.lng, event.coordinates.lat] as [number, number],
      },
      properties: {
        entity_type: "event",
        id: event.id,
        name: event.title,
        title: event.title,
        summary: event.summary,
        category: event.category,
        category_label: event.categoryLabel,
        venue_name: event.venueName,
        address: event.address,
        start_at: event.startAt,
        end_at: event.endAt,
        date_precision: event.datePrecision,
        organizer: event.organizer,
        price_text: event.priceText,
        source_url: event.sourceUrl,
        source_publisher: event.sourcePublisher,
        evidence_text: event.evidenceText,
        verification_status: event.verificationStatus,
        confidence_score: event.confidenceScore,
        status: event.status,
      },
    })),
  };
}

export { filterEventsByDateFilter } from "./event-dates";
