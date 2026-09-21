"use client";
import { createContext, useContext, useEffect, useState } from "react";
const ReadingContext = createContext(false);
export const useLargeText = () => useContext(ReadingContext);
export function ReadingPreferences({ children }: { children: React.ReactNode }) {
  const [large, setLarge] = useState(false);
  useEffect(() => {
    try { setLarge(localStorage.getItem("lc-compass-large-text") === "true"); } catch { /* Storage may be disabled. */ }
  }, []);
  useEffect(() => { document.documentElement.classList.toggle("large-text", large); }, [large]);
  function toggle() {
    const value = !large;
    setLarge(value);
    try { localStorage.setItem("lc-compass-large-text", String(value)); } catch { /* Keep the setting for this session. */ }
  }
  return (
    <ReadingContext.Provider value={large}>
      <button
        type="button"
        aria-pressed={large}
        onClick={toggle}
        className="sr-only"
        aria-label={large ? "Chữ lớn: Bật" : "Chữ lớn: Tắt"}
      >
        {large ? "Chữ lớn: Bật" : "Chữ lớn: Tắt"}
      </button>
      {children}
    </ReadingContext.Provider>
  );
}
