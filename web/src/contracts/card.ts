import { z } from "zod";

/**
 * Hàm kiểm tra ngày lịch thực tế (tránh ngày giả như 2026-99-99, 2026-02-30)
 */
export function isValidCalendarDate(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const [year, month, day] = dateStr.split("-").map(Number);
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export const DateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày phải theo định dạng YYYY-MM-DD");

/**
 * 1. Nguồn thông tin (Source)
 * Mỗi nguồn phải có URL HTTPS an toàn, đơn vị công bố và ngày truy cập.
 */
export const SourceSchema = z.object({
  id: z.string().min(1, "Source ID không được để trống"),
  url: z.string().url("URL nguồn không hợp lệ").startsWith("https://", "URL nguồn bắt buộc phải dùng giao thức https://"),
  title: z.string().min(1, "Tiêu đề nguồn không được để trống"),
  publisher: z.string().min(1, "Đơn vị công bố không được để trống"),
  relevantExcerpt: z.string().optional(),
  sourceDate: DateStringSchema.optional(),
  fetchedAt: z.string().min(1, "Ngày truy cập không được để trống"),
});

export type Source = z.infer<typeof SourceSchema>;

/**
 * 2. Trạng thái rà soát (Review)
 * Quy định: Thẻ published bắt buộc phải có reviewer và reviewedAt.
 */
export const ReviewStatusSchema = z.enum(["draft", "review", "published", "withdrawn"]);
export type ReviewStatus = z.infer<typeof ReviewStatusSchema>;

export const ReviewSchema = z.object({
  status: ReviewStatusSchema,
  owner: z.string().min(1, "Người phụ trách nội dung không được để trống"),
  reviewer: z.string().optional(),
  reviewedAt: DateStringSchema.optional(),
  reviewDue: DateStringSchema,
  notes: z.string().optional(), // Ghi chú nội bộ, bị loại bỏ trong Public DTO
});

export type Review = z.infer<typeof ReviewSchema>;

/**
 * 3. Hành động tiếp theo (Action)
 * Liên kết hoặc đầu mối chính thức, chỉ dùng URL đã kiểm chứng.
 */
export const ActionTypeSchema = z.enum(["external_link", "phone", "in_person", "checklist_action"]);
export type ActionType = z.infer<typeof ActionTypeSchema>;

export const ActionSchema = z.object({
  id: z.string().min(1),
  type: ActionTypeSchema,
  label: z.string().min(1, "Nhãn hành động không được để trống"),
  url: z.string().url().startsWith("https://", "URL hành động bắt buộc dùng https://").optional(),
  contact: z.string().optional(),
  fallback: z.string().optional(),
});

export type Action = z.infer<typeof ActionSchema>;

/**
 * 4. Khẳng định có gắn nguồn (Claim with Source)
 * Mỗi khẳng định quan trọng phải tham chiếu tới Source ID hợp lệ.
 */
export const ClaimWithSourceSchema = z.object({
  id: z.string().min(1),
  claim: z.string().min(1, "Nội dung khẳng định không được để trống"),
  sourceId: z.string().min(1, "Source ID tham chiếu không được để trống"),
});

export type ClaimWithSource = z.infer<typeof ClaimWithSourceSchema>;

/**
 * 5.1 Thân thẻ Thủ tục (SERVICE)
 * Hỗ trợ các bước tuần tự hoặc phân nhánh theo điều kiện
 */
export const StepBranchConditionSchema = z.object({
  questionId: z.string().min(1, "questionId không được để trống"),
  equals: z.string().min(1, "giá trị so sánh không được để trống"),
});

export const StepBranchSchema = z
  .object({
    when: StepBranchConditionSchema.optional(),
    condition: StepBranchConditionSchema.optional(),
    nextStepId: z.string().min(1, "nextStepId của nhánh không được để trống"),
    label: z.string().optional(),
  })
  .refine((b) => (b.when !== undefined) !== (b.condition !== undefined), {
    message:
      "Nhánh rẽ bắt buộc phải có đúng một trong hai trường 'when' hoặc 'condition' (không được đồng thời chứa cả 'when' và 'condition' hoặc thiếu cả hai)",
  });

export type StepBranch = z.infer<typeof StepBranchSchema>;

export const ServiceStepTypeSchema = z.enum(["procedural", "ui_guidance"]);
export type ServiceStepType = z.infer<typeof ServiceStepTypeSchema>;

export const ServiceStepSchema = z.object({
  id: z.string().min(1),
  stepNumber: z.number().int().positive(),
  stepType: ServiceStepTypeSchema.default("procedural"),
  title: z.string().min(1, "Tiêu đề bước không được để trống"),
  description: z.string().min(1),
  requiredDocs: z.array(z.string()).default([]),
  claimIds: z.array(z.string()).default([]),
  branches: z.array(StepBranchSchema).default([]),
  nextStepId: z.string().optional(),
});

export type ServiceStep = z.infer<typeof ServiceStepSchema>;

export const ServiceQuestionOptionSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});

export const ServiceQuestionSchema = z.object({
  id: z.string().min(1),
  prompt: z.string().min(1),
  options: z.array(ServiceQuestionOptionSchema).min(1),
  unknownOption: z
    .object({
      value: z.string().default("unknown"),
      label: z.string().default("Tôi chưa rõ / Không biết thông tin này"),
      guidance: z.string().min(1),
    })
    .optional(),
});

export type ServiceQuestion = z.infer<typeof ServiceQuestionSchema>;

export const ServiceBodySchema = z.object({
  summary: z.string().min(1),
  questions: z.array(ServiceQuestionSchema).default([]),
  steps: z.array(ServiceStepSchema).min(1, "Hành trình thủ tục phải có ít nhất 1 bước"),
  unknownOption: z.object({
    label: z.string().default("Tôi chưa rõ / Không biết thông tin này"),
    guidance: z.string().min(1, "Hướng dẫn khi người dùng chưa rõ thông tin"),
  }),
  missingQuestions: z.array(z.string()).default([]),
  claimsWithSources: z.array(ClaimWithSourceSchema).default([]),
});

export type ServiceBody = z.infer<typeof ServiceBodySchema>;

/**
 * 5.2 Thân thẻ Địa điểm (PLACE)
 */
export const PlaceBodySchema = z.object({
  function: z.string().min(1, "Chức năng phục vụ không được để trống"),
  address: z.string().min(1, "Địa chỉ không được để trống"),
  jurisdictionDetail: z.string().min(1),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  openingHours: z.string().default("Không rõ giờ"),
  contactPhone: z.string().optional(),
  claimsWithSources: z.array(ClaimWithSourceSchema).default([]),
});

export type PlaceBody = z.infer<typeof PlaceBodySchema>;

/**
 * 5.3 Thân thẻ Khám phá (DISCOVER)
 */
export const DiscoverBodySchema = z.object({
  story: z.string().min(1, "Nội dung câu chuyện/giới thiệu không được để trống"),
  locality: z.string().min(1, "Địa bàn không được để trống"),
  authorOrSource: z.string().min(1, "Tác giả hoặc nguồn tài liệu không được để trống"),
  mediaRights: z.string().min(1, "Quyền sử dụng hình ảnh/tư liệu không được để trống"),
  imageUrl: z.string().url().startsWith("https://").optional(),
  claimsWithSources: z.array(ClaimWithSourceSchema).default([]),
});

export type DiscoverBody = z.infer<typeof DiscoverBodySchema>;

/**
 * 6. Thẻ nội dung hoàn chỉnh (ContentCard)
 */
export const CardTypeSchema = z.enum(["SERVICE", "PLACE", "DISCOVER"]);
export type CardType = z.infer<typeof CardTypeSchema>;

const BaseCardSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "ID chỉ gồm chữ thường, số và dấu gạch ngang"),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "Version phải theo định dạng semver X.Y.Z"),
  title: z.string().min(1, "Tiêu đề thẻ không được để trống"),
  intentIds: z.array(z.string()).min(1, "Thẻ phải liên kết với ít nhất 1 intentId"),
  jurisdiction: z.object({
    id: z.string().min(1),
    label: z.string().min(1),
  }),
  applicability: z.array(z.string()).default([]),
  exclusions: z.array(z.string()).default([]),
  sources: z.array(SourceSchema).min(1, "Thẻ phải có ít nhất 1 nguồn thông tin đã xác minh"),
  review: ReviewSchema,
  actions: z.array(ActionSchema).default([]),
  isSynthetic: z.boolean().default(false),
  keywords: z.array(z.string()).optional(),
});

export const ServiceCardSchema = BaseCardSchema.extend({
  type: z.literal("SERVICE"),
  body: ServiceBodySchema,
});

export const PlaceCardSchema = BaseCardSchema.extend({
  type: z.literal("PLACE"),
  body: PlaceBodySchema,
});

export const DiscoverCardSchema = BaseCardSchema.extend({
  type: z.literal("DISCOVER"),
  body: DiscoverBodySchema,
});

export const ContentCardSchema = z.discriminatedUnion("type", [
  ServiceCardSchema,
  PlaceCardSchema,
  DiscoverCardSchema,
]);

export type ServiceCard = z.infer<typeof ServiceCardSchema>;
export type PlaceCard = z.infer<typeof PlaceCardSchema>;
export type DiscoverCard = z.infer<typeof DiscoverCardSchema>;
export type ContentCard = z.infer<typeof ContentCardSchema>;

/**
 * 7. Trạng thái khả dụng của thẻ (ContentAvailability)
 */
export const ContentAvailabilitySchema = z.enum(["available", "expired", "withdrawn", "not_found"]);
export type ContentAvailability = z.infer<typeof ContentAvailabilitySchema>;

/**
 * 8. Public Card DTO
 * Ràng buộc nghiêm ngặt:
 * - Khi availability !== "available": body là undefined, actions rỗng, isVerified = false
 * - Khi isSynthetic === true: isVerified = false
 */
export const PublicReviewInfoSchema = z.object({
  status: ReviewStatusSchema,
  reviewedAt: z.string().optional(),
  reviewDue: z.string(),
  isVerified: z.boolean(),
});

const BasePublicCardDTOSchema = z.object({
  id: z.string(),
  version: z.string(),
  title: z.string(),
  intentIds: z.array(z.string()),
  jurisdiction: z.object({
    id: z.string(),
    label: z.string(),
  }),
  applicability: z.array(z.string()),
  exclusions: z.array(z.string()),
  sources: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      title: z.string(),
      publisher: z.string(),
      sourceDate: z.string().optional(),
      fetchedAt: z.string().optional(),
      relevantExcerpt: z.string().optional(),
    })
  ),
  review: PublicReviewInfoSchema,
  actions: z.array(ActionSchema),
  availability: ContentAvailabilitySchema,
  availabilityMessage: z.string().optional(),
  isSynthetic: z.boolean(),
  keywords: z.array(z.string()).optional(),
  displayStatus: z.enum(["sourced_pending", "reviewed", "synthetic", "unavailable"]).optional(),
});

export const PublicServiceCardDTOSchema = BasePublicCardDTOSchema.extend({
  type: z.literal("SERVICE"),
  body: ServiceBodySchema.optional(),
});

export const PublicPlaceCardDTOSchema = BasePublicCardDTOSchema.extend({
  type: z.literal("PLACE"),
  body: PlaceBodySchema.optional(),
});

export const PublicDiscoverCardDTOSchema = BasePublicCardDTOSchema.extend({
  type: z.literal("DISCOVER"),
  body: DiscoverBodySchema.optional(),
});

const DiscriminatedPublicCardDTOSchema = z.discriminatedUnion("type", [
  PublicServiceCardDTOSchema,
  PublicPlaceCardDTOSchema,
  PublicDiscoverCardDTOSchema,
]);

// Ràng buộc tính nhất quán availability với body, actions và isVerified
export const PublicCardDTOSchema = DiscriminatedPublicCardDTOSchema.superRefine((data, ctx) => {
  if (data.displayStatus === "sourced_pending" && (data.isSynthetic || data.review.status !== "review" || data.review.isVerified || data.availability !== "available")) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["displayStatus"], message: "Nhãn có nguồn chờ rà soát chỉ dành cho dữ liệu thật ở trạng thái review, chưa xác minh." });
  }
  if (data.availability !== "available") {
    if (data.body !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["body"],
        message: "Thẻ không ở trạng thái available không được phép chứa nội dung chi tiết body",
      });
    }
    if (data.actions && data.actions.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["actions"],
        message: "Thẻ không ở trạng thái available không được phép chứa danh sách actions",
      });
    }
    if (data.review.isVerified === true) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["review", "isVerified"],
        message: "Thẻ không ở trạng thái available không thể có nhãn xác minh isVerified: true",
      });
    }
  }

  if (data.isSynthetic === true && data.review.isVerified === true) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["review", "isVerified"],
      message: "Dữ liệu mẫu giả lập (isSynthetic: true) tuyệt đối không được có nhãn xác minh isVerified: true",
    });
  }
});

export type PublicServiceCardDTO = z.infer<typeof PublicServiceCardDTOSchema>;
export type PublicPlaceCardDTO = z.infer<typeof PublicPlaceCardDTOSchema>;
export type PublicDiscoverCardDTO = z.infer<typeof PublicDiscoverCardDTOSchema>;
export type PublicCardDTO = z.infer<typeof PublicCardDTOSchema>;
