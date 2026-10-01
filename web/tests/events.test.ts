import fs from "node:fs";
import { describe, it, expect } from "vitest";
import { loadEventsCatalog, convertEventsToGeoJson, filterEventsByDateFilter } from "../src/lib/content/events-loader";
import { EventCollectionSchema, EventItemSchema, EventCandidateSchema, EventCandidate } from "../src/contracts/event";
import { importEventCandidates, publicationIssues } from "../src/lib/content/event-import";
import { eventOnDate } from "../src/lib/content/event-dates";
import { eventDateLabel } from "../src/lib/content/event-dates";
import { eventMapStyle, isAdministrativeLayer, addWardBoundary } from "../src/lib/content/event-map-style";
import { BoundaryRecordSchema } from "../src/lib/content/event-boundary";
import { vi } from "vitest";
import type { Map as LibreMap } from "maplibre-gl";

const batch = EventCollectionSchema.parse(JSON.parse(fs.readFileSync("../research/events/2026-10-01-community/candidates.json", "utf8")));
const fixtures = JSON.parse(fs.readFileSync("tests/fixtures/events-preview.json", "utf8"));
const approved: EventCandidate[] = fixtures.events.map((e: unknown) => { const event = EventItemSchema.parse(e); return EventCandidateSchema.parse({ id: event.id, origin: "discovered", proposed: event, sources: event.sources, checkedAt: event.checkedAt, reviewStatus: "approved", reasons: [] }); });
const fresh = () => structuredClone(approved[0]);
const run = (candidates = batch.candidates) => importEventCandidates(candidates, batch.window, batch.checkedAt);

describe("Evidence-gated event collection", () => {
  it("rejects university events and missing images, accepts sourced venue images", () => {
    const c = fresh(); delete c.proposed.image;
    expect(run([c]).catalog.totalEvents).toBe(0);
    const university = fresh(); university.proposed.organizer = "Đại học Bách khoa";
    expect(run([university]).catalog.totalEvents).toBe(0);
    const venue = fresh(); venue.proposed.image!.kind = "venue";
    expect(run([venue]).catalog.totalEvents).toBe(1);
    const campus = fresh(); campus.proposed.coordinatePrecision = "campus";
    expect(run([campus]).catalog.totalEvents).toBe(0);
  });
  it("preserves unknown time and uses Vietnam time", () => {
    const e = EventItemSchema.parse(fresh().proposed);
    expect(eventDateLabel(e)).toContain("08:30");
    expect(eventDateLabel({ ...e, datePrecision: "date_only", startAt: "2026-10-01", endAt: undefined })).toContain("Chưa công bố giờ");
  });
  it("handles missing key and enables only evidenced boundary geometry", () => {
    expect(eventMapStyle(false, undefined)).toEqual({ version: 8, sources: {}, layers: [] });
    expect(eventMapStyle(false, "test-key")).toContain("streets-v2/style.json");
    const pending = { status: "verified", note: "test", geojson: { type: "FeatureCollection", features: [] } };
    expect(BoundaryRecordSchema.safeParse(pending).success).toBe(false);
    const record = JSON.parse(fs.readFileSync("tests/fixtures/events-boundary-preview.json", "utf8"));
    const map = { getStyle: () => ({ layers: [{ id: "ward-old", "source-layer": "place" }, { id: "roads", "source-layer": "transportation_name" }] }), setLayoutProperty: vi.fn(), addSource: vi.fn(), addLayer: vi.fn() };
    addWardBoundary(map as unknown as LibreMap, record.geojson);
    expect(map.setLayoutProperty).toHaveBeenCalledWith("ward-old", "visibility", "none");
    expect(map.setLayoutProperty).toHaveBeenCalledTimes(1);
    expect(map.addLayer).toHaveBeenCalledTimes(2);
    expect(isAdministrativeLayer({ id: "road-labels", "source-layer": "transportation_name" })).toBe(false);
  });
  it("imports exactly the reviewed catalog; all 10 legacy records stay unpublished", async () => {
    expect(batch.candidates.filter(c => c.origin === "legacy")).toHaveLength(10);
    expect(batch.candidates.filter(c => c.origin === "legacy").every(c => c.reviewStatus !== "approved")).toBe(true);
    const result = run();
    expect(result.catalog.totalEvents).toBe(0);
    expect(result.excluded).toHaveLength(batch.candidates.length);
    expect(result.catalog).toEqual(await loadEventsCatalog());
    for (const c of approved) expect(publicationIssues(c, batch.window)).toEqual([]);
  });
  it("does not invent price, verification, confidence or checkedAt for legacy data", () => {
    const raw = { ...fresh().proposed };
    delete raw.priceText; delete raw.verificationStatus; delete raw.checkedAt; delete raw.confidenceScore;
    const e = EventItemSchema.parse(raw);
    expect(e.priceText).toBe("Chưa có thông tin chi phí");
    expect(e.verificationStatus).toBe("unverified");
    expect(e.checkedAt).toBeUndefined();
    expect(e.confidenceScore).toBeUndefined();
  });
  it("blocks missing coordinates, unread original, generic homepage, and invented free admission", () => {
    const missing = fresh(); delete missing.proposed.coordinates;
    expect(run([missing]).catalog.totalEvents).toBe(0);
    const blocked = fresh(); blocked.sources[0].accessStatus = "blocked";
    expect(run([blocked]).catalog.totalEvents).toBe(0);
    const home = fresh(); home.proposed.sourceUrl = home.sources[0].url = "https://dut.udn.vn/";
    expect(run([home]).catalog.totalEvents).toBe(0);
    const free = fresh(); free.proposed.priceText = "Miễn phí";
    expect(run([free]).catalog.totalEvents).toBe(0);
    const ward = fresh(); ward.sources = ward.sources.filter(s => !s.supports.includes("ward"));
    expect(run([ward]).catalog.totalEvents).toBe(0);
  });
  it("keeps separate dates, merges exact duplicates, rejects conflicting duplicate data", () => {
    const duplicate = fresh(); duplicate.id += "-copy"; duplicate.proposed.id += "-copy";
    expect(run([fresh(), duplicate]).catalog.totalEvents).toBe(1);
    duplicate.proposed.startAt = "2026-10-02T08:30:00+07:00";
    duplicate.proposed.endAt = "2026-10-02T11:30:00+07:00";
    expect(run([fresh(), duplicate]).catalog.totalEvents).toBe(2);
    const conflict = fresh(); conflict.proposed.endAt = "2026-10-01T12:30:00+07:00";
    expect(() => run([fresh(), conflict])).toThrow("mâu thuẫn");
  });
  it("blocks outside-window and postponed/cancelled events even if marked approved", () => {
    for (const status of ["cancelled", "postponed"] as const) {
      const c = fresh(); c.proposed.status = status;
      expect(run([c]).catalog.totalEvents).toBe(0);
    }
    const c = fresh(); c.proposed.startAt = "2026-12-31T08:00:00+07:00"; c.proposed.endAt = "2026-12-31T09:00:00+07:00";
    expect(run([c]).catalog.totalEvents).toBe(0);
  });
  it("requires finite supported recurrence, not an always-on recurring flag", () => {
    const c = fresh(); c.proposed.datePrecision = "recurring";
    expect(run([c]).catalog.totalEvents).toBe(0);
    c.proposed.endAt = "2026-10-31T11:30:00+07:00";
    c.proposed.recurrence = { dates: ["2026-10-03", "2026-10-10"] };
    c.sources[0].supports.push("recurrence");
    const e = run([c]).catalog.events[0];
    expect(eventOnDate(e, "2026-10-03")).toBe(true);
    expect(eventOnDate(e, "2026-10-04")).toBe(false);
    expect(eventOnDate(e, "2026-11-03")).toBe(false);
    expect(eventOnDate({ ...e, recurrence: undefined }, "2026-10-03")).toBe(false);
  });
  it("calendar, filters and marker payload match approved dates and coordinates", async () => {
    const { events } = run(approved).catalog;
    const geo = convertEventsToGeoJson(events);
    expect(geo.features).toHaveLength(7);
    expect(new Set(geo.features.map(f => f.geometry.coordinates.join(","))).size).toBe(1);
    expect(geo.features[0].geometry.coordinates).toEqual([108.12, 16.08]);
    expect(filterEventsByDateFilter(events, "today", new Date("2026-10-01T00:00:00+07:00"))).toHaveLength(2);
    expect(filterEventsByDateFilter(events, "weekend", new Date("2026-10-04T12:00:00+07:00"))).toHaveLength(3);
    expect(events.filter(e => eventOnDate(e, "2026-10-03"))).toHaveLength(2);
    expect(events.filter(e => eventOnDate(e, "2026-10-21"))).toHaveLength(0);
    const spanning = { ...events[0], startAt: "2026-10-30", endAt: "2026-11-02" };
    expect(filterEventsByDateFilter([spanning], "this_month", new Date("2026-11-01T00:00:00+07:00"))).toHaveLength(1);
  });
});
