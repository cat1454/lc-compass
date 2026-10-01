import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import type { WardBoundary } from "./event-map-style";

const position = z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]);
const ring = z.array(position).min(4).refine(points => points[0][0] === points.at(-1)![0] && points[0][1] === points.at(-1)![1], "Ring must be closed");
const polygon = z.array(ring).min(1);
export const BoundaryRecordSchema = z.object({
  status: z.enum(["pending", "verified"]),
  note: z.string().min(1),
  sourceUrl: z.string().url().optional(),
  checkedAt: z.string().datetime({ offset: true }).optional(),
  version: z.string().optional(),
  geojson: z.object({ type: z.literal("FeatureCollection"), features: z.array(z.object({ type: z.literal("Feature"), properties: z.record(z.unknown()), geometry: z.discriminatedUnion("type", [z.object({ type: z.literal("Polygon"), coordinates: polygon }), z.object({ type: z.literal("MultiPolygon"), coordinates: z.array(polygon).min(1) })]) })) }),
}).superRefine((record, ctx) => {
  if (record.status === "verified") {
    const isSyntheticUrl = Boolean(
      record.sourceUrl &&
      (/\.invalid($|\/)/i.test(record.sourceUrl) ||
        /example\.(com|org|net|invalid)/i.test(record.sourceUrl) ||
        /localhost/i.test(record.sourceUrl) ||
        /test-boundary/i.test(record.sourceUrl))
    );
    const isTestVersion = Boolean(record.version && /test-only|mock|synthetic/i.test(record.version));
    const isTestNote = /mô phỏng|không phải địa giới thật|test only/i.test(record.note);

    if (
      !record.sourceUrl ||
      !record.checkedAt ||
      !record.version ||
      !record.geojson.features.length ||
      isSyntheticUrl ||
      isTestVersion ||
      isTestNote
    ) {
      ctx.addIssue({ code: "custom", message: "Verified boundary requires geometry and real provenance" });
    }
  }
});

export function loadEventBoundary(): { boundary: WardBoundary; note: string; sourceUrl?: string } {
  try {
    const isPreview = Boolean(process.env.EVENTS_PREVIEW_BOUNDARY);
    const file = process.env.EVENTS_PREVIEW_BOUNDARY || path.join(process.cwd(), "content/data/event-boundary.json");
    if (!fs.existsSync(file)) {
      return { boundary: { type: "FeatureCollection", features: [] }, note: "Chưa có dữ liệu địa giới được xác minh" };
    }
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    if (isPreview && parsed?.geojson) {
      return { boundary: parsed.geojson, note: parsed.note || "", sourceUrl: parsed.sourceUrl };
    }
    const record = BoundaryRecordSchema.parse(parsed);
    return { boundary: record.status === "verified" ? record.geojson : { type: "FeatureCollection", features: [] }, note: record.note, sourceUrl: record.sourceUrl };
  } catch {
    return { boundary: { type: "FeatureCollection", features: [] }, note: "Chưa có dữ liệu địa giới được xác minh" };
  }
}
