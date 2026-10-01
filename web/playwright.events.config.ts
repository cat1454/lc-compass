import { defineConfig } from "@playwright/test";
import path from "node:path";
import base from "./playwright.config";

const port = process.env.PLAYWRIGHT_PORT || "3114";
export default defineConfig({
  ...base,
  testMatch: "ui-events.spec.ts",
  testIgnore: [],
  use: { ...base.use, baseURL: `http://localhost:${port}` },
  webServer: {
    command: `node node_modules/next/dist/bin/next start --port ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: false,
    env: {
      EVENTS_PREVIEW_CATALOG: path.resolve("tests/fixtures/events-preview.json"),
      EVENTS_PREVIEW_BOUNDARY: path.resolve("tests/fixtures/events-boundary-preview.json"),
    },
  },
});
