import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  validateContentCard,
  validateCardCollection,
  calculateAvailability,
  toPublicCardDTO,
  ContentCard,
  ContentCardSchema,
  PublicCardDTOSchema,
  NavigationResultSchema,
  ResearchResponseSchema,
  ResearchRequestSchema,
  isValidCalendarDate,
  StepBranchSchema,
} from "../src/contracts";

describe("01 - Hợp đồng dữ liệu & Fixtures (Contracts & Validator)", () => {
  const fixturesPath = path.resolve(__dirname, "../fixtures/cards.fixture.json");
  const rawFixtures = JSON.parse(fs.readFileSync(fixturesPath, "utf8")) as ContentCard[];

  it("Tất cả 7 thẻ trong cards.fixture.json phải hợp lệ theo ContentCardSchema", () => {
    expect(rawFixtures).toHaveLength(7);
    const collectionValidation = validateCardCollection(rawFixtures);
    if (!collectionValidation.valid) {
      console.error(collectionValidation.issues);
    }
    expect(collectionValidation.valid).toBe(true);
    expect(collectionValidation.issues).toHaveLength(0);
  });

  it("Tất cả fixture đều phải gắn nhãn isSynthetic = true để tránh lẫn vào published", () => {
    for (const card of rawFixtures) {
      expect(card.isSynthetic).toBe(true);
    }
  });

  it("Không cho phép xuất bản (isPublishedTarget = true) thẻ mang nhãn isSynthetic", () => {
    const validFixture = rawFixtures.find((c) => c.id === "service-tam-tru-valid")!;
    const validation = validateContentCard(validFixture, { isPublishedTarget: true });
    expect(validation.valid).toBe(false);
    expect(validation.issues.some((i) => i.field === "isSynthetic")).toBe(true);
  });

  it("Bắt lỗi khi thẻ published thiếu reviewer hoặc reviewedAt", () => {
    const invalidPublishedCard = {
      ...rawFixtures[0],
      id: "test-no-reviewer",
      isSynthetic: false,
      review: {
        status: "published",
        owner: "Đoàn phường",
        reviewDue: "2026-12-31",
      },
    };

    const validation = validateContentCard(invalidPublishedCard, { isPublishedTarget: true });
    expect(validation.valid).toBe(false);
    expect(validation.issues.some((i) => i.field === "review.reviewer")).toBe(true);
    expect(validation.issues.some((i) => i.field === "review.reviewedAt")).toBe(true);
  });

  it("Thẻ draft cho phép không có reviewer và reviewedAt", () => {
    const draftFixture = rawFixtures.find((c) => c.id === "service-draft-fixture")!;
    const validation = validateContentCard(draftFixture);
    expect(validation.valid).toBe(true);
  });

  it("Bắt lỗi khi claim tham chiếu tới sourceId không tồn tại trong danh sách sources", () => {
    const cardWithInvalidClaim = {
      ...rawFixtures[0],
      id: "test-invalid-claim",
      body: {
        ...rawFixtures[0].body,
        claimsWithSources: [
          {
            id: "claim-fake",
            claim: "Khẳng định không có nguồn hỗ trợ",
            sourceId: "source-khong-ton-tai",
          },
        ],
      },
    };

    const validation = validateContentCard(cardWithInvalidClaim);
    expect(validation.valid).toBe(false);
    expect(
      validation.issues.some((i) => i.message.includes("không tồn tại trong danh sách sources"))
    ).toBe(true);
  });

  it("Bắt lỗi khi bước dịch vụ (SERVICE) tham chiếu nextStepId không tồn tại", () => {
    const validService = rawFixtures.find((c) => c.id === "service-tam-tru-valid")!;
    const cardWithBrokenStep = {
      ...validService,
      id: "test-broken-step",
      body: {
        ...validService.body,
        steps: [
          {
            id: "step-1",
            stepNumber: 1,
            stepType: "procedural" as const,
            title: "Bước 1",
            description: "Mô tả",
            requiredDocs: [],
            claimIds: ["claim-1"],
            branches: [],
            nextStepId: "step-khong-co",
          },
        ],
      },
    };

    const validation = validateContentCard(cardWithBrokenStep);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some((i) => i.message.includes("không tồn tại"))).toBe(true);
  });

  it("Bắt lỗi URL nguồn không dùng giao thức https://", () => {
    const cardWithHttpSource = {
      ...rawFixtures[0],
      id: "test-http-source",
      sources: [
        {
          id: "src-insecure",
          url: "http://insecure-domain.org/guide",
          title: "Nguồn không an toàn",
          publisher: "Cơ quan",
          fetchedAt: "2026-09-18",
        },
      ],
    };

    const validation = validateContentCard(cardWithHttpSource);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some((i) => i.message.includes("https://"))).toBe(true);
  });

  it("Bắt lỗi trùng lặp card ID trong danh mục", () => {
    const duplicateList = [rawFixtures[0], { ...rawFixtures[1], id: rawFixtures[0].id }];
    const collectionValidation = validateCardCollection(duplicateList);
    expect(collectionValidation.valid).toBe(false);
    expect(collectionValidation.issues.some((i) => i.message.includes("ID trùng lặp"))).toBe(true);
  });

  // =========================================================================
  // CODEX REVIEW REGRESSION TESTS (R01 - R07)
  // =========================================================================
  describe("Codex Review Regression Tests (R01–R07)", () => {
    const now = new Date("2026-09-18T12:00:00Z");
    const makeCard = () =>
      ({
        ...structuredClone(rawFixtures[0] as any),
        isSynthetic: false,
      } as any);

    it("R01: Thẻ ở trạng thái review không được phép available (phải là not_found)", () => {
      const card = makeCard();
      card.review.status = "review";
      delete (card.review as any).reviewer;
      delete (card.review as any).reviewedAt;

      const availability = calculateAvailability(ContentCardSchema.parse(card), now);
      expect(availability).toBe("not_found");
    });

    it("R01: Thẻ withdrawn hoặc expired không được lộ body/actions trong Public DTO", () => {
      const cardWithdrawn = makeCard();
      cardWithdrawn.review.status = "withdrawn";

      const dtoWithdrawn = toPublicCardDTO(ContentCardSchema.parse(cardWithdrawn), now);
      expect(dtoWithdrawn.availability).toBe("withdrawn");
      expect(dtoWithdrawn.body).toBeUndefined();
      expect(dtoWithdrawn.actions).toHaveLength(0);
      expect(dtoWithdrawn.availabilityMessage).toBeDefined();

      const cardExpired = makeCard();
      cardExpired.review.reviewedAt = "2023-12-01";
      cardExpired.review.reviewDue = "2024-01-01";
      const dtoExpired = toPublicCardDTO(ContentCardSchema.parse(cardExpired), now);
      expect(dtoExpired.availability).toBe("expired");
      expect(dtoExpired.body).toBeUndefined();
      expect(dtoExpired.actions).toHaveLength(0);
    });

    it("R01: Fixture synthetic tuyệt đối không nhận isVerified = true", () => {
      const dtoSynthetic = toPublicCardDTO(ContentCardSchema.parse(rawFixtures[0]), now);
      expect(dtoSynthetic.isSynthetic).toBe(true);
      expect(dtoSynthetic.review.isVerified).toBe(false);
    });

    it("R02: Bắt lỗi bước tham chiếu claimId không tồn tại (dangling claim)", () => {
      const card = makeCard();
      card.body.steps[0].claimIds = ["does-not-exist"];

      const validation = validateContentCard(card, { isPublishedTarget: true });
      expect(validation.valid).toBe(false);
      expect(validation.issues.some((i) => i.message.includes("không tồn tại trong claimsWithSources"))).toBe(true);
    });

    it("R02: Bắt lỗi thẻ published có bước nghiệp vụ procedural mà không có bằng chứng (claimIds rỗng)", () => {
      const card = makeCard();
      card.body.claimsWithSources = [];
      card.body.steps.forEach((s: any) => (s.claimIds = []));

      const validation = validateContentCard(card, { isPublishedTarget: true });
      expect(validation.valid).toBe(false);
      expect(validation.issues.some((i) => i.message.includes("bắt buộc phải có ít nhất 1 bằng chứng"))).toBe(true);
    });

    it("R03: Từ chối ngày giả (2026-99-99, 2026-02-30) và fail-closed thành expired", () => {
      expect(isValidCalendarDate("2026-99-99")).toBe(false);
      expect(isValidCalendarDate("2026-02-30")).toBe(false);
      expect(isValidCalendarDate("2026-02-28")).toBe(true);

      const card = makeCard();
      card.review.reviewDue = "2026-99-99";

      const validation = validateContentCard(card, { isPublishedTarget: true });
      expect(validation.valid).toBe(false);
      expect(validation.issues.some((i) => i.field === "review.reviewDue")).toBe(true);

      const availability = calculateAvailability(ContentCardSchema.parse(card), now);
      expect(availability).toBe("expired");
    });

    it("R03: Từ chối thẻ có ngày reviewedAt ở tương lai so với asOfDate", () => {
      const card = makeCard();
      card.review.reviewedAt = "2026-10-01"; // tương lai so với now: 2026-09-18

      const validation = validateContentCard(card, { isPublishedTarget: true, asOfDate: now });
      expect(validation.valid).toBe(false);
      expect(validation.issues.some((i) => i.message.includes("không thể ở tương lai"))).toBe(true);
    });

    it("R03: Từ chối thẻ có reviewedAt sau hạn reviewDue", () => {
      const card = makeCard();
      card.review.reviewedAt = "2026-09-18";
      card.review.reviewDue = "2026-08-01"; // reviewDue trước reviewedAt

      const validation = validateContentCard(card, { isPublishedTarget: true });
      expect(validation.valid).toBe(false);
      expect(validation.issues.some((i) => i.message.includes("không được sau hạn rà soát"))).toBe(true);
    });

    it("R05: SERVICE bảo toàn trường branches và validator kiểm tra questionId/nextStepId", () => {
      const card = makeCard();
      card.body.questions = [
        {
          id: "housing",
          prompt: "Tình trạng thuê nhà",
          options: [{ value: "unknown", label: "Chưa rõ" }],
        },
      ];
      card.body.steps[0].branches = [
        {
          when: { questionId: "housing", equals: "unknown" },
          nextStepId: "step-2",
        },
      ];

      const parsed = ContentCardSchema.parse(card);
      expect((parsed.body as any).steps[0].branches).toHaveLength(1);
      expect((parsed.body as any).steps[0].branches[0].when?.questionId).toBe("housing");

      const validation = validateContentCard(parsed, { isPublishedTarget: true });
      expect(validation.valid).toBe(true);

      // Nhánh trỏ tới questionId không có
      const brokenQuestionBranch = structuredClone(card);
      brokenQuestionBranch.body.steps[0].branches[0].when!.questionId = "non-existent-q";
      const brokenQValidation = validateContentCard(brokenQuestionBranch, { isPublishedTarget: true });
      expect(brokenQValidation.valid).toBe(false);
      expect(brokenQValidation.issues.some((i) => i.message.includes("không tồn tại trong body.questions"))).toBe(true);
    });

    it("R06: ResearchResponse từ chối status ok khi không có citations", () => {
      const invalidOk = {
        status: "ok",
        answer: "unsupported answer",
        retrievedAt: now.toISOString(),
      };
      const result = ResearchResponseSchema.safeParse(invalidOk);
      expect(result.success).toBe(false);

      const validOk = {
        status: "ok",
        answer: "câu trả lời có trích dẫn",
        citations: [
          {
            id: "cit-1",
            url: "https://dichvucong.gov.vn",
            title: "Cổng DVC",
          },
        ],
        claims: [
          {
            statement: "Khẳng định có dẫn nguồn",
            citationIds: ["cit-1"],
          },
        ],
        retrievedAt: now.toISOString(),
      };
      const validResult = ResearchResponseSchema.safeParse(validOk);
      expect(validResult.success).toBe(true);
    });

    it("R07: PublicCardDTOSchema từ chối trường hợp type và body không khớp (discriminatedUnion)", () => {
      const card = makeCard();
      const dto = toPublicCardDTO(ContentCardSchema.parse(card), now);

      // Đổi type thành PLACE nhưng giữ nguyên ServiceBody
      const mismatched = { ...dto, type: "PLACE" };
      const parsed = PublicCardDTOSchema.safeParse(mismatched);
      expect(parsed.success).toBe(false);
    });

    // =========================================================================
    // ADDITIONAL CODEX FEEDBACK REGRESSION TESTS (5 POINTS)
    // =========================================================================
    describe("Kiểm thử bổ sung theo 5 điểm hở kỹ thuật của Codex", () => {
      it("Điểm 1 (P1): Thẻ thiếu người duyệt bị validator từ chối và toPublicCardDTO() không trả isVerified: true hay body", () => {
        const unreviewedCard = makeCard();
        unreviewedCard.review.status = "published";
        delete unreviewedCard.review.reviewer; // thiếu người duyệt

        const validation = validateContentCard(unreviewedCard);
        expect(validation.valid).toBe(false);

        const dto = toPublicCardDTO(unreviewedCard, now);
        expect(dto.review.isVerified).toBe(false);
        expect(dto.availability).toBe("not_found");
        expect(dto.body).toBeUndefined();
        expect(dto.actions).toHaveLength(0);
      });

      it("Điểm 2 (P1): Ngày duyệt 2099-01-01 bị từ chối ngay trong kiểm tra mặc định (asOfDate = now)", () => {
        const futureReviewedCard = makeCard();
        futureReviewedCard.review.reviewedAt = "2099-01-01";
        futureReviewedCard.review.reviewDue = "2099-12-31";

        // Gọi validateContentCard mặc định không truyền options
        const validation = validateContentCard(futureReviewedCard);
        expect(validation.valid).toBe(false);
        expect(validation.issues.some((i) => i.message.includes("không thể ở tương lai"))).toBe(true);

        // toPublicCardDTO mặc định cũng từ chối cấp nhãn xác minh
        const dto = toPublicCardDTO(futureReviewedCard);
        expect(dto.review.isVerified).toBe(false);
        expect(dto.body).toBeUndefined();
      });

      it("Điểm 3 (P2): Research status ok bắt buộc phải có claims mapping và citation tồn tại", () => {
        const okWithoutClaims = {
          status: "ok",
          answer: "câu trả lời",
          citations: [{ id: "cit-1", url: "https://dvc.gov.vn", title: "Cổng" }],
          claims: [], // rỗng claims
          retrievedAt: now.toISOString(),
        };
        const parseWithoutClaims = ResearchResponseSchema.safeParse(okWithoutClaims);
        expect(parseWithoutClaims.success).toBe(false);

        const okWithBrokenCitation = {
          status: "ok",
          answer: "câu trả lời",
          citations: [{ id: "cit-1", url: "https://dvc.gov.vn", title: "Cổng" }],
          claims: [{ statement: "Khẳng định", citationIds: ["cit-khong-co"] }],
          retrievedAt: now.toISOString(),
        };
        const parseBrokenCit = ResearchResponseSchema.safeParse(okWithBrokenCitation);
        expect(parseBrokenCit.success).toBe(false);
      });

      it("Điểm 4 (P2): Nhánh SERVICE bắt buộc có điều kiện và so sánh với giá trị lựa chọn tồn tại trong câu hỏi", () => {
        const card = makeCard();
        card.body.questions = [
          {
            id: "housing",
            prompt: "Tình trạng thuê nhà",
            options: [
              { value: "has_contract", label: "Có hợp đồng" },
              { value: "no_contract", label: "Không có hợp đồng" },
            ],
            unknownOption: {
              value: "unknown",
              label: "Chưa rõ",
              guidance: "Hướng dẫn",
            },
          },
        ];

        // So sánh với giá trị không tồn tại trong options
        card.body.steps[0].branches = [
          {
            when: { questionId: "housing", equals: "gia_tri_khong_ton_tai" },
            nextStepId: "step-2",
          },
        ];

        const validation = validateContentCard(card);
        expect(validation.valid).toBe(false);
        expect(validation.issues.some((i) => i.message.includes("không tồn tại trong danh sách lựa chọn"))).toBe(true);

        // Nhánh thiếu điều kiện (rỗng) bị StepBranchSchema từ chối
        const branchWithoutCond = { nextStepId: "step-2" };
        expect(StepBranchSchema.safeParse(branchWithoutCond).success).toBe(false);

        // Nhánh chứa đồng thời cả when và condition bị StepBranchSchema từ chối
        const branchWithBoth = {
          when: { questionId: "housing", equals: "has_house" },
          condition: { questionId: "housing", equals: "renting" },
          nextStepId: "step-2",
        };
        expect(StepBranchSchema.safeParse(branchWithBoth).success).toBe(false);

        // Nhánh chỉ có when hợp lệ được StepBranchSchema chấp nhận
        const branchWithWhenOnly = {
          when: { questionId: "housing", equals: "has_contract" },
          nextStepId: "step-2",
        };
        expect(StepBranchSchema.safeParse(branchWithWhenOnly).success).toBe(true);

        // Nhánh chỉ có condition hợp lệ được StepBranchSchema chấp nhận
        const branchWithCondOnly = {
          condition: { questionId: "housing", equals: "has_contract" },
          nextStepId: "step-2",
        };
        expect(StepBranchSchema.safeParse(branchWithCondOnly).success).toBe(true);

        // Kiểm tra validator: nhánh chỉ dùng condition hợp lệ -> PASS
        const validCondCard = makeCard();
        validCondCard.body.questions = card.body.questions;
        validCondCard.body.steps[0].branches = [branchWithCondOnly];
        expect(validateContentCard(validCondCard).valid).toBe(true);

        // Kiểm tra validator: nhánh dùng condition trỏ tới câu hỏi không tồn tại -> FAIL
        const brokenCondCard = makeCard();
        brokenCondCard.body.questions = card.body.questions;
        brokenCondCard.body.steps[0].branches = [
          {
            condition: { questionId: "cau_hoi_ma", equals: "has_house" },
            nextStepId: "step-2",
          },
        ];
        const brokenCondVal = validateContentCard(brokenCondCard);
        expect(brokenCondVal.valid).toBe(false);
        expect(brokenCondVal.issues.some((i) => i.message.includes("không tồn tại trong body.questions"))).toBe(true);

        // Kiểm tra validator: thẻ chứa đồng thời cả when và condition bị validator phát hiện
        const bothCard = makeCard();
        bothCard.body.questions = card.body.questions;
        bothCard.body.steps[0].branches = [branchWithBoth as any];
        const bothVal = validateContentCard(bothCard);
        expect(bothVal.valid).toBe(false);
      });

      it("P2 (Phân nhánh XOR): Bắt buộc đúng một trong hai trường 'when' hoặc 'condition', từ chối khi có cả hai và thẩm định condition độc lập", () => {
        // 1. Từ chối khi có cả 2 trường đồng thời
        const branchWithBoth = {
          when: { questionId: "q1", equals: "opt_a" },
          condition: { questionId: "q1", equals: "opt_b" },
          nextStepId: "step-2",
        };
        const parseBoth = StepBranchSchema.safeParse(branchWithBoth);
        expect(parseBoth.success).toBe(false);
        if (!parseBoth.success) {
          expect(parseBoth.error.issues.some((i) => i.message.includes("không được đồng thời chứa cả 'when' và 'condition'"))).toBe(true);
        }

        // 2. Từ chối khi thiếu cả 2 trường
        const branchEmpty = { nextStepId: "step-2" };
        expect(StepBranchSchema.safeParse(branchEmpty).success).toBe(false);

        // 3. Chấp nhận khi chỉ có when
        const branchWhen = {
          when: { questionId: "q1", equals: "opt_a" },
          nextStepId: "step-2",
        };
        expect(StepBranchSchema.safeParse(branchWhen).success).toBe(true);

        // 4. Chấp nhận khi chỉ có condition
        const branchCondition = {
          condition: { questionId: "q1", equals: "opt_a" },
          nextStepId: "step-2",
        };
        expect(StepBranchSchema.safeParse(branchCondition).success).toBe(true);

        // 5. Validator: condition trỏ tới câu hỏi không tồn tại -> phát hiện lỗi
        const card = makeCard();
        card.body.questions = [
          {
            id: "q1",
            prompt: "Câu hỏi 1",
            options: [{ value: "opt_a", label: "Lựa chọn A" }],
          },
        ];
        card.body.steps[0].branches = [
          {
            condition: { questionId: "non_existent_q", equals: "opt_a" },
            nextStepId: "step-2",
          },
        ];
        const valInvalid = validateContentCard(card);
        expect(valInvalid.valid).toBe(false);
        expect(valInvalid.issues.some((i) => i.message.includes("không tồn tại trong body.questions"))).toBe(true);

        // 6. Validator: condition trỏ tới câu hỏi hợp lệ và option hợp lệ -> PASS
        card.body.steps[0].branches = [branchCondition];
        const valValid = validateContentCard(card);
        expect(valValid.valid).toBe(true);
      });

      it("Điểm 5 (P2): PublicCardDTOSchema từ chối trực tiếp payload có availability !== 'available' nhưng chứa body hoặc isVerified: true", () => {
        const validCard = makeCard();
        const validDTO = toPublicCardDTO(validCard, now);

        // Payload có availability withdrawn nhưng vẫn chứa body
        const dirtyWithdrawnDTO = {
          ...validDTO,
          availability: "withdrawn",
          body: validCard.body,
        };
        expect(PublicCardDTOSchema.safeParse(dirtyWithdrawnDTO).success).toBe(false);

        // Payload có availability withdrawn nhưng review.isVerified = true
        const verifiedWithdrawnDTO = {
          ...validDTO,
          availability: "withdrawn",
          body: undefined,
          actions: [],
          review: { ...validDTO.review, isVerified: true },
        };
        expect(PublicCardDTOSchema.safeParse(verifiedWithdrawnDTO).success).toBe(false);

        // Payload có isSynthetic = true nhưng review.isVerified = true
        const verifiedSyntheticDTO = {
          ...validDTO,
          isSynthetic: true,
          review: { ...validDTO.review, isVerified: true },
        };
        expect(PublicCardDTOSchema.safeParse(verifiedSyntheticDTO).success).toBe(false);
      });
    });
  });

  describe("Contracts: Navigation & Research", () => {
    it("NavigationResultSchema xác thực hợp lệ kết quả điều hướng", () => {
      const sampleResult = {
        action: "show_cards",
        reasonCode: "MATCHED_DIRECT_INTENT",
        cardIds: ["service-tam-tru-valid"],
        missingQuestions: [],
        guidanceText: "Đã tìm thấy thẻ hướng dẫn phù hợp",
      };
      const parsed = NavigationResultSchema.parse(sampleResult);
      expect(parsed.action).toBe("show_cards");
      expect(parsed.cardIds).toHaveLength(1);
    });

    it("ResearchRequestSchema xác thực query và entry", () => {
      const req = ResearchRequestSchema.parse({
        query: "đăng ký tạm trú tại phường Liên Chiểu",
        entry: "services",
      });
      expect(req.query).toBe("đăng ký tạm trú tại phường Liên Chiểu");
    });
  });
});
