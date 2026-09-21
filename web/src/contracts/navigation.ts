import { z } from "zod";

/**
 * 1. Lối vào hệ thống (3 Lối vào cốt lõi)
 */
export const EntryPointSchema = z.enum(["services", "places", "discover"]);
export type EntryPoint = z.infer<typeof EntryPointSchema>;

/**
 * 2. Câu hỏi làm rõ thông tin (Question Clarification)
 */
export const QuestionClarificationOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  value: z.string().min(1),
});

export const QuestionClarificationSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  helpText: z.string().optional(),
  options: z.array(QuestionClarificationOptionSchema).min(1),
  allowUnknown: z.boolean().default(true), // Luôn cho phép tùy chọn 'Tôi không biết' theo ARCHITECTURE
});

export type QuestionClarification = z.infer<typeof QuestionClarificationSchema>;

/**
 * 3. Yêu cầu điều hướng (Navigation Request)
 */
export const NavigationRequestSchema = z.object({
  entry: EntryPointSchema,
  query: z
    .string()
    .trim()
    .min(1, "Câu hỏi không được rỗng")
    .max(1000, "Câu hỏi không vượt quá 1000 ký tự")
    .optional(),
  intentId: z.string().optional(),
  answers: z.record(z.string()).default({}),
});

export type NavigationRequest = z.infer<typeof NavigationRequestSchema>;

/**
 * 4. Hành vi điều hướng trả về (Navigation Action)
 */
export const NavigationActionSchema = z.enum([
  "show_cards",
  "ask_clarification",
  "out_of_scope",
  "no_data",
  "emergency",
]);

export type NavigationAction = z.infer<typeof NavigationActionSchema>;

/**
 * 5. Kết quả điều hướng (Navigation Result)
 */
export const NavigationResultSchema = z.object({
  action: NavigationActionSchema,
  reasonCode: z.string().min(1),
  cardIds: z.array(z.string()).default([]),
  missingQuestions: z.array(QuestionClarificationSchema).default([]),
  nextAction: z.string().optional(),
  guidanceText: z.string().optional(),
});

export type NavigationResult = z.infer<typeof NavigationResultSchema>;
