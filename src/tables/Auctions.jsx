import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useAppCtx } from "../context/AppCtx";

const GET_AUCTION_COOLDOWN_MS = 10_000;
const AUCTIONS_COLUMNS_TEMPLATE = [
  ["Item", 1],
  ["Type", 1],
  ["cur", 1],
  ["Supply", 1],
  ["End", 1],
  ["Notifications", 1],
];

function toYmd(date) {
  const d = date instanceof Date ? date : new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function normalizeAuctionsPayload(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") {
    if (Array.isArray(raw.auctions)) return raw.auctions;
    if (raw.auctions && typeof raw.auctions === "object" && Array.isArray(raw.auctions.auctions)) {
      return raw.auctions.auctions;
    }
    if (Array.isArray(raw.data)) return raw.data;
  }
  return [];
}

function getAuctionId(auction) {
  if (!auction || typeof auction !== "object") return "";
  const id = auction.auctionId ?? auction.id ?? auction.auction_id ?? auction.key ?? "";
  return String(id || "").trim();
}

function getAuctionItemLabel(auction) {
  if (!auction || typeof auction !== "object") return "-";
  const typeKey = String(auction.type || "").trim();
  const typedValue = typeKey ? auction[typeKey] : "";
  return String(
    auction.itemName
    || typedValue
    || auction.wearable
    || auction.collectible
    || auction.nft
    || auction.item
    || auction.name
    || auction.type
    || "-"
  );
}

function getAuctionItemImg(auction) {
  if (!auction || typeof auction !== "object") return "";
  const explicit = String(auction.itemImg || "").trim();
  if (explicit) return explicit;
  const name = String(getAuctionItemLabel(auction) || "").trim().toLowerCase();
  if (name === "pet") return "./icon/ui/petegg.png";
  return "";
}

function getAuctionType(auction) {
  if (!auction || typeof auction !== "object") return "-";
  return String(auction.type || "-");
}

function getAuctionIngredientKey(auction) {
  if (auction?.curKey) return String(auction.curKey);
  const ingredients = auction?.ingredients;
  if (!ingredients || typeof ingredients !== "object") return "-";
  const keys = Object.keys(ingredients).filter((k) => String(k || "").trim() !== "");
  if (keys.length < 1) return "-";
  return String(keys[0]);
}

function getAuctionIngredientImg(auction) {
  if (auction?.curImg) return String(auction.curImg);
  const key = String(getAuctionIngredientKey(auction) || "").toLowerCase();
  if (key === "gem") return "./icon/res/gem.webp";
  return "";
}

function formatItems(itemsObj) {
  if (!itemsObj || typeof itemsObj !== "object") return "-";
  const entries = Object.entries(itemsObj).filter(([k, v]) => String(k || "").trim() !== "");
  if (entries.length < 1) return "-";
  return entries
    .map(([name, qty]) => `${name}: ${Number(qty || 0)}`)
    .join(" | ");
}

function getAuctionDateMs(auction) {
  if (!auction || typeof auction !== "object") return null;
  const values = [auction.endAt, auction.endedAt, auction.endDate, auction.date, auction.startAt, auction.createdAt];
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    if (value == null) continue;
    const num = Number(value);
    if (Number.isFinite(num)) return num > 1e12 ? num : num * 1000;
    const ts = Date.parse(String(value));
    if (Number.isFinite(ts)) return ts;
  }
  return null;
}

function formatDateTime(value) {
  const num = Number(value);
  const ts = Number.isFinite(num) ? (num > 1e12 ? num : num * 1000) : Date.parse(String(value || ""));
  if (!Number.isFinite(ts)) return "-";
  return new Date(ts).toLocaleString();
}
function formatDateTimeWithYear(value, compact = false) {
  const ts = toTs(value);
  if (!Number.isFinite(ts)) return "-";
  const d = new Date(ts);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = String(d.getFullYear());
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return compact ? `${dd}/${mm}/${yyyy} ${hh}:${mi}` : `${dd}/${mm}/${yyyy}, ${hh}:${mi}`;
}
function toTs(value) {
  const num = Number(value);
  const ts = Number.isFinite(num) ? (num > 1e12 ? num : num * 1000) : Date.parse(String(value || ""));
  return Number.isFinite(ts) ? ts : null;
}
function isTodayTs(value) {
  const ts = toTs(value);
  if (!Number.isFinite(ts)) return false;
  const d = new Date(ts);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear()
    && d.getMonth() === now.getMonth()
    && d.getDate() === now.getDate()
  );
}

function extractSingleItemName(itemsObj) {
  if (!itemsObj || typeof itemsObj !== "object") return "";
  const keys = Object.keys(itemsObj).filter((k) => String(k || "").trim() !== "");
  return keys.length === 1 ? String(keys[0]) : "";
}

function extractSingleItemValue(itemsObj) {
  const key = extractSingleItemName(itemsObj);
  if (!key) return "";
  return String(Number(itemsObj?.[key] || 0));
}

function detectLeaderboardRewardKind(rows, auction) {
  const list = Array.isArray(rows) ? rows : [];
  for (let i = 0; i < list.length; i++) {
    const row = list[i] || {};
    const itemName = extractSingleItemName(row.items);
    if (itemName) {
      const lbl = String(itemName);
      const low = lbl.toLowerCase();
      const img = low === "gem"
        ? "./icon/res/gem.webp"
        : (low === "flower" || low === "sfl" ? "./icon/res/flowertoken.webp" : "");
      return { kind: "item", label: lbl, img };
    }
  }
  const hasTickets = list.some((row) => Number(row?.tickets || 0) > 0);
  if (hasTickets) {
    const label = String(getAuctionIngredientKey(auction) || "Tickets");
    const img = getAuctionIngredientImg(auction);
    return { kind: "tickets", label, img };
  }
  const hasSfl = list.some((row) => Number(row?.sfl || 0) > 0);
  if (hasSfl) return { kind: "sfl", label: "SFL", img: "./icon/res/flowertoken.webp" };
  return { kind: "items", label: "Items", img: "" };
}

function formatLeaderboardRewardCell(row, rewardKind) {
  const kind = String(rewardKind?.kind || "items");
  if (kind === "item") return extractSingleItemValue(row?.items) || "-";
  if (kind === "tickets") {
    const v = Number(row?.tickets || 0);
    return v > 0 ? String(v) : "-";
  }
  if (kind === "sfl") {
    const v = Number(row?.sfl || 0);
    return v > 0 ? String(v) : "-";
  }
  return formatItems(row?.items);
}

function formatCompactNumber(value) {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return "-";
  const abs = Math.abs(num);
  if (abs >= 1e9) return `${(num / 1e9).toFixed(3)}B`;
  if (abs >= 1e6) return `${(num / 1e6).toFixed(3)}M`;
  if (abs >= 1e3) return `${(num / 1e3).toFixed(3)}K`;
  return String(Math.round(num));
}

function getLeaderboardRewardUsd(row, rewardKind, usdPerSfl, gemsRatio) {
  const kind = String(rewardKind?.kind || "items");
  if (!(usdPerSfl > 0)) return null;
  if (kind === "tickets") return null;
  if (kind === "sfl") {
    const qty = Number(row?.sfl || 0);
    return qty > 0 ? (qty * usdPerSfl) : null;
  }
  if (kind === "item") {
    const itemName = String(extractSingleItemName(row?.items) || "").toLowerCase();
    const qty = Number(extractSingleItemValue(row?.items) || 0);
    if (qty <= 0) return null;
    if (itemName === "flower" || itemName === "sfl") {
      return qty * usdPerSfl;
    }
    if (itemName === "gem") {
      return gemsRatio > 0 ? (qty * gemsRatio * usdPerSfl) : null;
    }
  }
  return null;
}

function isFlowerRewardLabel(label) {
  const low = String(label || "").trim().toLowerCase();
  return low === "flower" || low === "sfl" || low === "flower token";
}

function isGemRewardLabel(label) {
  return String(label || "").trim().toLowerCase() === "gem";
}

function isTicketRewardLabel(label) {
  const low = String(label || "").trim().toLowerCase();
  return low === "ticket" || low === "tickets" || low.includes("ticket");
}

export default function AuctionsTable() {
  const {
    data: { dataSet, dataSetFarm, priceData },
    ui: { selectedInv, xListeColAuctions },
    config: { API_URL },
    actions: { setOptionField, syncAuctionNotifSelection },
  } = useAppCtx();

  const today = useMemo(() => toYmd(new Date()), []);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + 21);
    return toYmd(d);
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setUTCMonth(d.getUTCMonth() - 3);
    return toYmd(d);
  });
  const [auctions, setAuctions] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState("");
  const [selectedAuctionId, setSelectedAuctionId] = useState("");
  const [auctionDetails, setAuctionDetails] = useState(null);
  const [auctionDetailsCache, setAuctionDetailsCache] = useState({});
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [, setTick] = useState(0);
  const [sourceCount, setSourceCount] = useState(0);
  const rootRef = useRef(null);
  const listScrollRef = useRef(null);
  const autoScrollRowRef = useRef(null);
  const autoScrollKeyRef = useRef("");
  const [availableHeight, setAvailableHeight] = useState(520);
  const [viewportWidth, setViewportWidth] = useState(1024);

  const farmId = String(dataSetFarm?.frmid || dataSet?.options?.farmId || "").trim();
  const auctionColumns = Array.isArray(xListeColAuctions) ? xListeColAuctions : AUCTIONS_COLUMNS_TEMPLATE;
  const isColOn = (idx) => auctionColumns?.[idx]?.[1] === 1;
  const auctionSelectionByFarm = (dataSet?.options?.auctionNotifSelection && typeof dataSet.options.auctionNotifSelection === "object")
    ? dataSet.options.auctionNotifSelection
    : {};
  const auctionSelection = (farmId && auctionSelectionByFarm?.[farmId] && typeof auctionSelectionByFarm[farmId] === "object")
    ? auctionSelectionByFarm[farmId]
    : {};
  const selectedAuction = useMemo(
    () => auctions.find((a) => String(getAuctionId(a)) === String(selectedAuctionId)) || null,
    [auctions, selectedAuctionId]
  );
  const auctionItemTitle = getAuctionItemLabel(selectedAuction);
  const leaderboardRows = Array.isArray(auctionDetails?.leaderboard) ? auctionDetails.leaderboard : [];
  const leaderboardReward = useMemo(
    () => detectLeaderboardRewardKind(leaderboardRows, selectedAuction),
    [leaderboardRows, selectedAuction]
  );
  const auctionCurrencyLabel = String(getAuctionIngredientKey(selectedAuction) || "");
  const usdPerSfl = Number(priceData?.[2] ?? dataSet?.options?.usdSfl ?? 0);
  const gemsRatio = Number(dataSet?.options?.gemsRatio || 0);
  const showUsdColumn = useMemo(() => {
    if (!(usdPerSfl > 0)) return false;
    if (isTicketRewardLabel(auctionCurrencyLabel)) return false;
    if (isFlowerRewardLabel(auctionCurrencyLabel) || isGemRewardLabel(auctionCurrencyLabel)) return true;
    if (String(leaderboardReward?.kind || "") === "tickets") return false;
    if (String(leaderboardReward?.kind || "") === "sfl") return true;
    if (String(leaderboardReward?.kind || "") === "item") {
      const label = String(leaderboardReward?.label || "").toLowerCase();
      return isGemRewardLabel(label) || isFlowerRewardLabel(label);
    }
    return false;
  }, [auctionCurrencyLabel, leaderboardReward, usdPerSfl]);
  const highlightedEndTs = useMemo(() => {
    const nowMs = Date.now();
    const todayRows = [];
    const futureRows = [];
    auctions.forEach((auction) => {
      const endValue = auction?.endAt ?? auction?.endedAt ?? auction?.date;
      const ts = toTs(endValue);
      if (!Number.isFinite(ts)) return;
      if (isTodayTs(ts)) {
        todayRows.push(ts);
        return;
      }
      if (ts > nowMs) futureRows.push(ts);
    });
    if (todayRows.length > 0) return null; // keep current "today" highlight rule
    if (futureRows.length < 1) return null;
    return Math.min(...futureRows);
  }, [auctions]);
  const autoScrollTargetId = useMemo(() => {
    const nowMs = Date.now();
    let bestAuctionId = "";
    let bestDistance = Infinity;
    auctions.forEach((auction, idx) => {
      const ts = toTs(auction?.endAt ?? auction?.endedAt ?? auction?.date);
      if (!Number.isFinite(ts)) return;
      const distance = Math.abs(ts - nowMs);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestAuctionId = getAuctionId(auction) || `#${idx + 1}`;
      }
    });
    return bestAuctionId;
  }, [auctions]);
  const now = Date.now();
  const isNarrow = viewportWidth < 560;
  const cooldownLeftMs = Math.max(0, Number(cooldownUntil || 0) - now);
  const cooldownLeftSec = Math.ceil(cooldownLeftMs / 1000);

  useEffect(() => {
    if (cooldownLeftMs <= 0) return undefined;
    const timer = setInterval(() => setTick((v) => v + 1), 250);
    return () => clearInterval(timer);
  }, [cooldownLeftMs]);
  useLayoutEffect(() => {
    const updateHeight = () => {
      const top = Number(rootRef.current?.getBoundingClientRect?.().top || 0);
      const viewportInner = Number(window?.innerHeight || 0);
      const viewportClient = Number(document?.documentElement?.clientHeight || 0);
      const viewport = Math.min(
        viewportInner > 0 ? viewportInner : Infinity,
        viewportClient > 0 ? viewportClient : Infinity
      );
      const safeViewport = Number.isFinite(viewport) ? viewport : Math.max(viewportInner, viewportClient, 0);
      const next = Math.max(280, Math.floor(safeViewport - top - 24));
      setAvailableHeight(next);
      setViewportWidth(Number(window?.innerWidth || 1024));
    };
    updateHeight();
    const raf = requestAnimationFrame(updateHeight);
    window.addEventListener("resize", updateHeight);
    window.addEventListener("scroll", updateHeight, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("scroll", updateHeight, true);
    };
  }, []);
  useEffect(() => {
    const id = setTimeout(() => {
      const top = Number(rootRef.current?.getBoundingClientRect?.().top || 0);
      const viewportInner = Number(window?.innerHeight || 0);
      const viewportClient = Number(document?.documentElement?.clientHeight || 0);
      const safeViewport = Math.min(
        viewportInner > 0 ? viewportInner : Infinity,
        viewportClient > 0 ? viewportClient : Infinity
      );
      const vp = Number.isFinite(safeViewport) ? safeViewport : Math.max(viewportInner, viewportClient, 0);
      const next = Math.max(280, Math.floor(vp - top - 24));
      setAvailableHeight(next);
      setViewportWidth(Number(window?.innerWidth || 1024));
    }, 0);
    return () => clearTimeout(id);
  }, [auctions.length, detailsLoading, selectedAuctionId, detailsError]);

  useEffect(() => {
    let cancelled = false;
    async function loadAuctions() {
      if (selectedInv !== "auctions") return;
      setListLoading(true);
      setListError("");
      try {
        const url = `${API_URL}/auctions?from=${encodeURIComponent(startDate)}&to=${encodeURIComponent(endDate)}`;
        const response = await fetch(url, { method: "GET" });
        if (!response.ok) {
          if (!cancelled) setListError(`Erreur auctions (${response.status})`);
          if (!cancelled) setAuctions([]);
          return;
        }
        const payload = await response.json();
        const rows = normalizeAuctionsPayload(payload).slice();
        rows.sort((a, b) => Number(getAuctionDateMs(b) || 0) - Number(getAuctionDateMs(a) || 0));
        if (!cancelled) setAuctions(rows);
        if (!cancelled) setSourceCount(Number(payload?.sourceCount || rows.length || 0));
      } catch (error) {
        if (!cancelled) {
          setAuctions([]);
          setListError(String(error?.message || error || "Erreur"));
          setSourceCount(0);
        }
      } finally {
        if (!cancelled) setListLoading(false);
      }
    }
    loadAuctions();
    return () => {
      cancelled = true;
    };
  }, [selectedInv, API_URL, startDate, endDate]);
  useEffect(() => {
    if (selectedInv !== "auctions" || listLoading || listError || auctions.length < 1 || !autoScrollTargetId) return;
    const runKey = `${startDate}|${endDate}|${autoScrollTargetId}|${auctions.length}`;
    if (autoScrollKeyRef.current === runKey) return;
    const scrollEl = listScrollRef.current;
    const rowEl = autoScrollRowRef.current;
    if (!scrollEl || !rowEl) return;

    const frame = requestAnimationFrame(() => {
      const containerRect = scrollEl.getBoundingClientRect();
      const rowRect = rowEl.getBoundingClientRect();
      const isVisible = rowRect.top >= containerRect.top && rowRect.bottom <= containerRect.bottom;
      autoScrollKeyRef.current = runKey;
      if (isVisible) return;

      const targetScrollTop = rowEl.offsetTop - Math.max(0, (scrollEl.clientHeight / 2) - (rowEl.offsetHeight / 2));
      scrollEl.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: "smooth",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [selectedInv, listLoading, listError, auctions, autoScrollTargetId, startDate, endDate]);
  useEffect(() => {
    if (!farmId) return;
    const currentSelection = (auctionSelectionByFarm?.[farmId] && typeof auctionSelectionByFarm[farmId] === "object")
      ? auctionSelectionByFarm[farmId]
      : null;
    if (!currentSelection) return;
    const nowTs = Date.now();
    const nextFarmSelection = Object.fromEntries(
      Object.entries(currentSelection).filter(([, rawEntry]) => {
        const entry = (rawEntry && typeof rawEntry === "object") ? rawEntry : {};
        const endAt = Number(entry?.e ?? entry?.endAt ?? 0);
        return Number.isFinite(endAt) && endAt > nowTs;
      })
    );
    if (Object.keys(nextFarmSelection).length === Object.keys(currentSelection).length) return;
    const nextSelectionByFarm = { ...(auctionSelectionByFarm || {}) };
    if (Object.keys(nextFarmSelection).length > 0) nextSelectionByFarm[farmId] = nextFarmSelection;
    else delete nextSelectionByFarm[farmId];
    setOptionField("auctionNotifSelection", nextSelectionByFarm);
    syncAuctionNotifSelection(nextSelectionByFarm);
  }, [farmId, auctionSelectionByFarm, setOptionField, syncAuctionNotifSelection]);

  if (selectedInv !== "auctions") return null;

  function toggleAuctionNotif(auction, enabled) {
    const auctionId = String(getAuctionId(auction) || "").trim();
    const endTs = Number(getAuctionDateMs(auction) || 0);
    if (!farmId || !auctionId || !Number.isFinite(endTs)) return;
    if (enabled && endTs <= Date.now()) return;
    const itemLabel = String(getAuctionItemLabel(auction) || auctionId).trim();
    const nextSelectionByFarm = {
      ...auctionSelectionByFarm,
      [farmId]: {
        ...(auctionSelectionByFarm?.[farmId] || {}),
      },
    };
    if (enabled) {
      nextSelectionByFarm[farmId][auctionId] = { e: endTs, l: itemLabel };
    } else {
      delete nextSelectionByFarm[farmId][auctionId];
      if (Object.keys(nextSelectionByFarm[farmId]).length < 1) {
        delete nextSelectionByFarm[farmId];
      }
    }
    setOptionField("auctionNotifSelection", nextSelectionByFarm);
    syncAuctionNotifSelection(nextSelectionByFarm);
  }

  async function onSelectAuction(auction) {
    const auctionId = getAuctionId(auction);
    if (!auctionId) return;
    if (!farmId) {
      setDetailsError("Farm ID introuvable. Charge d'abord la ferme.");
      return;
    }
    const cacheKey = `${farmId}:${auctionId}`;
    const cached = auctionDetailsCache?.[cacheKey];
    if (cached && typeof cached === "object") {
      setSelectedAuctionId(auctionId);
      setDetailsError("");
      setDetailsLoading(false);
      setCooldownUntil(0);
      setAuctionDetails(cached);
      return;
    }
    if (Date.now() < Number(cooldownUntil || 0)) return;
    setSelectedAuctionId(auctionId);
    setDetailsLoading(true);
    setDetailsError("");
    setAuctionDetails(null);
    setCooldownUntil(Date.now() + GET_AUCTION_COOLDOWN_MS);
    try {
      const username = String(dataSetFarm?.username || "");
      const url = `${API_URL}/getauction?auctionId=${encodeURIComponent(auctionId)}&farmId=${encodeURIComponent(farmId)}&username=${encodeURIComponent(username)}`;
      const response = await fetch(url, { method: "GET" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setDetailsError(payload?.error ? String(payload.error) : `Erreur getAuction (${response.status})`);
        return;
      }
      setAuctionDetailsCache((prev) => ({
        ...(prev || {}),
        [cacheKey]: payload,
      }));
      setAuctionDetails(payload);
    } catch (error) {
      setDetailsError(String(error?.message || error || "Erreur getAuction"));
    } finally {
      setDetailsLoading(false);
    }
  }

  const pageStyle = {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    height: `${availableHeight}px`,
    minHeight: 320,
    overflow: "hidden",
  };
  const listFrameStyle = {
    flex: "1 1 auto",
    minHeight: 0,
    width: "90%",
    maxWidth: 550,
    margin: "0",
    border: "1px solid #3b3b3b",
    borderRadius: 8,
    padding: 10,
    background: "rgba(0,0,0,0.15)",
    overflow: "hidden",
  };
  const listScrollStyle = {
    height: "calc(100% - 42px)",
    overflow: "auto",
  };
  const detailsFrameStyle = {
    flex: "0 0 auto",
    maxHeight: "38vh",
    position: "relative",
    width: "90%",
    maxWidth: 550,
    margin: "0",
    border: "1px solid #3b3b3b",
    borderRadius: 8,
    padding: 10,
    background: "rgba(0,0,0,0.15)",
    overflow: "auto",
  };

  return (
    <div ref={rootRef} style={pageStyle}>
      <div style={listFrameStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <h3 style={{ margin: 0, display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span>Auctions</span>
            {cooldownLeftMs > 0 ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#f8cc7b" }}>
                <img src="./icon/ui/syncing.gif" alt="" className="itico" style={{ width: 14, height: 14 }} />
                <span>{cooldownLeftSec}s</span>
              </span>
            ) : null}
          </h3>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <label htmlFor="auctions-start-date" style={{ fontSize: 12 }}>from</label>
              <input
                id="auctions-start-date"
                type="date"
                value={startDate}
                style={{ maxWidth: 132 }}
                onChange={(e) => setStartDate(String(e.target.value || today))}
              />
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <label htmlFor="auctions-end-date" style={{ fontSize: 12 }}>to</label>
              <input
                id="auctions-end-date"
                type="date"
                value={endDate}
                style={{ maxWidth: 132 }}
                onChange={(e) => setEndDate(String(e.target.value || today))}
              />
            </span>
          </div>
        </div>

        {listLoading ? <div>Loading auctions...</div> : null}
        {!listLoading && listError ? <div style={{ color: "#ff8b8b" }}>{listError}</div> : null}
        {!listLoading && !listError && auctions.length < 1 ? (
          <div>
            No auction in selected range.
            {sourceCount > 0 ? ` (${sourceCount} auctions available in source)` : ""}
          </div>
        ) : null}

        <div
          ref={listScrollRef}
          className="table-container"
          style={{
            ...listScrollStyle,
            opacity: cooldownLeftMs > 0 ? 0.45 : 1,
            transition: "opacity 180ms ease",
          }}
        >
          {!listLoading && !listError && auctions.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  {isColOn(0) ? <th className="thcenter" style={{ textAlign: "left" }}>Item</th> : null}
                  {isColOn(1) ? <th className="thcenter">Type</th> : null}
                  {isColOn(2) ? <th className="thcenter">cur</th> : null}
                  {isColOn(3) ? <th className="thcenter">Supply</th> : null}
                  {isColOn(4) ? <th className="thcenter">End</th> : null}
                  {isColOn(5) ? (
                    <th className="thcenter" title="Auction notifications">
                      <span style={{ fontSize: 16, lineHeight: 1 }} aria-label="Notifications">🔔</span>
                    </th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {auctions.map((auction, idx) => {
                  const auctionId = getAuctionId(auction) || `#${idx + 1}`;
                  const auctionNotifEnabled = !!auctionSelection?.[auctionId];
                  const isSelected = String(selectedAuctionId) === String(auctionId);
                  const endValue = auction?.endAt ?? auction?.endedAt ?? auction?.date;
                  const endTs = toTs(endValue);
                  const canNotifyAuction = Number.isFinite(endTs) && endTs > now;
                  const isTodayEnd = isTodayTs(endValue);
                  const isClosestFuture = !isTodayEnd && highlightedEndTs != null && Number(endTs) === Number(highlightedEndTs);
                  const mustHighlightEnd = isTodayEnd || isClosestFuture;
                  const endText = isNarrow
                    ? (() => {
                      const ts = toTs(endValue);
                      if (!Number.isFinite(ts)) return "-";
                      const d = new Date(ts);
                      const dd = String(d.getDate()).padStart(2, "0");
                      const mm = String(d.getMonth() + 1).padStart(2, "0");
                      const hh = String(d.getHours()).padStart(2, "0");
                      const mi = String(d.getMinutes()).padStart(2, "0");
                      return `${dd}/${mm} ${hh}:${mi}`;
                    })()
                    : formatDateTime(endValue);
                  return (
                    <tr
                      key={`${auctionId}-${idx}`}
                      ref={auctionId === autoScrollTargetId ? autoScrollRowRef : null}
                      onClick={() => onSelectAuction(auction)}
                      style={{
                        cursor: "pointer",
                        background: isSelected ? "rgba(255,255,255,0.12)" : "transparent",
                      }}
                      title={cooldownLeftMs > 0 ? `Cooldown ${cooldownLeftSec}s` : "Load auction results"}
                    >
                      {isColOn(0) ? (
                        <td className="tdcenter" style={{ textAlign: "left" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                            {getAuctionItemImg(auction)
                              ? <img src={getAuctionItemImg(auction)} alt="" className="itico" style={{ width: 18, height: 18 }} />
                              : null}
                            <span>{getAuctionItemLabel(auction)}</span>
                          </span>
                        </td>
                      ) : null}
                      {isColOn(1) ? <td className="tdcenter">{getAuctionType(auction)}</td> : null}
                      {isColOn(2) ? (
                        <td className="tdcenter">
                          {getAuctionIngredientImg(auction)
                            ? <img src={getAuctionIngredientImg(auction)} alt="" className="itico" style={{ width: 16, height: 16 }} />
                            : "-"}
                        </td>
                      ) : null}
                      {isColOn(3) ? <td className="tdcenter">{Number(auction?.supply || 0) || "-"}</td> : null}
                      {isColOn(4) ? (
                        <td
                          className="tdcenter"
                          style={{
                            ...(mustHighlightEnd ? { color: "#ffd54f", fontWeight: 700 } : null),
                            whiteSpace: "nowrap",
                          }}
                        >
                          {endText}
                        </td>
                      ) : null}
                      {isColOn(5) ? (
                        <td className="tdcenter">
                          {canNotifyAuction ? (
                            <input
                              type="checkbox"
                              checked={auctionNotifEnabled}
                              onChange={(e) => {
                                e.stopPropagation();
                                toggleAuctionNotif(auction, !!e.target.checked);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              title="Notify 12 minutes before end"
                              style={{ width: 16, height: 16 }}
                            />
                          ) : null}
                        </td>
                      ) : null}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : null}
        </div>
      </div>

      <div className="table-container" style={detailsFrameStyle}>
        {getAuctionItemImg(selectedAuction)
          ? <img
            src={getAuctionItemImg(selectedAuction)}
            alt=""
            className="itico"
            style={{ width: "auto", height: "auto", maxWidth: 72, maxHeight: 72, position: "absolute", top: 8, right: 8 }}
          />
          : null}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h3 style={{ margin: 0, paddingRight: 84 }}>
            <span>Auction Details{auctionItemTitle && auctionItemTitle !== "-" ? `: ${auctionItemTitle}` : ""}</span>
          </h3>
        </div>

        {!selectedAuctionId ? <div>Select an auction in the list.</div> : null}
        {detailsLoading ? <div>Loading auction result...</div> : null}
        {!detailsLoading && detailsError ? <div style={{ color: "#ff8b8b" }}>{detailsError}</div> : null}

        {!detailsLoading && !detailsError && auctionDetails ? (
          <>
            <div style={{ marginBottom: 10, paddingRight: 84 }}>
              <div>Participant count: {Number(auctionDetails?.participantCount || 0)}</div>
              <div>Supply: {Number(auctionDetails?.supply || 0) || "-"}</div>
              <div style={{ whiteSpace: "nowrap" }}>
                End: {isNarrow
                  ? formatDateTimeWithYear(auctionDetails?.endAt, true)
                  : formatDateTimeWithYear(auctionDetails?.endAt)}
              </div>
            </div>

            <h4 style={{ margin: "4px 0 8px 0" }}>Leaderboard</h4>
            <table className="table">
              <thead>
                <tr>
                  <th className="thcenter">Rank</th>
                  <th className="thcenter">Username</th>
                  <th className="thcenter">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      {leaderboardReward?.img
                        ? <img src={leaderboardReward.img} alt="" className="itico" style={{ width: 16, height: 16 }} />
                        : null}
                      <span>{leaderboardReward?.label || "Items"}</span>
                    </span>
                  </th>
                  {showUsdColumn ? (
                    <th className="thcenter">
                      <img src="./usdc.png" alt="USDC" className="itico" style={{ width: 16, height: 16 }} />
                    </th>
                  ) : null}
                  <th className="thcenter">XP</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardRows.map((row, idx) => (
                  <tr key={`${row?.farmId || "farm"}-${idx}`}>
                    <td className="tdcenter">{Number(row?.rank || 0) || "-"}</td>
                    <td className="tdcenter">{String(row?.username || "-")}</td>
                    <td className="tdcenter">{formatLeaderboardRewardCell(row, leaderboardReward)}</td>
                    {showUsdColumn ? (
                      <td className="tdcenter">
                        {(() => {
                          const usdValue = getLeaderboardRewardUsd(row, leaderboardReward, usdPerSfl, gemsRatio);
                          if (usdValue != null) return usdValue.toFixed(3);
                          if (isFlowerRewardLabel(auctionCurrencyLabel)) {
                            const displayedQty = Number(formatLeaderboardRewardCell(row, leaderboardReward) || 0);
                            return Number.isFinite(displayedQty) && displayedQty > 0 ? (displayedQty * usdPerSfl).toFixed(3) : "-";
                          }
                          if (isGemRewardLabel(auctionCurrencyLabel)) {
                            const displayedQty = Number(formatLeaderboardRewardCell(row, leaderboardReward) || 0);
                            return Number.isFinite(displayedQty) && displayedQty > 0 && gemsRatio > 0
                              ? (displayedQty * gemsRatio * usdPerSfl).toFixed(3)
                              : "-";
                          }
                          return "-";
                        })()}
                      </td>
                    ) : null}
                    <td className="tdcenter">{formatCompactNumber(row?.experience || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : null}
      </div>
    </div>
  );
}

