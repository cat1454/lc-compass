import fs from "node:fs";
import path from "node:path";
import { ContentCardSchema, type ContentCard } from "../../contracts/card";
import { PlacesDirectorySchema } from "../../contracts/places-directory";

/** RFC 4180 fields: commas, escaped quotes, CRLF, BOM and embedded newlines. */
export function parseCsv(text: string, file = "CSV"): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [], field = "", quoted = false, closed = false;
  const input = text.replace(/^\uFEFF/, "");
  const fail = (message: string): never => { throw new Error(`${file}, dòng ${rows.length + 1}, cột ${row.length + 1}: ${message}`); };
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (quoted) {
      if (ch === '"') {
        if (input[i + 1] === '"') { field += '"'; i++; }
        else { quoted = false; closed = true; }
      } else field += ch;
    } else if (ch === ',' || ch === '\n' || ch === '\r') {
      row.push(field); field = ""; closed = false;
      if (ch !== ',') {
        if (ch === '\r' && input[i + 1] === '\n') i++;
        if (row.some(value => value !== "")) rows.push(row);
        row = [];
      }
    } else if (ch === '"' && !field && !closed) quoted = true;
    else if (closed || ch === '"') fail("Dấu ngoặc kép không hợp lệ");
    else field += ch;
  }
  if (quoted) fail("Thiếu dấu ngoặc kép đóng");
  if (row.length || field || closed) { row.push(field); rows.push(row); }
  const headers = rows.shift();
  if (!headers || !headers.length || headers.some(h => !h.trim()) || new Set(headers).size !== headers.length) fail("Tên cột trống hoặc trùng");
  const columnHeaders = headers!;
  return rows.map((values, index) => {
    if (values.length !== columnHeaders.length) throw new Error(`${file}, dòng ${index + 2}: cần ${columnHeaders.length} cột, có ${values.length}`);
    return Object.fromEntries(columnHeaders.map((header, i) => [header, values[i]]));
  });
}

const listFields = new Set(["intentIds", "applicability", "exclusions", "keywords", "body.missingQuestions", "requiredDocs", "claimIds"]);
const jsonFields = new Set(["branches", "options"]);
const numericFields = new Set(["stepNumber", "body.coordinates.lat", "body.coordinates.lng", "coordinates.lat", "coordinates.lng"]);
function inflate(row: Record<string, string>, context: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    if (key === "card_id" || value === "") continue;
    const parts = key.split(".");
    if (parts.some(part => ["__proto__", "constructor", "prototype"].includes(part))) throw new Error(`${context}: cột không hợp lệ ${key}`);
    let target = result;
    for (const part of parts.slice(0, -1)) {
      target[part] ??= {};
      target = target[part] as Record<string, unknown>;
    }
    let parsed: unknown = value;
    try {
      if (listFields.has(key)) parsed = value.split(/\r?\n/).filter(Boolean);
      else if (jsonFields.has(key)) parsed = JSON.parse(value);
      else if (numericFields.has(key)) {
        parsed = Number(value);
        if (!Number.isFinite(parsed)) throw new Error("Cần giá trị số");
      } else if (key === "isSynthetic") {
        if (!["true", "false"].includes(value)) throw new Error("Cần true hoặc false");
        parsed = value === "true";
      }
    } catch (error) { throw new Error(`${context}, cột ${key}: ${String(error)}`); }
    target[parts[parts.length - 1]] = parsed;
  }
  return result;
}

export function readCsvTable(name: string, directory = path.join(process.cwd(), "content", "data")) {
  return parseCsv(fs.readFileSync(path.join(directory, `${name}.csv`), "utf8"), `${name}.csv`);
}

export function readCsvCards(directory?: string): ContentCard[] {
  const rows = readCsvTable("cards", directory);
  const ids = new Set(rows.map(row => row.id));
  if (ids.size !== rows.length || ids.has(undefined as unknown as string)) throw new Error("cards.csv, cột id: ID trùng hoặc thiếu");
  const relations = ["sources", "actions", "steps", "questions", "claims"] as const;
  const tables = Object.fromEntries(relations.map(name => [name, readCsvTable(name, directory)]));
  for (const name of relations) {
    const keys = new Set<string>();
    tables[name].forEach((row, i) => {
      if (!ids.has(row.card_id)) throw new Error(`${name}.csv, dòng ${i + 2}, cột card_id: không có thẻ ${row.card_id}`);
      const key = `${row.card_id}/${row.id}`;
      if (!row.id || keys.has(key)) throw new Error(`${name}.csv, dòng ${i + 2}, cột id: thiếu hoặc trùng ID`);
      keys.add(key);
    });
  }
  return rows.map((row, index) => {
    const card = inflate(row, `cards.csv, dòng ${index + 2}`);
    const body = (card.body ??= {}) as Record<string, unknown>;
    for (const name of relations) {
      const children = tables[name].flatMap((child, i) => child.card_id === row.id ? [inflate(child, `${name}.csv, dòng ${i + 2}`)] : []);
      if (name === "sources" || name === "actions") card[name] = children;
      else if (name === "claims") body.claimsWithSources = children;
      else if (card.type === "SERVICE") body[name] = children;
      else if (children.length) throw new Error(`${name}.csv: thẻ ${row.id} không phải SERVICE`);
    }
    const validated = ContentCardSchema.safeParse(card);
    if (!validated.success) throw new Error(`cards.csv, dòng ${index + 2}, thẻ ${row.id}: ${validated.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join("; ")}`);
    return validated.data;
  });
}

export function readCsvPlaces(directory?: string) {
  const metadata = readCsvTable("directory", directory);
  if (metadata.length !== 1) throw new Error("directory.csv: cần đúng một dòng thông tin danh bạ");
  const rows = readCsvTable("places", directory);
  const ids = new Set<string>();
  const places = rows.map((row, index) => {
    if (!row.id || ids.has(row.id)) throw new Error(`places.csv, dòng ${index + 2}, cột id: thiếu hoặc trùng`);
    ids.add(row.id);
    return inflate(row, `places.csv, dòng ${index + 2}`);
  });
  const categoryCounts: Record<string, number> = {};
  for (const place of places) { const category = String(place.category); categoryCounts[category] = (categoryCounts[category] || 0) + 1; }
  const parsed = PlacesDirectorySchema.safeParse({ ...metadata[0], places, totalPlaces: places.length, categoryCounts });
  if (!parsed.success) throw new Error(`places.csv / directory.csv: ${parsed.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join("; ")}`);
  return parsed.data;
}
