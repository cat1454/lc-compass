import { z } from "zod";

export const EventCategorySchema = z.enum([
  "event_innovation", // Công nghệ, Chuyển đổi số, Khởi nghiệp
  "event_community",  // Hoạt động Đoàn - Hội, Tình nguyện, Dân sinh
  "event_sports",     // Thể thao phong trào, Giải bóng đá, Chạy bộ
  "event_education",  // Ngày hội tuyển dụng, Học thuật, Workshop
  "event_culture",    // Lễ hội truyền thống, Đình làng, Cầu ngư, Ẩm thực đêm
]);

export type EventCategory = z.infer<typeof EventCategorySchema>;

export const EventStatusSchema = z.enum([
  "scheduled",
  "updated",
  "cancelled",
  "postponed",
  "expired",
]);

export type EventStatus = z.infer<typeof EventStatusSchema>;

export const EventVerificationStatusSchema = z.enum([
  "unverified",
  "source_verified",
  "human_verified",
]);

export type EventVerificationStatus = z.infer<typeof EventVerificationStatusSchema>;

export const EventImageSchema = z.object({
  src: z.string().url().refine(url => new URL(url).protocol === "https:", "Ảnh phải dùng HTTPS"),
  alt: z.string().min(1),
  kind: z.enum(["event", "venue"]),
  sourceUrl: z.string().url(),
  credit: z.string().min(1),
  checkedAt: z.string().datetime({ offset: true }),
});

export const EventSourceSchema = z.object({
  url: z.string().url(),
  title: z.string().min(1),
  publisher: z.string().min(1),
  publishedAt: z.string().optional(),
  checkedAt: z.string().datetime({ offset: true }),
  accessStatus: z.enum(["read", "blocked", "snippet_only"]),
  kind: z.enum(["organizer", "government", "map", "platform", "media", "community"]),
  supports: z.array(z.enum(["time", "venue", "organizer", "ward", "coordinates", "status", "recurrence", "price"])),
  evidence: z.string().min(1),
});

export const EventItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().optional(),
  category: EventCategorySchema,
  categoryLabel: z.string().min(1),
  venueName: z.string().min(1),
  address: z.string().min(1),
  ward: z.literal("Phường Liên Chiểu"),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  startAt: z.union([z.string().date(), z.string().datetime({ offset: true })]),
  endAt: z.union([z.string().date(), z.string().datetime({ offset: true })]).optional(),
  datePrecision: z.enum(["exact", "date_only", "recurring"]),
  organizer: z.string().min(1),
  targetAudience: z.string().optional(),
  priceText: z.string().default("Chưa có thông tin chi phí"),
  sourceUrl: z.string().url(),
  sourcePublisher: z.string().min(1),
  evidenceText: z.string().min(1),
  verificationStatus: EventVerificationStatusSchema.default("unverified"),
  confidenceScore: z.number().min(0).max(1).optional(),
  status: EventStatusSchema.default("scheduled"),
  isFeatured: z.boolean().default(true),
  registrationUrl: z.string().url().optional(),
  image: EventImageSchema.optional(),
  sources: z.array(EventSourceSchema).optional(),
  checkedAt: z.string().datetime({ offset: true }).optional(),
  coordinatePrecision: z.enum(["venue", "campus"]).optional(),
  coordinateNote: z.string().optional(),
  // Explicit, finite dates only; absence never means "every day".
  recurrence: z.object({ dates: z.array(z.string().date()).min(1) }).optional(),
});

export type EventItem = z.infer<typeof EventItemSchema>;

export const EventsCatalogSchema = z.object({
  version: z.string(),
  asOfDate: z.string(),
  ward: z.literal("Phường Liên Chiểu"),
  totalEvents: z.number().int().nonnegative(),
  events: z.array(EventItemSchema),
});

export type EventsCatalog = z.infer<typeof EventsCatalogSchema>;

export const EventCandidateSchema = z.object({
  id: z.string().min(1),
  origin: z.enum(["legacy", "discovered"]),
  proposed: EventItemSchema.partial(),
  sources: z.array(EventSourceSchema),
  checkedAt: z.string().datetime({ offset: true }),
  reviewStatus: z.enum(["pending", "approved", "rejected"]),
  reasons: z.array(z.string()),
});
export type EventCandidate = z.infer<typeof EventCandidateSchema>;
export const EventCollectionSchema = z.object({
  window: z.object({ from: z.string().date(), through: z.string().date() }),
  checkedAt: z.string().datetime({ offset: true }),
  candidates: z.array(EventCandidateSchema),
});
