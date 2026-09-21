import { describe, expect, it } from "vitest";
import { cardStatus } from "../src/lib/card-status";
import type { PublicCardDTO } from "../src/contracts/card";

describe.each(["SERVICE", "PLACE", "DISCOVER"])("Community status %s", type => {
  const base = { type, availability: "available", isSynthetic: false, review: { status: "published", isVerified: true } } as PublicCardDTO;
  it("distinguishes reviewed, pending, synthetic and unavailable", () => {
    expect(cardStatus(base)).toBe("Đã rà soát");
    expect(cardStatus({ ...base, review: { ...base.review, status: "review", isVerified: false } })).toBe("Có nguồn · Chờ rà soát");
    expect(cardStatus({ ...base, isSynthetic: true })).toBe("Dữ liệu mô phỏng");
    for (const availability of ["expired", "withdrawn", "not_found"] as const) {
      expect(cardStatus({ ...base, availability })).toBe("Không còn khả dụng");
    }
    expect(cardStatus({ ...base, displayStatus: "unavailable" })).toBe("Không còn khả dụng");
  });
});
