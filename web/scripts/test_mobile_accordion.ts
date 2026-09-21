import { chromium } from "@playwright/test";
import * as path from "path";

async function main() {
  const browser = await chromium.launch({ headless: true });

  const mobileContext = await browser.newContext({
    viewport: { width: 322, height: 644 },
    deviceScaleFactor: 1,
  });
  const page = await mobileContext.newPage();
  await page.goto("http://localhost:3000/services", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  // Scroll to các bước thực hiện
  await page.evaluate(() => {
    window.scrollTo({ top: 220, behavior: "instant" });
  });
  await page.waitForTimeout(500);

  const scrolledPath = path.resolve(__dirname, "../../design/verification/actual_mobile_steps.png");
  await page.screenshot({ path: scrolledPath, fullPage: false });
  console.log("Scrolled mobile steps screenshot saved:", scrolledPath);

  // Verify aria-expanded on step buttons
  const stepButtons = await page.$$("button[id^='step-mobile-header-']");
  console.log(`Found ${stepButtons.length} step accordion buttons.`);
  for (let i = 0; i < stepButtons.length; i++) {
    const btn = stepButtons[i];
    const expanded = await btn.getAttribute("aria-expanded");
    const controls = await btn.getAttribute("aria-controls");
    console.log(`Step ${i + 1}: aria-expanded="${expanded}", aria-controls="${controls}"`);
  }

  // Click step 2 to expand it as well
  if (stepButtons.length > 1) {
    await stepButtons[1].click();
    await page.waitForTimeout(300);
    const expandedStep2 = await stepButtons[1].getAttribute("aria-expanded");
    console.log(`After click, Step 2: aria-expanded="${expandedStep2}"`);

    const togglePath = path.resolve(__dirname, "../../design/verification/actual_mobile_toggled.png");
    await page.screenshot({ path: togglePath, fullPage: false });
    console.log("Toggled screenshot saved:", togglePath);
  }

  await browser.close();
}

main().catch(console.error);
