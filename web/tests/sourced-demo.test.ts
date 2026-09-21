import * as csv from "../src/lib/content/csv";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContentCardSchema } from "../src/contracts/card";
import { validateContentCard } from "../src/contracts/validator";
import { getPublicCardById, loadPublicCatalog, loadRawCards } from "../src/lib/content/loader";
import { getSourcedDemoCard, loadSourcedDemoCatalog, toSourcedDemoDTO } from "../src/lib/content/sourced-demo";
import { searchCatalog } from "../src/lib/navigation/search";
import { searchPreview } from "../src/lib/navigation/search-preview";
import raw from "../content/sourced-demo/cards.json";

const now = new Date("2026-09-19T12:00:00+07:00");
const cards = raw.map((c) => ContentCardSchema.parse(c));
afterEach(() => vi.restoreAllMocks());

describe("Real-source demo and official publication boundary", () => {
  it("has evidence, real calendar dates and claim-source references without invented approvals", () => {
    for (const card of cards) {
      expect(validateContentCard(card, { asOfDate: now }).valid).toBe(true);
      expect(card.review.status).toBe("review");
      expect(card.review.reviewer).toBeUndefined();
      expect(card.review.reviewedAt).toBeUndefined();
      expect(card.isSynthetic).toBe(false);
      expect(card.title).not.toContain("?");
      const dto = toSourcedDemoDTO(card, now)!;
      expect(dto.displayStatus).toBe("sourced_pending");
      expect(dto.review.isVerified).toBe(false);
      expect(dto.body).toBeDefined();
      expect(dto.sources.every((s) => s.fetchedAt && s.relevantExcerpt)).toBe(true);
    }
  });
  it("searches accented/unaccented name, body, address, edited keywords and snippets", async () => {
    const catalog = await loadSourcedDemoCatalog(now);
    expect(searchCatalog("tạm trú", catalog).results[0]?.id).toBe("service-chuan-bi-tam-tru");
    for (const [a, b] of [["tạm trú", "tam tru"], ["ký túc xá", "ky tuc xa"], ["Lạc Long Quân", "lac long quan"], ["một cửa", "mot cua"]]) {
      const results = searchCatalog(a, catalog).results;
      expect(results.length).toBeGreaterThan(0);
      expect(searchCatalog(b, catalog).results.map((c) => c.id)).toEqual(results.map((c) => c.id));
    }
    const place = searchCatalog("68 lac long quan", catalog).results[0];
    expect(searchPreview(place, "68 lac long quan")).toContain("Lạc Long Quân");
    expect(searchPreview(place, "mot cua")).toContain("một cửa");
    expect(searchCatalog("khong-co-du-lieu-98765", catalog).results).toEqual([]);
  });
  it("loads 24 officially reviewed cards from published catalog", async () => {
    expect((await loadRawCards()).length).toBe(24);
    expect((await loadPublicCatalog({ includeUnavailable: true, asOfDate: now })).length).toBe(24);
    for (const card of cards) {
      const pub = await getPublicCardById(card.id, { asOfDate: now });
      expect(pub.availability).toBe("available");
      expect(pub.card).toBeDefined();
    }
    expect((await getPublicCardById("unknown-card-id")).availability).toBe("not_found");
  });
  it("rejects pending/synthetic cards accidentally placed inside published", async () => {
    vi.spyOn(csv, "readCsvCards").mockReturnValue(cards);
    expect(await loadPublicCatalog({ includeUnavailable: true, asOfDate: now })).toEqual([]);
    expect((await getPublicCardById(cards[0].id, { asOfDate: now })).availability).toBe("not_found");
    const synthetic = { ...cards[0], isSynthetic: true, review: { ...cards[0].review, status: "published", reviewer: "Test fixture", reviewedAt: "2026-09-19" } };
    vi.mocked(csv.readCsvCards).mockReturnValue([ContentCardSchema.parse(synthetic)]);
    expect(await loadPublicCatalog({ asOfDate: now })).toEqual([]);
  });
  it("accepts properly reviewed official data but removes body after expiry", async () => {
    const approved = { ...cards[0], review: { ...cards[0].review, status: "published", reviewer: "Test fixture only", reviewedAt: "2026-09-19" } };
    vi.spyOn(csv, "readCsvCards").mockReturnValue([ContentCardSchema.parse(approved)]);
    expect((await loadPublicCatalog({ asOfDate: now }))[0].review.isVerified).toBe(true);
    const result = await getPublicCardById(approved.id, { asOfDate: new Date("2027-01-01") });
    expect(result.availability).toBe("expired");
    expect(result.card?.body).toBeUndefined();
    expect((await getPublicCardById(`${approved.id}-valid`, { asOfDate: now })).availability).toBe("not_found");
  });
  it("expires at end of ICT day and omits expired cards from search", async () => {
    expect(toSourcedDemoDTO(cards[0], new Date("2026-10-19T16:59:59.999Z"))?.availability).toBe("available");
    const future = new Date("2026-10-19T17:00:00Z");
    const expired = await getSourcedDemoCard(cards[0].id, future);
    expect(expired?.availability).toBe("expired");
    expect(expired?.body).toBeUndefined();
    expect(expired?.actions).toEqual([]);
    expect(await loadSourcedDemoCatalog(future)).toEqual([]);
  });
  it("rejects missing evidence, invalid dates, withdrawn/draft/synthetic input", () => {
    for (const status of ["draft", "withdrawn", "published"] as const) expect(toSourcedDemoDTO({ ...cards[0], review: { ...cards[0].review, status } }, now)).toBeUndefined();
    expect(toSourcedDemoDTO({ ...cards[0], isSynthetic: true }, now)).toBeUndefined();
    expect(toSourcedDemoDTO({ ...cards[0], review: { ...cards[0].review, reviewDue: "2026-02-30" } }, now)).toBeUndefined();
    expect(toSourcedDemoDTO({ ...cards[0], sources: cards[0].sources.map((s) => ({ ...s, relevantExcerpt: "" })) }, now)).toBeUndefined();
    expect(toSourcedDemoDTO(cards[0], new Date("invalid"))).toBeUndefined();
  });
});
