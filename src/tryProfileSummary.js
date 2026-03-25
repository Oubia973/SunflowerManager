import { mergeFarmStateDeep } from "./fct.js";
import { TRY_SHARE_TABLE_LABELS } from "./tryProfileShare.js";
import {
  normalizeToken,
  inferCategoryTokens,
  BOOST_ITEM_CATEGORY_ALIASES,
  buildItemCategoryIndex,
} from "./tryNftTaxonomy.js";

function cap(txt) {
  const s = String(txt || "").trim();
  if (!s) return "Other";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getBoostCategoryLabel(tableName, boostName, boostNode, itablesIt) {
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
  const fromNodeCat = String(boostNode?.cat || "").trim();
  if (fromNodeCat) return cap(fromNodeCat);
  return "Other";
}

export function buildBoostDisplayMaps(boostables = {}, itablesIt = {}) {
  const boostIconMap = {};
  const boostCategoryMap = {};
  Object.entries(boostables || {}).forEach(([tableName, table]) => {
    Object.entries(table || {}).forEach(([boostName, node]) => {
      const icon = String(node?.img || "");
      const cat = getBoostCategoryLabel(tableName, boostName, node || {}, itablesIt || {});
      const k = `${String(tableName)}|${String(boostName)}`;
      if (icon) boostIconMap[k] = icon;
      boostIconMap[boostName] = boostIconMap[boostName] || icon;
      boostCategoryMap[k] = cat;
      boostCategoryMap[boostName] = boostCategoryMap[boostName] || cat;
    });
  });
  return { boostIconMap, boostCategoryMap };
}

export function buildZeroBoostState(farmState) {
  const src = JSON.parse(JSON.stringify(farmState || {}));
  const boostables = src?.boostables || {};
  const nextBoostables = { ...boostables };
  Object.keys(boostables || {}).forEach((tableName) => {
    const table = boostables?.[tableName] || {};
    nextBoostables[tableName] = Object.fromEntries(
      Object.entries(table).map(([item, value]) => [item, { ...(value || {}), tryit: 0 }])
    );
  });
  src.boostables = nextBoostables;
  return src;
}

export function buildScopedZeroState(farmState, scopeTables = []) {
  const src = JSON.parse(JSON.stringify(farmState || {}));
  const boostables = src?.boostables || {};
  const nextBoostables = { ...boostables };
  const scoped = new Set((scopeTables || []).map((t) => String(t || "")));
  Object.keys(boostables || {}).forEach((tableName) => {
    const table = boostables?.[tableName] || {};
    if (!scoped.has(String(tableName || ""))) {
      nextBoostables[tableName] = Object.fromEntries(
        Object.entries(table).map(([item, value]) => [item, { ...(value || {}), tryit: Number(value?.isactive || 0) }])
      );
      return;
    }
    nextBoostables[tableName] = Object.fromEntries(
      Object.entries(table).map(([item, value]) => [item, { ...(value || {}), tryit: 0 }])
    );
  });
  src.boostables = nextBoostables;
  return src;
}

export function buildActiveTryState(farmState, tryitConfig) {
  const src = JSON.parse(JSON.stringify(farmState || {}));
  const boostables = src?.boostables || {};
  const nextBoostables = { ...boostables };
  Object.keys(boostables || {}).forEach((tableName) => {
    const table = boostables?.[tableName] || {};
    nextBoostables[tableName] = Object.fromEntries(
      Object.entries(table).map(([item, value]) => [item, { ...(value || {}), tryit: Number(value?.isactive || 0) }])
    );
  });
  src.boostables = nextBoostables;
  const getByPath = (obj, path) => String(path || "").split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
  Object.entries(tryitConfig?.itemTables || {}).forEach(([, cfg]) => {
    const field = cfg?.field;
    const baseField = cfg?.baseField || field;
    const sources = Array.isArray(cfg?.sources) ? cfg.sources : [];
    if (!field || !baseField || sources.length < 1) return;
    // Only reset to active when a dedicated active/base field exists (e.g. spottry <- spot).
    if (field === baseField) return;
    sources.forEach((sourcePath) => {
      const table = getByPath(src, sourcePath);
      if (!table || typeof table !== "object") return;
      Object.keys(table).forEach((itemName) => {
        const cur = table[itemName] || {};
        table[itemName] = {
          ...cur,
          [field]: Number(cur?.[baseField] ?? cur?.[field] ?? 0),
        };
      });
    });
  });
  return src;
}

export function applyProfileToState(farmState, profilePayload, getScopeTablesFromPayload) {
  const scopeTables = getScopeTablesFromPayload(profilePayload);
  if (scopeTables.length < 1) return JSON.parse(JSON.stringify(farmState || {}));
  const payloadTables = (profilePayload?.tables && typeof profilePayload.tables === "object")
    ? profilePayload.tables
    : {};
  const src = JSON.parse(JSON.stringify(farmState || {}));
  const boostables = src?.boostables || {};
  const nextBoostables = { ...boostables };
  scopeTables.forEach((tableName) => {
    const currentTable = boostables?.[tableName] || {};
    const rows = Array.isArray(payloadTables?.[tableName]) ? payloadTables[tableName] : [];
    const enabledNames = new Set(
      rows.filter((entry) => Array.isArray(entry)).map((entry) => String(entry[0] || "")).filter(Boolean)
    );
    nextBoostables[tableName] = Object.fromEntries(
      Object.entries(currentTable).map(([itemName, value]) => [
        itemName,
        { ...(value || {}), tryit: enabledNames.has(itemName) ? 1 : 0 },
      ])
    );
  });
  src.boostables = nextBoostables;
  return src;
}

function shouldApplyFullItemProfile(profilePayload) {
  if (profilePayload?.includeNodes === true) return true;
  if (profilePayload?.includeNodes === false) return false;
  const mode = String(profilePayload?.mode || "").toLowerCase();
  const parts = Array.isArray(profilePayload?.parts) ? profilePayload.parts.map((p) => String(p || "").toLowerCase()) : [];
  const hasAllByParts = parts.includes("nft") && parts.includes("wearable") && parts.includes("skills");
  return mode === "all" || parts.includes("all") || hasAllByParts;
}

function getSelectedItemProfileKeys(profilePayload, tryitConfig) {
  const hasIncludeNodes = typeof profilePayload?.includeNodes === "boolean";
  const hasIncludeBuy = typeof profilePayload?.includeBuy === "boolean";
  if (hasIncludeNodes || hasIncludeBuy) {
    const out = [];
    if (profilePayload?.includeNodes === true) {
      out.push("xspottry", "xspot2try", "xspot3try");
    }
    if (profilePayload?.includeBuy === true) {
      out.push("xbuyit");
    }
    return out;
  }
  if (!shouldApplyFullItemProfile(profilePayload)) return [];
  return Object.keys(tryitConfig?.itemTables || {});
}

function buildDeltaHeaders({ frmid, deviceId, options, username, targetState, tryitpacked, simulatedSeason }) {
  return {
    frmid,
    deviceId,
    options,
    username,
    simulatedSeason,
    tryitarrays: {},
    tryitpacked: tryitpacked || { mode: "idx-v1", tables: {} },
    tryitMode: "delta",
    include: ["core", "inventory", "boosts"],
    page: "trynft",
    knownHashes: (targetState?.sectionHashes && typeof targetState.sectionHashes === "object")
      ? targetState.sectionHashes
      : {},
    knownTableHashes: (targetState?.tableHashes && typeof targetState.tableHashes === "object")
      ? targetState.tableHashes
      : {},
  };
}

export function buildPackedDelta(curState, baseState, tryitConfig) {
  if (!tryitConfig || !Array.isArray(tryitConfig?.boostTables) || !tryitConfig?.itemTables) {
    return { mode: "idx-v1", tables: {} };
  }
  const cur = curState || {};
  const base = baseState || {};
  const tryItPacked = { mode: "idx-v1", tables: {} };
  const getByPath = (obj, path) => String(path || "").split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
  const getPayloadOrderedKeys = (payloadKey) => {
    if ((tryitConfig?.boostTables || []).includes(payloadKey)) return Object.keys(cur?.boostables?.[payloadKey] || {});
    const tableCfg = tryitConfig?.itemTables?.[payloadKey];
    const sources = Array.isArray(tableCfg?.sources) ? tableCfg.sources : [];
    const keys = [];
    const seen = new Set();
    sources.forEach((sourcePath) => {
      const table = getByPath(cur, sourcePath) || {};
      Object.keys(table).forEach((itemKey) => {
        if (seen.has(itemKey)) return;
        seen.add(itemKey);
        keys.push(itemKey);
      });
    });
    return keys;
  };
  (tryitConfig?.boostTables || []).forEach((tableName) => {
    const table = cur?.boostables?.[tableName] || {};
    const baseTable = base?.boostables?.[tableName] || {};
    const orderedKeys = getPayloadOrderedKeys(tableName);
    const packedEntries = [];
    orderedKeys.forEach((itemKey, idx) => {
      const node = table?.[itemKey] || {};
      const baseNode = baseTable?.[itemKey] || {};
      const curVal = Number(node?.tryit || 0);
      const baseVal = Number(baseNode?.tryit ?? baseNode?.isactive ?? 0);
      if (curVal !== baseVal) packedEntries.push([idx, curVal]);
    });
    if (packedEntries.length > 0) tryItPacked.tables[tableName] = packedEntries;
  });
  Object.entries(tryitConfig?.itemTables || {}).forEach(([payloadKey, tableCfg]) => {
    const field = tableCfg?.field;
    const sources = Array.isArray(tableCfg?.sources) ? tableCfg.sources : [];
    if (!field || sources.length < 1) return;
    const orderedKeys = getPayloadOrderedKeys(payloadKey);
    const packedEntries = [];
    const readValueFrom = (stateObj, itemKey) => {
      for (let i = 0; i < sources.length; i += 1) {
        const table = getByPath(stateObj, sources[i]) || {};
        if (Object.prototype.hasOwnProperty.call(table, itemKey)) return Number(table[itemKey]?.[field] || 0);
      }
      return 0;
    };
    orderedKeys.forEach((itemKey, idx) => {
      const curVal = readValueFrom(cur, itemKey);
      const baseVal = readValueFrom(base, itemKey);
      if (curVal !== baseVal) packedEntries.push([idx, curVal]);
    });
    if (packedEntries.length > 0) tryItPacked.tables[payloadKey] = packedEntries;
  });
  return tryItPacked;
}

export async function postPackedDelta(params) {
  const { API_URL, frmid, deviceId, options, username, tryitConfig, targetState, baseState, simulatedSeason } = params || {};
  const packed = buildPackedDelta(targetState || {}, baseState || {}, tryitConfig);
  const headers = buildDeltaHeaders({
    frmid,
    deviceId,
    options,
    username,
    targetState,
    tryitpacked: packed,
    simulatedSeason,
  });
  const response = await fetch(API_URL + "/settry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(headers),
  });
  if (!response.ok) throw new Error(`settry delta failed (${response.status})`);
  const responseData = await response.json();
  return mergeFarmStateDeep(targetState || {}, responseData || {});
}

async function postTrySummarySingle(params) {
  const {
    API_URL,
    frmid,
    options,
    username,
    tryitConfig,
    baseState,
    targetState,
    simulatedSeason,
  } = params || {};
  const buildStrictTryitArrays = (state, cfg) => {
    const src = (state && typeof state === "object") ? state : {};
    const out = {};
    const boostTables = Array.isArray(cfg?.boostTables) ? cfg.boostTables : [];
    boostTables.forEach((tableName) => {
      const table = src?.boostables?.[tableName] || {};
      const row = {};
      Object.entries(table).forEach(([name, v]) => {
        row[name] = Number(v?.tryit ?? v?.isactive ?? 0);
      });
      out[tableName] = row;
    });
    const getByPath = (obj, path) => String(path || "").split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
    Object.entries(cfg?.itemTables || {}).forEach(([payloadKey, tableCfg]) => {
      const field = tableCfg?.field;
      const sources = Array.isArray(tableCfg?.sources) ? tableCfg.sources : [];
      const row = {};
      if (!field || sources.length < 1) {
        out[payloadKey] = row;
        return;
      }
      sources.forEach((sourcePath) => {
        const table = getByPath(src, sourcePath) || {};
        Object.entries(table).forEach(([name, v]) => {
          row[name] = Number(v?.[field] || 0);
        });
      });
      out[payloadKey] = row;
    });
    return out;
  };
  const body = {
    frmid,
    options,
    username,
    simulatedSeason,
    include: ["inventory", "boosts"],
    page: "trynft",
    baseTryitarrays: buildStrictTryitArrays(baseState || {}, tryitConfig),
    targetTryitarrays: buildStrictTryitArrays(targetState || {}, tryitConfig),
  };
  const response = await fetch(API_URL + "/settry-summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`settry-summary failed (${response.status})`);
  const data = await response.json();
  return {
    baseIt: (data?.baseIt && typeof data.baseIt === "object") ? data.baseIt : {},
    targetIt: (data?.targetIt && typeof data.targetIt === "object") ? data.targetIt : {},
  };
}

export function buildImpactsFromBases(currentIt = {}, baseIt = {}) {
  const pickMetricPair = (nextNode, baseNode, tryKey, rawKey) => {
    const nTry = Number(nextNode?.[tryKey]);
    const bTry = Number(baseNode?.[tryKey]);
    const nRaw = Number(nextNode?.[rawKey]);
    const bRaw = Number(baseNode?.[rawKey]);
    const hasTry = Number.isFinite(nTry) && Number.isFinite(bTry);
    const hasRaw = Number.isFinite(nRaw) && Number.isFinite(bRaw);
    if (hasTry && hasRaw) {
      const dTry = Math.abs(nTry - bTry);
      const dRaw = Math.abs(nRaw - bRaw);
      return dRaw > dTry ? { cur: nRaw, base: bRaw } : { cur: nTry, base: bTry };
    }
    if (hasTry) return { cur: nTry, base: bTry };
    if (hasRaw) return { cur: nRaw, base: bRaw };
    return { cur: 0, base: 0 };
  };
  return Object.entries(currentIt || {})
    .map(([name, value]) => {
      const baseNode = baseIt?.[name] || {};
      const yPair = pickMetricPair(value, baseNode, "myieldtry", "myield");
      const hPair = pickMetricPair(value, baseNode, "harvesttry", "harvest");
      const dPair = pickMetricPair(value, baseNode, "dailysfltry", "dailysfl");
      const yTry = Number(yPair.cur || 0);
      const yBase = Number(yPair.base || 0);
      const hTry = Number(hPair.cur || 0);
      const hBase = Number(hPair.base || 0);
      const dTry = Number(dPair.cur || 0);
      const dBase = Number(dPair.base || 0);
      if (!Number.isFinite(yTry) || !Number.isFinite(yBase)) return null;
      const yDiff = Math.abs(yTry - yBase);
      const hDiff = Math.abs(hTry - hBase);
      const dDiff = Math.abs(dTry - dBase);
      if (yDiff < 1e-9 && hDiff < 1e-9 && dDiff < 1e-9) return null;
      return {
        name: String(name || ""),
        img: String(value?.img || ""),
        buyit: Number(value?.buyit || 0) === 1,
        cat: String(value?.cat || value?.scat || "other"),
        yield: Number(yTry.toFixed(4)),
        yieldBase: Number(yBase.toFixed(4)),
        yieldPct: yBase !== 0 ? Number((((yTry - yBase) / Math.abs(yBase)) * 100).toFixed(2)) : 0,
        harvest: Number(hTry.toFixed(4)),
        harvestBase: Number(hBase.toFixed(4)),
        harvestPct: hBase !== 0 ? Number((((hTry - hBase) / Math.abs(hBase)) * 100).toFixed(2)) : 0,
        dailysfl: Number(dTry.toFixed(4)),
        dailysflBase: Number(dBase.toFixed(4)),
        dailysflPct: dBase !== 0 ? Number((((dTry - dBase) / Math.abs(dBase)) * 100).toFixed(2)) : 0,
      };
    })
    .filter(Boolean)
    .sort((a, b) => Math.abs(Number(b?.yieldPct || 0)) - Math.abs(Number(a?.yieldPct || 0)));
}

export function buildImpactsVsActive(profileIt = {}, activeIt = {}) {
  const pickMetricPair = (nextNode, baseNode, tryKey, rawKey) => {
    const nTry = Number(nextNode?.[tryKey]);
    const bRaw = Number(baseNode?.[rawKey]);
    const nRaw = Number(nextNode?.[rawKey]);
    const hasTry = Number.isFinite(nTry) && Number.isFinite(bRaw);
    const hasRaw = Number.isFinite(nRaw) && Number.isFinite(bRaw);
    if (hasTry && hasRaw) {
      const dTry = Math.abs(nTry - bRaw);
      const dRaw = Math.abs(nRaw - bRaw);
      return dRaw > dTry ? { cur: nRaw, base: bRaw } : { cur: nTry, base: bRaw };
    }
    if (hasTry) return { cur: nTry, base: bRaw || 0 };
    if (hasRaw) return { cur: nRaw, base: bRaw || 0 };
    return { cur: 0, base: 0 };
  };
  return Object.entries(profileIt || {})
    .map(([name, value]) => {
      const activeNode = activeIt?.[name] || {};
      const yPair = pickMetricPair(value, activeNode, "myieldtry", "myield");
      const hPair = pickMetricPair(value, activeNode, "harvesttry", "harvest");
      const dPair = pickMetricPair(value, activeNode, "dailysfltry", "dailysfl");
      const yTry = Number(yPair.cur || 0);
      const yBase = Number(yPair.base || 0);
      const hTry = Number(hPair.cur || 0);
      const hBase = Number(hPair.base || 0);
      const dTry = Number(dPair.cur || 0);
      const dBase = Number(dPair.base || 0);
      if (!Number.isFinite(yTry) || !Number.isFinite(yBase)) return null;
      const yDiff = Math.abs(yTry - yBase);
      const hDiff = Math.abs(hTry - hBase);
      const dDiff = Math.abs(dTry - dBase);
      if (yDiff < 1e-9 && hDiff < 1e-9 && dDiff < 1e-9) return null;
      return {
        name: String(name || ""),
        img: String(value?.img || ""),
        buyit: Number(value?.buyit || 0) === 1,
        cat: String(value?.cat || value?.scat || "other"),
        yield: Number(yTry.toFixed(4)),
        yieldBase: Number(yBase.toFixed(4)),
        yieldPct: yBase !== 0 ? Number((((yTry - yBase) / Math.abs(yBase)) * 100).toFixed(2)) : 0,
        harvest: Number(hTry.toFixed(4)),
        harvestBase: Number(hBase.toFixed(4)),
        harvestPct: hBase !== 0 ? Number((((hTry - hBase) / Math.abs(hBase)) * 100).toFixed(2)) : 0,
        dailysfl: Number(dTry.toFixed(4)),
        dailysflBase: Number(dBase.toFixed(4)),
        dailysflPct: dBase !== 0 ? Number((((dTry - dBase) / Math.abs(dBase)) * 100).toFixed(2)) : 0,
      };
    })
    .filter(Boolean)
    .sort((a, b) => Math.abs(Number(b?.yieldPct || 0)) - Math.abs(Number(a?.yieldPct || 0)));
}

export function applyItemProfileToState(farmState, profilePayload, tryitConfig) {
  const fullProfile = (profilePayload?.fullProfile && typeof profilePayload.fullProfile === "object")
    ? profilePayload.fullProfile
    : null;
  if (!fullProfile?.items) return JSON.parse(JSON.stringify(farmState || {}));
  const selectedItemKeys = new Set(getSelectedItemProfileKeys(profilePayload, tryitConfig));
  if (selectedItemKeys.size < 1) return JSON.parse(JSON.stringify(farmState || {}));
  const src = JSON.parse(JSON.stringify(farmState || {}));
  const itemVals = (fullProfile?.items && typeof fullProfile.items === "object") ? fullProfile.items : {};
  const getByPath = (obj, path) => String(path || "").split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
  Object.entries(tryitConfig?.itemTables || {}).forEach(([payloadKey, cfg]) => {
    if (!selectedItemKeys.has(String(payloadKey || ""))) return;
    const field = cfg?.field;
    const sources = Array.isArray(cfg?.sources) ? cfg.sources : [];
    const vals = itemVals?.[payloadKey] || {};
    if (!field || sources.length < 1) return;
    sources.forEach((sourcePath) => {
      const table = getByPath(src, sourcePath);
      if (!table || typeof table !== "object") return;
      Object.keys(table).forEach((itemName) => {
        if (!Object.prototype.hasOwnProperty.call(vals, itemName)) return;
        table[itemName] = {
          ...(table[itemName] || {}),
          [field]: Number(vals[itemName] || 0),
        };
      });
    });
  });
  return src;
}

export function buildBoostChanges(baseState, nextState, scopeTables = [], itablesIt = {}) {
  const out = [];
  const baseBoostables = baseState?.boostables || {};
  const nextBoostables = nextState?.boostables || {};
  (scopeTables || []).forEach((tableName) => {
    const baseTable = baseBoostables?.[tableName] || {};
    const nextTable = nextBoostables?.[tableName] || {};
    const keys = new Set([...Object.keys(baseTable), ...Object.keys(nextTable)]);
    keys.forEach((name) => {
      const baseNode = baseTable?.[name] || {};
      const nextNode = nextTable?.[name] || {};
      const baseVal = Number(baseNode?.tryit ?? baseNode?.isactive ?? 0);
      const nextVal = Number(nextNode?.tryit ?? nextNode?.isactive ?? 0);
      if (baseVal === nextVal) return;
      const img = String(nextNode?.img || baseNode?.img || "");
      const category = getBoostCategoryLabel(
        tableName,
        name,
        (nextNode && typeof nextNode === "object" ? nextNode : (baseNode || {})),
        itablesIt || {}
      );
      out.push({
        table: String(tableName || ""),
        section: TRY_SHARE_TABLE_LABELS?.[tableName] || String(tableName || ""),
        name: String(name || ""),
        status: nextVal === 1 ? "added" : "removed",
        img,
        category,
        boost: String(nextNode?.boost || baseNode?.boost || ""),
        points: Number(nextNode?.points ?? baseNode?.points ?? 0),
      });
    });
  });
  return out.sort((a, b) => {
    if (a.status !== b.status) return a.status === "added" ? -1 : 1;
    if (a.section !== b.section) return a.section.localeCompare(b.section);
    return a.name.localeCompare(b.name);
  });
}

export function buildSpotChanges(baseState, nextState) {
  const baseIt = baseState?.itables?.it || {};
  const nextIt = nextState?.itables?.it || {};
  const keys = new Set([...Object.keys(baseIt), ...Object.keys(nextIt)]);
  const out = [];
  const uniqueByNode = new Map();
  const fruitCatTokens = new Set([
    "fruit",
    "apple",
    "banana",
    "blueberry",
    "orange",
    "tomato",
    "lemon",
    "celestine",
    "lunara",
    "duskberry",
    "grape",
  ]);
  keys.forEach((itemName) => {
    const b = baseIt?.[itemName] || {};
    const n = nextIt?.[itemName] || {};
    const catToken = normalizeToken(n?.cat || b?.cat || n?.scat || b?.scat || "");
    const nodeName = catToken === "crop"
      ? "Crop Plot"
      : (fruitCatTokens.has(catToken) ? "Fruit Patch" : String(itemName || ""));
    [
      ["spottry", "spot", ""],
      ["spot2try", "spot2", "T2"],
      ["spot3try", "spot3", "T3"],
    ].forEach(([field, baseField, tierSuffix]) => {
      const bv = Number(b?.[baseField] ?? b?.[field] ?? 0);
      const nv = Number(n?.[field] ?? 0);
      if (Math.abs(nv - bv) < 1e-9) return;
      const delta = nv - bv;
      const sign = delta >= 0 ? "+" : "-";
      out.push({
        table: "spots",
        section: "Nodes",
        category: "Nodes",
        name: nodeName,
        img: String(n?.img || b?.img || ""),
        nameSuffix: String(tierSuffix || ""),
        status: "changed",
        delta,
        finalValue: String(nv),
        diffText: `(${sign}${Math.abs(delta)})`,
      });
    });
  });
  out.forEach((row) => {
    const k = `${String(row?.name || "")}|${String(row?.nameSuffix || "")}`;
    if (!uniqueByNode.has(k)) {
      uniqueByNode.set(k, row);
      return;
    }
    // Keep the strongest visible change if duplicates exist for same logical node.
    const prev = uniqueByNode.get(k);
    if (Math.abs(Number(row?.delta || 0)) > Math.abs(Number(prev?.delta || 0))) {
      uniqueByNode.set(k, row);
    }
  });
  return Array.from(uniqueByNode.values());
}

export function shouldCompareNodesForPayload(profilePayload) {
  if (profilePayload?.includeNodes === true) return true;
  if (profilePayload?.includeNodes === false) return false;
  const mode = String(profilePayload?.mode || "").toLowerCase();
  const parts = Array.isArray(profilePayload?.parts)
    ? profilePayload.parts.map((p) => String(p || "").toLowerCase())
    : [];
  const hasAllByParts = parts.includes("nft") && parts.includes("wearable") && parts.includes("skills");
  return mode === "all" || parts.includes("all") || hasAllByParts;
}

export async function computeProfileSummaryPayload(params = {}) {
  const {
    API_URL,
    frmid,
    deviceId,
    options,
    username,
    tryitConfig,
    currentState,
    activeBaseState,
    profilePayload,
    simulatedSeason,
    compareMode = "active",
    getScopeTablesFromPayload,
  } = params;
  const mode = String(compareMode || "active");
  const activeState = buildActiveTryState(activeBaseState || currentState || {}, tryitConfig);
  const scopeTables = getScopeTablesFromPayload(profilePayload || {});
  const scopedZeroState = buildScopedZeroState(activeState, scopeTables);
  const diffBaseState = mode === "zero" ? scopedZeroState : activeState;
  let diffProfileState = applyProfileToState(diffBaseState, profilePayload || {}, getScopeTablesFromPayload);
  diffProfileState = applyItemProfileToState(diffProfileState, profilePayload || {}, tryitConfig);
  const includeNodeChanges = shouldCompareNodesForPayload(profilePayload || {});
  const boostChanges = [
    ...buildBoostChanges(diffBaseState, diffProfileState, scopeTables, diffProfileState?.itables?.it || {}),
    ...(includeNodeChanges ? buildSpotChanges(diffBaseState, diffProfileState) : []),
  ];
  let profState = applyProfileToState(activeState, profilePayload || {}, getScopeTablesFromPayload);
  profState = applyItemProfileToState(profState, profilePayload || {}, tryitConfig);
  const commonReq = { API_URL, frmid, deviceId, options, username, tryitConfig, simulatedSeason };
  const baseCompareState = mode === "zero" ? scopedZeroState : activeState;
  let impacts = [];
  try {
    const { baseIt, targetIt } = await postTrySummarySingle({
      ...commonReq,
      baseState: baseCompareState,
      targetState: profState,
    });
    impacts = buildImpactsFromBases(targetIt || {}, baseIt || {});
  } catch {
    const profMerged = await postPackedDelta({ ...commonReq, targetState: profState, baseState: currentState || {} });
    if (mode === "zero") {
      const zeroMerged = await postPackedDelta({ ...commonReq, targetState: scopedZeroState, baseState: profState });
      impacts = buildImpactsFromBases(
        profMerged?.itables?.it || {},
        zeroMerged?.itables?.it || {}
      );
    } else {
      impacts = buildImpactsVsActive(
        profMerged?.itables?.it || {},
        activeState?.itables?.it || {}
      );
    }
  }
  const restoredCurrent = JSON.parse(JSON.stringify(currentState || {}));
  return {
    restoredCurrent,
    summaryPayload: {
      ...(profilePayload || {}),
      compareMode: mode === "zero" ? "zero" : "active",
      impacts,
      boostChanges,
    },
  };
}
