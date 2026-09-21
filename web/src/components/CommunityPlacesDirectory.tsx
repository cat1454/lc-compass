"use client";

import { useUrlFilters } from "../lib/use-url-filters";
import React, { useMemo, useState } from "react";
import {
  Check,
  Copy,
  ExternalLink,
  GraduationCap,
  HeartPulse,
  Info,
  Landmark,
  MapPin,
  Search,
  ShoppingBag,
  Sparkles,
  Trees,
  UtensilsCrossed,
  Wrench,
  X,
} from "lucide-react";
import { CommunityPlaceItem, PlaceCategory } from "../contracts/places-directory";

interface CategoryMeta {
  key: PlaceCategory | "all";
  label: string;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryMeta[] = [
  { key: "all", label: "Tất cả", icon: <MapPin className="w-3.5 h-3.5" /> },
  { key: "market", label: "Chợ & Mua sắm", icon: <ShoppingBag className="w-3.5 h-3.5" /> },
  { key: "park", label: "Công viên & Không gian xanh", icon: <Trees className="w-3.5 h-3.5" /> },
  { key: "healthcare", label: "Y tế & Nhà thuốc", icon: <HeartPulse className="w-3.5 h-3.5" /> },
  { key: "education", label: "Giáo dục & Trường học", icon: <GraduationCap className="w-3.5 h-3.5" /> },
  { key: "living_service", label: "Tiện ích dân sinh", icon: <Wrench className="w-3.5 h-3.5" /> },
  { key: "food", label: "Ẩm thực & Quán ăn", icon: <UtensilsCrossed className="w-3.5 h-3.5" /> },
  { key: "community", label: "Cộng đồng & Hành chính", icon: <Landmark className="w-3.5 h-3.5" /> },
];

const TOP_STREETS = [
  "Nguyễn Lương Bằng",
  "Lạc Long Quân",
  "Tôn Đức Thắng",
  "Nguyễn Tất Thành",
  "Âu Cơ",
  "Đồng Kè",
];

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .trim();
}

interface Props {
  initialPlaces: CommunityPlaceItem[];
  totalCount: number;
  availableStreets: string[];
}

export function CommunityPlacesDirectory({
  initialPlaces,
  availableStreets,
}: Props) {
  const { params, update } = useUrlFilters();
  const query = params.get("search") || "";
  const rawCategory = params.get("category") || "all";
  const selectedCategory = CATEGORIES.some((c) => c.key === rawCategory) ? rawCategory : "all";
  const rawStreet = params.get("street") || "all";
  const selectedStreet = availableStreets.includes(rawStreet) ? rawStreet : "all";
  const onlyWithNotes = params.get("notes") === "true";

  const setQuery = (search: string) => update({ search });
  const setSelectedCategory = (category: string) => update({ category });
  const setSelectedStreet = (street: string) => update({ street });
  const setOnlyWithNotes = (val: boolean) => update({ notes: val ? "true" : "" });

  const [displayLimit, setDisplayLimit] = useState(30);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Lọc dữ liệu client-side tức thì
  const filteredPlaces = useMemo(() => {
    let result = initialPlaces;

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedStreet !== "all") {
      result = result.filter((p) => p.street.toLowerCase() === selectedStreet.toLowerCase());
    }

    if (onlyWithNotes) {
      result = result.filter((p) => Boolean(p.notes && p.notes.trim().length > 0));
    }

    if (query.trim().length > 0) {
      const normQuery = normalize(query);
      const rawLower = query.toLowerCase().trim();

      result = result.filter((p) => {
        const normName = normalize(p.name);
        const normAddress = normalize(p.address);
        const normNotes = p.notes ? normalize(p.notes) : "";
        const normCat = normalize(p.categoryLabel);

        return (
          normName.includes(normQuery) ||
          normAddress.includes(normQuery) ||
          normNotes.includes(normQuery) ||
          normCat.includes(normQuery) ||
          p.name.toLowerCase().includes(rawLower) ||
          p.address.toLowerCase().includes(rawLower)
        );
      });
    }

    return result;
  }, [initialPlaces, selectedCategory, selectedStreet, onlyWithNotes, query]);

  // Đếm số lượng theo từng danh mục
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: initialPlaces.length };
    initialPlaces.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [initialPlaces]);

  // Đếm số địa điểm có ghi chú/chỉ dẫn
  const placesWithNotesCount = useMemo(() => {
    return initialPlaces.filter((p) => Boolean(p.notes && p.notes.trim().length > 0)).length;
  }, [initialPlaces]);

  // Giới hạn hiển thị phân trang tải thêm
  const visiblePlaces = useMemo(() => {
    return filteredPlaces.slice(0, displayLimit);
  }, [filteredPlaces, displayLimit]);

  const hasMore = displayLimit < filteredPlaces.length;
  const isAnyFilterActive = selectedCategory !== "all" || selectedStreet !== "all" || query || onlyWithNotes;

  const currentCategoryLabel = CATEGORIES.find((c) => c.key === selectedCategory)?.label || "";

  return (
    <div className="space-y-6 pt-2">
      {/* Khối tìm kiếm & Bộ lọc nhanh */}
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-600 shrink-0" />
              <span>Tra cứu Tiện ích &amp; Đời sống Phường Liên Chiểu</span>
            </h3>
            <p className="text-xs text-slate-500">
              Danh bạ {initialPlaces.length.toLocaleString("vi-VN")} địa điểm đã đối chiếu ranh giới; chưa xác minh hoạt động của từng cơ sở.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200 shrink-0 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            {initialPlaces.length.toLocaleString("vi-VN")} địa điểm
          </span>
        </div>

        {/* Ô nhập tìm kiếm từ khóa */}
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setDisplayLimit(30);
            }}
            placeholder="Tìm chợ, công viên, tiệm thuốc, trường học, quán ăn, tạp hóa..."
            style={{ fontSize: "16px" }}
            className="touch-target w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
            aria-label="Tìm tiện ích đời sống theo từ khóa"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setDisplayLimit(30);
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 text-xs transition-colors"
              title="Xóa tìm kiếm"
              aria-label="Xóa tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 1. Lọc theo Danh mục (Category Chips) */}
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-slate-600">Nhóm tiện ích:</div>
          <div className="flex gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar -mx-1 px-1">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              const count = categoryCounts[cat.key] || 0;

              return (
                <button
                  key={cat.key}
                  aria-pressed={isSelected}
                  onClick={() => {
                    setSelectedCategory(cat.key);
                    setDisplayLimit(30);
                  }}
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all shadow-xs ${
                    isSelected
                      ? "bg-teal-700 text-white shadow-teal-700/20"
                      : "bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60"
                  }`}
                >
                  <span className={isSelected ? "text-teal-200" : "text-slate-500"}>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span
                    className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isSelected ? "bg-teal-800 text-teal-100" : "bg-white text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Lọc nhanh Tuyến đường huyết mạch & Dropdown đầy đủ */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-600">Tuyến đường huyết mạch:</span>
            {/* Dropdown 50+ tuyến */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 hidden sm:inline">Khác:</span>
              <select
                aria-label="Lọc theo tuyến đường"
                value={selectedStreet}
                onChange={(e) => {
                  setSelectedStreet(e.target.value);
                  setDisplayLimit(30);
                }}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-teal-600 text-xs max-w-[170px] sm:max-w-xs truncate"
              >
                <option value="all">Toàn bộ tuyến ({availableStreets.length})</option>
                {availableStreets.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Street Chips: 1 chạm cho người dân */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
            <button
              type="button"
              onClick={() => {
                setSelectedStreet("all");
                setDisplayLimit(30);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                selectedStreet === "all"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80"
              }`}
            >
              Tất cả các tuyến
            </button>
            {TOP_STREETS.map((st) => {
              const isSelected = selectedStreet.toLowerCase() === st.toLowerCase();
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    setSelectedStreet(isSelected ? "all" : st);
                    setDisplayLimit(30);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                    isSelected
                      ? "bg-teal-700 text-white shadow-2xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80"
                  }`}
                >
                  {st}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Tiện ích lọc nâng cao: Chỉ hiện nơi có hướng dẫn/ghi chú */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 text-xs">
          <button
            type="button"
            onClick={() => {
              setOnlyWithNotes(!onlyWithNotes);
              setDisplayLimit(30);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              onlyWithNotes
                ? "bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/80"
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${onlyWithNotes ? "text-amber-600" : "text-slate-400"}`} />
            <span>Chỉ nơi có ghi chú / chỉ dẫn ({placesWithNotesCount})</span>
          </button>

          {isAnyFilterActive && (
            <button
              onClick={() => {
                update({ category: "all", street: "all", search: "", notes: "" });
                setDisplayLimit(30);
              }}
              className="text-xs text-teal-700 hover:text-teal-900 underline ml-auto font-semibold"
            >
              Đặt lại toàn bộ
            </button>
          )}
        </div>

        {/* 4. Thanh bộ lọc đang áp dụng (Active Filter Chips) */}
        {isAnyFilterActive && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Đang lọc:</span>
            {query && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 font-medium">
                <span>Từ khóa: &ldquo;{query}&rdquo;</span>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-slate-400 hover:text-slate-700"
                  aria-label="Xóa bộ lọc từ khóa"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 font-medium">
                <span>Nhóm: {currentCategoryLabel}</span>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className="text-teal-500 hover:text-teal-800"
                  aria-label="Xóa bộ lọc nhóm"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedStreet !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 font-medium">
                <span>Đường: {selectedStreet}</span>
                <button
                  type="button"
                  onClick={() => setSelectedStreet("all")}
                  className="text-blue-500 hover:text-blue-800"
                  aria-label="Xóa bộ lọc tuyến đường"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {onlyWithNotes && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-medium">
                <span>Có chỉ dẫn</span>
                <button
                  type="button"
                  onClick={() => setOnlyWithNotes(false)}
                  className="text-amber-500 hover:text-amber-800"
                  aria-label="Xóa bộ lọc có chỉ dẫn"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Thông báo số lượng kết quả */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 px-1">
        <div>
          Hiển thị <span className="font-bold text-slate-900">{visiblePlaces.length}</span> trong tổng số{" "}
          <span className="font-bold text-teal-700">{filteredPlaces.length.toLocaleString("vi-VN")}</span> địa điểm phù hợp
        </div>
        {query && (
          <div className="text-slate-500 italic truncate max-w-[200px]">
            Từ khóa: &ldquo;{query}&rdquo;
          </div>
        )}
      </div>

      {/* Danh sách thẻ địa điểm */}
      {filteredPlaces.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-3 shadow-sm">
          <Search className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">{initialPlaces.length === 0 ? "Danh bạ chưa có dữ liệu" : "Không tìm thấy địa điểm phù hợp"}</h4>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Không có địa điểm nào khớp với từ khóa hoặc bộ lọc đã chọn trong ranh giới Phường Liên Chiểu mới.
          </p>
          <button
            onClick={() => {
              update({ category: "all", street: "all", search: "", notes: "" });
            }}
            className="mt-2 px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-xl hover:bg-teal-700 transition-colors shadow-sm"
          >
            Xem toàn bộ địa điểm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visiblePlaces.map((place) => {
            const googleMapsQuery = encodeURIComponent(`${place.name} ${place.address}`);
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${googleMapsQuery}`;

            // Chọn màu sắc nhận diện theo nhóm tiện ích
            const badgeStyles: Record<PlaceCategory, string> = {
              market: "bg-amber-50 text-amber-800 border-amber-200",
              park: "bg-emerald-50 text-emerald-800 border-emerald-200",
              healthcare: "bg-rose-50 text-rose-800 border-rose-200",
              education: "bg-blue-50 text-blue-800 border-blue-200",
              living_service: "bg-indigo-50 text-indigo-800 border-indigo-200",
              food: "bg-orange-50 text-orange-800 border-orange-200",
              community: "bg-purple-50 text-purple-800 border-purple-200",
            };

            const catMeta = CATEGORIES.find((c) => c.key === place.category);
            const isCopied = copiedId === place.id;

            return (
              <div
                key={place.id}
                className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3 relative group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        badgeStyles[place.category]
                      }`}
                    >
                      {catMeta?.icon}
                      <span>{place.categoryLabel}</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {place.id}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base leading-snug group-hover:text-teal-700 transition-colors">
                    {place.name}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-600 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{place.address}</span>
                  </p>

                  {place.notes && (
                    <p className="text-xs text-slate-600 bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 flex items-start gap-2">
                      <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>{place.notes}</span>
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  {/* Nút sao chép địa chỉ 1 chạm */}
                  <button
                    type="button"
                    onClick={() => handleCopy(place.id, place.address)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                    title="Sao chép địa chỉ để gửi Zalo hoặc đặt xe"
                    aria-label="Sao chép địa chỉ"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Chép địa chỉ</span>
                      </>
                    )}
                  </button>

                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold rounded-xl transition-colors"
                    title="Mở tìm kiếm vị trí trên Google Maps"
                  >
                    <span>Xem bản đồ</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Nút Xem thêm (Load More) */}
      {hasMore && (
        <div className="text-center pt-2 pb-4">
          <button
            onClick={() => setDisplayLimit((prev) => prev + 30)}
            className="px-6 py-3 bg-white border border-slate-300 hover:border-teal-600 text-slate-700 hover:text-teal-700 font-semibold text-sm rounded-2xl shadow-sm hover:shadow transition-all inline-flex items-center gap-2"
          >
            <span>Hiển thị thêm 30 địa điểm</span>
            <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 font-bold">
              (Còn {(filteredPlaces.length - displayLimit).toLocaleString("vi-VN")} điểm)
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
