import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const contentDir = path.join(rootDir, 'content', 'published');
const fixturesDir = path.join(rootDir, 'fixtures');

console.log('🔍 [content:validate] Bắt đầu kiểm tra dữ liệu nội dung...');

// Kiểm tra sự tồn tại của các thư mục dữ liệu
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}
if (!fs.existsSync(fixturesDir)) {
  fs.mkdirSync(fixturesDir, { recursive: true });
}

const publishedFiles = fs.readdirSync(contentDir).filter(f => f.endsWith('.json'));
const fixtureFiles = fs.readdirSync(fixturesDir).filter(f => f.endsWith('.json'));

console.log(`📁 Thư mục published: ${publishedFiles.length} tệp JSON`);
console.log(`📁 Thư mục fixtures: ${fixtureFiles.length} tệp JSON`);

let hasError = false;

for (const file of publishedFiles) {
  try {
    const raw = fs.readFileSync(path.join(contentDir, file), 'utf8');
    JSON.parse(raw);
    console.log(`  ✓ ${file}: JSON hợp lệ`);
  } catch (err) {
    console.error(`  ✗ ${file}: Lỗi cú pháp JSON - ${err.message}`);
    hasError = true;
  }
}

for (const file of fixtureFiles) {
  try {
    const raw = fs.readFileSync(path.join(fixturesDir, file), 'utf8');
    JSON.parse(raw);
    console.log(`  ✓ Fixture ${file}: JSON hợp lệ`);
  } catch (err) {
    console.error(`  ✗ Fixture ${file}: Lỗi cú pháp JSON - ${err.message}`);
    hasError = true;
  }
}

if (hasError) {
  console.error('❌ [content:validate] Phát hiện lỗi trong tệp dữ liệu JSON.');
  process.exit(1);
}

if (publishedFiles.length === 0 && fixtureFiles.length === 0) {
  console.log('ℹ️ [content:validate] Trạng thái Gói 00: Thư mục nội dung sẵn sàng. Chưa có tệp dữ liệu published/fixtures (sẽ được bổ sung và kiểm tra schema tại Gói 01).');
} else {
  console.log('✅ [content:validate] Kiểm tra cú pháp dữ liệu hoàn tất.');
}

process.exit(0);
