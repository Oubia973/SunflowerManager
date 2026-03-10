export const TRY_SHARE_PART_TABLES = {
  collectibles: ["nft"],
  wearables: ["nftw"],
  craft: ["buildng"],
  buds: ["bud"],
  skills: ["skill", "skilllgc"],
  shrines: ["shrine"],
  // Legacy aliases
  nft: ["nft"],
  wearable: ["nftw"],
};
import {
  normalizeToken,
  inferCategoryTokens,
  BOOST_ITEM_CATEGORY_ALIASES,
  buildItemCategoryIndex,
} from "./tryNftTaxonomy.js";

export const TRY_SHARE_ALL_TABLES = ["nft", "nftw", "skill", "skilllgc", "buildng", "bud", "shrine"];

export const TRY_SHARE_TABLE_LABELS = {
  nft: "NFT",
  nftw: "Wearable",
  skill: "Skill",
  skilllgc: "Skill",
  buildng: "Craft",
  bud: "Bud",
  shrine: "Shrine",
};
const TRY_PROFILE_STORAGE_KEY = "SFLManTryProfiles";
export const TRY_PROFILE_STORAGE_LIMIT_BYTES = 2 * 1024 * 1024;

function cap(txt) {
  const s = String(txt || "").trim();
  if (!s) return "Other";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getSharedBoostCategory(tableName, boostNode, itablesIt = {}) {
  const t = String(tableName || "").toLowerCase();
  if ((t === "skill" || t === "skilllgc") && String(boostNode?.cat || "").trim()) {
    return cap(boostNode?.cat);
  }
  const itemCategoryIndex = buildItemCategoryIndex(itablesIt || {});
  const rawTokens = [
    ...(Array.isArray(boostNode?.boostit) ? boostNode.boostit : [boostNode?.boostit]),
    ...(Array.isArray(boostNode?.cat) ? boostNode.cat : [boostNode?.cat]),
    ...(Array.isArray(boostNode?.scat) ? boostNode.scat : [boostNode?.scat]),
    ...inferCategoryTokens(boostNode?.boost),
  ]
    .map((v) => normalizeToken(v))
    .filter(Boolean);
  for (const token of rawTokens) {
    const mapped = BOOST_ITEM_CATEGORY_ALIASES[token] || BOOST_ITEM_CATEGORY_ALIASES[itemCategoryIndex[token]];
    if (mapped) return cap(mapped);
    if (itemCategoryIndex[token]) return cap(itemCategoryIndex[token]);
  }
  const fallback = String(boostNode?.cat || boostNode?.category || boostNode?.scat || "").trim();
  return fallback ? cap(fallback) : "Other";
}

function toUtf8Binary(str) {
  return encodeURIComponent(String(str || "")).replace(/%([0-9A-F]{2})/g, (_, p1) =>
    String.fromCharCode(parseInt(p1, 16))
  );
}

function fromUtf8Binary(bin) {
  return decodeURIComponent(
    Array.from(String(bin || ""))
      .map((ch) => `%${ch.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join("")
  );
}

export function isYieldImpactBoost(boostNode) {
  const typeTokens = Array.isArray(boostNode?.boosttype)
    ? boostNode.boosttype.map((v) => String(v || "").toLowerCase())
    : [String(boostNode?.boosttype || "").toLowerCase()];
  if (typeTokens.includes("yield") || typeTokens.includes("harvest") || typeTokens.includes("production")) {
    return true;
  }
  const txt = String(boostNode?.boost || "").toLowerCase();
  return /yield|harvest|production|output|produce/.test(txt);
}

export function getSelectedShareTables(parts = [], includeAll = false) {
  const out = [];
  (Array.isArray(parts) ? parts : []).forEach((part) => {
    (TRY_SHARE_PART_TABLES[part] || []).forEach((tableName) => {
      if (!out.includes(tableName)) out.push(tableName);
    });
  });
  return out;
}

export function getScopeTablesFromPayload(payload) {
  const mode = String(payload?.mode || "").toLowerCase();
  const parts = Array.isArray(payload?.parts) ? payload.parts : [];
  if (mode === "all" || parts.includes("all")) {
    return [...TRY_SHARE_ALL_TABLES];
  }
  return getSelectedShareTables(parts, false);
}

export function buildTryProfilePayload(
  boostables = {},
  parts = ["collectibles", "wearables", "craft", "buds", "skills", "shrines"],
  includeAll = false,
  itablesIt = {},
  includeBuy = false
) {
  const selectedTables = getSelectedShareTables(parts, false);
  const payloadTables = {};
  const summaryBoostChanges = [];
  const summaryImpactCats = new Set();
  selectedTables.forEach((tableName) => {
    const table = boostables?.[tableName] || {};
    const rows = Object.entries(table)
      .filter(([, value]) => Number(value?.tryit || 0) === 1)
      .map(([name, value]) => [
        name,
        String(value?.boost || ""),
        isYieldImpactBoost(value) ? 1 : 0,
        String(value?.img || ""),
        getSharedBoostCategory(tableName, value, itablesIt),
      ]);
    if (rows.length > 0) payloadTables[tableName] = rows;
    Object.entries(table).forEach(([name, value]) => {
      const tryVal = Number(value?.tryit || 0);
      const activeVal = Number(value?.isactive || 0);
      if (tryVal === activeVal) return;
      const sharedCat = getSharedBoostCategory(tableName, value, itablesIt);
      const catToken = normalizeToken(sharedCat);
      if (catToken) summaryImpactCats.add(catToken);
      summaryBoostChanges.push([
        String(tableName || ""),
        String(name || ""),
        tryVal === 1 ? "added" : "removed",
        String(value?.img || ""),
        sharedCat,
        String(value?.boost || ""),
        Number(value?.points || 0),
      ]);
    });
  });
  return {
    v: 1,
    mode: "parts",
    parts: (Array.isArray(parts) ? parts : []),
    includeNodes: !!includeAll,
    includeBuy: !!includeBuy,
    tables: payloadTables,
    summaryBase: "active_at_share",
    summaryBoostChanges,
    summaryImpactCats: Array.from(summaryImpactCats),
  };
}

export function buildImpactedItemsPayload(itablesIt = {}, allowedCats = []) {
  const allowed = new Set((Array.isArray(allowedCats) ? allowedCats : []).map((c) => normalizeToken(c)).filter(Boolean));
  const rows = Object.entries(itablesIt || {})
    .map(([name, value]) => {
      const itemCat = normalizeToken(value?.cat || value?.scat || "other");
      if (allowed.size > 0 && !allowed.has(itemCat)) return null;
      const yBase = Number(value?.myield ?? 0);
      const yTry = Number(value?.myieldtry ?? yBase);
      const hBase = Number(value?.harvest ?? 0);
      const hTry = Number(value?.harvesttry ?? hBase);
      const dBase = Number(value?.dailysfl ?? 0);
      const dTry = Number(value?.dailysfltry ?? dBase);
      if (!Number.isFinite(yBase) || !Number.isFinite(yTry)) return null;
      const yDiff = Math.abs(yTry - yBase);
      const hDiff = Math.abs(hTry - hBase);
      const dDiff = Math.abs(dTry - dBase);
      if (yDiff < 1e-9 && hDiff < 1e-9 && dDiff < 1e-9) return null;
      const yPct = yBase !== 0 ? (((yTry - yBase) / Math.abs(yBase)) * 100) : 0;
      const hPct = hBase !== 0 ? (((hTry - hBase) / Math.abs(hBase)) * 100) : 0;
      const dPct = dBase !== 0 ? (((dTry - dBase) / Math.abs(dBase)) * 100) : 0;
      return [
        name,
        Number(yTry.toFixed(4)),
        Number(yBase.toFixed(4)),
        Number(yPct.toFixed(2)),
        Number(hTry.toFixed(4)),
        Number(hBase.toFixed(4)),
        Number(hPct.toFixed(2)),
        Number(dTry.toFixed(4)),
        Number(dBase.toFixed(4)),
        Number(dPct.toFixed(2)),
        String(value?.img || ""),
        String(value?.cat || value?.scat || "other"),
        Number(value?.buyit || 0) === 1 ? 1 : 0,
      ];
    })
    .filter(Boolean)
    .sort((a, b) => Math.abs(Number(b[3] || 0)) - Math.abs(Number(a[3] || 0)));
  return rows;
}

export function encodeTryProfilePayload(payload) {
  const json = JSON.stringify(payload || {});
  const base64 = btoa(toUtf8Binary(json));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function decodeTryProfilePayload(token) {
  try {
    const safe = String(token || "").replace(/-/g, "+").replace(/_/g, "/");
    const padded = safe + "=".repeat((4 - (safe.length % 4)) % 4);
    const json = fromUtf8Binary(atob(padded));
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function buildTryProfileShareUrl(payload) {
  const token = encodeTryProfilePayload(payload);
  return `${window.location.origin}${window.location.pathname}?tnft=${encodeURIComponent(token)}`;
}

async function resolveShortTryProfile(code) {
  const shortCode = String(code || "").trim();
  if (!shortCode) return null;
  try {
    const response = await fetch(`/trynft-short/${encodeURIComponent(shortCode)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) return null;
    const json = await response.json();
    const payload = (json?.payload && typeof json.payload === "object") ? json.payload : null;
    return payload;
  } catch {
    return null;
  }
}

export async function createShortTryProfileShareUrl(payload) {
  try {
    const response = await fetch("/trynft-short", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload: payload || {} }),
    });
    if (!response.ok) return null;
    const json = await response.json();
    const code = String(json?.code || "").trim();
    if (!code) return null;
    return `${window.location.origin}${window.location.pathname}?tnfts=${encodeURIComponent(code)}`;
  } catch {
    return null;
  }
}

export async function parseTryProfileFromLocation() {
  try {
    const params = new URLSearchParams(window.location.search || "");
    const shortCode = params.get("tnfts");
    if (shortCode) {
      return await resolveShortTryProfile(shortCode);
    }
    const token = params.get("tnft");
    if (!token) return null;
    return decodeTryProfilePayload(token);
  } catch {
    return null;
  }
}

export function parseTryProfileFromText(rawText) {
  try {
    const text = String(rawText || "").trim();
    if (!text) return null;
    const tryDecode = (token) => decodeTryProfilePayload(String(token || "").trim());
    if (/^https?:\/\//i.test(text)) {
      const url = new URL(text);
      const token = url.searchParams.get("tnft");
      if (!token) return null;
      return tryDecode(token);
    }
    if (text.includes("tnft=")) {
      const fake = new URL(text.startsWith("?") ? `https://local${text}` : `https://local/?${text}`);
      const token = fake.searchParams.get("tnft");
      if (!token) return null;
      return tryDecode(token);
    }
    return tryDecode(text);
  } catch {
    return null;
  }
}

export async function parseTryProfileFromTextAsync(rawText) {
  try {
    const text = String(rawText || "").trim();
    if (!text) return null;
    if (/^https?:\/\//i.test(text)) {
      const url = new URL(text);
      const shortCode = String(url.searchParams.get("tnfts") || "").trim();
      if (shortCode) return await resolveShortTryProfile(shortCode);
      const token = url.searchParams.get("tnft");
      if (!token) return null;
      return decodeTryProfilePayload(token);
    }
    if (text.includes("tnfts=")) {
      const fake = new URL(text.startsWith("?") ? `https://local${text}` : `https://local/?${text}`);
      const shortCode = String(fake.searchParams.get("tnfts") || "").trim();
      if (!shortCode) return null;
      return await resolveShortTryProfile(shortCode);
    }
    if (text.includes("tnft=")) {
      const fake = new URL(text.startsWith("?") ? `https://local${text}` : `https://local/?${text}`);
      const token = fake.searchParams.get("tnft");
      if (!token) return null;
      return decodeTryProfilePayload(token);
    }
    return decodeTryProfilePayload(text);
  } catch {
    return null;
  }
}

export function buildTryProfileSummaryRows(profilePayload) {
  const tables = (profilePayload?.tables && typeof profilePayload.tables === "object") ? profilePayload.tables : {};
  const scopedTables = new Set(getScopeTablesFromPayload(profilePayload));
  const rows = [];
  Object.entries(tables).forEach(([tableName, tableRows]) => {
    if (scopedTables.size > 0 && !scopedTables.has(String(tableName || ""))) return;
    const section = TRY_SHARE_TABLE_LABELS[tableName] || tableName;
    (Array.isArray(tableRows) ? tableRows : []).forEach((entry) => {
      if (Array.isArray(entry)) {
        rows.push({
          table: String(tableName || ""),
          section,
          name: String(entry[0] || ""),
          boost: String(entry[1] || ""),
          yieldImpact: Number(entry[2] || 0) === 1,
          img: String(entry[3] || ""),
          category: String(entry[4] || ""),
        });
      }
    });
  });
  return rows;
}

export function buildSharedBoostChangesRows(profilePayload) {
  const rows = Array.isArray(profilePayload?.summaryBoostChanges) ? profilePayload.summaryBoostChanges : [];
  const scopedTables = new Set(getScopeTablesFromPayload(profilePayload));
  return rows
    .filter((entry) => Array.isArray(entry))
    .filter((entry) => {
      const table = String(entry?.[0] || "");
      if (scopedTables.size < 1) return true;
      return scopedTables.has(table);
    })
    .map((entry) => {
      const table = String(entry?.[0] || "");
      return {
        table,
        section: TRY_SHARE_TABLE_LABELS[table] || table,
        name: String(entry?.[1] || ""),
        status: String(entry?.[2] || "added"),
        img: String(entry?.[3] || ""),
        category: String(entry?.[4] || "") || "Other",
        boost: String(entry?.[5] || ""),
        points: Number(entry?.[6] || 0),
      };
    });
}

export function clearTryProfileFromUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete("tnft");
  url.searchParams.delete("tnfts");
  const qs = url.searchParams.toString();
  const next = `${url.pathname}${qs ? `?${qs}` : ""}${url.hash || ""}`;
  window.history.replaceState({}, "", next);
}

function bytesLen(text) {
  try {
    if (typeof TextEncoder !== "undefined") {
      return new TextEncoder().encode(String(text || "")).length;
    }
  } catch {}
  return String(text || "").length;
}

function encodeNum(n) {
  const x = Number(n || 0);
  if (Number.isInteger(x)) return x.toString(36);
  return String(x);
}

function decodeNum(s) {
  const txt = String(s || "");
  if (!txt) return 0;
  const isIntBase36 = /^-?[0-9a-z]+$/i.test(txt) && !txt.includes(".");
  if (isIntBase36) return parseInt(txt, 36) || 0;
  return Number(txt) || 0;
}

function packDenseMap(tableObj) {
  const src = (tableObj && typeof tableObj === "object") ? tableObj : {};
  const names = Object.keys(src);
  const vals = names.map((k) => Number(src[k] || 0));
  const isBit = vals.every((v) => v === 0 || v === 1);
  if (isBit) {
    return { n: names, b: vals.join("") };
  }
  return { n: names, v: vals.map(encodeNum).join(".") };
}

function unpackDenseMap(packed) {
  if (!packed || typeof packed !== "object") return {};
  const names = Array.isArray(packed?.n) ? packed.n : [];
  const out = {};
  if (typeof packed?.b === "string") {
    const bits = packed.b;
    names.forEach((name, idx) => {
      out[name] = bits[idx] === "1" ? 1 : 0;
    });
    return out;
  }
  if (typeof packed?.v === "string") {
    const vals = packed.v.split(".");
    names.forEach((name, idx) => {
      out[name] = decodeNum(vals[idx] || "0");
    });
    return out;
  }
  return out;
}

function packProfilePayload(payload) {
  const src = (payload && typeof payload === "object") ? payload : {};
  const fullProfile = (src?.fullProfile && typeof src.fullProfile === "object") ? src.fullProfile : null;
  if (!fullProfile) return src;
  const packedBoostables = {};
  Object.entries(fullProfile?.boostables || {}).forEach(([tableName, table]) => {
    packedBoostables[tableName] = packDenseMap(table || {});
  });
  const packedItems = {};
  Object.entries(fullProfile?.items || {}).forEach(([payloadKey, table]) => {
    packedItems[payloadKey] = packDenseMap(table || {});
  });
  return {
    ...src,
    fullProfilePacked: {
      b: packedBoostables,
      i: packedItems,
    },
    fullProfile: undefined,
  };
}

function unpackProfilePayload(payload) {
  const src = (payload && typeof payload === "object") ? payload : {};
  const packed = (src?.fullProfilePacked && typeof src.fullProfilePacked === "object") ? src.fullProfilePacked : null;
  if (!packed) return src;
  const boostables = {};
  Object.entries(packed?.b || {}).forEach(([tableName, tablePacked]) => {
    boostables[tableName] = unpackDenseMap(tablePacked);
  });
  const items = {};
  Object.entries(packed?.i || {}).forEach(([payloadKey, tablePacked]) => {
    items[payloadKey] = unpackDenseMap(tablePacked);
  });
  return {
    ...src,
    fullProfile: { boostables, items },
  };
}

function toStoredProfiles(profiles) {
  return (Array.isArray(profiles) ? profiles : []).map((p) => ({
    ...p,
    payload: packProfilePayload(p?.payload || {}),
  }));
}

function fromStoredProfiles(stored) {
  return (Array.isArray(stored) ? stored : []).map((p) => ({
    ...p,
    payload: unpackProfilePayload(p?.payload || {}),
  }));
}

export function getTryProfilesUsageBytes() {
  try {
    const raw = localStorage.getItem(TRY_PROFILE_STORAGE_KEY) || "[]";
    return bytesLen(raw);
  } catch {
    return 0;
  }
}

export function readTryProfiles() {
  try {
    const raw = localStorage.getItem(TRY_PROFILE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return fromStoredProfiles(parsed).filter((p) => p && typeof p === "object" && p.id && p.payload);
  } catch {
    return [];
  }
}

function writeTryProfiles(profiles) {
  const stored = toStoredProfiles(profiles);
  const nextRaw = JSON.stringify(stored);
  if (bytesLen(nextRaw) > TRY_PROFILE_STORAGE_LIMIT_BYTES) {
    return { ok: false, error: "Profiles storage limit reached (2MB)" };
  }
  localStorage.setItem(TRY_PROFILE_STORAGE_KEY, nextRaw);
  return { ok: true };
}

export function saveTryProfile(profileName, payload) {
  const name = String(profileName || "").trim();
  if (!name) {
    return { ok: false, error: "Profile name is required" };
  }
  const all = readTryProfiles();
  const now = Date.now();
  const foundIdx = all.findIndex((p) => String(p?.name || "").toLowerCase() === name.toLowerCase());
  if (foundIdx >= 0) {
    const next = [...all];
    next[foundIdx] = {
      ...next[foundIdx],
      name,
      payload: payload || {},
      updatedAt: now,
    };
    const wr = writeTryProfiles(next);
    if (!wr?.ok) return { ok: false, error: wr?.error || "Save failed", profiles: all };
    return { ok: true, action: "updated", profile: next[foundIdx], profiles: next };
  }
  const created = {
    id: `tryp-${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    payload: payload || {},
    createdAt: now,
    updatedAt: now,
  };
  const next = [created, ...all];
  const wr = writeTryProfiles(next);
  if (!wr?.ok) return { ok: false, error: wr?.error || "Save failed", profiles: all };
  return { ok: true, action: "created", profile: created, profiles: next };
}

export function deleteTryProfile(profileId) {
  const id = String(profileId || "").trim();
  if (!id) return { ok: false, error: "Missing profile id" };
  const all = readTryProfiles();
  const next = all.filter((p) => String(p?.id || "") !== id);
  const wr = writeTryProfiles(next);
  if (!wr?.ok) return { ok: false, error: wr?.error || "Delete failed", profiles: all };
  return { ok: true, profiles: next };
}
