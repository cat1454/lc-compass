import { test, expect } from "@playwright/test";

test.describe("Multimodal Accessibility Features: Voice Input & Text to Speech", () => {
  test("Microphone Voice Input button appears, listens and populates search query", async ({ page }) => {
    // Inject mock Web Speech API before page loads
    await page.addInitScript(() => {
      class MockSpeechRecognition {
        lang = "";
        continuous = false;
        interimResults = false;
        onstart: (() => void) | null = null;
        onresult: ((event: any) => void) | null = null;
        onerror: ((err: any) => void) | null = null;
        onend: (() => void) | null = null;

        start() {
          if (this.onstart) this.onstart();
          setTimeout(() => {
            if (this.onresult) {
              this.onresult({
                results: [[{ transcript: "đăng ký tạm trú" }]],
              });
            }
            if (this.onend) this.onend();
          }, 100);
        }

        stop() {
          if (this.onend) this.onend();
        }
      }

      (window as any).webkitSpeechRecognition = MockSpeechRecognition;
      (window as any).SpeechRecognition = MockSpeechRecognition;
    });

    await page.goto("/");

    // Locate the voice button in search section
    const micButton = page.getByRole("region", { name: /Tra cứu thẻ hướng dẫn/ }).getByRole("button", { name: /Nói để tìm kiếm/ });
    await expect(micButton).toBeVisible();

    // Click to start speaking
    await micButton.click();

    // Check search input value is populated
    const searchInput = page.getByRole("searchbox", { name: "Nhập từ khóa tìm kiếm hoặc nói bằng giọng nói" });
    await expect(searchInput).toHaveValue("đăng ký tạm trú", { timeout: 5000 });
  });

  test("TextToSpeech button appears on card detail and reads steps aloud", async ({ page }) => {
    // Inject mock SpeechSynthesis before page loads
    await page.addInitScript(() => {
      class MockUtterance {
        text: string;
        lang = "";
        rate = 1;
        voice = null;
        onstart: (() => void) | null = null;
        onend: (() => void) | null = null;
        onerror: (() => void) | null = null;
        constructor(text: string) {
          this.text = text;
        }
      }
      (window as any).SpeechSynthesisUtterance = MockUtterance;

      const mockSynthesis = {
        speak: (utterance: any) => {
          (window as any).__lastUtteranceText = utterance.text;
          (window as any).__lastUtteranceLang = utterance.lang;
          (window as any).__lastUtteranceRate = utterance.rate;
          setTimeout(() => {
            if (utterance.onstart) utterance.onstart();
          }, 50);
        },
        cancel: () => {
          (window as any).__synthesisCancelled = true;
        },
        getVoices: () => [{ lang: "vi-VN", name: "Vietnamese Voice" }],
      };

      Object.defineProperty(window, "speechSynthesis", {
        value: mockSynthesis,
        writable: true,
      });
    });

    // Navigate to a service card detail page
    await page.goto("/cards/service-chuan-bi-tam-tru");

    // Locate the TTS button
    const ttsButton = page.getByRole("button", { name: /Nghe đọc to bằng giọng nói/ });
    await expect(ttsButton).toBeVisible();

    // Click to listen
    await ttsButton.click();

    // Button should now show "Dừng đọc âm thanh"
    await expect(page.getByRole("button", { name: /Dừng đọc âm thanh/ })).toBeVisible();

    // Verify utterance text was synthesized with steps
    const lastText = await page.evaluate(() => (window as any).__lastUtteranceText);
    expect(lastText).toContain("Chuẩn bị thông tin đăng ký tạm trú");
    expect(lastText).toContain("Bước");

    // Click again to stop reading
    await page.getByRole("button", { name: /Dừng đọc âm thanh/ }).click();
    const isCancelled = await page.evaluate(() => (window as any).__synthesisCancelled);
    expect(isCancelled).toBe(true);
  });

  test("Voice and TTS gracefully hide if browser APIs are not supported", async ({ page }) => {
    await page.addInitScript(() => {
      // Intentionally delete speech APIs to simulate unsupported browser
      delete (window as any).webkitSpeechRecognition;
      delete (window as any).SpeechRecognition;
      delete (window as any).speechSynthesis;
    });

    await page.goto("/");
    // Microphone button should NOT be rendered
    const micButton = page.getByRole("button", { name: /Nói để tìm kiếm/ });
    await expect(micButton).toHaveCount(0);
  });
});
