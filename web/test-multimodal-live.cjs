const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to local production build (http://localhost:3005)...');
  await page.goto('http://localhost:3005', { waitUntil: 'networkidle' });

  // 1. Check VoiceInputButton on homepage
  const hasWebkitSpeech = await page.evaluate(() => 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  console.log('Browser window has SpeechRecognition API:', hasWebkitSpeech);

  const voiceBtn = page.locator('button[aria-label="Nói để tìm kiếm"], button[title*="Nói để tìm kiếm"]');
  const voiceBtnCount = await voiceBtn.count();
  console.log('VoiceInputButton found count on homepage:', voiceBtnCount);
  if (voiceBtnCount > 0) {
    const isVisible = await voiceBtn.first().isVisible();
    console.log('VoiceInputButton is visible on UI:', isVisible);
  }

  // 2. Check TextToSpeechButton on a service card detail page
  console.log('\nNavigating to service card detail: http://localhost:3005/cards/service-chuan-bi-tam-tru...');
  await page.goto('http://localhost:3005/cards/service-chuan-bi-tam-tru', { waitUntil: 'networkidle' });

  const hasSpeechSynthesis = await page.evaluate(() => 'speechSynthesis' in window);
  console.log('Browser window has SpeechSynthesis API:', hasSpeechSynthesis);

  const ttsBtn = page.locator('button:has-text("Nghe đọc các bước"), button[aria-label*="Nghe đọc"]');
  const ttsBtnCount = await ttsBtn.count();
  console.log('TextToSpeechButton found count:', ttsBtnCount);
  if (ttsBtnCount > 0) {
    const isVisible = await ttsBtn.first().isVisible();
    console.log('TextToSpeechButton is visible on UI:', isVisible);
  }

  // 3. Check PrintActionSlip on the same card
  const printBtn = page.locator('button:has-text("In phiếu hướng dẫn A5")');
  const printBtnCount = await printBtn.count();
  console.log('PrintActionSlip button count:', printBtnCount);
  if (printBtnCount > 0) {
    const isVisible = await printBtn.first().isVisible();
    console.log('PrintActionSlip is visible on UI:', isVisible);
  }

  await browser.close();
  console.log('\nAll checks completed on local server!');
})();
