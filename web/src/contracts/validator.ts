import {
  ContentCard,
  ContentCardSchema,
  ContentAvailability,
  PublicCardDTO,
  PublicCardDTOSchema,
  isValidCalendarDate,
} from "./card";

export interface ValidationIssue {
  cardId?: string;
  field?: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  card?: ContentCard;
  issues: ValidationIssue[];
}

/**
 * Tính toán mốc thời gian cuối ngày (23:59:59.999) theo múi giờ Việt Nam Asia/Ho_Chi_Minh (UTC+7).
 * 23:59:59.999 ICT tương đương 16:59:59.999 UTC cùng ngày.
 */
export function parseEndOfDayICT(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 16, 59, 59, 999));
}

/**
 * Format Date sang chuỗi YYYY-MM-DD theo múi giờ Asia/Ho_Chi_Minh (UTC+7).
 */
export function formatCalendarDateICT(date: Date): string {
  const ictDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  return ictDate.toISOString().slice(0, 10);
}

/**
 * Kiểm tra tính toàn vẹn và hợp lệ của một thẻ nội dung (ContentCard).
 * Mặc định asOfDate là thời điểm hiện tại (now) để ngăn chặn ngày duyệt tương lai ngay trong cấu hình mặc định.
 */
export function validateContentCard(
  rawCard: unknown,
  options: { isPublishedTarget?: boolean; asOfDate?: Date } = {}
): ValidationResult {
  const issues: ValidationIssue[] = [];
  const asOfDate = options.asOfDate ?? new Date();

  // 1. Kiểm tra cấu trúc cơ bản theo Zod Schema
  const parseResult = ContentCardSchema.safeParse(rawCard);
  if (!parseResult.success) {
    for (const error of parseResult.error.errors) {
      issues.push({
        field: error.path.join("."),
        message: error.message,
      });
    }
    return { valid: false, issues };
  }

  const card = parseResult.data;
  const cardId = card.id;

  // 2. R03: Kiểm tra tính hợp lệ của ngày tháng và thứ tự ngày
  if (!isValidCalendarDate(card.review.reviewDue)) {
    issues.push({
      cardId,
      field: "review.reviewDue",
      message: `Hạn rà soát "${card.review.reviewDue}" không phải là ngày lịch thực tế`,
    });
  }

  if (card.review.reviewedAt) {
    if (!isValidCalendarDate(card.review.reviewedAt)) {
      issues.push({
        cardId,
        field: "review.reviewedAt",
        message: `Ngày rà soát "${card.review.reviewedAt}" không phải là ngày lịch thực tế`,
      });
    } else {
      // Kiểm tra thứ tự: reviewedAt không được sau reviewDue
      if (card.review.reviewedAt > card.review.reviewDue) {
        issues.push({
          cardId,
          field: "review.reviewedAt",
          message: `Ngày rà soát (${card.review.reviewedAt}) không được sau hạn rà soát reviewDue (${card.review.reviewDue})`,
        });
      }

      // R03 & Feedback: Mặc định asOfDate chặn ngày rà soát tương lai (ví dụ 2099-01-01)
      const asOfDateICT = formatCalendarDateICT(asOfDate);
      if (card.review.reviewedAt > asOfDateICT) {
        issues.push({
          cardId,
          field: "review.reviewedAt",
          message: `Ngày rà soát (${card.review.reviewedAt}) không thể ở tương lai so với mốc kiểm tra (${asOfDateICT})`,
        });
      }
    }
  }

  // 3. R01 & R02: Quy định nghiêm ngặt với thẻ published
  const isTargetingPublish = options.isPublishedTarget || card.review.status === "published";
  if (isTargetingPublish) {
    if (!card.review.reviewer || card.review.reviewer.trim().length === 0) {
      issues.push({
        cardId,
        field: "review.reviewer",
        message: "Thẻ ở trạng thái published bắt buộc phải có người rà soát (reviewer) xác nhận",
      });
    }
    if (!card.review.reviewedAt || card.review.reviewedAt.trim().length === 0) {
      issues.push({
        cardId,
        field: "review.reviewedAt",
        message: "Thẻ ở trạng thái published bắt buộc phải có ngày rà soát (reviewedAt)",
      });
    }
    // R01: Không cho phép phát hành dữ liệu giả lập (synthetic)
    if (card.isSynthetic && options.isPublishedTarget) {
      issues.push({
        cardId,
        field: "isSynthetic",
        message: "Thẻ mang nhãn giả định (synthetic/fixture) không thể phát hành vào catalog chính thức",
      });
    }
  }

  // 4. R02: Kiểm tra tính duy nhất và hợp lệ của Source IDs và Claim IDs
  const sourceIds = new Set<string>();
  for (const s of card.sources) {
    if (sourceIds.has(s.id)) {
      issues.push({
        cardId,
        field: "sources",
        message: `Trùng lặp sourceId: "${s.id}" xuất hiện nhiều lần trong thẻ`,
      });
    }
    sourceIds.add(s.id);
  }

  const claimIds = new Set<string>();
  for (const c of card.body.claimsWithSources) {
    if (claimIds.has(c.id)) {
      issues.push({
        cardId,
        field: "body.claimsWithSources",
        message: `Trùng lặp claimId: "${c.id}" xuất hiện nhiều lần trong thẻ`,
      });
    }
    claimIds.add(c.id);

    // Kiểm tra claim -> source
    if (!sourceIds.has(c.sourceId)) {
      issues.push({
        cardId,
        field: `body.claimsWithSources.${c.id}`,
        message: `Khẳng định "${c.claim}" tham chiếu tới sourceId "${c.sourceId}" không tồn tại trong danh sách sources`,
      });
    }
  }

  // 5. R02 & R05: Kiểm tra cấu trúc nội dung chi tiết theo từng loại thẻ
  if (card.type === "SERVICE") {
    const stepIds = new Set(card.body.steps.map((s) => s.id));
    if (stepIds.size !== card.body.steps.length) {
      issues.push({
        cardId,
        field: "body.steps",
        message: "Các bước trong thẻ thủ tục phải có ID duy nhất",
      });
    }

    // R02: Kiểm tra step -> claim và bằng chứng nghiệp vụ
    for (const step of card.body.steps) {
      // Kiểm tra claimIds của step phải tồn tại trong claimsWithSources
      for (const cId of step.claimIds) {
        if (!claimIds.has(cId)) {
          issues.push({
            cardId,
            field: `body.steps.${step.id}.claimIds`,
            message: `Bước "${step.id}" tham chiếu claimId "${cId}" không tồn tại trong claimsWithSources`,
          });
        }
      }

      // R02: Nếu là thẻ published, bước nghiệp vụ (procedural) bắt buộc phải có ít nhất 1 bằng chứng gắn nguồn
      if (isTargetingPublish && step.stepType === "procedural" && step.claimIds.length === 0) {
        issues.push({
          cardId,
          field: `body.steps.${step.id}.claimIds`,
          message: `Bước nghiệp vụ "${step.id}" của thẻ published bắt buộc phải có ít nhất 1 bằng chứng trích dẫn (claimId)`,
        });
      }

      // Kiểm tra nextStepId
      if (step.nextStepId && !stepIds.has(step.nextStepId)) {
        issues.push({
          cardId,
          field: `body.steps.${step.id}.nextStepId`,
          message: `Bước "${step.id}" trỏ tới nextStepId "${step.nextStepId}" không tồn tại trong danh sách bước`,
        });
      }

      // R05 & Feedback: Kiểm tra branches của step, bắt buộc đúng một trong hai trường 'when'/'condition' và so sánh với option tồn tại
      for (const branch of step.branches) {
        if (branch.when && branch.condition) {
          issues.push({
            cardId,
            field: `body.steps.${step.id}.branches`,
            message: `Nhánh rẽ của bước "${step.id}" không được đồng thời chứa cả 'when' và 'condition'`,
          });
          continue;
        }

        const cond = branch.when || branch.condition;
        if (!cond) {
          issues.push({
            cardId,
            field: `body.steps.${step.id}.branches`,
            message: `Nhánh rẽ của bước "${step.id}" thiếu điều kiện (bắt buộc phải có đúng một trong hai trường 'when' hoặc 'condition')`,
          });
          continue;
        }

        const targetQuestion = card.body.questions.find((q) => q.id === cond.questionId);
        if (!targetQuestion) {
          issues.push({
            cardId,
            field: `body.steps.${step.id}.branches`,
            message: `Nhánh rẽ của bước "${step.id}" tham chiếu questionId "${cond.questionId}" không tồn tại trong body.questions`,
          });
        } else {
          // Thẩm định giá trị so sánh 'equals' có tồn tại trong options hoặc unknownOption của câu hỏi
          const validOptionValues = new Set(targetQuestion.options.map((o) => o.value));
          if (targetQuestion.unknownOption?.value) {
            validOptionValues.add(targetQuestion.unknownOption.value);
          }
          if (!validOptionValues.has(cond.equals)) {
            issues.push({
              cardId,
              field: `body.steps.${step.id}.branches`,
              message: `Giá trị so sánh "${cond.equals}" trong nhánh rẽ của bước "${step.id}" không tồn tại trong danh sách lựa chọn của câu hỏi "${cond.questionId}"`,
            });
          }
        }

        if (!stepIds.has(branch.nextStepId)) {
          issues.push({
            cardId,
            field: `body.steps.${step.id}.branches`,
            message: `Nhánh rẽ của bước "${step.id}" trỏ tới nextStepId "${branch.nextStepId}" không tồn tại trong danh sách bước`,
          });
        }
      }
    }

    // R02: Thẻ published phải có claimsWithSources nếu có bước nghiệp vụ
    if (isTargetingPublish && card.body.claimsWithSources.length === 0) {
      const hasProcedural = card.body.steps.some((s) => s.stepType === "procedural");
      if (hasProcedural) {
        issues.push({
          cardId,
          field: "body.claimsWithSources",
          message: "Thẻ thủ tục published có bước nghiệp vụ không được để trống danh sách bằng chứng claimsWithSources",
        });
      }
    }
  } else if (card.type === "PLACE" || card.type === "DISCOVER") {
    // R02: Thẻ PLACE/DISCOVER published phải có ít nhất 1 khẳng định có nguồn
    if (isTargetingPublish && card.body.claimsWithSources.length === 0) {
      issues.push({
        cardId,
        field: "body.claimsWithSources",
        message: `Thẻ ${card.type} published bắt buộc phải có ít nhất 1 khẳng định gắn nguồn trong claimsWithSources`,
      });
    }
  }

  return {
    valid: issues.length === 0,
    card: issues.length === 0 ? card : undefined,
    issues,
  };
}

/**
 * Tính toán trạng thái khả dụng của thẻ dựa trên trạng thái rà soát và hạn reviewDue
 * R01: Chỉ thẻ published mới có thể available. Draft/review trả về not_found. Withdrawn trả về withdrawn.
 * R03: Kiểm tra lịch thực tế và tính mốc 23:59:59 ICT. Fail-closed nếu ngày hỏng.
 */
export function calculateAvailability(
  card: ContentCard,
  asOfDate: Date = new Date()
): ContentAvailability {
  if (card.review.status === "withdrawn") {
    return "withdrawn";
  }

  if (card.review.status === "draft" || card.review.status === "review") {
    return "not_found";
  }

  // R03: Kiểm tra tính hợp lệ của ngày lịch reviewDue
  if (!isValidCalendarDate(card.review.reviewDue)) {
    return "expired"; // Fail-closed
  }

  // So sánh mốc asOfDate với cuối ngày hạn reviewDue theo giờ Việt Nam
  const dueDateTime = parseEndOfDayICT(card.review.reviewDue).getTime();
  if (isNaN(dueDateTime) || asOfDate.getTime() > dueDateTime) {
    return "expired";
  }

  return "available";
}

/**
 * Chuyển đổi ContentCard thành PublicCardDTO an toàn
 * P1 Feedback: Thực hiện kiểm tra validateContentCard() trước khi xuất DTO. Thẻ không đạt chuẩn sẽ bị từ chối cấp nhãn isVerified và không trả body.
 * P2 Feedback: Đảm bảo availability !== 'available' thì body: undefined, actions: [], isVerified: false.
 */
export function toPublicCardDTO(
  card: ContentCard,
  asOfDate: Date = new Date()
): PublicCardDTO {
  // Chạy kiểm tra tính hợp lệ toàn diện (chỉ áp dụng isPublishedTarget khi thẻ không phải synthetic)
  const validation = validateContentCard(card, {
    isPublishedTarget: !card.isSynthetic && card.review.status === "published",
    asOfDate,
  });

  let availability = calculateAvailability(card, asOfDate);

  // Nếu thẻ vi phạm tiêu chuẩn rà soát (ví dụ thiếu reviewer, thiếu reviewedAt, hoặc reviewedAt tương lai),
  // tuyệt đối không xem là available hay verified!
  if (!validation.valid) {
    availability = "not_found";
  }

  // isVerified chỉ true khi: validation đạt chuẩn + thẻ thật (không synthetic) + published + available
  const isVerified =
    validation.valid &&
    !card.isSynthetic &&
    card.review.status === "published" &&
    availability === "available";

  const publicReview = {
    status: card.review.status,
    reviewedAt: card.review.reviewedAt,
    reviewDue: card.review.reviewDue,
    isVerified,
  };

  let availabilityMessage: string | undefined;
  if (!validation.valid) {
    availabilityMessage = "Nội dung thẻ không đạt chuẩn kiểm định hợp lệ và chưa được phát hành công khai.";
  } else if (availability === "withdrawn") {
    availabilityMessage = "Nội dung hoặc địa điểm này đã được cơ quan thông báo thu hồi/tạm ngừng hoạt động.";
  } else if (availability === "expired") {
    availabilityMessage = "Nội dung này đã quá hạn rà soát định kỳ. Vui lòng tham khảo kênh chính thống hoặc liên hệ cơ quan để có thông tin cập nhật mới nhất.";
  } else if (availability === "not_found") {
    availabilityMessage = "Nội dung chưa được phê duyệt phát hành công khai.";
  }

  // Chỉ trả body và actions khi validation đạt VÀ availability là available
  const hasContent = validation.valid && availability === "available";
  const body = hasContent ? card.body : undefined;
  const actions = hasContent ? card.actions : [];

  const baseDTO = {
    id: card.id,
    version: card.version,
    title: card.title,
    intentIds: card.intentIds,
    jurisdiction: card.jurisdiction,
    applicability: card.applicability,
    exclusions: card.exclusions,
    sources: card.sources.map((s) => ({
      id: s.id,
      url: s.url,
      title: s.title,
      publisher: s.publisher,
      sourceDate: s.sourceDate,
      fetchedAt: s.fetchedAt,
      relevantExcerpt: s.relevantExcerpt,
    })),
    review: publicReview,
    actions,
    availability,
    availabilityMessage,
    isSynthetic: card.isSynthetic,
    keywords: card.keywords,
    displayStatus: availability !== "available" ? "unavailable" : card.isSynthetic ? "synthetic" : isVerified ? "reviewed" : "unavailable",
  };

  const fullDTO = {
    ...baseDTO,
    type: card.type,
    body,
  };

  return PublicCardDTOSchema.parse(fullDTO) as PublicCardDTO;
}

/**
 * Kiểm tra tính hợp lệ của toàn bộ danh mục thẻ (Collection Validation)
 * R04: Đảm bảo ID duy nhất trên toàn bộ danh mục thẻ.
 */
export function validateCardCollection(
  rawCards: unknown[],
  options: { isPublishedTarget?: boolean; asOfDate?: Date } = {}
): { valid: boolean; issues: ValidationIssue[] } {
  const allIssues: ValidationIssue[] = [];
  const seenIds = new Set<string>();

  for (let index = 0; index < rawCards.length; index++) {
    const raw = rawCards[index];
    const validation = validateContentCard(raw, options);

    if (!validation.valid) {
      allIssues.push(...validation.issues);
      continue;
    }

    const card = validation.card!;
    if (seenIds.has(card.id)) {
      allIssues.push({
        cardId: card.id,
        field: "id",
        message: `ID trùng lặp: Thẻ có id "${card.id}" đã xuất hiện trước đó trong danh mục`,
      });
    } else {
      seenIds.add(card.id);
    }
  }

  return {
    valid: allIssues.length === 0,
    issues: allIssues,
  };
}
