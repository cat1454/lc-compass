import type { PublicCardDTO } from "../contracts/card";

/** Check the destination, never infer a map from an action label. */
export function isMapAction(action: PublicCardDTO["actions"][number]): boolean {
  if (action.type !== "external_link" || !action.url) return false;
  try {
    const url = new URL(action.url);
    if (url.protocol !== "https:" || url.username || url.password || url.port) return false;
    return url.hostname === "maps.google.com" ||
      ((url.hostname === "google.com" || url.hostname === "www.google.com") && /^\/maps(?:\/|$)/.test(url.pathname)) ||
      ((url.hostname === "openstreetmap.org" || url.hostname === "www.openstreetmap.org") && url.pathname === "/");
  } catch {
    return false;
  }
}

export function getLocationLink(card: PublicCardDTO) {
  if (card.availability !== "available" || !card.body || card.isSynthetic || !card.sources.length) return undefined;
  // Address search does not assert verified coordinates or a verified routing destination.
  if (card.type === "PLACE") {
    const address = card.body.address.trim();
    if (!address || /chưa (?:rõ|xác minh)|không rõ/i.test(address)) return undefined;
    const url = new URL("https://www.google.com/maps/search/");
    url.search = new URLSearchParams({ api: "1", query: `${card.title}, ${address}` }).toString();
    if (url.href.length > 2048) return undefined;
    return { url: url.href, label: "Tìm trên Google Maps theo địa chỉ" };
  }
  // A locality is not a specific destination; SERVICE/DISCOVER require an explicit action.
  const action = card.actions.find(isMapAction);
  return action?.url ? { url: action.url, label: "Mở liên kết bản đồ" } : undefined;
}
