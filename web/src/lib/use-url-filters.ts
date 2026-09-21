"use client";
import { useSyncExternalStore } from "react";
const eventName = "compass-url-change";

if (typeof window !== "undefined" && !(window as any).__compass_history_patched) {
  (window as any).__compass_history_patched = true;
  const origPush = window.history.pushState.bind(window.history);
  window.history.pushState = function (...args) {
    origPush(...args);
    window.dispatchEvent(new Event(eventName));
  };
  const origReplace = window.history.replaceState.bind(window.history);
  window.history.replaceState = function (...args) {
    origReplace(...args);
    window.dispatchEvent(new Event(eventName));
  };
}

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(eventName, callback);
  return () => { window.removeEventListener("popstate", callback); window.removeEventListener(eventName, callback); };
}
export function useUrlFilters() {
  const search = useSyncExternalStore(subscribe, () => window.location.search, () => "");
  const params = new URLSearchParams(search);
  function update(values: Record<string, string>) {
    const url = new URL(window.location.href);
    for (const [key, value] of Object.entries(values)) {
      if (!value || value === "all" || value === "ALL") url.searchParams.delete(key);
      else url.searchParams.set(key, value);
    }
    if (url.href !== window.location.href) {
      window.history.pushState(null, "", url);
      window.dispatchEvent(new Event(eventName));
    }
  }
  return { params, update };
}
