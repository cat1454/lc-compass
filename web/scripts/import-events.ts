import fs from "node:fs";
import path from "node:path";
import { EventCollectionSchema } from "../src/contracts/event";
import { importEventCandidates } from "../src/lib/content/event-import";

const input = process.argv.find(a => a.endsWith(".json"));
if (!input) throw new Error("Usage: tsx scripts/import-events.ts ../research/events/2026-10-01/candidates.json [--write]");
const collection = EventCollectionSchema.parse(JSON.parse(fs.readFileSync(input, "utf8")));
const result = importEventCandidates(collection.candidates, collection.window, collection.checkedAt);
if (process.argv.includes("--write")) {
  fs.writeFileSync(path.join(process.cwd(), "content/data/events.json"), JSON.stringify(result.catalog, null, 2) + "\n");
  fs.writeFileSync(path.join(path.dirname(input), "approved-events.json"), JSON.stringify(result.catalog, null, 2) + "\n");
  fs.writeFileSync(path.join(path.dirname(input), "import-report.json"), JSON.stringify({ imported: result.catalog.totalEvents, excluded: result.excluded, duplicates: result.duplicates }, null, 2) + "\n");
}
console.log(JSON.stringify({ mode: process.argv.includes("--write") ? "write" : "dry-run", candidates: collection.candidates.length, imported: result.catalog.totalEvents, excluded: result.excluded.length, duplicates: result.duplicates.length }));
