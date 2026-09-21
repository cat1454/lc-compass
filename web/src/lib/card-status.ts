import type { PublicCardDTO } from "../contracts/card";
export function cardStatus(card: PublicCardDTO): string {
  if (card.availability !== "available" || card.displayStatus === "unavailable") return "Không còn khả dụng";
  if (card.isSynthetic || card.displayStatus === "synthetic") return "Dữ liệu mô phỏng";
  if (card.review.isVerified && card.review.status === "published") return "Đã rà soát";
  return "Có nguồn · Chờ rà soát";
}
