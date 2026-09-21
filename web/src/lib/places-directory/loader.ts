import { readCsvPlaces } from "../content/csv";
import {
  CommunityPlaceItem,
  PlaceCategory,
  PlacesDirectory,
} from "../../contracts/places-directory";

// Chuẩn hóa tiếng Việt không dấu để tìm kiếm thông minh
export function normalizeVietnamese(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .trim();
}


/**
 * Tải toàn bộ danh bạ tiện ích đời sống cộng đồng Phường Liên Chiểu
 */
export async function loadPlacesDirectory(): Promise<PlacesDirectory> {
  return readCsvPlaces();
}

export interface SearchPlacesOptions {
  query?: string;
  category?: PlaceCategory | "all";
  street?: string;
  limit?: number;
  offset?: number;
}

export interface SearchPlacesResult {
  items: CommunityPlaceItem[];
  totalMatches: number;
  categoryCounts: Record<string, number>;
  streets: string[];
}

/**
 * Tìm kiếm và phân loại địa điểm tiện ích đời sống
 */
export async function searchCommunityPlaces(
  options: SearchPlacesOptions = {}
): Promise<SearchPlacesResult> {
  const directory = await loadPlacesDirectory();
  const { query, category, street, limit = 50, offset = 0 } = options;

  let filtered = directory.places;

  // 1. Lọc theo danh mục
  if (category && category !== "all") {
    filtered = filtered.filter((p) => p.category === category);
  }

  // 2. Lọc theo tuyến đường
  if (street && street !== "all") {
    filtered = filtered.filter((p) => p.street.toLowerCase() === street.toLowerCase());
  }

  // 3. Tìm kiếm theo từ khóa tiếng Việt không dấu & có dấu
  if (query && query.trim().length > 0) {
    const normQuery = normalizeVietnamese(query);
    const rawQueryLower = query.toLowerCase().trim();

    filtered = filtered.filter((p) => {
      const normName = normalizeVietnamese(p.name);
      const normAddress = normalizeVietnamese(p.address);
      const normNotes = p.notes ? normalizeVietnamese(p.notes) : "";
      const normCat = normalizeVietnamese(p.categoryLabel);

      return (
        normName.includes(normQuery) ||
        normAddress.includes(normQuery) ||
        normNotes.includes(normQuery) ||
        normCat.includes(normQuery) ||
        p.name.toLowerCase().includes(rawQueryLower) ||
        p.address.toLowerCase().includes(rawQueryLower)
      );
    });
  }

  // Thống kê số lượng kết quả theo danh mục sau khi lọc
  const categoryCounts: Record<string, number> = { all: filtered.length };
  filtered.forEach((p) => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  // Thu thập danh sách các tuyến đường có trong kết quả
  const streetsSet = new Set<string>();
  directory.places.forEach((p) => streetsSet.add(p.street));
  const streets = Array.from(streetsSet).sort();

  const totalMatches = filtered.length;
  const items = filtered.slice(offset, offset + limit);

  return {
    items,
    totalMatches,
    categoryCounts,
    streets,
  };
}
