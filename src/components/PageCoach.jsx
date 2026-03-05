import React, { useEffect, useMemo, useRef, useState } from "react";
import "./PageCoach.css";

const PAGE_LABELS = {
  home: "Home",
  inv: "Farm",
  cook: "Cook",
  fish: "Fish",
  flower: "Flower",
  bounty: "Dig",
  animal: "Animals",
  pet: "Pets",
  craft: "Craft",
  cropmachine: "Crop Machine",
  map: "Map",
  expand: "Expand",
  buynodes: "Buy nodes",
  factions: "Factions",
  toplists: "Lists",
  market: "Market",
  activity: "Activity",
};

// Ordered steps for "Page en cours" by page.
// Prefer names instead of indexes because visible columns can change.
// Supported entries:
// - "Column Name" -> single column by name
// - { names: ["A", "B"], title, text } -> grouped named columns
// - { fromName: "A", toName: "B", title, text } -> contiguous range by names
// - { fromName: "A", toEnd: true, excludeFrom: true, title, text } -> range from A to last
// Only listed columns/groups are used (no automatic extra steps).
const PAGE_COLUMN_STEP_ORDER = {
  cook: [
    "Cook",
    "Quantity",
    "XP",
    "XP/H",
    "XP",
    "Cost",
    "Prod",
    {
      fromName: "Prod",
      toEnd: true,
      excludeFrom: true,
      title: "Groupe ingredients",
      text: "Ces colonnes se lisent ensemble: composants/ressources de recette.",
    },
  ],
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
    if (!best || score > best.score) {
      best = { el, r, score };
    }
  }

  if (!best?.r) return null;
  const r = best.r;
  return {
    left: Math.max(6, Math.round(r.left - 6)),
    top: Math.max(6, Math.round(r.top - 6)),
    width: Math.round(r.width + 12),
    height: Math.round(r.height + 12),
  };
}

function getElementRect(el) {
  if (!el || !el.getBoundingClientRect) return null;
  const r = el.getBoundingClientRect();
  if (!r || r.width < 2 || r.height < 2) return null;
  return {
    left: Math.max(6, Math.round(r.left - 6)),
    top: Math.max(6, Math.round(r.top - 6)),
    width: Math.round(r.width + 12),
    height: Math.round(r.height + 12),
  };
}

function getElementsUnionRect(elements) {
  const rects = (Array.isArray(elements) ? elements : [])
    .map((el) => getElementRect(el))
    .filter(Boolean);
  if (!rects.length) return null;
  const left = Math.min(...rects.map((r) => r.left));
  const top = Math.min(...rects.map((r) => r.top));
  const right = Math.max(...rects.map((r) => r.left + r.width));
  const bottom = Math.max(...rects.map((r) => r.top + r.height));
  return { left, top, width: right - left, height: bottom - top };
}

function getHeaderLabel(th, idx) {
  const txt = (th?.textContent || "").replace(/\s+/g, " ").trim();
  const imgTitle = th?.querySelector("img")?.getAttribute("title") || "";
  return txt || imgTitle || `Colonne ${idx + 1}`;
}

function normalizeHeaderName(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function findHeaderIndexByName(headers, name, used, ignoreUsed = false) {
  const target = normalizeHeaderName(name);
  if (!target) return -1;

  for (let i = 0; i < headers.length; i++) {
    if (!ignoreUsed && used?.has(i)) continue;
    const candidate = normalizeHeaderName(getHeaderLabel(headers[i], i));
    if (candidate === target) return i;
  }
  for (let i = 0; i < headers.length; i++) {
    if (!ignoreUsed && used?.has(i)) continue;
    const candidate = normalizeHeaderName(getHeaderLabel(headers[i], i));
    if (candidate && (candidate.includes(target) || target.includes(candidate))) return i;
  }
  return -1;
}

function buildOrderedPageColumnSteps(headers, currentPage, pageKey) {
  const ordered = Array.isArray(PAGE_COLUMN_STEP_ORDER[pageKey]) ? PAGE_COLUMN_STEP_ORDER[pageKey] : null;
  if (!ordered) return null;

  const used = new Set();
  const out = [];
  let groupCount = 0;

  ordered.forEach((entry) => {
    if (typeof entry === "string") {
      const idx = findHeaderIndexByName(headers, entry, used, false);
      if (idx < 0 || idx >= headers.length || used.has(idx)) return;
      const th = headers[idx];
      const label = getHeaderLabel(th, idx);
      used.add(idx);
      out.push({
        id: `col-${idx}`,
        element: th,
        title: `${label}`,
        text: explainColumn(currentPage, label, idx),
      });
      return;
    }

    if (typeof entry === "number" && Number.isFinite(entry)) {
      const idx = Math.floor(entry) - 1;
      if (idx < 0 || idx >= headers.length || used.has(idx)) return;
      const th = headers[idx];
      const label = getHeaderLabel(th, idx);
      used.add(idx);
      out.push({
        id: `col-${idx}`,
        element: th,
        title: `${label}`,
        text: explainColumn(currentPage, label, idx),
      });
      return;
    }

    if (entry && typeof entry === "object") {
      const elements = [];

      if (Array.isArray(entry.names) && entry.names.length > 0) {
        entry.names.forEach((name) => {
          const idx = findHeaderIndexByName(headers, name, used, false);
          if (idx >= 0 && !used.has(idx)) {
            elements.push(headers[idx]);
            used.add(idx);
          }
        });
      } else if (typeof entry.fromName === "string") {
        const startRaw = findHeaderIndexByName(headers, entry.fromName, used, true);
        if (startRaw < 0) return;

        let endRaw = startRaw;
        if (entry.toEnd) {
          endRaw = headers.length - 1;
        } else if (typeof entry.toName === "string") {
          const foundEnd = findHeaderIndexByName(headers, entry.toName, used, true);
          endRaw = foundEnd >= 0 ? foundEnd : startRaw;
        }

        let startIdx = Math.min(startRaw, endRaw);
        let endIdx = Math.max(startRaw, endRaw);
        if (entry.excludeFrom && startIdx < endIdx) startIdx += 1;
        if (entry.excludeTo && endIdx > startIdx) endIdx -= 1;
        if (startIdx > endIdx) return;

        for (let i = startIdx; i <= endIdx; i++) {
          if (!used.has(i)) {
            elements.push(headers[i]);
            used.add(i);
          }
        }
      }

      if (!elements.length) return;
      groupCount += 1;
      out.push({
        id: `group-${groupCount}`,
        elements,
        title: entry.title || "Groupe de colonnes",
        text: entry.text || "Ces colonnes se lisent comme un bloc.",
      });
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
      const target = Math.max(
        0,
        Math.min(
          current.scrollWidth - current.clientWidth,
          ((leftIn + rightIn) / 2) - (current.clientWidth / 2)
        )
      );
      current.scrollTo({ left: target, behavior: "smooth" });
    }
    current = current.parentElement;
  }
}

function buildBaseSteps(currentPage) {
  return [
    {
      id: "options",
      selector: 'button[title="Options"]',
      title: "1. Regler les calculs",
      text: "Ici tu ajustes les options qui changent les resultats affiches.",
    },
    {
      id: "autorefresh",
      selector: ".coach-search-refresh-target",
      title: "2. Auto-refresh",
      text: "Ici: bouton de refresh manuel + cercle d'auto-refresh. Tu vois quand la prochaine mise a jour auto arrive.",
    },
    {
      id: "trades",
      selector: ".tabletrades",
      title: "3. Trades recents",
      text: "Cette ligne resume les listings/trades recents. Clique dessus pour plus de details.",
    },
    {
      id: "page-select",
      selector: ".header-page-select .cd-btn, .header-market-select .cd-btn",
      title: "4. Aller sur Boosts/Market",
      text: "Depuis ce menu, tu accèdes a toutes les autres pages.",
    },
    {
      id: "boosts-shortcut",
      selector: ".top-frame .coach-boosts-btn",
      title: "5. Boosts (NFT)",
      text: "Ce bouton ouvre la vue Boosts/NFT pour régler les combinaisons de test.",
    },
    {
      id: "deliveries-shortcut",
      selector: 'button[title="Deliveries"]',
      title: "6. Page Deliveries",
      text: "Ce bouton ouvre les Delivery, les Chores et les Bounty.",
    },
    {
      id: "tryset-switch",
      selector: ".top-frame .coach-tryset-switch",
      title: "7. Switch Active/Tryset",
      text: "Active = état actuel des NFT/skills. Tryset = simulation pour tester une combinaison de NFT/skills.",
    },
  ];
}

function explainColumn(currentPage, labelRaw, index) {
  const page = String(currentPage || "").toLowerCase();
  const label = String(labelRaw || "").replace(/\s+/g, " ").trim();
  const low = label.toLowerCase();
  const generic = "Cette colonne t'aide a comparer les lignes pour decider plus vite.";

  const commonMap = [
    [/name|item|fish|pet|component|shrine/, "Identifie l'element."],
    [/qty|quantity|stock/, "Quantité en stock / journalière / personnalisé."],
    [/cost|prod/, "Cout de production estimé (base de calcul de rentabilité)."],
    [/betty/, "Prix de vente a la boutique de Betty."],
    [/market/, "Prix du marché."],
    [/ratio/, "Nombre de Coins obtenu par Flower."],
    [/time|ready|when|grow/, "Heure / temps avant la récolte."],
  ];
  for (let i = 0; i < commonMap.length; i++) {
    if (commonMap[i][0].test(low)) return commonMap[i][1];
  }

  if (page === "inv") {
    if (/yield|harvest/.test(low)) return "Production moyenne calculée selon les NFT/skills.";
    if (/toharvest/.test(low)) return "Production réelle sur la ferme.";
  }
  if (page === "cook") {
    if (/xp|xp\/h|xp\/flower/.test(low)) return "Rendement XP: compare le meilleur XP pour ton cout/temps.";
  }
  if (page === "fish") {
    if (/bait/.test(low)) return "Appat obtenu par un composteur utilisé pour la pêche";
    if (/chum/.test(low)) return "Appat ajouté sur la canne à pêche";
    if (/map/.test(low)) return "Chance de trouver une carte pour un poisson rare";
  }
  if (page === "activity") {
    if (/harvest|burn/.test(low)) return "Activité de la ferme: ce qui est brulé/produit pendant une période.";
    if (/delivery/.test(low)) return "Quantité brulé pour les livraisons du Plaza.";
    if (/cost|market/.test(low)) return "Prix de production ou du marché.";
  }
  if (page === "expand") {
    if (/node|from|to|value/.test(low)) return "Aide a estimer la valeur des nouvelles parcelles et les ressources requises.";
  }

  if (!label) return `Colonne ${index + 1}: ${generic}`;
  return generic;
}

function buildPageSteps(currentPage) {
  const pageKey = String(currentPage || "").toLowerCase();
  const pageName = PAGE_LABELS[pageKey] || "Current page";
  const headers = Array.from(document.querySelectorAll(".table-container table thead th"))
    .filter((th) => !!getElementRect(th));

  if (!headers.length) {
    return [
      {
        id: "no-columns",
        selector: ".table-container",
        title: `Colonnes de ${pageName}`,
        text: "Aucune colonne detectee pour le moment. Charge les donnees ou ouvre une page avec tableau.",
      },
    ];
  }

  const orderedSteps = buildOrderedPageColumnSteps(headers, currentPage, pageKey);
  if (orderedSteps && orderedSteps.length > 0) {
    return [...orderedSteps];
  }

  const columnSteps = headers.map((th, idx) => {
    const label = getHeaderLabel(th, idx);
    return {
      id: `col-${idx}`,
      element: th,
      title: `Colonne ${label}`,
      text: explainColumn(currentPage, label, idx),
    };
  });

  return [...columnSteps];
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
  if (canBelow && (!canAbove || spaceBelow >= spaceAbove)) {
    top = rect.top + rect.height + gap;
  } else if (canAbove) {
    top = rect.top - h - gap;
  } else {
    top = spaceBelow >= spaceAbove
      ? (rect.top + rect.height + gap)
      : (rect.top - h - gap);
  }
  top = clamp(top, pad, viewportH - h - pad);
  left = clamp(left, pad, viewportW - w - pad);
  return { left, top, width: w };
}

function PageCoach({ onClose, currentPage }) {
  const bubbleRef = useRef(null);
  const [mode, setMode] = useState("base");
  const [domTick, setDomTick] = useState(0);
  const steps = useMemo(
    () => (mode === "page" ? buildPageSteps(currentPage) : buildBaseSteps(currentPage)),
    [currentPage, mode, domTick]
  );
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState(null);
  const [bubbleHeight, setBubbleHeight] = useState(180);

  const step = steps[index] || steps[0];
  const isLast = index >= steps.length - 1;

  useEffect(() => {
    setIndex(0);
  }, [currentPage, mode]);

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
        // Fallback to browser behavior for any remaining hidden clipping contexts.
        step.element.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      });
    }
  }, [step, index]);

  useEffect(() => {
    const update = () => {
      const next = Array.isArray(step?.elements)
        ? getElementsUnionRect(step.elements)
        : (step?.element ? getElementRect(step.element) : getRect(step?.selector));
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
      if (r && r.height > 0) {
        setBubbleHeight(Math.ceil(r.height));
      }
    };
    measure();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => measure());
      ro.observe(el);
      return () => ro.disconnect();
    }
    const id = setInterval(measure, 400);
    return () => clearInterval(id);
  }, [step, index, mode, rect]);

  const bubbleWidth = Math.min(310, window.innerWidth - 20);
  const bubblePos = rect
    ? computeBubblePos(rect, bubbleWidth, bubbleHeight)
    : {
        left: 10,
        top: Math.max(10, window.innerHeight - bubbleHeight - 10),
        width: bubbleWidth,
      };

  return (
    <div className="pagecoach-overlay" onClick={onClose}>
      {rect ? (
        <div
          className="pagecoach-focus"
          style={{
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
          }}
        />
      ) : null}
      <section
        ref={bubbleRef}
        className="pagecoach-bubble"
        style={{ left: bubblePos.left, top: bubblePos.top, width: bubblePos.width }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="pagecoach-content" key={`${mode}-${step?.id || index}`}>
          <div className="pagecoach-mode-row">
            <button
              type="button"
              className={`pagecoach-mode-btn ${mode === "base" ? "is-active" : ""}`}
              onClick={() => setMode("base")}
            >
              Base
            </button>
            <button
              type="button"
              className={`pagecoach-mode-btn ${mode === "page" ? "is-active" : ""}`}
              onClick={() => setMode("page")}
            >
              Page en cours
            </button>
          </div>
          <div className="pagecoach-step">Etape {index + 1}/{steps.length}</div>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
          {!rect ? <p className="pagecoach-warning">Zone introuvable sur cet ecran. Passe a l'etape suivante.</p> : null}
          <div className="pagecoach-actions">
            <button type="button" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
              Precedent
            </button>
            <button type="button" onClick={() => (isLast ? onClose?.() : setIndex((i) => i + 1))}>
              {isLast ? "Terminer" : "Suivant"}
            </button>
            <button type="button" onClick={onClose}>
              Fermer
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PageCoach;
