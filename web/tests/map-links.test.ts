import { describe, expect, it } from "vitest";
import { getLocationLink, isMapAction } from "../src/lib/map-links";
import { loadSourcedDemoCatalog } from "../src/lib/content/sourced-demo";

describe("Map destinations", () => {
  it.each([
    "https://google.com/maps.evil",
    "https://google.com.evil.test/maps",
    "https://example.org/?q=maps.google.com",
    "https://example.org/maps",
    "javascript:alert(1)",
    "https://user:pass@maps.google.com/",
  ])("rejects misleading map labels and destinations: %s", (url) => {
    expect(isMapAction({ id: "map", label: "Chỉ đường", type: "external_link", url })).toBe(false);
  });
  it.each(["https://maps.google.com/?q=Da+Nang", "https://www.google.com/maps/search/?api=1&query=Da+Nang", "https://www.openstreetmap.org/?mlat=16&mlon=108"])("accepts map hosts: %s", (url) => {
    expect(isMapAction({ id: "visit", label: "Mở", type: "external_link", url })).toBe(true);
  });
  it("encodes each sourced place's own address and suppresses unavailable/synthetic data", async () => {
    const cards = await loadSourcedDemoCatalog(new Date("2026-09-19T12:00:00+07:00"));
    const places = cards.filter(c => c.type === "PLACE");
    expect(places.length).toBeGreaterThan(0);
    for (const card of places) {
      const link = getLocationLink(card)!;
      const url = new URL(link.url);
      expect(url.searchParams.get("api")).toBe("1");
      expect(url.searchParams.get("query")).toBe(`${card.title}, ${card.body!.address}`);
      expect(link.label).toContain("theo địa chỉ");
      expect(getLocationLink({ ...card, availability: "expired" })).toBeUndefined();
      expect(getLocationLink({ ...card, isSynthetic: true })).toBeUndefined();
    }
    for (const card of cards.filter(c => c.type !== "PLACE")) {
      if (!card.actions.some(isMapAction)) expect(getLocationLink(card)).toBeUndefined();
    }
  });
});
