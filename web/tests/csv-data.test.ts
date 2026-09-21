import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { parseCsv, readCsvCards, readCsvPlaces } from "../src/lib/content/csv";
import { ContentCardSchema } from "../src/contracts/card";
import oldCards from "../content/published/cards.json";
import oldPlaces from "../content/places-directory/places.json";

let temporary: string | undefined;
afterEach(() => {
  if (temporary) {
    const resolved = path.resolve(temporary);
    if (!resolved.startsWith(path.resolve(os.tmpdir()) + path.sep) || !path.basename(resolved).startsWith("lc-csv-")) throw new Error("Unexpected test directory");
    fs.rmSync(resolved, { recursive: true, force: true });
    temporary = undefined;
  }
});
function copyData() {
  temporary = fs.mkdtempSync(path.join(os.tmpdir(), "lc-csv-"));
  for (const file of fs.readdirSync("content/data").filter(f => f.endsWith(".csv"))) {
    fs.copyFileSync(path.join("content/data", file), path.join(temporary, file));
  }
  return temporary;
}

describe("CSV source of truth", () => {
  it("preserves commas, quotes, accents, multiline cells, BOM and leading zeroes", () => {
    expect(parseCsv('\uFEFFid,text,phone\r\n1,"Liên Chiểu, ""nguồn""\nDòng 2",0236123456\r\n'))
      .toEqual([{ id: "1", text: 'Liên Chiểu, "nguồn"\nDòng 2', phone: "0236123456" }]);
    expect(() => parseCsv('id,id\n1,2')).toThrow(/Tên cột/);
    expect(() => parseCsv('id,name\n1')).toThrow(/dòng 2/);
    expect(() => parseCsv('id,name\n1,"abc')).toThrow(/ngoặc kép/);
  });
  it("migrates all approved content without changing bodies, actions or evidence", () => {
    const cards = readCsvCards();
    expect(cards).toHaveLength(24);
    for (const [index, card] of cards.entries()) {
      const old = ContentCardSchema.parse(oldCards[index]);
      expect({ ...card, review: { ...card.review, notes: old.review.notes } }).toEqual(old);
    }
    expect(readCsvPlaces()).toEqual(oldPlaces);
  });
  it("reflects CSV edits on the next read without JSON regeneration or server restart", () => {
    const directory = copyData();
    const file = path.join(directory, "cards.csv");
    const old = readCsvCards(directory)[0].title;
    fs.writeFileSync(file, fs.readFileSync(file, "utf8").replace(old, "Tiêu đề mới từ CSV"));
    expect(readCsvCards(directory)[0].title).toBe("Tiêu đề mới từ CSV");
    const places = path.join(directory, "places.csv");
    const first = readCsvPlaces(directory).places[0].name;
    fs.writeFileSync(places, fs.readFileSync(places, "utf8").replace(first, "Địa điểm CSV mới"));
    expect(readCsvPlaces(directory).places[0].name).toBe("Địa điểm CSV mới");
  });
  it("reports broken relationships and invalid typed data", () => {
    const directory = copyData();
    const sources = path.join(directory, "sources.csv");
    fs.writeFileSync(sources, fs.readFileSync(sources, "utf8").replace('"service-chuan-bi-tam-tru"', '"missing-card"'));
    expect(() => readCsvCards(directory)).toThrow(/sources.csv, dòng 2, cột card_id/);
    const places = path.join(directory, "places.csv");
    fs.writeFileSync(places, fs.readFileSync(places, "utf8").replace('"boundary_confirmed"', '"invalid"'));
    expect(() => readCsvPlaces(directory)).toThrow(/verificationMethod/);
  });
});
