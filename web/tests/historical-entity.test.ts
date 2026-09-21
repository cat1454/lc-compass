import { describe, it, expect } from "vitest";
import { resolveHistoricalEntities } from "../src/lib/navigation/entity-resolver";

describe("Historical Entity Resolution Engine (NQ 1659)", () => {
  it("định tuyến đúng từ UBND Hòa Khánh Bắc cũ về Trung tâm Hành chính Phường Liên Chiểu mới", () => {
    const res = resolveHistoricalEntities("UBND phường Hòa Khánh Bắc ở đâu");
    expect(res.hasHistoricalMatch).toBe(true);
    expect(res.suggestedCardIds).toContain("place-trung-tam-hanh-chinh-lien-chieu");
    expect(res.primaryNotice).toContain("NQ 1659");
    expect(res.primaryNotice).toContain("68 đường Lạc Long Quân");
  });

  it("định tuyến đúng từ Công an phường Hòa Khánh Bắc cũ về Công an Phường Liên Chiểu mới", () => {
    const res = resolveHistoricalEntities("công an phường hòa khánh bắc");
    expect(res.hasHistoricalMatch).toBe(true);
    expect(res.suggestedCardIds).toContain("place-cong-an-phuong-lien-chieu");
    expect(res.primaryNotice).toContain("66 đường Lạc Long Quân");
  });

  it("định tuyến đúng từ Trạm Y tế Hòa Khánh Bắc cũ về Trạm Y tế Liên Chiểu mới", () => {
    const res = resolveHistoricalEntities("trạm y tế hòa khánh bắc");
    expect(res.hasHistoricalMatch).toBe(true);
    expect(res.suggestedCardIds).toContain("place-tram-y-te-lien-chieu");
    expect(res.primaryNotice).toContain("178 đường Âu Cơ");
  });

  it("cảnh báo rõ ràng đối với thực thể chuyển ra ngoài địa giới mới (Nam Ô sang Hải Vân)", () => {
    const res = resolveHistoricalEntities("làng nam ô có lễ hội gì");
    expect(res.hasHistoricalMatch).toBe(true);
    expect(res.matchedEntities[0].isWithinNewLienChieu).toBe(false);
    expect(res.matchedEntities[0].currentName).toBe("Phường Hải Vân mới");
  });

  it("cảnh báo rõ ràng đối với KTX phía Tây (thuộc Phường Hòa Khánh mới)", () => {
    const res = resolveHistoricalEntities("thuê trọ gần ktx phía tây");
    expect(res.hasHistoricalMatch).toBe(true);
    expect(res.matchedEntities[0].isWithinNewLienChieu).toBe(false);
    expect(res.matchedEntities[0].currentName).toBe("Phường Hòa Khánh mới");
  });
});
