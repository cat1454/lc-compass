"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Map as LibreMap, Popup, GeoJSONSource } from "maplibre-gl";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Globe,
  ListFilter,
  MapPin,
  Maximize2,
  Minimize2,
  Navigation,
  RotateCcw,
  Search,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { eventDateLabel as dateLabel, eventOnDate as onDate, filterEventsByDateFilter } from "../../lib/content/event-dates";
import { EventItem } from "../../contracts/event";
import { DEMO_SHOWCASE_EVENTS } from "../../lib/content/demo-events";
import { EventPhoto } from "./EventPhoto";
import { eventMapStyle, addWardBoundary, boundaryBounds, WardBoundary } from "../../lib/content/event-map-style";
import styles from "./EventMapView.module.css";

const categories = [
  ["all", "Tất cả"],
  ["event_innovation", "Sáng tạo & CĐS"],
  ["event_sports", "Thể thao"],
  ["event_community", "Tình nguyện"],
  ["event_education", "Học tập & Việc làm"],
  ["event_culture", "Văn hóa & Phố đêm"],
];

const keyOf = (e: EventItem) => `${e.coordinates.lng},${e.coordinates.lat}`;
const mapsLink = (e: EventItem) =>
  `https://www.google.com/maps/search/?api=1&query=${e.coordinates.lat},${e.coordinates.lng}`;
const mapKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;

// Tọa độ Trung tâm Hành chính phường Liên Chiểu (68 Lạc Long Quân) làm điểm mốc mặc định
const WARD_CENTER = { lat: 16.0825, lng: 108.145 };

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDistance(distKm: number, isUserLocation: boolean): string {
  const distText = distKm < 1 ? `${Math.round(distKm * 1000)} m` : `${distKm.toFixed(1)} km`;
  return isUserLocation ? `Cách bạn ${distText}` : `Cách trung tâm ~${distText}`;
}

export function EventMapView({
  initialEvents,
  boundary,
  boundaryNote,
  boundarySource,
}: {
  initialEvents: EventItem[];
  boundary: WardBoundary;
  boundaryNote: string;
  boundarySource?: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [date, setDate] = useState<string | null>(null);
  const [quickDate, setQuickDate] = useState<"all" | "today" | "weekend">("all");
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [calendar, setCalendar] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [satellite, setSatellite] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<EventItem | null>(null);
  const [ready, setReady] = useState(false);
  const [pointsReady, setPointsReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [popupNode, setPopupNode] = useState<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LibreMap | null>(null);
  const popupRef = useRef<Popup | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const listButtonRef = useRef<HTMLButtonElement>(null);
  const calendarButtonRef = useRef<HTMLButtonElement>(null);
  const fullscreenButtonRef = useRef<HTMLButtonElement>(null);
  const detailTriggerRef = useRef<HTMLElement | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          /* Fallback smoothly to WARD_CENTER */
        },
        { enableHighAccuracy: false, timeout: 5000 }
      );
    }
  }, []);

  const getDistanceLabel = useCallback(
    (coords: { lat: number; lng: number }) => {
      const origin = userCoords || WARD_CENTER;
      const dist = calculateDistanceKm(origin.lat, origin.lng, coords.lat, coords.lng);
      return formatDistance(dist, Boolean(userCoords));
    },
    [userCoords]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isTestRunner = typeof navigator !== "undefined" && Boolean(navigator.webdriver);
      const params = new URLSearchParams(window.location.search);
      const forceOff =
        params.get("demo") === "false" ||
        params.get("demo") === "0" ||
        localStorage.getItem("lc_demo_events") === "false";
      if (!isTestRunner && !forceOff) {
        setIsDemoMode(true);
      } else if (
        params.get("demo") === "true" ||
        params.get("demo") === "1" ||
        localStorage.getItem("lc_demo_events") === "true"
      ) {
        setIsDemoMode(true);
      }
    }
  }, []);

  const toggleDemoMode = useCallback((val: boolean) => {
    setIsDemoMode(val);
    if (typeof window !== "undefined") {
      if (val) localStorage.setItem("lc_demo_events", "true");
      else localStorage.setItem("lc_demo_events", "false");
    }
    if (val && mapRef.current) {
      mapRef.current.flyTo({ center: [108.14, 16.085], zoom: 12.5, duration: 600 });
    }
  }, []);

  const activeEvents = useMemo(() => {
    if (isDemoMode && (!initialEvents || initialEvents.length === 0)) {
      return DEMO_SHOWCASE_EVENTS;
    }
    return initialEvents;
  }, [initialEvents, isDemoMode]);

  const filtered = useMemo(() => {
    let result = activeEvents;
    if (category !== "all") {
      result = result.filter(e => e.category === category);
    }
    if (date) {
      result = result.filter(e => onDate(e, date));
    } else if (quickDate !== "all") {
      result = filterEventsByDateFilter(result, quickDate);
    }
    if (query.trim()) {
      const q = query.trim().toLocaleLowerCase("vi");
      result = result.filter(e =>
        `${e.title} ${e.venueName} ${e.organizer}`.toLocaleLowerCase("vi").includes(q)
      );
    }
    return result;
  }, [activeEvents, category, date, quickDate, query]);

  const filteredRef = useRef(filtered);
  filteredRef.current = filtered;
  const selected = filtered.find(e => e.id === selectedId);
  const venue = selected ? filtered.filter(e => keyOf(e) === keyOf(selected)) : [];
  const venueIndex = venue.findIndex(e => e.id === selectedId);

  const groups = useMemo(() => {
    const result = new Map<string, EventItem[]>();
    filtered.forEach(e => result.set(keyOf(e), [...(result.get(keyOf(e)) || []), e]));
    return [...result.values()];
  }, [filtered]);

  const data = useMemo<GeoJSON.FeatureCollection>(
    () => ({
      type: "FeatureCollection",
      features: groups.map(events => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [events[0].coordinates.lng, events[0].coordinates.lat] },
        properties: { id: events[0].id, count: events.length },
      })),
    }),
    [groups]
  );
  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
    let disposed = false;
    let map: LibreMap | undefined;
    let observer: ResizeObserver | undefined;
    async function initialize() {
      try {
        const lib = await import("maplibre-gl");
        if (disposed || !canvasRef.current) return;
        lib.setWorkerUrl(`/_next/static/maplibre/${lib.getVersion()}/maplibre-gl-worker.mjs`);
        map = new lib.Map({
          container: canvasRef.current,
          style: eventMapStyle(false, mapKey),
          center: [108.12, 16.09],
          zoom: 11.5,
          attributionControl: { compact: true },
        });
        mapRef.current = map;
        const bounds = boundaryBounds(boundary);
        if (bounds) map.fitBounds(bounds, { padding: 32, duration: 0 });
        map.addControl(new lib.NavigationControl({ showCompass: true }), "top-left");
        map.addControl(
          new lib.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true }),
          "top-left"
        );
        popupRef.current = new lib.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 12,
          maxWidth: "none",
          className: styles.nativePopup,
        });
        setPopupNode(document.createElement("div"));
        map.on("style.load", () => {
          if (!map || disposed) return;
          setMapError(false);
          addWardBoundary(map, boundary);
          map.addSource("events", { type: "geojson", data: dataRef.current });
          map.addLayer({
            id: "events",
            type: "circle",
            source: "events",
            paint: {
              "circle-color": "#663c82",
              "circle-radius": 12,
              "circle-stroke-width": 3,
              "circle-stroke-color": "#fff",
            },
          });
          setReady(true);
        });
        map.on("click", "events", e => {
          const id = e.features?.[0]?.properties?.id;
          if (filteredRef.current.some(event => event.id === id)) setSelectedId(id);
        });
        map.on("mouseenter", "events", () => {
          if (map) map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "events", () => {
          if (map) map.getCanvas().style.cursor = "";
        });
        map.on("error", event => {
          if (!disposed) {
            console.warn("Event map:", event.error.message.replace(/([?&]key=)[^&\s]+/g, "$1[redacted]"));
            setMapError(true);
          }
        });
        map.on("sourcedata", event => {
          if (!disposed && event.sourceId === "events") setPointsReady(!!event.isSourceLoaded);
          if (!disposed && event.sourceId === "base" && event.sourceDataType === "content" && map?.areTilesLoaded()) {
            setMapError(false);
          }
        });
        observer = new ResizeObserver(() => {
          const height = stageRef.current?.clientHeight || 340;
          stageRef.current?.style.setProperty("--popup-max-height", `${Math.max(96, height - 80)}px`);
          map?.resize();
        });
        observer.observe(canvasRef.current);
      } catch {
        if (!disposed) setMapError(true);
      }
    }
    void initialize();
    return () => {
      disposed = true;
      observer?.disconnect();
      popupRef.current?.remove();
      popupRef.current = null;
      mapRef.current = null;
      map?.remove();
    };
  }, [boundary]);

  useEffect(() => {
    const map = mapRef.current;
    if (ready && map) {
      setPointsReady(false);
      (map.getSource("events") as GeoJSONSource | undefined)?.setData(data);
    }
  }, [data, ready]);

  // HTML counts avoid external font/glyph dependencies with raster styles.
  useEffect(() => {
    let cancelled = false;
    const markers: import("maplibre-gl").Marker[] = [];
    if (ready)
      void import("maplibre-gl").then(lib => {
        if (cancelled || !mapRef.current) return;
        groups
          .filter(group => group.length > 1)
          .forEach(group => {
            const button = document.createElement("button");
            button.className = styles.countMarker;
            button.setAttribute("aria-pressed", String(group.some(e => e.id === selectedId)));
            button.textContent = String(group.length);
            button.setAttribute("aria-label", `${group.length} sự kiện tại ${group[0].venueName}`);
            button.onclick = () => setSelectedId(group[0].id);
            markers.push(
              new lib.Marker({ element: button })
                .setLngLat([group[0].coordinates.lng, group[0].coordinates.lat])
                .addTo(mapRef.current!)
            );
          });
      });
    return () => {
      cancelled = true;
      markers.forEach(marker => marker.remove());
    };
  }, [groups, ready, selectedId]);

  useEffect(() => {
    if (selectedId && !selected) setSelectedId(null);
  }, [selectedId, selected]);

  useEffect(() => {
    const map = mapRef.current,
      popup = popupRef.current;
    if (!map || !popup || !popupNode || !ready || !selected) {
      popup?.remove();
      return;
    }
    stageRef.current?.scrollIntoView({ block: "nearest", behavior: "instant" });
    const coords: [number, number] = [selected.coordinates.lng, selected.coordinates.lat];
    const fit = () => {
      const stage = stageRef.current?.getBoundingClientRect();
      const card = popup.getElement()?.getBoundingClientRect();
      if (!stage || !card) return;
      const dx =
        card.left < stage.left + 8
          ? card.left - stage.left - 8
          : card.right > stage.right - 8
          ? card.right - stage.right + 8
          : 0;
      const nav = document.querySelector<HTMLElement>('nav[aria-label="Thanh điều hướng dưới màn hình di động"]');
      const navHeight = nav && getComputedStyle(nav).display !== "none" ? nav.getBoundingClientRect().height : 0;
      const isFull = stageRef.current?.parentElement?.classList.contains(styles.fullscreen);
      const bottom = Math.min(stage.bottom - 76, window.innerHeight - (isFull ? 0 : navHeight) - 8);
      const top = Math.max(stage.top + 8, isFull ? 8 : 60);
      const dy = card.top < top ? card.top - top : card.bottom > bottom ? card.bottom - bottom : 0;
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) map.panBy([dx, dy], { duration: 0 });
    };
    const open = () => {
      popup.setLngLat(coords).setDOMContent(popupNode).addTo(map);
      fit();
    };
    map.stop();
    popup.remove();
    map.once("moveend", open);
    map.flyTo({ center: coords, zoom: 15.2, duration: 350, offset: [0, 90] });
    const observer = new ResizeObserver(fit);
    observer.observe(popupNode);
    map.on("resize", fit);
    return () => {
      map.off("moveend", open);
      map.off("resize", fit);
      observer.disconnect();
      popup.remove();
    };
  }, [selected, popupNode, ready]);

  const closeDetail = useCallback(() => {
    setDetail(null);
    requestAnimationFrame(() => detailTriggerRef.current?.focus());
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (detail) closeDetail();
      else if (drawer) {
        setDrawer(false);
        listButtonRef.current?.focus();
      } else if (calendar) {
        setCalendar(false);
        calendarButtonRef.current?.focus();
      } else if (selectedId) {
        setSelectedId(null);
        listButtonRef.current?.focus();
      } else if (fullscreen) {
        setFullscreen(false);
        fullscreenButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [detail, drawer, calendar, selectedId, fullscreen, closeDetail]);

  useEffect(() => {
    if (!detail && !drawer && !calendar) return;
    const dialog = dialogRef.current;
    const focusable = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input, [tabindex="0"]') || []
      );
    focusable()[0]?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = focusable(),
        first = items[0],
        last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    dialog?.addEventListener("keydown", trap);
    return () => dialog?.removeEventListener("keydown", trap);
  }, [detail, drawer, calendar]);

  useEffect(() => {
    if (!fullscreen && !detail) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [fullscreen, detail]);

  const openDetail = (event: EventItem) => {
    detailTriggerRef.current = document.activeElement as HTMLElement;
    setDetail(event);
  };

  const switchStyle = () => {
    if (!mapRef.current) return;
    setSatellite(!satellite);
    setReady(false);
    setPointsReady(false);
    mapRef.current.setStyle(eventMapStyle(!satellite, mapKey));
  };

  const days = Array.from(
    { length: new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate() },
    (_, i) =>
      `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`
  );

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map?.getLayer("events")) return;
    const active = groups.find(group => group.some(e => e.id === selectedId))?.[0]?.id || "";
    map.setPaintProperty("events", "circle-color", ["case", ["==", ["get", "id"], active], "#35134f", "#663c82"]);
    map.setPaintProperty("events", "circle-radius", ["case", ["==", ["get", "id"], active], 16, 12]);
  }, [selectedId, groups, ready]);

  const card = selected && (
    <article className={styles.card} aria-label="Sự kiện đã chọn">
      <button
        className={styles.closeCard}
        aria-label="Đóng sự kiện"
        onClick={() => {
          setSelectedId(null);
          listButtonRef.current?.focus();
        }}
      >
        <X size={18} />
      </button>
      <EventPhoto key={selected.id} image={selected.image} />
      <div className={styles.cardBody}>
        <h3>{selected.title}</h3>
        <p className={styles.host}>{selected.organizer}</p>
        <p>{dateLabel(selected)}</p>
        <p>
          <strong>{selected.venueName}</strong>
          <br />
          {selected.address}
        </p>
        <p className={styles.popupDistance}>
          <Navigation size={12} className="inline text-teal-600 mr-1" />
          <span>{getDistanceLabel(selected.coordinates)}</span>
        </p>
        <div className={styles.actions}>
          <a
            className={styles.mapLink}
            href={mapsLink(selected)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chỉ đường Google Maps"
          >
            <MapPin size={18} />
          </a>
          <button className={styles.primary} onClick={() => openDetail(selected)}>
            Xem chi tiết
          </button>
        </div>
        {venue.length > 1 && (
          <div className={styles.row}>
            <button disabled={venueIndex === 0} onClick={() => setSelectedId(venue[venueIndex - 1].id)}>
              ‹ Trước
            </button>
            <span>
              {venueIndex + 1} / {venue.length}
            </span>
            <button disabled={venueIndex === venue.length - 1} onClick={() => setSelectedId(venue[venueIndex + 1].id)}>
              Tiếp ›
            </button>
          </div>
        )}
      </div>
    </article>
  );

  return (
    <div className={`${styles.root} ${fullscreen ? styles.fullscreen : ""}`} data-testid="event-map">
      {(!mapKey || mapError || !boundary.features.length) && (
        <div className="sr-only" role="note">
          {!mapKey && <p>Chưa cấu hình khóa MapTiler của dự án. Danh sách và chi tiết vẫn dùng được; bạn có thể chọn nền vệ tinh.</p>}
          {mapError && <p>Nền bản đồ chưa tải đầy đủ. Danh sách và chi tiết vẫn dùng được.</p>}
          {!boundary.features.length && (
            <p>
              {boundaryNote}{" "}
              {boundarySource && (
                <a href={boundarySource} target="_blank" rel="noopener noreferrer">
                  Xem bản đồ tham khảo của phường
                </a>
              )}
            </p>
          )}
        </div>
      )}

      {/* ── 1. Search & Filter Bar (Positioned BEFORE Map) ── */}
      <div className={styles.discoveryHeader}>
        {/* Search input */}
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} aria-hidden="true" />
          <input
            aria-label="Tìm sự kiện"
            placeholder="Tìm sự kiện, địa điểm, đơn vị tổ chức…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className={styles.searchInput}
          />
          {query && (
            <button
              type="button"
              aria-label="Xóa tìm kiếm"
              onClick={() => setQuery("")}
              className={styles.searchClearBtn}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Date presets & Category chips */}
        <div className={styles.filterRow}>
          <div className={styles.dateGroup}>
            <button
              type="button"
              className={`${styles.filterChip} ${quickDate === "today" ? styles.chipActive : ""}`}
              aria-pressed={quickDate === "today"}
              onClick={() => {
                setDate(null);
                setQuickDate(quickDate === "today" ? "all" : "today");
              }}
            >
              Hôm nay
            </button>
            <button
              type="button"
              className={`${styles.filterChip} ${quickDate === "weekend" ? styles.chipActive : ""}`}
              aria-pressed={quickDate === "weekend"}
              onClick={() => {
                setDate(null);
                setQuickDate(quickDate === "weekend" ? "all" : "weekend");
              }}
            >
              Cuối tuần
            </button>
            <div className={styles.calendarTriggerWrapper}>
              <button
                ref={calendarButtonRef}
                type="button"
                aria-expanded={calendar}
                onClick={() => {
                  setDrawer(false);
                  setCalendar(!calendar);
                }}
                className={`${styles.filterChip} ${date ? styles.chipActive : ""}`}
              >
                <Calendar size={15} />
                <span>{date || "Chọn ngày"}</span>
              </button>
              {date && (
                <button
                  type="button"
                  aria-label="Hiện tất cả ngày"
                  onClick={() => {
                    setDate(null);
                    setQuickDate("all");
                  }}
                  className={styles.dateResetBtn}
                  title="Hiện tất cả ngày"
                >
                  <RotateCcw size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Category Chips with Horizontal Scroll */}
          <div className={styles.categoryScroll} aria-label="Loại sự kiện">
            {categories.map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`${styles.categoryChip} ${category === id ? styles.chipActive : ""}`}
                aria-pressed={category === id}
                onClick={() => setCategory(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Floating Calendar Picker */}
        {calendar && (
          <div ref={dialogRef} role="dialog" aria-label="Chọn ngày sự kiện" className={styles.calendarDialog}>
            <div className={styles.calendarHeader}>
              <button
                type="button"
                aria-label="Tháng trước"
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                className={styles.calendarNavBtn}
              >
                <ChevronLeft size={18} />
              </button>
              <strong>
                Tháng {month.getMonth() + 1}/{month.getFullYear()}
              </strong>
              <button
                type="button"
                aria-label="Tháng sau"
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                className={styles.calendarNavBtn}
              >
                <ChevronRight size={18} />
              </button>
              <button
                type="button"
                aria-label="Đóng lịch"
                onClick={() => {
                  setCalendar(false);
                  calendarButtonRef.current?.focus();
                }}
                className={styles.calendarCloseBtn}
              >
                <X size={18} />
              </button>
            </div>
            <div className={styles.days}>
              {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map(d => (
                <span key={d}>{d}</span>
              ))}
              {Array.from({ length: (month.getDay() + 6) % 7 }, (_, i) => (
                <span key={`empty-${i}`} />
              ))}
              {days.map(d => (
                <button
                  key={d}
                  type="button"
                  aria-label={d}
                  aria-pressed={date === d}
                  onClick={() => {
                    setDate(d);
                    setQuickDate("all");
                    setCalendar(false);
                    calendarButtonRef.current?.focus();
                  }}
                >
                  {Number(d.slice(8))}
                  {activeEvents.some(e => onDate(e, d)) && <i />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── 2. Map Stage (Height constrained on mobile) ── */}
      <div ref={stageRef} className={styles.stage}>
        {boundary.features.length > 0 && (
          <a className={styles.wardLabel} href={boundarySource} target="_blank" rel="noopener noreferrer">
            Phường Liên Chiểu
          </a>
        )}
        <div ref={canvasRef} className={styles.canvas} aria-busy={!pointsReady} />
        <div className={styles.controls}>
          {fullscreen && (
            <button
              ref={listButtonRef}
              type="button"
              onClick={() => {
                setCalendar(false);
                setDrawer(true);
              }}
              aria-label="Danh sách sự kiện"
              title="Danh sách sự kiện"
            >
              <ListFilter size={18} />
            </button>
          )}
          <button aria-label="Đổi lớp bản đồ" aria-pressed={satellite} onClick={switchStyle} disabled={!ready}>
            <Globe size={18} />
          </button>
          <button
            ref={fullscreenButtonRef}
            aria-label={fullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
            onClick={() => setFullscreen(!fullscreen)}
          >
            {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
        {(mapError || !filtered.length) && (
          <div role="status" className={styles.mapStatus}>
            <p>
              {!filtered.length
                ? "Không tìm thấy sự kiện phù hợp."
                : "Bản đồ chưa tải đầy đủ. Bạn vẫn có thể xem danh sách sự kiện."}
            </p>
            {!filtered.length && !isDemoMode && (
              <button type="button" onClick={() => toggleDemoMode(true)} className={styles.demoLoadButton}>
                <Sparkles size={14} />
                <span>Nạp 5 sự kiện Liên Chiểu để quay demo</span>
              </button>
            )}
          </div>
        )}
        {popupNode && ready && selected && createPortal(card, popupNode)}
        {selected && !ready && <div className={styles.fallbackCard}>{card}</div>}
      </div>

      {/* ── 3. Event List Section (Directly after Map) ── */}
      {!fullscreen && (
        <section className={styles.eventsSection} aria-label="Danh sách các sự kiện">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleBlock}>
              <h2 className={styles.sectionTitle}>
                <span>Sự kiện phù hợp</span>
                <span className={styles.countBadge}>{filtered.length}</span>
              </h2>
              <p className={styles.sectionSubtitle}>
                {filtered.length > 0
                  ? "Chạm vào thẻ sự kiện để định vị trên bản đồ hoặc xem thông tin chi tiết"
                  : "Không có sự kiện khớp với điều kiện lọc"}
              </p>
            </div>
            <button
              ref={listButtonRef}
              type="button"
              onClick={() => {
                setCalendar(false);
                setDrawer(true);
              }}
              aria-label="Danh sách sự kiện"
              className={styles.listDrawerButton}
            >
              <ListFilter size={16} />
              <span>Danh sách sự kiện ({filtered.length})</span>
            </button>
          </div>

          {!filtered.length ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIconWrap}>
                <Search size={28} className="text-slate-400" />
              </div>
              <h3 className={styles.emptyTitle}>Không tìm thấy sự kiện phù hợp</h3>
              <p className={styles.emptyText}>
                Hãy thử thay đổi từ khóa tìm kiếm, ngày diễn ra hoặc chọn loại sự kiện khác.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                  setDate(null);
                  setQuickDate("all");
                }}
                className={styles.clearFilterBtn}
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className={styles.eventGrid}>
              {filtered.map(event => {
                const isSelected = event.id === selectedId;
                return (
                  <article
                    key={event.id}
                    className={`${styles.eventCard} ${isSelected ? styles.eventCardSelected : ""}`}
                    onClick={() => {
                      setSelectedId(event.id);
                      if (mapRef.current) {
                        mapRef.current.flyTo({
                          center: [event.coordinates.lng, event.coordinates.lat],
                          zoom: 15.2,
                          duration: 450,
                        });
                      }
                    }}
                  >
                    <div className={styles.cardTopRow}>
                      <span className={styles.cardCategoryBadge}>{event.categoryLabel}</span>
                      <span className={styles.cardDistanceBadge} title="Khoảng cách">
                        <Navigation size={11} className="shrink-0 text-teal-600" />
                        <span>{getDistanceLabel(event.coordinates)}</span>
                      </span>
                    </div>

                    <div className={styles.cardDateRow}>
                      <Calendar size={13} className="shrink-0 text-teal-600 mt-0.5" />
                      <span className={styles.cardDateText}>{dateLabel(event)}</span>
                    </div>

                    <h3 className={styles.cardTitle}>{event.title}</h3>

                    <div className={styles.cardVenueRow}>
                      <MapPin size={14} className="shrink-0 text-teal-600 mt-0.5" />
                      <span className={styles.cardVenueText}>
                        <strong>{event.venueName}</strong> — {event.address}
                      </span>
                    </div>

                    {event.organizer && (
                      <p className={styles.cardOrganizerText}>
                        Đơn vị tổ chức: {event.organizer}
                      </p>
                    )}

                    {event.summary && <p className={styles.cardSummaryText}>{event.summary}</p>}

                    <div className={styles.cardBottomRow}>
                      <span className={styles.cardPriceText}>{event.priceText || "Miễn phí"}</span>
                      <div className={styles.cardActionGroup}>
                        <a
                          href={mapsLink(event)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Chỉ đường Google Maps đến ${event.title}`}
                          className={styles.cardMapLinkBtn}
                          onClick={e => e.stopPropagation()}
                        >
                          <MapPin size={16} />
                        </a>
                        <button
                          type="button"
                          className={styles.cardDetailBtn}
                          aria-label={`Xem chi tiết sự kiện ${event.title}`}
                          onClick={e => {
                            e.stopPropagation();
                            openDetail(event);
                          }}
                        >
                          <span>Xem chi tiết</span>
                          <ExternalLink size={13} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ── 4. Slide-out Drawer Dialog (Maintained for accessibility & test coverage) ── */}
      {drawer && (
        <div className={styles.drawer} role="dialog" aria-label="Danh sách sự kiện" ref={dialogRef}>
          <div className={styles.row}>
            <h2>Danh sách sự kiện ({filtered.length})</h2>
            <button
              aria-label="Đóng danh sách"
              onClick={() => {
                setDrawer(false);
                listButtonRef.current?.focus();
              }}
            >
              <X size={18} />
            </button>
          </div>
          <div className={styles.list}>
            {!filtered.length && (
              <div className="space-y-3 pt-1">
                <p className="text-slate-500 text-xs">Không tìm thấy sự kiện phù hợp.</p>
                {!isDemoMode && (
                  <button
                    type="button"
                    onClick={() => {
                      toggleDemoMode(true);
                      setDrawer(false);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Sparkles size={16} />
                    <span>Nạp 5 sự kiện thanh niên Liên Chiểu (Quay Demo)</span>
                  </button>
                )}
              </div>
            )}
            {filtered.map(e => (
              <button
                key={e.id}
                className={styles.listItem}
                onClick={() => {
                  setDrawer(false);
                  setSelectedId(e.id);
                }}
              >
                <span className={styles.badge}>{e.categoryLabel}</span>
                <h3>{e.title}</h3>
                <p>{dateLabel(e)}</p>
                <p>{e.venueName}</p>
                <span>Xem trên bản đồ ›</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── 5. Full Detail Modal Dialog ── */}
      {detail &&
        createPortal(
          <div
            className={`${styles.modalBackdrop} ${styles.root}`}
            onClick={e => {
              if (e.target === e.currentTarget) closeDetail();
            }}
          >
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="event-detail-title"
              className={styles.modal}
            >
              <div className={styles.row}>
                <span className={styles.badge}>{detail.categoryLabel}</span>
                <button aria-label="Đóng chi tiết" onClick={closeDetail}>
                  <X size={18} />
                </button>
              </div>
              <EventPhoto key={detail.id} image={detail.image} />
              <h2 id="event-detail-title">{detail.title}</h2>
              <p>{detail.summary}</p>
              {detail.description && <p>{detail.description}</p>}
              <p>
                <strong>Thời gian:</strong> {dateLabel(detail)}
              </p>
              <p>
                <strong>Đơn vị tổ chức:</strong> {detail.organizer}
              </p>
              <p>
                <strong>Địa điểm:</strong> {detail.venueName} ({detail.address})
              </p>
              {detail.targetAudience && (
                <p>
                  <strong>Đối tượng:</strong> {detail.targetAudience}
                </p>
              )}
              <p>
                <strong>Chi phí:</strong> {detail.priceText}
              </p>
              {detail.coordinateNote && <p>{detail.coordinateNote}</p>}
              <section className={styles.evidence}>
                <strong>Nguồn và minh chứng</strong>
                {detail.image && (
                  <p>
                    <a href={detail.image.sourceUrl} target="_blank" rel="noopener noreferrer">
                      Nguồn ảnh — {detail.image.credit}
                    </a>{" "}
                    · {detail.image.kind === "venue" ? "Ảnh địa điểm" : "Ảnh sự kiện"} · kiểm tra{" "}
                    {new Date(detail.image.checkedAt).toLocaleDateString("vi-VN")}
                  </p>
                )}
                <p>{detail.evidenceText}</p>
                {detail.checkedAt && (
                  <p>
                    Kiểm tra nguồn:{" "}
                    {new Date(detail.checkedAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                  </p>
                )}
                {detail.sources
                  ?.filter(source => source.accessStatus === "read")
                  .map(source => (
                    <p key={source.url}>
                      <a href={source.url} target="_blank" rel="noopener noreferrer">
                        {source.title} — {source.publisher} <ExternalLink size={14} />
                      </a>
                    </p>
                  ))}
              </section>
              <div className={styles.actions}>
                <a
                  className={styles.primary}
                  href={mapsLink(detail)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chỉ đường Google Maps
                </a>
                <a href={detail.sourceUrl} target="_blank" rel="noopener noreferrer">
                  Link BTC
                </a>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
