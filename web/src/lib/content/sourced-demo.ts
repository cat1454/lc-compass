import { ContentCard, PublicCardDTO, PublicCardDTOSchema } from "../../contracts/card";
import { toPublicCardDTO, validateContentCard } from "../../contracts/validator";
import { readCardDirectory } from "./loader";

/** Demo projection keeps review.status intact; it never approves a card. */
export function toSourcedDemoDTO(card: ContentCard, now = new Date()): PublicCardDTO | undefined {
  if (card.isSynthetic || card.review.status !== "review" || !Number.isFinite(now.getTime())) return undefined;
  if (!validateContentCard(card, { asOfDate: now }).valid) return undefined;
  if (card.sources.some((s) => !s.relevantExcerpt?.trim() || !Number.isFinite(Date.parse(s.fetchedAt)) || Date.parse(s.fetchedAt) > now.getTime())) return undefined;
  if (!card.body.claimsWithSources.length) return undefined;
  const expired = now.getTime() > new Date(`${card.review.reviewDue}T23:59:59.999+07:00`).getTime();
  const base = toPublicCardDTO(card, now);
  return PublicCardDTOSchema.parse({
    ...base,
    availability: expired ? "expired" : "available",
    displayStatus: expired ? "unavailable" : "sourced_pending",
    availabilityMessage: expired ? "Nội dung đã quá hạn rà soát; tạm ẩn chi tiết." : undefined,
    body: expired ? undefined : card.body,
    actions: expired ? [] : card.actions,
    review: { status: "review", reviewDue: card.review.reviewDue, isVerified: false },
  });
}

export async function loadSourcedDemoCatalog(now = new Date()): Promise<PublicCardDTO[]> {
  return readCardDirectory("sourced-demo").map((c) => toSourcedDemoDTO(c, now))
    .filter((c): c is PublicCardDTO => !!c && c.availability === "available");
}

export async function getSourcedDemoCard(id: string, now = new Date()): Promise<PublicCardDTO | undefined> {
  const raw = readCardDirectory("sourced-demo").find((c) => c.id === id);
  return raw ? toSourcedDemoDTO(raw, now) : undefined;
}
