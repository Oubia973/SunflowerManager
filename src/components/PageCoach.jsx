import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./PageCoach.css";
import "../dlist.css";
import { PAGE_COACH_LANGUAGE_OPTIONS, PAGE_COACH_LOCALES } from "./pageCoachLocales";

const PAGE_COACH_LANGUAGE_STORAGE_KEY = "pagecoach-language";

const PAGE_FALLBACK_SELECTORS = {
  home: ".home-container",
  factions: ".factions-grid",
  chapter: ".chapter-table",
  auctions: ".table-container",
  toplists: ".toplists-wrap",
  market: ".table",
};

function getRect(selector) {
  const nodes = Array.from(document.querySelectorAll(selector));
  if (!nodes.length) return null;
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;
  let best = null;
  for (let i = 0; i < nodes.length; i++) {
    const el = nodes[i];
    if (!el) continue;
    const cs = window.getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) continue;
    const r = el.getBoundingClientRect();
    if (!r || r.width < 2 || r.height < 2) continue;
    const ix = Math.max(0, Math.min(r.right, viewportW) - Math.max(r.left, 0));
    const iy = Math.max(0, Math.min(r.bottom, viewportH) - Math.max(r.top, 0));
    const visibleArea = ix * iy;
    if (visibleArea <= 0) continue;
    const topBias = Math.max(0, viewportH * 0.4 - r.top);
    const score = visibleArea + topBias * 10;
    if (!best || score > best.score) best = { r, score };
  }
  if (!best?.r) return null;
  const r = best.r;
  return { left: Math.max(6, Math.round(r.left - 6)), top: Math.max(6, Math.round(r.top - 6)), width: Math.round(r.width + 12), height: Math.round(r.height + 12) };
}

function getElementRect(el) {
  if (!el?.getBoundingClientRect) return null;
  const r = el.getBoundingClientRect();
  if (!r || r.width < 2 || r.height < 2) return null;
  return { left: Math.max(6, Math.round(r.left - 6)), top: Math.max(6, Math.round(r.top - 6)), width: Math.round(r.width + 12), height: Math.round(r.height + 12) };
}

function getElementsUnionRect(elements) {
  const rects = (Array.isArray(elements) ? elements : []).map((el) => getElementRect(el)).filter(Boolean);
  if (!rects.length) return null;
  const left = Math.min(...rects.map((r) => r.left));
  const top = Math.min(...rects.map((r) => r.top));
  const right = Math.max(...rects.map((r) => r.left + r.width));
  const bottom = Math.max(...rects.map((r) => r.top + r.height));
  return { left, top, width: right - left, height: bottom - top };
}

function normalizeHeaderName(value) {
  return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "");
}

function getLocaleWithFallback(language) {
  const base = PAGE_COACH_LOCALES.fr || {};
  const english = PAGE_COACH_LOCALES.en || base;
  const selected = PAGE_COACH_LOCALES[language] || base;
  const fallback = ["id", "zh", "ko", "ja", "vi"].includes(String(language || "").toLowerCase()) ? english : base;
  return {
    ...fallback,
    ...selected,
    ui: {
      ...(fallback.ui || {}),
      ...(selected.ui || {}),
    },
    pageLabels: {
      ...(fallback.pageLabels || {}),
      ...(selected.pageLabels || {}),
    },
    pageColumnStepOrder: {
      ...(fallback.pageColumnStepOrder || {}),
      ...(selected.pageColumnStepOrder || {}),
    },
    pageGenericExplanations: {
      ...(fallback.pageGenericExplanations || {}),
      ...(selected.pageGenericExplanations || {}),
    },
    commonExplanations: {
      ...(fallback.commonExplanations || {}),
      ...(selected.commonExplanations || {}),
    },
    pageColumnExplanations: Object.keys({
      ...(fallback.pageColumnExplanations || {}),
      ...(selected.pageColumnExplanations || {}),
    }).reduce((acc, pageKey) => {
      acc[pageKey] = {
        ...((fallback.pageColumnExplanations || {})[pageKey] || {}),
        ...((selected.pageColumnExplanations || {})[pageKey] || {}),
      };
      return acc;
    }, {}),
    pageIntroSteps: {
      ...(fallback.pageIntroSteps || {}),
      ...(selected.pageIntroSteps || {}),
    },
    baseSteps: Array.isArray(selected.baseSteps) && selected.baseSteps.length
      ? selected.baseSteps
      : (fallback.baseSteps || []),
  };
}

function getHeaderLabel(th, idx, ui) {
  const txt = (th?.textContent || "").replace(/\s+/g, " ").replace(/\s*\/+\s*$/g, "").trim();
  const images = Array.from(th?.querySelectorAll("img") || []);
  const imgTitle = images[0]?.getAttribute("title") || "";
  const ariaLabel = th?.querySelector("[aria-label]")?.getAttribute("aria-label") || "";
  const hasImg = images.length > 0;
  const lowerTxt = txt.toLowerCase();
  const imageTitles = images.map((img) => String(img.getAttribute("title") || "").toLowerCase());
  const lowerImgTitle = imgTitle.toLowerCase();
  const lowerAriaLabel = ariaLabel.toLowerCase();
  const hasEnergyIcon = imageTitles.some((title) => title.includes("energy"));
  const hasMarketIcon = imageTitles.some((title) => title.includes("market") || title.includes("marketplace"));
  const hasFlowerIcon = imageTitles.some((title) => title.includes("flower"));
  if (hasImg && lowerTxt === "xp") return "XP/Flower";
  if (hasImg && lowerTxt === "daily") return "Daily Flower";
  if (hasImg && lowerTxt === "current" && hasEnergyIcon) return "Current Energy";
  if (hasEnergyIcon && hasFlowerIcon) return "Energy/Flower";
  if (hasEnergyIcon && hasMarketIcon) return "Energy/Market";
  if (
    hasImg &&
    lowerTxt === "prod" &&
    (
      hasMarketIcon ||
      lowerImgTitle.includes("market") ||
      lowerImgTitle.includes("marketplace") ||
      lowerAriaLabel.includes("market") ||
      lowerAriaLabel.includes("marketplace")
    )
  ) {
    return "Prod market";
  }
  const raw = (txt || imgTitle || ariaLabel || `${ui.columnPrefix} ${idx + 1}`).replace(/\s*\/+\s*$/g, "").trim();
  const canonicalMatches = [[/^season/i, "Season"], [/^quantity/i, "Quantity"], [/^cost/i, "Cost"], [/^buy/i, "Buy"], [/^ready/i, "Ready"], [/^dailymax/i, "DailyMax"], [/^daily/i, "Daily"], [/^gain\/h/i, "Gain/h"], [/^chng%?/i, "Chng%"]];
  for (let i = 0; i < canonicalMatches.length; i++) {
    if (canonicalMatches[i][0].test(raw)) return canonicalMatches[i][1];
  }
  return raw;
}

function isExplainableHeader(th) {
  if (!th) return false;
  const className = String(th.className || "");
  const txt = (th.textContent || "").replace(/\s+/g, " ").trim();
  const ariaLabel = th.querySelector("[aria-label]")?.getAttribute("aria-label") || "";
  const hasText = !!(txt || ariaLabel);
  if (className.includes("th-icon")) return false;
  if (!hasText && th.querySelector("img")) return false;
  return true;
}

function findHeaderIndexByName(headers, name, used, ui, ignoreUsed = false) {
  const target = normalizeHeaderName(name);
  if (!target) return -1;
  for (let i = 0; i < headers.length; i++) {
    if (!ignoreUsed && used?.has(i)) continue;
    const candidate = normalizeHeaderName(getHeaderLabel(headers[i], i, ui));
    if (candidate === target) return i;
  }
  for (let i = 0; i < headers.length; i++) {
    if (!ignoreUsed && used?.has(i)) continue;
    const candidate = normalizeHeaderName(getHeaderLabel(headers[i], i, ui));
    if (candidate && (candidate.includes(target) || target.includes(candidate))) return i;
  }
  return -1;
}

function explainColumn(locale, currentPage, labelRaw, index) {
  const page = String(currentPage || "").toLowerCase();
  const label = String(labelRaw || "").replace(/\s+/g, " ").trim();
  const exactKey = normalizeHeaderName(label);
  const pageGeneric = locale.pageGenericExplanations?.[page] || `This column helps compare objects on this page.`;
  const keyAliases = {
    dailyflower: ["daily"],
    energymarket: ["energy"],
    energyflower: ["energy"],
  };
  const candidateKeys = [exactKey, ...(keyAliases[exactKey] || [])];
  let exactText = "";
  for (let i = 0; i < candidateKeys.length; i++) {
    const key = candidateKeys[i];
    exactText = locale.pageColumnExplanations?.[page]?.[key] || locale.commonExplanations?.[key];
    if (exactText) break;
  }
  if (exactText) return exactText;
  if (!label) return `${locale.ui.columnPrefix} ${index + 1}: ${pageGeneric}`;
  return pageGeneric;
}

function buildOrderedPageColumnSteps(headers, currentPage, locale, pageKey) {
  const ordered = Array.isArray(locale.pageColumnStepOrder?.[pageKey]) ? locale.pageColumnStepOrder[pageKey] : null;
  if (!ordered) return null;
  const used = new Set();
  const out = [];
  let groupCount = 0;
  ordered.forEach((entry) => {
    if (typeof entry === "string") {
      const idx = findHeaderIndexByName(headers, entry, used, locale.ui, false);
      if (idx < 0 || idx >= headers.length || used.has(idx)) return;
      const th = headers[idx];
      const label = getHeaderLabel(th, idx, locale.ui);
      used.add(idx);
      out.push({ id: `col-${idx}`, element: th, title: `${label}`, text: explainColumn(locale, currentPage, label, idx) });
      return;
    }
    if (entry && typeof entry === "object") {
      const elements = [];
      if (Array.isArray(entry.names) && entry.names.length > 0) {
        entry.names.forEach((name) => {
          const idx = findHeaderIndexByName(headers, name, used, locale.ui, false);
          if (idx >= 0 && !used.has(idx)) {
            elements.push(headers[idx]);
            used.add(idx);
          }
        });
      } else if (typeof entry.fromName === "string") {
        const startRaw = findHeaderIndexByName(headers, entry.fromName, used, locale.ui, true);
        if (startRaw < 0) return;
        let endRaw = entry.toEnd ? headers.length - 1 : startRaw;
        if (!entry.toEnd && typeof entry.toName === "string") {
          const foundEnd = findHeaderIndexByName(headers, entry.toName, used, locale.ui, true);
          endRaw = foundEnd >= 0 ? foundEnd : startRaw;
        }
        let startIdx = Math.min(startRaw, endRaw);
        let endIdx = Math.max(startRaw, endRaw);
        if (entry.excludeFrom && startIdx < endIdx) startIdx += 1;
        if (entry.excludeTo && endIdx > startIdx) endIdx -= 1;
        for (let i = startIdx; i <= endIdx; i++) {
          if (!used.has(i)) {
            elements.push(headers[i]);
            used.add(i);
          }
        }
      }
      if (!elements.length) return;
      groupCount += 1;
      out.push({ id: `group-${groupCount}`, elements, title: entry.title || locale.ui.groupTitle, text: entry.text || locale.ui.groupText });
    }
  });
  return out;
}

function isScrollableX(el) {
  if (!el || el === document.body) return false;
  const cs = window.getComputedStyle(el);
  const ox = cs.overflowX;
  return (ox === "auto" || ox === "scroll") && el.scrollWidth > el.clientWidth + 2;
}

function revealElementInHorizontalContainers(el) {
  if (!el) return;
  let current = el.parentElement;
  while (current && current !== document.body) {
    if (isScrollableX(current)) {
      const crect = current.getBoundingClientRect();
      const erect = el.getBoundingClientRect();
      const leftIn = erect.left - crect.left + current.scrollLeft;
      const rightIn = erect.right - crect.left + current.scrollLeft;
      const target = Math.max(0, Math.min(current.scrollWidth - current.clientWidth, ((leftIn + rightIn) / 2) - (current.clientWidth / 2)));
      current.scrollTo({ left: target, behavior: "smooth" });
    }
    current = current.parentElement;
  }
}

function buildBaseSteps(locale) {
  return Array.isArray(locale.baseSteps) ? locale.baseSteps : [];
}

function buildPageSteps(currentPage, locale) {
  const pageKey = String(currentPage || "").toLowerCase();
  const pageName = locale.pageLabels?.[pageKey] || locale.ui.currentPageFallback;
  let headers = Array.from(document.querySelectorAll(".table-container table thead th, .factions-table thead th, .toplists-table thead th"))
    .filter((th) => !!getElementRect(th))
    .filter((th) => isExplainableHeader(th));
  if (pageKey === "home" && headers.length > 0) {
    const firstTable = headers[0]?.closest("table");
    if (firstTable) headers = headers.filter((th) => th.closest("table") === firstTable);
  }
  if (pageKey === "factions" && headers.length > 0) {
    const firstTable = headers[0]?.closest("table");
    if (firstTable) headers = headers.filter((th) => th.closest("table") === firstTable);
  }
  const introSteps = Array.isArray(locale.pageIntroSteps?.[pageKey]) ? locale.pageIntroSteps[pageKey] : [];
  const orderedSteps = headers.length ? buildOrderedPageColumnSteps(headers, currentPage, locale, pageKey) : null;
  const columnSteps = orderedSteps && orderedSteps.length > 0 ? orderedSteps : headers.map((th, idx) => {
    const label = getHeaderLabel(th, idx, locale.ui);
    return { id: `col-${idx}`, element: th, title: `${label}`, text: explainColumn(locale, currentPage, label, idx) };
  });
  if (introSteps.length || columnSteps.length) return [...introSteps, ...columnSteps];
  const fallbackSelector = PAGE_FALLBACK_SELECTORS[pageKey] || ".table-container";
  const text = locale.pageGenericExplanations?.[pageKey] || `${locale.ui.pageSummaryPrefix} ${pageName}. ${locale.ui.pageSummarySuffix}`;
  return [{ id: "page-fallback", selector: fallbackSelector, title: `${pageName}`, text }];
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function computeBubblePos(rect, bubbleWidth, bubbleHeight) {
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;
  const pad = 8;
  const gap = 10;
  const w = Math.min(Math.max(220, bubbleWidth || 310), Math.max(220, viewportW - (pad * 2)));
  const h = Math.min(Math.max(120, bubbleHeight || 180), Math.max(120, viewportH - (pad * 2)));
  let left = clamp(rect.left, pad, viewportW - w - pad);
  const spaceBelow = viewportH - (rect.top + rect.height) - gap - pad;
  const spaceAbove = rect.top - gap - pad;
  const canBelow = spaceBelow >= h;
  const canAbove = spaceAbove >= h;
  let top;
  if (canBelow && (!canAbove || spaceBelow >= spaceAbove)) top = rect.top + rect.height + gap;
  else if (canAbove) top = rect.top - h - gap;
  else top = spaceBelow >= spaceAbove ? rect.top + rect.height + gap : rect.top - h - gap;
  top = clamp(top, pad, viewportH - h - pad);
  left = clamp(left, pad, viewportW - w - pad);
  return { left, top, width: w };
}

function PickerChevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PageCoachLanguagePicker({ label, options, value, onChange }) {
  const rootRef = useRef(null);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);

  const selected = options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    if (!open) return undefined;
    const update = () => {
      const r = btnRef.current?.getBoundingClientRect();
      if (!r) return;
      const width = Math.max(72, Math.round(r.width));
      const left = Math.max(8, Math.min(Math.round(r.left), window.innerWidth - width - 8));
      const estimatedHeight = Math.min(window.innerHeight - 16, Math.max(120, (options.length * 34) + 10));
      const belowTop = Math.round(r.bottom + 6);
      const aboveTop = Math.round(r.top - estimatedHeight - 6);
      const fitsBelow = belowTop + estimatedHeight <= window.innerHeight - 8;
      const top = fitsBelow ? belowTop : Math.max(8, aboveTop);
      const maxHeight = Math.max(100, Math.min(estimatedHeight, window.innerHeight - top - 8));
      setPos({ left, top, width, maxHeight });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const handlePointerDown = (event) => {
      if (rootRef.current?.contains(event.target)) return;
      if (menuRef.current?.contains(event.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const menu = open && pos
    ? createPortal(
      <div
        ref={menuRef}
        className="cd-pop cd-pop--portal cd-dense cd-open cd-down pagecoach-language-menu"
        style={{ left: pos.left, top: pos.top, width: pos.width, maxHeight: pos.maxHeight }}
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="cd-list" role="listbox" aria-multiselectable="false">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`cd-item ${option.value === value ? "cd-on" : ""}`}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              <span />
              <span className="cd-label">
                <span className="cd-labelMain">{option.label}</span>
              </span>
            </button>
          ))}
        </div>
      </div>,
      document.body
    )
    : null;

  return (
    <div
      ref={rootRef}
      className="cd-root cd-dense pagecoach-language-dlist"
      data-open={open ? "1" : "0"}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="cd-title">{label}</div>
      <button
        ref={btnRef}
        type="button"
        className="cd-btn"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="cd-left">
          <span className="cd-text">
            <span className="cd-triggerLabel">{selected?.label || value}</span>
          </span>
        </span>
        <span className="cd-right">
          <PickerChevron />
        </span>
      </button>
      {menu}
    </div>
  );
}

function PageCoach({ onClose, currentPage }) {
  const bubbleRef = useRef(null);
  const [mode, setMode] = useState("page");
  const [language, setLanguage] = useState(() => localStorage.getItem(PAGE_COACH_LANGUAGE_STORAGE_KEY) || "en");
  const [domTick, setDomTick] = useState(0);
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState(null);
  const [bubbleHeight, setBubbleHeight] = useState(180);
  const locale = useMemo(() => getLocaleWithFallback(language), [language]);
  const steps = useMemo(() => (mode === "page" ? buildPageSteps(currentPage, locale) : buildBaseSteps(locale)), [currentPage, mode, domTick, locale]);
  const step = steps[index] || steps[0];
  const isLast = index >= steps.length - 1;

  useEffect(() => {
    localStorage.setItem(PAGE_COACH_LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    setIndex(0);
  }, [currentPage, mode, language]);

  useEffect(() => {
    if (mode !== "page") return undefined;
    const id = setInterval(() => setDomTick((v) => v + 1), 900);
    return () => clearInterval(id);
  }, [mode]);

  useEffect(() => {
    if (Array.isArray(step?.elements) && step.elements.length > 0) {
      const mid = step.elements[Math.floor(step.elements.length / 2)] || step.elements[0];
      requestAnimationFrame(() => {
        revealElementInHorizontalContainers(mid);
        mid.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      });
    } else if (step?.element) {
      requestAnimationFrame(() => {
        revealElementInHorizontalContainers(step.element);
        step.element.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      });
    }
  }, [step, index]);

  useEffect(() => {
    const update = () => {
      const next = Array.isArray(step?.elements) ? getElementsUnionRect(step.elements) : (step?.element ? getElementRect(step.element) : getRect(step?.selector));
      setRect(next);
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    const timer = setInterval(update, 250);
    return () => {
      clearInterval(timer);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [step]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose?.();
      if (event.key === "ArrowRight") setIndex((i) => Math.min(steps.length - 1, i + 1));
      if (event.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, steps.length]);

  useEffect(() => {
    const el = bubbleRef.current;
    if (!el) return undefined;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r?.height > 0) setBubbleHeight(Math.ceil(r.height));
    };
    measure();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => measure());
      ro.observe(el);
      return () => ro.disconnect();
    }
    const id = setInterval(measure, 400);
    return () => clearInterval(id);
  }, [step, index, mode, rect, language]);

  const bubbleWidth = Math.min(310, window.innerWidth - 20);
  const bubblePos = rect ? computeBubblePos(rect, bubbleWidth, bubbleHeight) : { left: 10, top: Math.max(10, window.innerHeight - bubbleHeight - 10), width: bubbleWidth };

  return (
    <div className="pagecoach-overlay" onClick={onClose}>
      {rect ? <div className="pagecoach-focus" style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }} /> : null}
      <section ref={bubbleRef} className="pagecoach-bubble" style={{ left: bubblePos.left, top: bubblePos.top, width: bubblePos.width }} onClick={(event) => event.stopPropagation()}>
        <div className="pagecoach-content" key={`${mode}-${language}-${step?.id || index}`}>
          <div className="pagecoach-mode-row">
            <button type="button" className={`pagecoach-mode-btn ${mode === "base" ? "is-active" : ""}`} onClick={() => setMode("base")}>{locale.ui.baseMode}</button>
            <button type="button" className={`pagecoach-mode-btn ${mode === "page" ? "is-active" : ""}`} onClick={() => setMode("page")}>{locale.ui.currentPageMode}</button>
            <div
              className="pagecoach-language-select"
              onMouseDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
            >
              <PageCoachLanguagePicker
                label={locale.ui.languageLabel}
                options={PAGE_COACH_LANGUAGE_OPTIONS}
                value={language}
                onChange={setLanguage}
              />
            </div>
          </div>
          <div className="pagecoach-step">{locale.ui.step} {index + 1}/{steps.length}</div>
          <h3>{step?.title || locale.ui.helpTitle}</h3>
          <p>{step?.text || locale.ui.nextHint}</p>
          {!rect ? <p className="pagecoach-warning">{locale.ui.missingZone}</p> : null}
          <div className="pagecoach-actions">
            <button type="button" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>{locale.ui.previous}</button>
            <button type="button" onClick={() => (isLast ? onClose?.() : setIndex((i) => i + 1))}>{isLast ? locale.ui.finish : locale.ui.next}</button>
            <button type="button" onClick={onClose}>{locale.ui.close}</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PageCoach;
