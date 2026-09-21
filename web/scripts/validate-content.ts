import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateContentCard, ValidationIssue } from "../src/contracts/validator";
import { toSourcedDemoDTO } from "../src/lib/content/sourced-demo";
import { readCsvCards, readCsvPlaces } from "../src/lib/content/csv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const contentDir = path.join(rootDir, "content", "published");
const fixturesDir = path.join(rootDir, "fixtures");

console.log("🔍 [content:validate] Bắt đầu kiểm tra dữ liệu nội dung với Contract Validator...");

let totalErrors = 0;

/**
 * Thu thập đệ quy tất cả các tệp JSON trong thư mục
 */
function getJsonFilesRecursively(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getJsonFilesRecursively(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Kiểm tra toàn bộ tệp trong một thư mục, đảm bảo tính duy nhất của ID xuyên suốt toàn bộ các tệp (R04)
 */
function validateDirectoryCatalog(
  dirPath: string,
  catalogName: string,
  options: { isPublishedTarget: boolean }
) {
  const jsonFiles = getJsonFilesRecursively(dirPath);
  console.log(`\n📁 [${catalogName}] Quét ${jsonFiles.length} tệp JSON trong thư mục...`);

  if (jsonFiles.length === 0) {
    if (options.isPublishedTarget) {
      console.log("  ℹ️ Thư mục content/published hiện chưa có thẻ dữ liệu phát hành.");
      console.log("  ℹ️ Catalog rỗng là hợp lệ cho giai đoạn khởi tạo (dữ liệu thật sẽ bổ sung ở Gói 02).");
    } else {
      console.log("  ℹ️ Không có tệp fixture nào.");
    }
    return;
  }

  // Bảng theo dõi tính duy nhất của ID trên toàn bộ catalog
  const globalCardRegistry = new Map<string, string>(); // cardId -> filePath

  for (const filePath of jsonFiles) {
    const relativeFilePath = path.relative(rootDir, filePath);
    try {
      const raw = fs.readFileSync(filePath, "utf8");
      const parsed = JSON.parse(raw);
      const cards = Array.isArray(parsed) ? parsed : [parsed];

      console.log(`  📄 Kiểm tra tệp: ${relativeFilePath} (${cards.length} thẻ)...`);

      for (let i = 0; i < cards.length; i++) {
        const rawCard = cards[i];
        const validation = validateContentCard(rawCard, options);

        if (!validation.valid) {
          totalErrors += validation.issues.length;
          for (const issue of validation.issues) {
            console.error(
              `    ❌ [Tệp: ${relativeFilePath} | Thẻ: ${issue.cardId || `index ${i}`}] Trường "${issue.field || "cấu trúc"}": ${issue.message}`
            );
          }
          continue;
        }

        const card = validation.card!;
        if (catalogName === "Sourced Demo" && !toSourcedDemoDTO(card)) {
          totalErrors++;
          console.error(`Invalid sourced demo evidence or status: ${card.id}`);
        }
        if (options.isPublishedTarget && !["published", "withdrawn"].includes(card.review.status)) {
          totalErrors++;
          console.error(`Unreviewed card in published catalog: ${card.id}`);
        }

        // R04: Kiểm tra tính duy nhất của ID xuyên suốt các tệp trong catalog
        if (globalCardRegistry.has(card.id)) {
          totalErrors++;
          const originalFile = globalCardRegistry.get(card.id)!;
          console.error(
            `    ❌ [Trùng lặp ID xuyên file] Thẻ id "${card.id}" trong "${relativeFilePath}" trùng lặp với thẻ trong "${originalFile}"`
          );
        } else {
          globalCardRegistry.set(card.id, relativeFilePath);
        }
      }
    } catch (err: any) {
      totalErrors++;
      console.error(`    ❌ Lỗi đọc/cú pháp JSON tệp ${relativeFilePath}: ${err.message}`);
    }
  }
}

const demoDir = path.join(rootDir, "content", "demo");
validateDirectoryCatalog(path.join(rootDir, "content", "sourced-demo"), "Sourced Demo", { isPublishedTarget: false });

// 1. Kiểm tra Fixtures
validateDirectoryCatalog(fixturesDir, "Fixtures", { isPublishedTarget: false });

// 2. Kiểm tra Demo Catalog (Dữ liệu mẫu mô phỏng phục vụ đánh giá cuộc thi)
if (fs.existsSync(demoDir)) {
  validateDirectoryCatalog(demoDir, "Demo Catalog", { isPublishedTarget: false });
}

// 3. Kiểm tra Published (Bắt buộc tiêu chuẩn xuất bản nghiêm ngặt)
try {
  const cards = readCsvCards();
  for (const card of cards) {
    const result = validateContentCard(card, { isPublishedTarget: ["published", "withdrawn"].includes(card.review.status) });
    if (!result.valid) {
      totalErrors++;
      console.error(`cards.csv, thẻ ${card.id}: ${JSON.stringify(result.issues)}`);
    }
  }
  const directory = readCsvPlaces();
  console.log(`CSV chính thức: ${cards.length} thẻ, ${directory.totalPlaces} địa điểm`);
} catch (error) {
  totalErrors++;
  console.error(String(error));
}

console.log("\n------------------------------------------------------------");
if (totalErrors > 0) {
  console.error(`❌ [content:validate] Kiểm tra thất bại với tổng cộng ${totalErrors} lỗi hợp đồng dữ liệu.`);
  process.exit(1);
} else {
  console.log("✅ [content:validate] Toàn bộ kiểm tra hợp đồng dữ liệu ĐẠT thành công.");
  process.exit(0);
}
