import fs from "fs";
import path from "path";
import { ContentAvailability, ContentCard, ContentCardSchema, PublicCardDTO } from "../../contracts/card";
import { toPublicCardDTO, validateContentCard } from "../../contracts/validator";
import { readCsvCards } from "./csv";

/** Explicit catalog boundary: never fall back to fixtures or unreviewed content. */
export function readCardDirectory(directory: string): ContentCard[] {
  const dir = path.join(process.cwd(), "content", directory);
  if (!fs.existsSync(dir)) return [];
  const cards: ContentCard[] = [];
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
    const parsed: unknown = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
    for (const item of Array.isArray(parsed) ? parsed : [parsed]) cards.push(ContentCardSchema.parse(item));
  }
  if (new Set(cards.map((c) => c.id)).size !== cards.length) throw new Error(`Duplicate card ID in ${directory}`);
  return cards;
}

export async function loadRawCards(): Promise<ContentCard[]> {
  return readCsvCards();
}

function officialCard(card: ContentCard, asOfDate: Date): boolean {
  return !card.isSynthetic && ["published", "withdrawn"].includes(card.review.status)
    && validateContentCard(card, { isPublishedTarget: true, asOfDate }).valid;
}

export async function loadPublicCatalog(options: { asOfDate?: Date; includeUnavailable?: boolean } = {}): Promise<PublicCardDTO[]> {
  const now = options.asOfDate ?? new Date();
  return (await loadRawCards()).filter((c) => officialCard(c, now))
    .map((c) => toPublicCardDTO(c, now))
    .filter((c) => options.includeUnavailable || c.availability === "available");
}

export async function getPublicCardById(cardId: string, options: { asOfDate?: Date } = {}): Promise<{
  card?: PublicCardDTO; availability: ContentAvailability; message?: string;
}> {
  const now = options.asOfDate ?? new Date();
  const raw = (await loadRawCards()).find((c) => c.id === cardId && officialCard(c, now));
  if (!raw) return { availability: "not_found" };
  const card = toPublicCardDTO(raw, now);
  return { card, availability: card.availability, message: card.availabilityMessage };
}
