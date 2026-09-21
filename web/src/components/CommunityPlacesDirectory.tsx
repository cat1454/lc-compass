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
  { key: "community", label: "Hành chính", icon: <Landmark className="w-3.5 h-3.5" /> },
  { key: "healthcare", label: "Y tế", icon: <HeartPulse className="w-3.5 h-3.5" /> },
  { key: "education", label: "Trường học", icon: <GraduationCap className="w-3.5 h-3.5" /> },
  { key: "market", label: "Chợ & Mua sắm", icon: <ShoppingBag className="w-3.5 h-3.5" /> },
  { key: "food", label: "Ẩm thực", icon: <UtensilsCrossed className="w-3.5 h-3.5" /> },
  { key: "park", label: "Công viên", icon: <Trees className="w-3.5 h-3.5" /> },
  { key: "living_service", label: "Tiện ích", icon: <Wrench className="w-3.5 h-3.5" /> },
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

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: initialPlaces.length };
    initialPlaces.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [initialPlaces]);

  const placesWithNotesCount = useMemo(
    () => initialPlaces.filter((p) => Boolean(p.notes && p.notes.trim().length > 0)).length,
    [initialPlaces]
  );

  const visiblePlaces = useMemo(
    () => filteredPlaces.slice(0, displayLimit),
    [filteredPlaces, displayLimit]
  );

  const hasMore = displayLimit < filteredPlaces.length;
  const isAnyFilterActive =
    selectedCategory !== "all" || selectedStreet !== "all" || query || onlyWithNotes;
  const currentCategoryLabel = CATEGORIES.find((c) => c.key === selectedCategory)?.label || "";

  const badgeStyles: Record<PlaceCategory, string> = {
    market: "bg-amber-50 text-amber-800 border-amber-200",
    park: "bg-emerald-50 text-emerald-800 border-emerald-200",
    healthcare: "bg-rose-50 text-rose-800 border-rose-200",
    education: "bg-blue-50 text-blue-800 border-blue-200",
    living_service: "bg-indigo-50 text-indigo-800 border-indigo-200",
    food: "bg-orange-50 text-orange-800 border-orange-200",
    community: "bg-purple-50 text-purple-800 border-purple-200",
  };

  return (
    <div className="space-y-4">

      {/* ════════════════════════════════════════════════════
          SEARCH PANEL — luôn ở đầu trang, nổi bật
          ════════════════════════════════════════════════════ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        {/* ── 1. Ô tìm kiếm chính ── */}
        <div className="p-4 sm:p-5">
          <label
            htmlFor="places-search"
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            Tìm địa điểm
          </label>
          <div className="relative">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="places-search"
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setDisplayLimit(30);
              }}
              placeholder="Chợ, tiệm thuốc, trường học, UBND, quán ăn..."
              style={{ fontSize: "16px" }}
              className="touch-target w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white focus:border-teal-400
                         transition-all text-slate-800 placeholder:text-slate-400"
              aria-label="Tìm tiện ích đời sống theo từ khóa"
              autoComplete="off"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setDisplayLimit(30);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center
                           justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 transition-colors"
                aria-label="Xóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ── 2. Lọc theo nhóm tiện ích (Category chips) ── */}
        <div className="px-4 sm:px-5 pb-3 border-t border-slate-100 pt-3">
          <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
            Nhóm tiện ích
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              const count = categoryCounts[cat.key] || 0;
              return (
                <button
                  key={cat.key}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setSelectedCategory(cat.key);
                    setDisplayLimit(30);
                  }}
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-teal-700 text-white shadow-sm"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                  }`}
                >
                  <span className={isSelected ? "text-teal-200" : "text-slate-400"}>
                    {cat.icon}
                  </span>
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

        {/* ── 3. Lọc theo tuyến đường ── */}
        <div className="px-4 sm:px-5 pb-3 border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between gap-3 mb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Tuyến đường
            </p>
            <select
              aria-label="Lọc theo tuyến đường"
              value={selectedStreet}
              onChange={(e) => {
                setSelectedStreet(e.target.value);
                setDisplayLimit(30);
              }}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700
                         font-medium text-xs focus:outline-none focus:border-teal-500 max-w-[200px] sm:max-w-xs"
            >
              <option value="all">Tất cả ({availableStreets.length} tuyến)</option>
              {availableStreets.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Quick street chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
            <button
              type="button"
              onClick={() => { setSelectedStreet("all"); setDisplayLimit(30); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                selectedStreet === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
              }`}
            >
              Tất cả
            </button>
            {TOP_STREETS.map((st) => {
              const isSelected = selectedStreet.toLowerCase() === st.toLowerCase();
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => { setSelectedStreet(isSelected ? "all" : st); setDisplayLimit(30); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                    isSelected
                      ? "bg-teal-700 text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                  }`}
                >
                  {st}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 4. Bộ lọc nâng cao + Đặt lại ── */}
        <div className="px-4 sm:px-5 py-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => { setOnlyWithNotes(!onlyWithNotes); setDisplayLimit(30); }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              onlyWithNotes
                ? "bg-amber-100 text-amber-900 border border-amber-300"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${onlyWithNotes ? "text-amber-600" : "text-slate-400"}`} />
            Có ghi chú / chỉ dẫn ({placesWithNotesCount})
          </button>

          {isAnyFilterActive && (
            <button
              type="button"
              onClick={() => { update({ category: "all", street: "all", search: "", notes: "" }); setDisplayLimit(30); }}
              className="text-xs text-teal-700 hover:text-teal-900 underline font-semibold ml-auto"
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>

        {/* ── 5. Active filter chips ── */}
        {isAnyFilterActive && (
          <div className="mx-4 sm:mx-5 mb-3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Đang lọc:</span>
            {query && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 font-medium">
                &ldquo;{query}&rdquo;
                <button type="button" onClick={() => setQuery("")} aria-label="Xóa bộ lọc từ khóa">
                  <X className="w-3 h-3 text-slate-400 hover:text-slate-700" />
                </button>
              </span>
            )}
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 font-medium">
                {currentCategoryLabel}
                <button type="button" onClick={() => setSelectedCategory("all")} aria-label="Xóa bộ lọc nhóm">
                  <X className="w-3 h-3 text-teal-400 hover:text-teal-700" />
                </button>
              </span>
            )}
            {selectedStreet !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 font-medium">
                {selectedStreet}
                <button type="button" onClick={() => setSelectedStreet("all")} aria-label="Xóa bộ lọc tuyến đường">
                  <X className="w-3 h-3 text-blue-400 hover:text-blue-700" />
                </button>
              </span>
            )}
            {onlyWithNotes && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-medium">
                Có chỉ dẫn
                <button type="button" onClick={() => setOnlyWithNotes(false)} aria-label="Xóa bộ lọc có chỉ dẫn">
                  <X className="w-3 h-3 text-amber-400 hover:text-amber-700" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════
          KẾT QUẢ — đếm số lượng
          ════════════════════════════════════════════════════ */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 px-1">
        <span>
          Hiển thị{" "}
          <strong className="text-slate-800">{visiblePlaces.length}</strong>
          {" / "}
          <strong className="text-teal-700">{filteredPlaces.length.toLocaleString("vi-VN")}</strong>{" "}
          địa điểm
        </span>
        {query && (
          <span className="italic truncate max-w-[200px] sm:max-w-xs">
            Từ khóa: &ldquo;{query}&rdquo;
          </span>
        )}
      </div>

      {/* ════════════════════════════════════════════════════
          DANH SÁCH ĐỊA ĐIỂM
          ════════════════════════════════════════════════════ */}
      {filteredPlaces.length === 0 ? (
        /* Empty state */
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3 shadow-sm">
          <Search className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">
            {initialPlaces.length === 0 ? "Danh bạ chưa có dữ liệu" : "Không tìm thấy địa điểm phù hợp"}
          </h4>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Không có địa điểm nào khớp với từ khóa hoặc bộ lọc trong ranh giới Phường Liên Chiểu mới.
          </p>
          <button
            type="button"
            onClick={() => { update({ category: "all", street: "all", search: "", notes: "" }); }}
            className="mt-2 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors"
          >
            Xem toàn bộ địa điểm
          </button>
        </div>
      ) : (
        /* Grid kết quả */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {visiblePlaces.map((place) => {
            const googleMapsQuery = encodeURIComponent(`${place.name} ${place.address}`);
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${googleMapsQuery}`;
            const catMeta = CATEGORIES.find((c) => c.key === place.category);
            const isCopied = copiedId === place.id;

            return (
              <div
                key={place.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm
                           hover:shadow-md hover:border-teal-200 transition-all
                           flex flex-col justify-between gap-3 group"
              >
                {/* Top: badge + tên + địa chỉ */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0 ${
                        badgeStyles[place.category]
                      }`}
                    >
                      {catMeta?.icon}
                      <span>{place.categoryLabel}</span>
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-teal-700 transition-colors"
                      style={{ overflowWrap: "break-word" }}>
                    {place.name}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-500 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span style={{ overflowWrap: "break-word" }}>{place.address}</span>
                  </p>

                  {place.notes && (
                    <p className="text-xs text-slate-600 bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-start gap-2">
                      <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span style={{ overflowWrap: "break-word" }}>{place.notes}</span>
                    </p>
                  )}
                </div>

                {/* Bottom: actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(place.id, place.address)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl
                               bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                    aria-label="Sao chép địa chỉ"
                    title="Sao chép địa chỉ để gửi Zalo hoặc đặt xe"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Chép địa chỉ</span>
                      </>
                    )}
                  </button>

                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2
                               bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold
                               rounded-xl transition-colors"
                    aria-label={`Xem ${place.name} trên bản đồ`}
                  >
                    <span>Bản đồ</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Nút tải thêm */}
      {hasMore && (
        <div className="text-center pt-2 pb-4">
          <button
            type="button"
            onClick={() => setDisplayLimit((prev) => prev + 30)}
            className="px-6 py-3 bg-white border border-slate-300 hover:border-teal-500
                       text-slate-700 hover:text-teal-700 font-semibold text-sm rounded-2xl
                       shadow-sm hover:shadow transition-all inline-flex items-center gap-2"
          >
            <span>Hiển thị thêm 30 địa điểm</span>
            <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-bold">
              còn {(filteredPlaces.length - displayLimit).toLocaleString("vi-VN")}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
