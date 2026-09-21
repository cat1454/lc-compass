import { describe, expect, it } from "vitest";
import {
  loadPlacesDirectory,
  searchCommunityPlaces,
  normalizeVietnamese,
} from "../src/lib/places-directory/loader";
import { PlaceCategorySchema } from "../src/contracts/places-directory";

describe("Tầng Dữ liệu Danh bạ Tiện ích Đời sống Phường Liên Chiểu (1.000+ POIs)", () => {
  it("nạp thành công danh bạ tiện ích và đạt quy mô tối thiểu 1.000 địa điểm", async () => {
    const directory = await loadPlacesDirectory();

    expect(directory).toBeDefined();
    expect(directory.version).toBe("1.0.0");
    expect(directory.ward).toBe("Phường Liên Chiểu");
    expect(directory.jurisdictionLaw).toBe("Nghị quyết số 1659/NQ-UBTVQH15");
    expect(directory.totalPlaces).toBeGreaterThanOrEqual(1000);
    expect(directory.places.length).toBe(directory.totalPlaces);
  });

  it("đảm bảo tính toàn vẹn của dữ liệu: ID duy nhất, không trùng lặp", async () => {
    const directory = await loadPlacesDirectory();
    const idSet = new Set<string>();

    for (const place of directory.places) {
      expect(place.id).toBeDefined();
      expect(place.id.length).toBeGreaterThan(0);
      expect(idSet.has(place.id)).toBe(false);
      idSet.add(place.id);
    }
  });

  it("tuân thủ 100% ranh giới hành chính và hợp đồng dữ liệu", async () => {
    const directory = await loadPlacesDirectory();
    const excludedDistricts = ["hòa minh", "hòa khánh nam", "hải vân", "thanh khê", "đà sơn", "hoàng văn thái"];

    for (const place of directory.places) {
      // 1. Phân loại hợp lệ theo Zod enum
      expect(PlaceCategorySchema.safeParse(place.category).success).toBe(true);

      // 2. Tên, địa chỉ, tuyến đường đầy đủ
      expect(place.name.trim().length).toBeGreaterThan(0);
      expect(place.address.trim().length).toBeGreaterThan(0);
      expect(place.street.trim().length).toBeGreaterThan(0);

      // 3. Đúng phường Liên Chiểu mới
      expect(place.ward).toBe("Phường Liên Chiểu");
      expect(place.verificationMethod).toBe("boundary_confirmed");

      // 4. Tuyệt đối không chứa địa chỉ các phường lân cận bị loại
      const combined = `${place.name} ${place.address} ${place.street}`.toLowerCase();
      for (const exc of excludedDistricts) {
        expect(combined.includes(exc)).toBe(false);
      }
    }
  });

  it("phân bổ đầy đủ 7 nhóm danh mục tiện ích đời sống", async () => {
    const directory = await loadPlacesDirectory();
    const categories = ["market", "park", "healthcare", "education", "living_service", "food", "community"];

    for (const cat of categories) {
      const count = directory.categoryCounts[cat as import("../src/contracts/places-directory").PlaceCategory];
      expect(count).toBeGreaterThan(0);
      const filtered = directory.places.filter((p) => p.category === cat);
      expect(filtered.length).toBe(count);
    }
  });

  describe("Bộ máy Tìm kiếm và Phân loại tiện ích (Search Engine)", () => {
    it("chuẩn hóa tiếng Việt không dấu chính xác", () => {
      expect(normalizeVietnamese("Phường Liên Chiểu")).toBe("phuong lien chieu");
      expect(normalizeVietnamese("Đại học Bách Khoa")).toBe("dai hoc bach khoa");
      expect(normalizeVietnamese("Chợ Hòa Khánh")).toBe("cho hoa khanh");
    });

    it("tìm kiếm theo danh mục cụ thể", async () => {
      const result = await searchCommunityPlaces({ category: "market", limit: 100 });
      expect(result.items.length).toBeGreaterThan(0);
      result.items.forEach((item) => {
        expect(item.category).toBe("market");
      });
    });

    it("tìm kiếm theo tuyến đường", async () => {
      const result = await searchCommunityPlaces({ street: "Âu Cơ", limit: 100 });
      expect(result.items.length).toBeGreaterThan(0);
      result.items.forEach((item) => {
        expect(item.street).toBe("Âu Cơ");
      });
    });

    it("tìm kiếm tiếng Việt có dấu và không dấu ra cùng kết quả", async () => {
      const resWithAccents = await searchCommunityPlaces({ query: "Chợ Hòa Khánh" });
      const resWithoutAccents = await searchCommunityPlaces({ query: "cho hoa khanh" });

      expect(resWithAccents.items.length).toBeGreaterThan(0);
      expect(resWithoutAccents.items.length).toBeGreaterThan(0);

      // Cả hai đều tìm thấy Chợ Hòa Khánh
      const foundAccent = resWithAccents.items.some((p) => p.name.includes("Chợ Hòa Khánh"));
      const foundNoAccent = resWithoutAccents.items.some((p) => p.name.includes("Chợ Hòa Khánh"));
      expect(foundAccent).toBe(true);
      expect(foundNoAccent).toBe(true);
    });

    it("tìm kiếm cơ sở y tế và nhà thuốc", async () => {
      const res = await searchCommunityPlaces({ query: "nhà thuốc" });
      expect(res.items.length).toBeGreaterThan(0);
      expect(res.items.some((p) => p.category === "healthcare")).toBe(true);
    });

    it("tìm kiếm trường học và cơ sở giáo dục", async () => {
      const res = await searchCommunityPlaces({ query: "Bách Khoa" });
      expect(res.items.length).toBeGreaterThan(0);
      expect(res.items.some((p) => p.name.includes("Bách Khoa"))).toBe(true);
    });

    it("xử lý an toàn khi không có kết quả", async () => {
      const res = await searchCommunityPlaces({ query: "từ_khóa_không_tồn_tại_xyz_12345" });
      expect(res.totalMatches).toBe(0);
      expect(res.items).toEqual([]);
    });
  });
});
