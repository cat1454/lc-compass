import fs from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HomeLivingPulse } from "../src/components/home/HomeLivingPulse";
import { UnknownCaseFeedbackCard } from "../src/components/UnknownCaseFeedbackCard";
import { eventOnDate } from "../src/lib/content/event-dates";
import { loadEventBoundary, BoundaryRecordSchema } from "../src/lib/content/event-boundary";
import { loadEventsCatalog } from "../src/lib/content/events-loader";
import { loadPlacesDirectory } from "../src/lib/places-directory/loader";
import { EventItemSchema } from "../src/contracts/event";

const fixture = JSON.parse(fs.readFileSync("tests/fixtures/events-preview.json", "utf8"));
const boundary = JSON.parse(fs.readFileSync("tests/fixtures/events-boundary-preview.json", "utf8"));
afterEach(() => vi.restoreAllMocks());

describe("Publication audit regressions", () => {
  it("does not invent live schedules, evacuation sites or a rescue hotline on home", () => {
    const html = renderToStaticMarkup(createElement(HomeLivingPulse, { isLargeText: false }));
    expect(html).not.toContain("tel:0905423233");
    expect(html).not.toContain("19h00 - 21h30");
    expect(html).not.toContain("THPT Nguyễn Trãi");
    expect(html).not.toContain("DỮ LIỆU THỰC ĐỊA TUẦN NÀY");
  });
  it("does not repurpose the contest contact as a public service hotline", () => {
    const html = renderToStaticMarkup(createElement(UnknownCaseFeedbackCard, { searchQuery: "test" }));
    expect(html).not.toContain("tel:0905423233");
    expect(html).not.toContain("ỦY BAN NHÂN DÂN PHƯỜNG LIÊN CHIỂU – TỔ CHUYỂN ĐỔI SỐ");
  });
  it("does not publish legacy directory entries without individual evidence", async () => {
    const directory = await loadPlacesDirectory();
    expect(directory.places.every(p => "evidence" in p)).toBe(true);
  });
  it("uses Vietnam calendar dates for offset timestamps", () => {
    const e = EventItemSchema.parse({ ...fixture.events[0], startAt: "2026-10-01T18:30:00Z", endAt: "2026-10-01T19:30:00Z" });
    expect(eventOnDate(e, "2026-10-02")).toBe(true);
    expect(eventOnDate(e, "2026-10-01")).toBe(false);
  });
  it("does not crash the event page when the boundary file is unavailable", () => {
    vi.spyOn(fs, "readFileSync").mockImplementation(() => { throw new Error("missing boundary"); });
    expect(loadEventBoundary().boundary.features).toEqual([]);
  });
  it("requires real provenance beyond a verified flag before drawing a boundary", () => {
    expect(BoundaryRecordSchema.safeParse(boundary).success).toBe(false);
  });
  it("does not publish synthetic events copied into the real catalog", async () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(fixture));
    expect((await loadEventsCatalog()).events).toEqual([]);
  });
});
