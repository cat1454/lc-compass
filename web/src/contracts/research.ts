import { z } from "zod";
import { EntryPointSchema } from "./navigation";

/**
 * 1. Trích dẫn nguồn tham khảo từ bên ngoài (Citation)
 */
export const CitationSchema = z.object({
  id: z.string().min(1, "Citation ID không được để trống"),
  url: z.string().url("URL trích dẫn không hợp lệ").startsWith("https://", "URL trích dẫn bắt buộc dùng https://"),
  title: z.string().min(1, "Tiêu đề trích dẫn không được để trống"),
  snippet: z.string().optional(),
});

export type Citation = z.infer<typeof CitationSchema>;

/**
 * Khẳng định gắn với trích dẫn (Claim Mapping trong Research)
 */
export const ResearchClaimMappingSchema = z.object({
  statement: z.string().min(1, "Nội dung khẳng định không được để trống"),
  citationIds: z.array(z.string()).min(1, "Khẳng định bắt buộc phải trỏ tới ít nhất 1 citationId"),
});

export type ResearchClaimMapping = z.infer<typeof ResearchClaimMappingSchema>;

/**
 * 2. Yêu cầu tìm nguồn trực tiếp (Research Request)
 * POST /api/research
 */
export const ResearchRequestSchema = z.object({
  query: z
    .string()
    .trim()
    .min(1, "Từ khóa tìm kiếm không được để trống")
    .max(1000, "Từ khóa tìm kiếm không được vượt quá 1000 ký tự"),
  entry: EntryPointSchema,
  jurisdiction: z.string().optional(),
});

export type ResearchRequest = z.infer<typeof ResearchRequestSchema>;

/**
 * 3. Trạng thái kết quả tìm kiếm (Research Status)
 */
export const ResearchStatusSchema = z.enum([
  "ok",
  "no_evidence",
  "disabled",
  "rate_limited",
  "unavailable",
]);

export type ResearchStatus = z.infer<typeof ResearchStatusSchema>;

/**
 * 4. Phản hồi tìm nguồn trực tiếp (Research Response)
 * R06: Khi status = 'ok', bắt buộc phải có citations (>= 1) và answer có nội dung.
 */
const BaseResearchResponseSchema = z.object({
  status: ResearchStatusSchema,
  answer: z.string().default(""),
  citations: z.array(CitationSchema).default([]),
  claims: z.array(ResearchClaimMappingSchema).default([]),
  attribution: z.string().optional(),
  retrievedAt: z.string().min(1, "retrievedAt không được để trống"),
  isReferenceOnly: z.literal(true).default(true), // Luôn gắn nhãn kết quả chỉ mang tính tham khảo
});

export const ResearchResponseSchema = BaseResearchResponseSchema.superRefine((data, ctx) => {
  if (data.status === "ok") {
    if (!data.citations || data.citations.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["citations"],
        message: "Phản hồi có status 'ok' bắt buộc phải có ít nhất 1 trích dẫn (citation)",
      });
    }
    if (!data.answer || data.answer.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["answer"],
        message: "Phản hồi có status 'ok' bắt buộc phải có nội dung câu trả lời",
      });
    }
    // Bắt buộc phải có danh sách mapping khẳng định (claims >= 1) khi status = 'ok'
    if (!data.claims || data.claims.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["claims"],
        message: "Phản hồi có status 'ok' bắt buộc phải có ít nhất 1 khẳng định mapping nguồn (claims)",
      });
    } else {
      const availableCitationIds = new Set(data.citations.map((c) => c.id));
      for (let i = 0; i < data.claims.length; i++) {
        const claim = data.claims[i];
        if (!claim.citationIds || claim.citationIds.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["claims", i, "citationIds"],
            message: `Khẳng định "${claim.statement}" bắt buộc phải tham chiếu ít nhất 1 citationId`,
          });
        } else {
          for (const citId of claim.citationIds) {
            if (!availableCitationIds.has(citId)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["claims", i, "citationIds"],
                message: `Khẳng định "${claim.statement}" tham chiếu citationId "${citId}" không tồn tại trong danh sách citations`,
              });
            }
          }
        }
      }
    }
  }
});

export type ResearchResponse = z.infer<typeof ResearchResponseSchema>;
