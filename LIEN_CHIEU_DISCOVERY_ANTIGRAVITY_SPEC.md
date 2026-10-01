# LIEN CHIEU DISCOVERY MAP
## Product Specification + Technical Blueprint + Antigravity Build Prompt

> Tài liệu này là nguồn yêu cầu chính cho AI coding agent (Antigravity).
> Mục tiêu: xây một web app khám phá **sự kiện + địa điểm đời sống/Local Gems tại Liên Chiểu, Đà Nẵng**, mobile-first, có bản đồ, dữ liệu có nguồn gốc kiểm chứng được và tuyệt đối không tự bịa địa điểm/sự kiện.

---

# 0. NGUYÊN TẮC LÀM VIỆC CHO ANTIGRAVITY

Antigravity phải tuân thủ các nguyên tắc sau trong toàn bộ dự án:

1. **Không bịa dữ liệu thực tế.**
   - Không tự tạo tên sự kiện, địa điểm, địa chỉ, ngày giờ, tọa độ hoặc đơn vị tổ chức rồi coi đó là dữ liệu thật.
   - Seed data dùng để test UI phải được đánh dấu rõ là `demo` hoặc `mock`.
   - Dữ liệu production chỉ được publish khi có `source_url` hoặc bằng chứng nguồn tương đương.

2. **Source-first.**
   - Mỗi Event/Place phải truy ngược được về nguồn.
   - Mọi record phải có metadata provenance.
   - Nếu thiếu bằng chứng, record ở trạng thái `pending_verification`.

3. **Mobile-first.**
   - Giao diện chính được thiết kế cho điện thoại.
   - Desktop là bản mở rộng, không phải thiết kế gốc.

4. **Không phá schema/API khi chỉnh UI.**
   - UI refactor không được làm thay đổi contract dữ liệu nếu chưa có migration rõ ràng.

5. **Không scrape trái điều khoản sử dụng.**
   - Ưu tiên API chính thức, RSS, Open Data, OpenStreetMap/Overpass, dữ liệu được cho phép reuse.
   - Với Facebook, Google Maps hoặc nguồn có hạn chế scraping: ưu tiên manual verification/link-out/official API nếu có quyền.

6. **Không để LLM trở thành nguồn sự thật.**
   - AI chỉ được dùng để:
     - tìm ứng viên,
     - trích xuất,
     - chuẩn hóa,
     - phân loại,
     - gợi ý duplicate,
     - tạo tóm tắt.
   - AI không được tự xác nhận một record là đúng nếu không có bằng chứng nguồn.

---

# 1. PRODUCT VISION

## 1.1 Tên tạm

**Liên Chiểu Discovery Map**

Có thể đổi branding sau.

## 1.2 Mục tiêu sản phẩm

Một web app giúp người dân, sinh viên và khách đến Liên Chiểu:

- xem các sự kiện đang/sắp diễn ra;
- khám phá địa điểm đời sống;
- tìm Local Gems;
- xem địa điểm gần mình;
- lọc theo thời gian/chủ đề;
- mở chỉ đường;
- lưu địa điểm yêu thích;
- biết thông tin đó đến từ đâu;
- báo sai hoặc đề xuất địa điểm/sự kiện mới.

## 1.3 Bài toán chính

Hiện thông tin địa phương thường nằm rải rác trên:

- website chính quyền;
- website/fanpage trường đại học;
- trung tâm văn hóa/thể thao;
- đơn vị tổ chức;
- venue;
- fanpage cộng đồng;
- nền tảng sự kiện;
- OpenStreetMap;
- bài đăng riêng lẻ.

Sản phẩm gom chúng lại thành **một bản đồ có thể khám phá và kiểm chứng**.

---

# 2. HỆ THỐNG THAM KHẢO

Reference chính:

- Hanoi Maps Events:
  - https://hanoimaps.github.io/events/
- Repository:
  - https://github.com/hanoimaps/hanoimaps.github.io

Điểm cần học từ Hanoi Maps:

- Map-first UX.
- Dữ liệu sự kiện ở dạng GeoJSON.
- Filter theo ngày.
- Marker trên bản đồ.
- Popup thông tin.
- Deep link qua URL.
- Geolocation.
- Street/satellite map.
- Event có source/event URL.

Điểm không nên copy nguyên:

- Popup desktop làm interaction chính.
- Toàn bộ dữ liệu đẩy trong một JSON khi hệ thống lớn.
- Thiếu workflow moderation mạnh.
- Chưa tách rõ Place/Event/Organizer/Source.
- Mobile UX còn có thể tối ưu hơn.
- Chưa đủ metadata về freshness/verification/provenance.

---

# 3. PHẠM VI SẢN PHẨM

## 3.1 MVP

MVP bắt buộc có:

- Map Liên Chiểu.
- Event discovery.
- Place discovery.
- Search.
- Category filters.
- Date filters.
- Mobile bottom sheet.
- Event detail.
- Place detail.
- Directions link.
- Share/deep-link.
- Nearby.
- Geolocation.
- Source attribution.
- Verification status.
- Admin moderation cơ bản.
- Pipeline import dữ liệu.
- Duplicate detection.
- Expired event handling.
- Không fake data.

## 3.2 V1

Sau MVP:

- Favorites.
- User submit.
- User correction/report.
- Event reminders.
- Better full-text search.
- Better Local Gems ranking.
- Saved filters.
- Basic analytics.
- PWA.

## 3.3 V2

Không build sớm nếu chưa có usage:

- Recommendation AI phức tạp.
- Personalization ML.
- Social feed.
- Chatbot.
- Gamification.
- Passport/stamp.
- Real-time collaborative edits.
- Advanced route planning.

---

# 4. PERSONAS

## 4.1 Sinh viên

Muốn biết:

- hôm nay có gì;
- gần trường có gì;
- workshop/CLB/sự kiện miễn phí;
- quán, công viên, thể thao, địa điểm học tập.

## 4.2 Người dân địa phương

Muốn:

- xem hoạt động cộng đồng;
- chợ/công viên/y tế/dịch vụ;
- sự kiện phường;
- hoạt động văn hóa/thể thao.

## 4.3 Người mới đến

Muốn:

- khám phá khu vực;
- địa điểm đáng đi;
- điểm gần mình;
- xem nguồn để tin cậy.

## 4.4 Admin/curator

Muốn:

- nhập record;
- xem nguồn;
- verify;
- xử lý duplicate;
- sửa giờ/địa chỉ;
- expire/cancel event.

---

# 5. MOBILE-FIRST DESIGN STANDARD

## 5.1 Primary viewport

Thiết kế chính:

```text
390 x 844 px
```

Hỗ trợ tối thiểu:

```text
>= 360 px width
```

Breakpoints:

```text
< 768 px       Mobile
768–1023 px    Tablet
>= 1024 px     Desktop
```

## 5.2 Mobile rules bắt buộc

- Dùng `100dvh`, không dùng `100vh` cho app shell.
- Respect:
  - `env(safe-area-inset-top)`
  - `env(safe-area-inset-bottom)`
- Touch target tối thiểu khoảng `44x44px`.
- Không horizontal body scrolling.
- Map chiếm full available viewport.
- Search nổi phía trên.
- Filter dạng horizontal chips.
- Mobile không dùng popup nhỏ làm interaction chính.
- Marker click → mở bottom sheet.
- Bottom navigation cố định phía dưới.
- Calendar đầy đủ chỉ mở khi người dùng bấm "Chọn ngày".

## 5.3 Mobile app shell

```text
┌─────────────────────────────┐
│ 🔍 Tìm ở Liên Chiểu...   ☰ │
│                             │
│ [Hôm nay][Ngày mai][Event] │
│                             │
│            MAP              │
│       ●        ●            │
│               ●             │
│                         ◎   │
│                         ◉   │
│                             │
├─────────────────────────────┤
│ ─────────                   │
│ Tên event/place             │
│ 1.2 km · hôm nay            │
│ ✓ Đã xác minh               │
│ [Chi tiết] [Chỉ đường]     │
├─────────────────────────────┤
│ 🗺 Khám phá  📅 Event  ♡   │
└─────────────────────────────┘
```

## 5.4 Bottom Sheet

Bottom sheet có 3 mức:

### Collapsed

Khoảng 100–140px.

Hiển thị:

- tên;
- category;
- khoảng cách;
- thời gian nếu là event;
- verification badge.

### Half

Khoảng 50–60% màn hình.

Hiển thị:

- ảnh;
- tên;
- mô tả ngắn;
- thời gian;
- địa chỉ;
- CTA.

### Expanded

Gần full screen.

Hiển thị:

- full detail;
- source;
- organizer;
- map preview;
- report correction;
- related places/events.

## 5.5 Filter date

Mặc định:

```text
Hôm nay
Ngày mai
Cuối tuần
Chọn ngày
```

Không show full month calendar trực tiếp trên map.

## 5.6 Map controls

Bên phải:

- locate me;
- zoom;
- layer/style toggle.

Không che bottom sheet.

## 5.7 Bottom nav

MVP:

```text
Khám phá
Sự kiện
Đã lưu
```

Nếu chưa làm favorites thì có thể chỉ:

```text
Khám phá
Sự kiện
```

Không tạo quá nhiều tab.

---

# 6. INFORMATION ARCHITECTURE

```text
/
├── Explore Map
├── Events
├── Places
├── Search
├── Saved
├── Event Detail
├── Place Detail
├── Submit / Report
└── Admin
```

Mobile ưu tiên map ở `/`.

---

# 7. CORE USER FLOWS

## 7.1 Khám phá gần mình

```text
Open app
→ Ask location permission
→ Show map around user
→ Nearby records load
→ User selects marker
→ Bottom sheet opens
→ User taps details / directions
```

## 7.2 Tìm event hôm nay

```text
Open app
→ Tap "Hôm nay"
→ Filter events active today
→ Map + list synchronize
→ Select event
→ View source and details
```

## 7.3 Tìm theo category

```text
Search/Filter
→ Select category
→ map filters
→ result count updates
→ select result
```

## 7.4 Share

```text
Open event/place
→ Share
→ URL includes record slug/id
→ receiver opens same record
```

## 7.5 Report wrong data

```text
Detail
→ Báo thông tin sai
→ choose type
→ optional note
→ moderation queue
```

---

# 8. FUNCTIONAL REQUIREMENTS

# 8.1 MAP

Must have:

- MapLibre GL JS.
- GeoJSON source.
- marker clustering.
- selected marker state.
- hover only on desktop.
- click/tap on mobile.
- fit bounds.
- zoom.
- geolocation.
- map/list sync.
- layer/style switch if tile provider supports it.

### Acceptance Criteria

- Map renders under 3 seconds on normal mobile connection when cached tiles are available.
- Selecting a marker selects corresponding list card.
- Selecting a list card pans/zooms to marker.
- Clusters expand when tapped.
- No marker is rendered with invalid coordinates.

---

# 8.2 SEARCH

Search across:

- event name;
- place name;
- organizer;
- category;
- tags;
- address text.

MVP can use client-side normalized search if dataset small.

Later use Postgres FTS.

---

# 8.3 FILTERS

Filters:

- Today.
- Tomorrow.
- Weekend.
- Custom date.
- Event category.
- Place category.
- Verified only.
- Nearby radius.
- Open now (places, optional).
- Free (events, only if price known).

Never infer price if source does not state it.

---

# 8.4 EVENT DETAIL

Required fields:

- name.
- date.
- start/end time if known.
- place/venue.
- address.
- organizer.
- short description.
- source.
- verification status.
- last verified time.
- directions.
- share.
- status.

Possible statuses:

```text
scheduled
updated
cancelled
postponed
expired
pending_verification
```

---

# 8.5 PLACE DETAIL

Required:

- name.
- category.
- address.
- coordinate.
- description if sourced.
- verified status.
- source(s).
- directions.
- nearby events.

Optional:

- opening hours.
- phone.
- website.
- social URL.

Only store fields with evidence.

---

# 8.6 DEEP LINKS

Examples:

```text
/event/{slug-or-id}
/place/{slug-or-id}
```

Map state can use:

```text
/?date=2026-10-01
/?category=community
/?lat=...&lng=...&zoom=...
```

Do not overstuff URL.

---

# 8.7 FAVORITES

Optional V1.

Store anonymously in localStorage for MVP.

Later sync with account.

---

# 8.8 USER SUBMISSION

User can submit:

- event;
- place;
- correction.

Submission never auto-publishes.

Status:

```text
submitted
reviewing
approved
rejected
needs_more_evidence
```

---

# 8.9 ADMIN

Admin must support:

- review queue;
- source link preview;
- approve/reject;
- merge duplicate;
- change verification state;
- edit record;
- expire/cancel event;
- audit log.

---

# 9. DATA MODEL

Use relational DB for canonical data.

Recommended:

```text
PostgreSQL + PostGIS
```

Supabase is suitable for MVP.

GeoJSON is an interchange/render format, not necessarily canonical storage.

---

# 9.1 EVENT

```ts
Event {
  id: UUID
  slug: string

  name: string
  description?: string

  start_at?: timestamp
  end_at?: timestamp
  date_precision: "exact" | "date_only" | "unknown_time"

  timezone: "Asia/Ho_Chi_Minh"

  venue_id?: UUID

  address_text?: string

  latitude?: number
  longitude?: number

  organizer_id?: UUID

  category_id?: UUID
  tags?: string[]

  price_text?: string
  ticket_url?: string

  status:
    | "scheduled"
    | "updated"
    | "cancelled"
    | "postponed"
    | "expired"
    | "pending_verification"

  verification_status:
    | "unverified"
    | "source_verified"
    | "human_verified"

  confidence_score?: number

  last_verified_at?: timestamp

  created_at: timestamp
  updated_at: timestamp
}
```

---

# 9.2 PLACE

```ts
Place {
  id: UUID
  slug: string

  name: string
  description?: string

  category_id: UUID

  address_text?: string

  latitude: number
  longitude: number

  osm_type?: string
  osm_id?: string

  website_url?: string
  social_url?: string
  phone?: string
  opening_hours?: string

  verification_status:
    | "unverified"
    | "source_verified"
    | "human_verified"

  last_verified_at?: timestamp

  created_at: timestamp
  updated_at: timestamp
}
```

---

# 9.3 ORGANIZER

```ts
Organizer {
  id: UUID
  name: string
  website_url?: string
  social_url?: string
  type?: string

  verification_status: string
}
```

---

# 9.4 SOURCE

```ts
Source {
  id: UUID

  entity_type: "event" | "place" | "organizer"
  entity_id: UUID

  source_type:
    | "official_website"
    | "government"
    | "school"
    | "venue"
    | "ticketing"
    | "osm"
    | "social"
    | "community_submission"
    | "manual"

  source_url: string

  title?: string

  discovered_at: timestamp
  checked_at: timestamp

  evidence_text?: string

  is_primary: boolean

  license?: string
  reuse_note?: string
}
```

---

# 9.5 MEDIA

```ts
Media {
  id: UUID
  entity_type: "event" | "place"
  entity_id: UUID

  media_type: "image"
  url: string

  source_url?: string
  license?: string
  attribution?: string

  approved_for_display: boolean
}
```

Không hotlink hình tùy tiện nếu không có quyền.

---

# 9.6 MODERATION

```ts
ModerationItem {
  id: UUID

  entity_type: string
  entity_id?: UUID

  action_type:
    | "new"
    | "update"
    | "duplicate"
    | "correction"
    | "cancelled_event"

  status:
    | "pending"
    | "approved"
    | "rejected"

  submitted_by?: UUID

  evidence: jsonb

  created_at: timestamp
  reviewed_at?: timestamp
}
```

---

# 10. GEOJSON OUTPUT

Example template ONLY.

Do not treat example as real data.

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": "uuid",
      "geometry": {
        "type": "Point",
        "coordinates": [108.000000, 16.000000]
      },
      "properties": {
        "entity_type": "event",
        "name": "DEMO EVENT",
        "status": "pending_verification",
        "verification_status": "unverified",
        "source_url": null
      }
    }
  ]
}
```

Coordinate order:

```text
[longitude, latitude]
```

Not:

```text
[latitude, longitude]
```

---

# 11. DUPLICATE DETECTION

Never dedupe only by exact string.

Candidate duplicate score:

```text
name similarity
+ same/similar date
+ same venue
+ distance between coordinates
+ same source URL
```

Suggested fingerprint:

```text
normalize(name)
+ event_date
+ normalized_venue
```

Potential duplicate → moderation queue.

Do not auto-delete unless very high-confidence rule is met.

---

# 12. VERIFICATION MODEL

Do not use a simple boolean only.

Use:

```text
unverified
source_verified
human_verified
```

Suggested internal confidence:

```text
0.0 – 1.0
```

Confidence is internal ranking metadata, not an absolute statement of truth.

Example components:

```text
+ official source present
+ exact date evidence
+ exact venue evidence
+ coordinates from reliable source
+ second independent source
+ human review
- only community submission
- missing exact location
- stale source
```

Never ask an LLM to "guess credibility".

---

# 13. DATA FRESHNESS

Every record should have:

```text
last_verified_at
source.checked_at
```

Event rules:

```text
end_at < now
→ status = expired
```

If source says cancelled:

```text
status = cancelled
```

Do not delete immediately.

Archive instead.

Place rules:

- reverify important places periodically;
- refresh opening hours more often than stable coordinates.

---

# 14. DATA SOURCES FOR LIÊN CHIỂU

The system must use a multi-source strategy.

## 14.1 Priority order

### Tier 1 – Primary / official

Prefer:

- Đà Nẵng official portals.
- Local government pages.
- Official cultural/sports organizations.
- Official university/school pages.
- Official organizer websites.
- Official venue pages.
- Ticketing/event organizer page.

### Tier 2 – Open geographic data

- OpenStreetMap.
- Overpass API.
- Nominatim for limited geocoding/reverse-geocoding where allowed.

### Tier 3 – Secondary discovery

- local news;
- community sites;
- public social pages.

Tier 3 is discovery evidence, not automatically truth.

---

# 15. OSM / OVERPASS FOR PLACE BOOTSTRAP

Goal:

Get baseline POIs such as:

- cafe;
- restaurant;
- food;
- market;
- park;
- sports;
- library;
- community centre;
- beach;
- tourism;
- education;
- healthcare;
- public services.

Important:

- First verify the **current administrative boundary** for Liên Chiểu.
- Do not assume old district/phường relation IDs.
- Store boundary source and checked date.

Example Overpass template:

```overpass
[out:json][timeout:60];

area["name"="Liên Chiểu"]["boundary"="administrative"]->.searchArea;

(
  nwr["amenity"](area.searchArea);
  nwr["tourism"](area.searchArea);
  nwr["leisure"](area.searchArea);
  nwr["shop"](area.searchArea);
);

out center tags;
```

More focused:

```overpass
[out:json][timeout:60];

area["name"="Liên Chiểu"]["boundary"="administrative"]->.searchArea;

(
  nwr["amenity"="cafe"](area.searchArea);
  nwr["amenity"="restaurant"](area.searchArea);
  nwr["amenity"="marketplace"](area.searchArea);
  nwr["leisure"="park"](area.searchArea);
  nwr["leisure"="sports_centre"](area.searchArea);
  nwr["amenity"="library"](area.searchArea);
  nwr["amenity"="community_centre"](area.searchArea);
);

out center tags;
```

If boundary matching is ambiguous:

- query OSM boundary first;
- inspect exact relation;
- then use relation/area ID explicitly.

---

# 16. LAT/LNG PROVENANCE

Coordinates must store provenance.

Example:

```ts
geocoding_provenance:
  | "osm"
  | "official_source"
  | "manual_map_verification"
  | "nominatim"
  | "user_submission"
```

Avoid:

```text
"AI guessed coordinates"
```

Never use that.

---

# 17. EVENT DATA PIPELINE

Recommended:

```text
Source Discovery
→ Raw Snapshot
→ Parser
→ Normalizer
→ Validator
→ Dedupe
→ Geocode
→ Human Review
→ Publish
→ Reverify
→ Expire/Archive
```

---

# 17.1 Raw Snapshot

Save raw evidence:

```text
source URL
page title
retrieved_at
raw text excerpt
screenshot/file hash if appropriate
```

This allows audit later.

---

# 17.2 Parser

Parser extracts candidate:

```text
name
date
time
venue
address
organizer
ticket URL
image URL
description
```

Unknown field:

```text
null
```

Never hallucinate.

---

# 17.3 Normalizer

Normalize:

- Vietnamese Unicode.
- whitespace.
- time.
- ISO 8601.
- categories.
- source types.
- address formatting.

---

# 17.4 Validator

Reject/pending if:

- no name;
- impossible date;
- invalid coordinate;
- no source URL;
- coordinate far outside target boundary;
- malformed URL.

---

# 17.5 Geocode

Order:

1. official coordinates if available;
2. OSM/OSM object;
3. Nominatim with rate-limit/caching compliance;
4. manual verification.

Do not mass scrape Google Maps.

---

# 17.6 Human Review

Reviewer sees:

```text
candidate record
source
raw evidence
existing duplicates
map coordinate
confidence components
```

Actions:

```text
Approve
Reject
Merge
Request more evidence
```

---

# 18. DATA QUALITY STATES

Each field can conceptually be:

```text
known
unknown
conflicting
stale
```

Do not replace `unknown` with generated text.

---

# 19. INITIAL DATA BOOTSTRAP

Start with quality, not quantity.

## Stage 1

Target:

```text
50–100 verified places
10–30 verified active/upcoming events
```

Categories:

- food;
- coffee;
- markets;
- parks/public spaces;
- sports;
- culture/community;
- education;
- public services;
- useful local places.

## Stage 2

Expand:

```text
200–500 places
```

Only after dedupe and category quality are stable.

## Stage 3

Scale to 1000+ places if needed.

Do not force 1000 low-quality records just to hit a number.

---

# 20. TECH STACK

Recommended MVP:

## Frontend

```text
Next.js
TypeScript
React
Tailwind CSS
MapLibre GL JS
```

Optional UI:

```text
shadcn/ui
Radix primitives
```

Bottom sheet:

```text
Vaul
```

or custom accessible implementation.

## Backend / Database

```text
Supabase
PostgreSQL
PostGIS
```

Benefits:

- relational schema;
- auth;
- Row Level Security;
- geospatial support;
- storage;
- fast MVP.

## Deployment

```text
Vercel
+
Supabase
```

Alternative:

```text
Cloudflare Pages/Workers
```

Static-only is allowed for proof of concept, but the main recommended MVP architecture is DB-backed because moderation and provenance are core requirements.

---

# 21. COMPONENT TREE

```text
src/
├── app/
│   ├── page.tsx
│   ├── events/
│   ├── places/
│   ├── event/[id]/
│   ├── place/[id]/
│   └── admin/
│
├── components/
│   ├── mobile/
│   │   ├── MobileHeader.tsx
│   │   ├── SearchBar.tsx
│   │   ├── FilterChips.tsx
│   │   ├── BottomSheet.tsx
│   │   ├── BottomNav.tsx
│   │   ├── EventCard.tsx
│   │   └── PlaceCard.tsx
│   │
│   ├── map/
│   │   ├── MapView.tsx
│   │   ├── MapMarkers.tsx
│   │   ├── MarkerClusters.tsx
│   │   ├── MapControls.tsx
│   │   └── SelectedMarker.tsx
│   │
│   ├── details/
│   └── admin/
│
├── lib/
│   ├── db/
│   ├── geo/
│   ├── search/
│   ├── filters/
│   ├── validation/
│   └── dedupe/
│
├── data/
│   ├── categories.ts
│   └── demo/
│
├── types/
│   ├── event.ts
│   ├── place.ts
│   ├── source.ts
│   └── moderation.ts
│
└── styles/
```

---

# 22. API DESIGN

MVP read APIs:

```http
GET /api/events
GET /api/events/{id}
GET /api/places
GET /api/places/{id}
GET /api/search
```

Filters:

```text
date
from
to
category
q
lat
lng
radius
verified
bbox
```

Admin:

```http
POST /api/admin/events
PATCH /api/admin/events/{id}
POST /api/admin/places
PATCH /api/admin/places/{id}
POST /api/admin/moderation/{id}/approve
POST /api/admin/moderation/{id}/reject
POST /api/admin/moderation/{id}/merge
```

Community:

```http
POST /api/submissions
POST /api/reports
```

---

# 23. SPATIAL QUERIES

PostGIS:

- nearby places;
- bbox;
- distance;
- in boundary.

Use `geography(Point, 4326)` when appropriate.

Indexes:

```sql
GIST(location)
BTREE(status)
BTREE(start_at)
BTREE(category_id)
BTREE(verification_status)
```

---

# 24. MAP RENDERING

Prefer GeoJSON source + clustered layers rather than thousands of DOM markers.

MapLibre source example concept:

```ts
map.addSource("places", {
  type: "geojson",
  data: geojson,
  cluster: true,
  clusterRadius: 50
});
```

Do not create 1000+ `new Marker()` DOM nodes on mobile.

---

# 25. EMPTY / ERROR / LOADING STATES

## Loading

Show:

- map skeleton/loading state;
- card skeletons.

## Empty

Example:

```text
Không tìm thấy sự kiện phù hợp trong ngày này.
Thử đổi ngày hoặc bỏ bớt bộ lọc.
```

## Error

Example:

```text
Không tải được dữ liệu.
[Thử lại]
```

## Location denied

App must still work.

Fallback to Liên Chiểu default map center/bounds.

---

# 26. ACCESSIBILITY

Must:

- keyboard accessible desktop;
- semantic buttons;
- ARIA labels;
- sufficient contrast;
- visible focus states;
- screen-reader labels;
- non-color-only verification indicators.

---

# 27. PERFORMANCE

Targets:

- initial mobile load reasonable on 4G;
- lazy-load images;
- avoid loading all media immediately;
- cluster map features;
- debounce search;
- cache API responses;
- only query visible bbox when dataset becomes large.

---

# 28. PRIVACY

Geolocation:

- request only when needed;
- do not persist precise location by default;
- do not send it to analytics as raw precise coordinates.

Community submissions:

- collect minimum personal data.

---

# 29. IMAGE POLICY

Image can be displayed only when:

- source allows it;
- permission/license known;
- owned/official image usage is acceptable;
- or user uploaded with rights.

Store:

```text
image source
license
attribution
approved_for_display
```

If uncertain:

- show placeholder;
- link to source instead.

---

# 30. DEVELOPMENT PHASES

## Phase 0 – Repository Setup

Deliver:

- Next.js + TS.
- Tailwind.
- MapLibre.
- env example.
- lint.
- formatting.
- test setup.

Definition of done:

- app runs;
- map component loads;
- no real fake data.

---

## Phase 1 – Database / Schema

Deliver:

- migrations;
- PostGIS enabled;
- events;
- places;
- organizers;
- sources;
- categories;
- media;
- moderation.

Definition of done:

- migrations reproducible;
- seed only categories + clearly labelled demo records.

---

## Phase 2 – Mobile Map UI

Deliver:

- map full-screen;
- top search;
- filter chips;
- marker cluster;
- selected marker;
- bottom sheet;
- locate me;
- safe area.

Definition of done:

- works at 360, 390, 430 widths;
- no horizontal overflow;
- bottom sheet usable one-handed.

---

## Phase 3 – Event / Place UX

Deliver:

- event details;
- place details;
- filter;
- date chips;
- deep links;
- source badge;
- verification badge;
- directions.

Definition of done:

- every displayed production record exposes source.

---

## Phase 4 – Ingestion

Deliver:

- adapter interface;
- OSM adapter;
- manual CSV import;
- normalizer;
- validator;
- dedupe;
- raw evidence storage.

Definition of done:

- candidate cannot publish automatically without policy.

---

## Phase 5 – Admin

Deliver:

- review queue;
- approve/reject;
- merge duplicate;
- edit;
- audit.

Definition of done:

- all new scraped/community records go pending.

---

## Phase 6 – QA / Deploy

Deliver:

- responsive tests;
- API tests;
- schema validation;
- accessibility check;
- deployment.

Definition of done:

- no source-less production records;
- no broken mobile layout;
- expired events not shown as upcoming.

---

# 31. TESTS

## Unit

Test:

- date active logic;
- duplicate score;
- coordinate validation;
- GeoJSON conversion;
- filter logic;
- category mapping.

## Integration

Test:

- DB → API → map.
- event query by date.
- nearby query.
- moderation state transitions.

## E2E

Test:

```text
Open app
→ select Today
→ tap marker
→ bottom sheet opens
→ open event
→ source visible
→ directions clickable
```

---

# 32. DATA RESEARCH AGENT PROMPT

Use this prompt to discover Liên Chiểu data.

```text
You are a Data Research Agent for Liên Chiểu Discovery Map.

Goal:
Find real places or public events relevant to Liên Chiểu, Đà Nẵng.

STRICT RULES:
1. Never invent any place, event, address, coordinate, date, organizer or URL.
2. Every candidate must include at least one accessible source URL.
3. Prefer primary sources:
   - government
   - organizer
   - venue
   - school/university
   - official event platform
   - OpenStreetMap for geographic entities
4. Social posts can be used as evidence only when the public page/post is accessible.
5. If a field cannot be proven, return null.
6. Do not infer coordinates from memory.
7. Record the provenance of latitude/longitude.
8. Do not mark data as verified yourself.
9. Record the date you checked each source.
10. Do not scrape sources whose terms prohibit automated scraping.

For each record return:

{
  "entity_type": "event | place",
  "name": "...",
  "description": "... or null",
  "category": "...",
  "address_text": "... or null",
  "latitude": null,
  "longitude": null,
  "coordinate_provenance": null,
  "start_at": null,
  "end_at": null,
  "organizer": null,
  "source_url": "...",
  "source_type": "...",
  "evidence": "short quote/paraphrase proving the fields",
  "checked_at": "ISO timestamp",
  "uncertain_fields": [],
  "notes": ""
}

For places:
- Prefer OpenStreetMap/Overpass for bootstrap.
- Preserve OSM ID/type if present.

For events:
- Event date/time must be explicitly supported by the source.
- If the source is old and the event date has passed, mark as historical candidate, not active.

OUTPUT:
JSON array only.

DEFINITION OF DONE:
- Every record has source URL.
- No guessed fields.
- Every coordinate includes provenance.
- Uncertain fields are null.
```

---

# 33. DATA VERIFICATION AGENT PROMPT

```text
You are the Data Verification Agent for Liên Chiểu Discovery Map.

Input:
One candidate event/place record and its sources.

Your job is to VERIFY, not rewrite creatively.

Checks:

1. Does the source URL exist and support the record?
2. Is the name exactly supported?
3. Is the date/time supported?
4. Is the venue/address supported?
5. Is the organizer supported?
6. Are coordinates supported by OSM/official source/manual geocoding provenance?
7. Is the record inside or relevant to Liên Chiểu?
8. Is it a duplicate of an existing entity?
9. Is the information stale?
10. Is there conflicting information across sources?

Never fill missing fields from general knowledge.

Return:

{
  "decision":
    "approve |
     reject |
     needs_more_evidence |
     possible_duplicate",
  "verification_status":
    "unverified |
     source_verified |
     human_review_required",
  "field_checks": {
    "name": "...",
    "date": "...",
    "location": "...",
    "organizer": "..."
  },
  "conflicts": [],
  "missing_evidence": [],
  "duplicate_candidates": [],
  "notes": ""
}

Definition of Done:
- Decision supported by evidence.
- No invented field.
- Conflict is explicitly surfaced.
```

---

# 34. UI REFINEMENT AGENT PROMPT

```text
You are refining the UI of Liên Chiểu Discovery Map.

DO NOT change:
- database schema
- API contracts
- route structure
- business logic
unless explicitly requested.

Priority:
mobile-first UX.

Primary viewport:
390x844.

Requirements:
- support width >= 360px;
- use 100dvh;
- respect iOS safe area;
- touch target >= 44x44px;
- no horizontal overflow;
- map remains primary context;
- marker tap opens draggable bottom sheet;
- bottom sheet: collapsed / half / expanded;
- filter chips horizontal-scroll;
- map controls remain reachable;
- bottom navigation above safe-area;
- selected marker and selected card stay synchronized;
- no desktop popup as main mobile interaction;
- loading, empty, error and denied-location states;
- accessible controls;
- avoid visual clutter.

Do not introduce fake event/place data.

Definition of Done:
- 360px, 390px and 430px mobile layouts tested;
- no clipped controls;
- bottom sheet does not cover essential actions;
- map and list selection stay synchronized;
- no schema/API changes.
```

---

# 35. MASTER PROMPT FOR ANTIGRAVITY

Copy the prompt below into Antigravity at project start.

```text
You are the lead software engineer responsible for building a production-oriented MVP named "Liên Chiểu Discovery Map".

PROJECT GOAL
Build a mobile-first web app for discovering verified public events and useful/local places in Liên Chiểu, Đà Nẵng.

REFERENCE
Use https://hanoimaps.github.io/events/ as product inspiration only.
Do not clone it mechanically.

CORE PRODUCT DIFFERENCES
Our version must:
- be mobile-first;
- use bottom sheets instead of desktop-style map popups on mobile;
- support both Events and Places;
- expose data source/provenance;
- support moderation;
- support verification state;
- support data freshness;
- support duplicate detection;
- never rely on LLM-generated factual data.

TECH STACK
- Next.js
- TypeScript
- React
- Tailwind CSS
- MapLibre GL JS
- PostgreSQL
- PostGIS
- Supabase
- Vercel
- Vitest/Jest
- Playwright
- optional shadcn/ui
- optional Vaul for bottom sheet

MOBILE REQUIREMENTS
Primary viewport: 390x844.
Support >=360px.

- use 100dvh, not 100vh;
- support iOS safe-area insets;
- minimum touch target 44x44;
- map occupies full available viewport;
- top floating search bar;
- horizontally scrollable filter chips;
- filters include:
  Today,
  Tomorrow,
  Weekend,
  Select date;
- marker selection opens draggable bottom sheet;
- bottom sheet states:
  collapsed,
  half,
  expanded;
- selected map marker and selected list card must stay synchronized;
- cluster markers at low zoom;
- map controls float on the right;
- bottom navigation fixed above safe area;
- avoid horizontal page scrolling;
- app must remain usable if geolocation permission is denied.

DATA RULES
This rule is critical:

DO NOT CREATE FAKE PRODUCTION DATA.

Never invent:
- events;
- places;
- dates;
- addresses;
- coordinates;
- organizers;
- source URLs;
- opening hours;
- prices.

Demo data is allowed only inside:
data/demo
or test fixtures
and must include:
"is_demo": true.

Every production Event or Place must have provenance.

Use entities:
- Event
- Place
- Organizer
- Source
- Category
- Media
- ModerationItem

VERIFICATION STATES
Use:
- unverified
- source_verified
- human_verified

EVENT STATUS
Use:
- scheduled
- updated
- cancelled
- postponed
- expired
- pending_verification

DATABASE
Use PostgreSQL + PostGIS.

Store canonical entities in database.
Expose GeoJSON for map rendering.

Coordinate order in GeoJSON must be:
[longitude, latitude].

Important indexes:
- GIST location
- start_at
- category_id
- status
- verification_status

MAP
Use MapLibre GL JS.

Prefer GeoJSON sources and MapLibre layers instead of hundreds/thousands of DOM markers.

Implement:
- marker clustering;
- cluster click zoom;
- selected marker;
- bbox filtering;
- nearby filtering;
- map/list synchronization.

MVP PAGES
/
 /events
 /places
 /event/[id]
 /place/[id]
 /admin

MVP USER FEATURES
- map discovery;
- events;
- places;
- search;
- category filters;
- date filters;
- custom date;
- nearby;
- location permission;
- event detail;
- place detail;
- source attribution;
- verification state;
- directions;
- deep links;
- share;
- expired event filtering.

ADMIN FEATURES
- review queue;
- candidate source links;
- approve;
- reject;
- merge duplicate;
- edit;
- mark cancelled;
- mark expired;
- audit information.

COMMUNITY
Design schema/API for:
- submit event/place;
- report wrong information.

User submissions must NEVER auto-publish.

INGESTION PIPELINE

source
→ raw snapshot
→ parser
→ normalizer
→ validator
→ dedupe
→ geocode
→ human review
→ publish
→ reverify
→ expire/archive

Unknown values must stay null.

DATA SOURCES
Primary:
- official government sources;
- official organizers;
- official schools/universities;
- official venues;
- official ticketing pages;
- OpenStreetMap.

OpenStreetMap/Overpass may bootstrap place data.

Before importing:
verify the current Liên Chiểu administrative boundary.
Do not hard-code an outdated OSM relation.

Coordinates must store provenance:
- osm
- official_source
- nominatim
- manual_map_verification
- user_submission

Never use:
"AI guessed coordinates".

SOURCE MODEL
Each source should store:
- entity type;
- entity ID;
- source type;
- source URL;
- title;
- discovered_at;
- checked_at;
- evidence;
- is_primary;
- license/reuse note.

IMAGE POLICY
Do not copy/hotlink arbitrary copyrighted images.
Only display approved media with known source/usage permission.
Otherwise use placeholder and source link.

SEARCH
MVP search:
- name;
- category;
- organizer;
- address;
- tags.

DATE LOGIC
An event is active for a selected date if the selected date intersects the event interval.

EXPIRED EVENT
If event end time/date has passed:
do not show it in upcoming results by default.
Archive instead of deleting.

DUPLICATES
Use candidate matching based on:
- normalized name;
- date;
- venue;
- coordinate distance;
- source URL.

Potential duplicate goes to moderation queue.
Do not auto-delete uncertain records.

NON-FUNCTIONAL
- mobile-first;
- accessible;
- secure;
- privacy-aware;
- fast;
- cacheable;
- no layout overflow;
- clear loading/empty/error states.

GEOLOCATION PRIVACY
Request only when user asks or when clearly useful.
Do not store precise user coordinates by default.
Do not send raw coordinates to analytics.

FOLDER STRUCTURE

src/
  app/
  components/
    mobile/
    map/
    details/
    admin/
  lib/
    db/
    geo/
    search/
    filters/
    validation/
    dedupe/
  types/
  data/
    demo/

IMPLEMENTATION ORDER

PHASE 0
Setup:
Next.js + TS + Tailwind + MapLibre + lint + tests.

PHASE 1
Database:
schema + migrations + PostGIS + RLS.

PHASE 2
Mobile map UI:
map, header, search, filter chips, clusters, bottom sheet.

PHASE 3
Event/place pages:
detail, source, verification, directions, sharing.

PHASE 4
Ingestion:
manual import + OSM adapter + validation + dedupe.

PHASE 5
Admin:
review queue, approve/reject/merge/edit.

PHASE 6
QA:
responsive, API tests, E2E, performance, accessibility, deploy.

IMPORTANT DEVELOPMENT BEHAVIOR

Before coding each phase:
1. inspect existing project;
2. summarize what exists;
3. list files to change;
4. implement only that phase;
5. run lint/tests/build;
6. fix failures;
7. summarize changed files.

Do not rewrite unrelated code.

Do not introduce unrequested libraries when existing dependencies already solve the problem.

Do not change schema or API contract during UI work without explicit migration.

DEFINITION OF DONE FOR MVP

The MVP is complete only when:

1. A user can open the map on a 360px-wide phone.
2. Map loads without horizontal overflow.
3. User can see Places and Events.
4. User can select Today/Tomorrow/Weekend.
5. User can search.
6. Marker clusters work.
7. Marker tap opens bottom sheet.
8. Bottom sheet works in collapsed/half/expanded states.
9. Selecting list item selects marker.
10. Event detail shows its source.
11. Place detail shows its source.
12. No production record lacks provenance.
13. Expired events are excluded from upcoming view.
14. Geolocation-denied flow still works.
15. Admin can review candidate records.
16. Community submission is pending by default.
17. Duplicate candidates are surfaced.
18. App passes lint.
19. Tests pass.
20. Production build succeeds.
21. No fake production data exists.

START NOW WITH PHASE 0.

First inspect the repository.
Then propose the exact file structure and dependency list.
After that implement Phase 0 only.
```

---

# 36. FIRST FILES ANTIGRAVITY SHOULD CREATE

```text
README.md
.env.example

src/types/event.ts
src/types/place.ts
src/types/source.ts
src/types/moderation.ts

src/lib/geo/
src/lib/validation/
src/lib/dedupe/

src/components/map/MapView.tsx
src/components/mobile/MobileHeader.tsx
src/components/mobile/FilterChips.tsx
src/components/mobile/BottomSheet.tsx
src/components/mobile/BottomNav.tsx

supabase/migrations/
```

---

# 37. FIRST DATA TASK

Before filling production DB:

1. Resolve correct current Liên Chiểu boundary.
2. Query OSM/Overpass.
3. Import a small candidate batch.
4. Normalize categories.
5. Detect duplicates.
6. Verify 50–100 high-value places manually.
7. Collect active events only from accessible sources.
8. Publish only reviewed records.

---

# 38. CATEGORY STARTER SET

Suggested initial categories:

```text
food
coffee
market
shopping
park
public_space
sports
culture
community
education
healthcare
public_service
event_music
event_sports
event_education
event_community
event_culture
other
```

Avoid hundreds of categories initially.

---

# 39. WHAT NOT TO BUILD YET

Do not prioritize:

- recommender ML;
- chat assistant;
- complex user profiles;
- gamification;
- blockchain;
- AR;
- route optimization;
- social following;
- automated Facebook scraping;
- large AI pipeline;
- unnecessary microservices.

First prove:

```text
reliable local data
+
good mobile map UX
+
source transparency
```

---

# 40. MVP SUCCESS CRITERIA

The MVP is successful if a user can answer:

```text
"Hôm nay ở Liên Chiểu có gì?"
"Gần tôi có gì?"
"Địa điểm này ở đâu?"
"Thông tin này lấy từ đâu?"
"Đi tới đó bằng cách nào?"
```

within a few taps on a phone.

The strongest differentiator is not the map itself.

The differentiator is:

```text
LOCAL DISCOVERY
+
MOBILE UX
+
SOURCE TRANSPARENCY
+
DATA QUALITY
```

---

# 41. FINAL IMPLEMENTATION PRINCIPLE

Build this project in this order:

```text
Data trust
→ Mobile map
→ Discovery UX
→ Moderation
→ Scale
→ Intelligence
```

Not:

```text
AI first
→ fake dataset
→ beautiful demo
→ unreliable product
```

The app must remain useful even without AI.

AI is an assistant to the data pipeline, not the database.
