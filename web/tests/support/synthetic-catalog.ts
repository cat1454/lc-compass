// Legacy routing/branching tests explicitly use synthetic content, never the public loader.
import { ContentCardSchema } from "../../src/contracts/card";
import { toPublicCardDTO } from "../../src/contracts/validator";
import raw from "../../content/demo/cards.json";

export async function loadRawCards() { return raw.map((c) => ContentCardSchema.parse(c)); }
export async function loadPublicCatalog() { return (await loadRawCards()).map((c) => toPublicCardDTO(c)); }
export async function getPublicCardById(id: string, options: { asOfDate?: Date } = {}) {
  const raw = (await loadRawCards()).find((c) => c.id === id);
  if (!raw) return { availability: "not_found" as const, card: undefined, message: undefined };
  const card = toPublicCardDTO(raw, options.asOfDate);
  return { card, availability: card.availability, message: card.availabilityMessage };
}
