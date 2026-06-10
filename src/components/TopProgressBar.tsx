"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function TopProgressBar() {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const cleanupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function start() {
    const bar = barRef.current;
    if (!bar) return;
    if (cleanupTimer.current) {
      clearTimeout(cleanupTimer.current);
      cleanupTimer.current = null;
    }
    if (safetyTimer.current) clearTimeout(safetyTimer.current);
    loadingRef.current = true;
    bar.style.transition = "none";
    bar.style.width = "0%";
    bar.style.opacity = "1";
    void bar.offsetWidth;
    bar.style.transition = "width 8s cubic-bezier(0.1, 0.05, 0, 1)";
    bar.style.width = "85%";
    // Fallback in case navigation never completes (download, blocked, etc.)
    safetyTimer.current = setTimeout(finish, 10000);
  }

  function finish() {
    const bar = barRef.current;
    if (!bar || !loadingRef.current) return;
    loadingRef.current = false;
    if (safetyTimer.current) {
      clearTimeout(safetyTimer.current);
      safetyTimer.current = null;
    }
    bar.style.transition = "width 200ms ease, opacity 250ms ease 200ms";
    bar.style.width = "100%";
    bar.style.opacity = "0";
    cleanupTimer.current = setTimeout(() => {
      bar.style.transition = "none";
      bar.style.width = "0%";
      cleanupTimer.current = null;
    }, 500);
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      let url: URL;
      try {
        url = new URL(anchor.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;
      start();
    }
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    finish();
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (cleanupTimer.current) clearTimeout(cleanupTimer.current);
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
    };
  }, []);

  return (
    <div
      aria-hidden
      ref={barRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: 2,
        width: 0,
        opacity: 0,
        background: "var(--foreground)",
        boxShadow: "0 0 8px rgba(10, 10, 10, 0.35)",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}
