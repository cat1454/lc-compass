import { chromium } from "@playwright/test";
import * as path from "path";

async function main() {
  const browser = await chromium.launch({ headless: true });

  // 1. Mobile Web Viewport: 322 x 644 matching ref_mobile_web.png 1:1
  const mobileContext = await browser.newContext({
    viewport: { width: 322, height: 644 },
    deviceScaleFactor: 1,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto("http://localhost:3000/services", { waitUntil: "networkidle" });
  await mobilePage.waitForTimeout(1000);

  const mobileActualPath = path.resolve(__dirname, "../../design/verification/actual_mobile.png");
  await mobilePage.screenshot({ path: mobileActualPath, fullPage: false });
  console.log("Mobile screenshot saved (322x644):", mobileActualPath);
  await mobileContext.close();

  // 2. Desktop Web Viewport: 1180 x 704 matching ref_desktop_web.png 1:1
  const desktopContext = await browser.newContext({
    viewport: { width: 1180, height: 704 },
    deviceScaleFactor: 1,
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto("http://localhost:3000/services", { waitUntil: "networkidle" });
  await desktopPage.waitForTimeout(1000);

  const desktopActualPath = path.resolve(__dirname, "../../design/verification/actual_desktop.png");
  await desktopPage.screenshot({ path: desktopActualPath, fullPage: false });
  console.log("Desktop screenshot saved (1180x704):", desktopActualPath);
  await desktopContext.close();

  await browser.close();
  console.log("Done taking 1:1 viewport screenshots!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
