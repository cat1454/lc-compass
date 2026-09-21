import { z } from "zod";

export const PlaceCategorySchema = z.enum([
  "market",         // Chợ, siêu thị, mua sắm thiết yếu
  "park",           // Công viên, hoa viên, không gian công cộng
  "healthcare",     // Y tế, trạm xá, nhà thuốc, phòng khám
  "education",      // Trường học các cấp, đại học, thư viện, TT đào tạo
  "living_service", // Tiện ích đời sống (ATM, xăng dầu, bưu điện, sửa xe, giặt ủi...)
  "food",           // Quán ăn, ẩm thực bình dân, căng tin, cà phê sinh viên
  "community",      // Nhà sinh hoạt cộng đồng, di tích, tôn giáo, hành chính
]);

export type PlaceCategory = z.infer<typeof PlaceCategorySchema>;

export const CommunityPlaceItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: PlaceCategorySchema,
  categoryLabel: z.string().min(1),
  address: z.string().min(1),
  street: z.string().min(1),
  ward: z.literal("Phường Liên Chiểu"),
  notes: z.string().optional(),
  source: z.string().min(1),
  verificationMethod: z.literal("boundary_confirmed"),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
});

export type CommunityPlaceItem = z.infer<typeof CommunityPlaceItemSchema>;

export const PlacesDirectorySchema = z.object({
  version: z.string().min(1),
  asOfDate: z.string().min(1),
  ward: z.literal("Phường Liên Chiểu"),
  jurisdictionLaw: z.literal("Nghị quyết số 1659/NQ-UBTVQH15"),
  totalPlaces: z.number().int().nonnegative(),
  categoryCounts: z.record(PlaceCategorySchema, z.number().int().nonnegative()),
  places: z.array(CommunityPlaceItemSchema),
});

export type PlacesDirectory = z.infer<typeof PlacesDirectorySchema>;
