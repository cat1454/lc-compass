import { PublicCardDTO } from "../../contracts/card";
import { removeVietnameseTones } from "./search";

export function searchPreview(card: PublicCardDTO, query: string): string {
  const parts = [card.title];
  if (card.type === "SERVICE" && card.body) parts.push(card.body.summary, ...card.body.steps.map((s) => `${s.title}: ${s.description}`));
  if (card.type === "PLACE" && card.body) parts.push(card.body.address, card.body.function);
  if (card.type === "DISCOVER" && card.body) parts.push(card.body.story, card.body.locality);
  parts.push(...card.applicability, ...(card.keywords ?? []).map((k) => `Từ khóa biên tập: ${k}`), card.jurisdiction.label);
  const tokens = removeVietnameseTones(query).split(/\s+/).filter(Boolean);
  const scored = parts.map((text) => ({ text, score: tokens.filter((t) => removeVietnameseTones(text).includes(t)).length }));
  scored.sort((a, b) => b.score - a.score);
  const selected = query.trim() ? scored[0].text : parts[1] ?? parts[0];
  const normalized = removeVietnameseTones(selected);
  const at = Math.max(0, normalized.indexOf(tokens[0] ?? ""));
  const start = Math.max(0, at - 65);
  return `${start ? "…" : ""}${selected.slice(start, start + 260)}${selected.length > start + 260 ? "…" : ""}`;
}
