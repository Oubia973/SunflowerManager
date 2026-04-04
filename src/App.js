import React, { useEffect, useState, useRef, useMemo } from 'react';
import logo from './gobcarry.gif';
import './App.css';
import ModalTNFT from './ftrynft.js';
import ModalGraph from './fgraph.js';
import ModalDlvr from './fdelivery.js';
import ModalOptions from './foptions.js';
import ModalAdmin from './fadmin.jsx';
import PageCoach from './components/PageCoach.jsx';
import Cadre from './animodal.js';
import Tooltip from "./tooltip/Tooltip.jsx";
import DList from "./dlist.jsx";
//import CounterInput from "./counterinput.js";
import { FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel } from '@mui/material';
import { frmtNb, filterTryit, formatUpdated, UpdatedSince, mergeFarmStateDeep, getOrCreateDeviceId } from './fct.js';
import { computeGemsRatio } from './gemsRatio.js';
import { promptPass, promptInfo, promptConfirm, promptChoice, promptInput } from './promptW';

import { AppCtx } from "./context/AppCtx";
import PanelTable from "./tables/PanelTable";
import HeaderTrades from "./components/HeaderTrades";
import AutoRefreshProgress from "./components/AutoRefreshProgress";
import TryProfileSummaryModal from "./components/TryProfileSummaryModal.jsx";
import {
  parseTryProfileFromLocation,
  clearTryProfileFromUrl,
  buildTryProfileSummaryRows,
  buildSharedBoostChangesRows,
} from "./tryProfileShare.js";

import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { StatusBar, Style } from '@capacitor/status-bar';
//StatusBar.setStyle({ style: Style.Light });
const isNativeApp = Capacitor.isNativePlatform();

const runLocal = true;
const API_URL = runLocal ? "" : process.env.REACT_APP_API_URL;
const TRYIT_STORAGE_KEY = "SFLManTryit";
const TRYIT_FALLBACK_BOOST_KEYS = ["nft", "nftw", "skill", "skilllgc", "buildng", "bud", "shrine"];
const TRYIT_FALLBACK_ITEM_KEYS = ["xbuyit", "xfarmit", "xcookit", "xspottry", "xspot2try", "xspot3try"];
const LOAD_FARM_COOLDOWN_MS = 6000;
const LOAD_FARM_SPAM_WINDOW_MS = 2500;
const LOAD_FARM_SPAM_THRESHOLD = 4;
const AUCTION_NOTIF_SYNC_DEBOUNCE_MS = 4000;
const NOTIF_PREFS_STORAGE_KEY = "SFLManNotifPrefs";
const onDev = false;

function normalizeNotifPrefs(raw) {
  const source = (raw && typeof raw === "object") ? raw : {};
  const enabledFarmIds = Array.isArray(source.enabledFarmIds)
    ? [...new Set(
      source.enabledFarmIds
        .map((farmId) => String(farmId || "").trim())
        .filter(Boolean)
    )]
    : [];
  return {
    enabledFarmIds,
    skipMultiFarmPrompt: source.skipMultiFarmPrompt === true,
    updatedAt: Number(source.updatedAt || 0) || 0,
  };
}

function readNotifPrefs() {
  try {
    return normalizeNotifPrefs(JSON.parse(localStorage.getItem(NOTIF_PREFS_STORAGE_KEY) || "{}"));
  } catch {
    return normalizeNotifPrefs({});
  }
}

function writeNotifPrefs(nextValue) {
  const normalized = normalizeNotifPrefs({
    ...nextValue,
    updatedAt: Date.now(),
  });
  localStorage.setItem(NOTIF_PREFS_STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

function updateNotifPrefs(updater) {
  const current = readNotifPrefs();
  const nextValue = typeof updater === "function" ? updater(current) : updater;
  return writeNotifPrefs(nextValue);
}

function setNotifFarmEnabledLocal(farmId, enabled) {
  const farmKey = String(farmId || "").trim();
  if (!farmKey) return readNotifPrefs();
  return updateNotifPrefs((current) => {
    const enabledSet = new Set(current.enabledFarmIds || []);
    if (enabled) enabledSet.add(farmKey);
    else enabledSet.delete(farmKey);
    return {
      ...current,
      enabledFarmIds: [...enabledSet],
    };
  });
}

function resetMultiFarmNotifPromptLocal() {
  return updateNotifPrefs((current) => ({
    ...current,
    skipMultiFarmPrompt: false,
  }));
}

function setSkipMultiFarmNotifPromptLocal(skipValue) {
  return updateNotifPrefs((current) => ({
    ...current,
    skipMultiFarmPrompt: skipValue === true,
  }));
}

function getOtherEnabledNotifFarmIdsLocal(currentFarmId) {
  const farmKey = String(currentFarmId || "").trim();
  return readNotifPrefs().enabledFarmIds.filter((farmId) => farmId !== farmKey);
}
async function detectBraveBrowser() {
  try {
    return !!(typeof navigator !== "undefined"
      && navigator.brave
      && typeof navigator.brave.isBrave === "function"
      && await navigator.brave.isBrave());
  } catch {
    return false;
  }
}

var vversion = 0.09;
let dataSet = {};
dataSet.options = {};

const imgsfl = './icon/res/flowertoken.webp';
const imgSFL = <img src={imgsfl} alt={''} className="itico" title="Flower" />;
const imgcoins = './icon/res/coins.png';
const imgCoins = <img src={imgcoins} alt={''} className="itico" title="Coins" />;
const imgxp = './icon/ui/level_up.png';
const imgcrop = './icon/res/soil.png';
const imgwood = './icon/res/harvested_tree.png';
const imgstone = './icon/res/stone_small.png';
const imgbeehive = './icon/res/beehive.webp';
const imgcow = './icon/res/cow.webp';
const imgsheep = './icon/res/sheep.webp';
const imgflowerbed = './icon/flower/flower_bed_modal.png';
const imgchkn = './icon/res/chkn.png';
const imgflch = './icon/ui/flch.png';
const imgrdy = './icon/ui/expression_alerted.png';
const imgtrd = './icon/ui/sparkle2.gif';
const imgpet = './icon/pet/dog.webp';
const imgcrustacean = './icon/fish/dollocaris.webp';
const imgshrine = './icon/shrine/boar.webp';
const imgacorn = './icon/pet/acorn.webp';
const imgexchng = './icon/ui/exchange.png';
const imgExchng = <img src={imgexchng} alt={''} title="Marketplace" style={{ width: '25px', height: '25px' }} />;
const imgbuyit = <img src={imgexchng} alt={''} title="Marketplace" style={{ width: '15px', height: '15px' }} />;
const imgadmin = './icon/ui/vip.webp';
const imgna = './icon/nft/na.png';
const imgrod = './icon/tools/fishing_rod.png';
const imgwinter = <img src="./icon/ui/winter.webp" alt={''} className="seasonico" title="Winter" />;
const imgspring = <img src="./icon/ui/spring.webp" alt={''} className="seasonico" title="Spring" />;
const imgsummer = <img src="./icon/ui/summer.webp" alt={''} className="seasonico" title="Summer" />;
const imgautumn = <img src="./icon/ui/autumn.webp" alt={''} className="seasonico" title="Autumn" />;

var platformListings = "Trades";
let buttonClicked = false;
let curID = "";
let lastID = "";


const INV_COLUMNS_TEMPLATE = [
  ['Hoard', 1],
  ['Item name', 0],
  ['Quantity', 1],
  ['Time', 1],
  ['Production cost', 1],
  ['Shop price', 1],
  ['Ratio coins/flower', 1],
  ['Marketplace price', 1],
  ['Withdraw quantity', 0],
  ['Niftyswap price', 0],
  ['OpenSea price', 0],
  ['Price difference with Marketplace', 0],
  ['Yield', 1],
  ['Harvest average', 1],
  ['To harvest', 1],
  ['BlockBuck production', 0],
  ['Daily Flower', 1],
  ['Daily max production', 1],
  ['Profit %', 1],
  ['When ready', 1],
  ['Price change', 1],
  ['Gain/h', 0],
  ['Buy', 1],
];
const INV_COLUMNS_PICKER = [
  // { idx: 0, label: 'Hoard' },
  { idx: 1, label: 'Item name' },
  { idx: 2, label: 'Quantity' },
  { idx: 3, label: 'Time' },
  { idx: 4, label: 'Production cost' },
  { idx: 22, label: 'Buy' },
  { idx: 5, label: 'Shop price' },
  { idx: 6, label: 'Ratio coins/flower' },
  { idx: 7, label: 'Marketplace price' },
  { idx: 8, label: 'Withdraw quantity' },
  { idx: 12, label: 'Yield' },
  { idx: 13, label: 'Harvest average' },
  { idx: 14, label: 'To harvest' },
  { idx: 15, label: 'BlockBuck production' },
  { idx: 16, label: 'Daily Flower' },
  { idx: 17, label: 'Daily max production' },
  { idx: 18, label: 'Profit %' },
  { idx: 19, label: 'When ready' },
  { idx: 20, label: 'Price change' },
  { idx: 21, label: 'Gain/h' },
];
const INV_SORT_OPTIONS_TEMPLATE = [
  { value: "none", label: "Default", idx: null },
  { value: "item", label: "Item", idx: 1 },
  { value: "quantity", label: "Quantity", idx: 2 },
  { value: "time", label: "Time", idx: 3 },
  { value: "cost", label: "Cost", idx: 4 },
  { value: "shop", label: "Shop", idx: 5 },
  { value: "market", label: "Market", idx: 7 },
  { value: "nifty", label: "Nifty", idx: 9 },
  { value: "opensea", label: "OpenSea", idx: 10 },
  { value: "ratio", label: "Ratio", idx: 6 },
  { value: "yield", label: "Yield", idx: 12 },
  { value: "harvest", label: "Harvest", idx: 13 },
  { value: "toharvest", label: "ToHarvest", idx: 14 },
  { value: "dailysfl", label: "Daily Flower", idx: 16 },
  { value: "gainh", label: "Gain/h", idx: 21 },
  { value: "ready", label: "Ready", idx: 19 },
  { value: "pricechange", label: "Price change", idx: 20 },
];
const COOK_COLUMNS_TEMPLATE = [
  ['Building', 1],
  ['Item name', 0],
  ['Quantity', 1],
  ['XP', 1],
  ['Time to cook', 1],
  ['Time for components growing', 0],
  ['XP/H', 1],
  ['XP/H with components time', 0],
  ['XP/Flower', 1],
  ['Oil', 1],
  ['Cost', 1],
  ['Marketplace price', 1],
  ['Components', 1],
];
const COOK_COLUMNS_PICKER = [
  { idx: 0, label: 'Building' },
  { idx: 1, label: 'Item name' },
  { idx: 2, label: 'Quantity' },
  { idx: 3, label: 'XP' },
  { idx: 4, label: 'Time to cook' },
  //{ idx: 5, label: 'Time for components growing' },
  { idx: 6, label: 'XP/H' },
  //{ idx: 7, label: 'XP/H with components time' },
  { idx: 8, label: 'XP/Flower' },
  { idx: 9, label: 'Oil' },
  { idx: 10, label: 'Cost' },
  { idx: 11, label: 'Marketplace price' },
  { idx: 12, label: 'Components' },
];
const COOK_SORT_OPTIONS_TEMPLATE = [
  { value: "none", label: "Default", idx: null },
  { value: "building", label: "Building", idx: 0 },
  { value: "item", label: "Item", idx: 1 },
  { value: "quantity", label: "Quantity", idx: 2 },
  { value: "xp", label: "XP", idx: 3 },
  { value: "time", label: "Time", idx: 4 },
  { value: "xph", label: "XP/H", idx: 6 },
  { value: "xpsfl", label: "XP/Flower", idx: 8 },
  { value: "cost", label: "Cost", idx: 10 },
  { value: "market", label: "Marketplace", idx: 11 },
  { value: "components", label: "Components", idx: 12 },
];
const FISH_COLUMNS_TEMPLATE = [
  ['Category', 1],
  ['Location', 0],
  ['Hoard', 1],
  ['Item name', 1],
  ['Bait', 1],
  ['Quantity', 1],
  ['Caught', 1],
  ['Map', 1],
  ['Chum', 1],
  ['Period', 1],
  ['Percent by category', 1],
  ['XP', 1],
  ['Cost', 1],
  ['Market', 1],
  ['XP/Flower', 1],
];
const FISH_COLUMNS_PICKER = [
  { idx: 0, label: 'Category' },
  //{ idx: 1, label: 'Location' },
  // { idx: 2, label: 'Hoard' },
  { idx: 3, label: 'Fish' },
  { idx: 4, label: 'Bait' },
  { idx: 5, label: 'Quantity' },
  { idx: 6, label: 'Caught' },
  { idx: 7, label: 'Map' },
  { idx: 8, label: 'Chum' },
  { idx: 9, label: 'Period' },
  { idx: 10, label: '% by category' },
  { idx: 11, label: 'XP' },
  { idx: 12, label: 'Cost' },
  { idx: 13, label: 'Market' },
  { idx: 14, label: 'XP/Flower' },
];
const CRUSTA_COLUMNS_TEMPLATE = [
  ['Tool', 1],
  ['Hoard', 1],
  ['Crustacean', 1],
  ['Stock', 1],
  ['Caught', 1],
  ['Chum', 1],
  ['Cost', 1],
  ['Market', 1],
  ['Grow', 1],
  ['Ready', 1],
];
const CRUSTA_COLUMNS_PICKER = [
  { idx: 0, label: 'Tool' },
  // { idx: 1, label: 'Hoard' },
  { idx: 2, label: 'Crustacean' },
  { idx: 3, label: 'Stock' },
  { idx: 4, label: 'Caught' },
  { idx: 5, label: 'Chum' },
  { idx: 6, label: 'Cost' },
  { idx: 7, label: 'Market' },
  { idx: 8, label: 'Grow' },
  { idx: 9, label: 'Ready' },
];
const PET_PETS_COLUMNS_TEMPLATE = [
  ['Pet', 1],
  ['Fetch', 1],
  ['Supply', 1],
  ['Lvl', 1],
  ['Aura', 1],
  ['Bib', 1],
  ['Current Energy', 1],
  ['Requests', 1],
  ['Energy', 1],
  ['Cost', 1],
  ['Marketplace', 1],
  ['Energy/SFL', 1],
  ['Energy/Marketplace', 1],
];
const PET_PETS_COLUMNS_PICKER = [
  { idx: 0, label: 'Pet' },
  { idx: 1, label: 'Fetch' },
  { idx: 2, label: 'Supply' },
  { idx: 3, label: 'Lvl' },
  { idx: 4, label: 'Aura' },
  { idx: 5, label: 'Bib' },
  { idx: 6, label: 'Current Energy' },
  { idx: 7, label: 'Requests' },
  { idx: 8, label: 'Energy' },
  { idx: 9, label: 'Cost' },
  { idx: 10, label: 'Marketplace' },
  { idx: 11, label: 'Energy/SFL' },
  { idx: 12, label: 'Energy/Marketplace' },
];
const PET_SHRINES_COLUMNS_TEMPLATE = [
  ['Shrine', 1],
  ['Components', 1],
  ['Time', 1],
  ['Cost', 1],
  ['Marketplace', 1],
  ['Supply', 1],
  ['Boost', 1],
];
const PET_SHRINES_COLUMNS_PICKER = [
  { idx: 0, label: 'Shrine' },
  { idx: 1, label: 'Components' },
  { idx: 2, label: 'Time' },
  { idx: 3, label: 'Cost' },
  { idx: 4, label: 'Marketplace' },
  { idx: 5, label: 'Supply' },
  { idx: 6, label: 'Boost' },
];
const PET_COMPONENTS_COLUMNS_TEMPLATE = [
  ['Component', 1],
  ['Quantity', 1],
  ['Energy', 1],
  ['Yield', 1],
  ['Cost', 1],
  ['Prod Marketplace', 1],
  ['Marketplace', 1],
  ['Fetched by', 1],
  ['Used in Shrines', 1],
];
const PET_COMPONENTS_COLUMNS_PICKER = [
  { idx: 0, label: 'Component' },
  { idx: 1, label: 'Quantity' },
  { idx: 2, label: 'Energy' },
  { idx: 3, label: 'Yield' },
  { idx: 4, label: 'Cost' },
  { idx: 5, label: 'Prod Marketplace' },
  { idx: 6, label: 'Marketplace' },
  { idx: 7, label: 'Fetched by' },
  { idx: 8, label: 'Used in Shrines' },
];
const CROPMACHINE_COLUMNS_TEMPLATE = [
  ['Select', 1],
  ['Name', 1],
  ['Time', 1],
  ['Seeds', 1],
  ['Harvest Average', 1],
  ['Harvest Cost', 1],
  ['Oil', 1],
  ['Oil Cost', 1],
  ['Total Cost', 1],
  ['Marketplace', 1],
  ['Profit', 1],
  ['Gain/h', 1],
  ['Daily SFL', 1],
];
const CROPMACHINE_COLUMNS_PICKER = [
  { idx: 0, label: 'Select' },
  { idx: 1, label: 'Name' },
  { idx: 2, label: 'Time' },
  { idx: 3, label: 'Seeds' },
  { idx: 4, label: 'Harvest Avg' },
  { idx: 5, label: 'Harvest Cost' },
  { idx: 6, label: 'Oil' },
  { idx: 7, label: 'Oil Cost' },
  { idx: 8, label: 'Total Cost' },
  { idx: 9, label: 'Marketplace' },
  { idx: 10, label: 'Profit' },
  { idx: 11, label: 'Gain/h' },
  { idx: 12, label: 'Daily SFL' },
];
const EXPAND_COLUMNS_TEMPLATE = [
  ['Level', 1],
  ['Bumpkin', 1],
  ['From / To', 1],
  ['Nodes', 1],
  ['Time', 1],
  ['Resources', 1],
  ['Value', 1],
];
const EXPAND_COLUMNS_PICKER = [
  { idx: 1, label: 'Bumpkin' },
  { idx: 2, label: 'From / To' },
  { idx: 3, label: 'Nodes' },
  { idx: 4, label: 'Time' },
  { idx: 5, label: 'Resources' },
  { idx: 6, label: 'Value' },
];
const BUYNODES_COLUMNS_TEMPLATE = [
  ['Node', 1],
  ['Base', 1],
  ['Increase', 1],
  ['Owned', 1],
  ['Bought', 1],
  ['Buy', 1],
  ['Nodes after', 1],
  ['Next Price', 1],
  ['Sunstone Total', 1],
  ['Obsidian Total', 1],
  ['Obsidian Time', 1],
  ['Bought to reach', 1],
  // ['Priority', 1],
  // ['Remaining Obs', 1],
];
const AUCTIONS_COLUMNS_TEMPLATE = [
  ['Item', 1],
  ['Type', 1],
  ['cur', 1],
  ['Supply', 1],
  ['End', 1],
  ['Notifications', 1],
];
const BUYNODES_COLUMNS_PICKER = [
  { idx: 0, label: 'Node' },
  { idx: 1, label: 'Base' },
  { idx: 2, label: 'Increase' },
  { idx: 3, label: 'Owned' },
  { idx: 4, label: 'Bought' },
  { idx: 5, label: 'Buy' },
  { idx: 6, label: 'Nodes after' },
  { idx: 7, label: 'Next Price' },
  { idx: 8, label: 'Sunstone Total' },
  { idx: 9, label: 'Obsidian Total' },
  { idx: 10, label: 'Obsidian Time' },
  { idx: 11, label: 'Bought to reach' },
  // { idx: 12, label: 'Priority' },
  // { idx: 13, label: 'Remaining Obs' },
];
const AUCTIONS_COLUMNS_PICKER = [
  { idx: 0, label: 'Item' },
  { idx: 1, label: 'Type' },
  { idx: 2, label: 'cur' },
  { idx: 3, label: 'Supply' },
  { idx: 4, label: 'End' },
  { idx: 5, label: 'Notifications' },
];
const ACTIVITY_COLUMNS_TEMPLATE = [
  ['From', 1],
  ['Total XP', 1],
  ['Tickets on daily chest', 1],
  ['Tickets from deliveries', 1],
  ['Tickets from chores', 1],
  ['Bounty Chickens', 1],
  ['Bounty Barn', 1],
  ['Bounty Poppy', 1],
  ['Tickets max', 1],
  ['Deliveries cost', 1],
  ['Deliveries cost P2P', 1],
  ['Ticket cost', 1],
  ['SFL from deliveries', 1],
  ['Coins from deliveries', 1],
  ['Poppy cost', 1],
  ['Poppy cost P2P', 1],
  ['Poppy ticket cost', 1],
];
const ACTIVITY_ITEM_COLUMNS_TEMPLATE = [
  ['Item Name', 1],
  ['Harvested', 1],
  ['Quantity', 1],
  ['Burned', 1],
  ['Production Cost', 1],
  ['Marketplace Price', 1],
  ['Niftyswap Price', 0],
  ['OpenSea Price', 0],
  ['Traded', 1],
  ['Devliveries Burn', 1],
];
const ACTIVITY_QUEST_COLUMNS_TEMPLATE = [
  ['From', 1],
  ['Description', 1],
  ['Reward', 1],
  ['Date', 1],
];

function buildSectionsKey(sections) {
  return [...new Set((sections || []).map((s) => String(s || "").trim()).filter(Boolean))]
    .sort()
    .join("|");
}

function getBalanceValue(balance, key = "sfl") {
  if (balance && typeof balance === "object") {
    return Number(balance[key] || 0);
  }
  return key === "sfl" ? Number(balance || 0) : 0;
}

function hasBalanceData(balance) {
  if (balance && typeof balance === "object") {
    return Object.values(balance).some((value) => Number(value || 0) > 0);
  }
  return Number(balance || 0) > 0;
}

function shouldDebugHashFlow() {
  try {
    if (typeof window !== "undefined" && window.__SFL_DEBUG_HASH_FLOW === true) return true;
    return localStorage.getItem("SFL_DEBUG_HASH_FLOW") === "1";
  } catch {
    return false;
  }
}

function sampleHashKeys(hashObj, limit = 5) {
  const keys = Object.keys((hashObj && typeof hashObj === "object") ? hashObj : {});
  return keys.slice(0, Math.max(1, Number(limit) || 5)).join(",");
}

function computeRequiredSections(uiState, pageSectionRequirements) {
  if (!pageSectionRequirements || typeof pageSectionRequirements !== "object") return [];
  const selectedInv = String(uiState?.selectedInv || "home");
  const base = pageSectionRequirements?.[selectedInv]
    || pageSectionRequirements?.home
    || [];
  const required = new Set(base);

  // Lists are always loaded lazily through dedicated endpoints.
  if (selectedInv === "toplists") {
    required.delete("toplists");
  }
  return [...required];
}

function buildTryitCoverageSignature(farmState) {
  const payload = (farmState && typeof farmState === "object") ? farmState : {};
  const tryitMode = String(payload?.tryitMode || "");
  const tryitarrays = (payload?.tryitarrays && typeof payload.tryitarrays === "object")
    ? payload.tryitarrays
    : {};
  return JSON.stringify({ tryitMode, tryitarrays });
}

function hasPathData(payload, path) {
  const src = (payload && typeof payload === "object") ? payload : {};
  const parts = String(path || "").split(".").filter(Boolean);
  if (parts.length < 1) return false;
  let cur = src;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!cur || typeof cur !== "object" || !Object.prototype.hasOwnProperty.call(cur, part)) {
      return false;
    }
    cur = cur[part];
  }
  return true;
}

function hasSectionData(
  payload,
  section,
  sectionPayloadKeys,
  sectionTablePaths
) {
  const keys = Array.isArray(sectionPayloadKeys?.[section]) ? sectionPayloadKeys[section] : [];
  const nonRootKeys = keys.filter((key) => key !== "itables" && key !== "boostables");
  const tablePaths = sectionTablePaths?.[section];
  if (Array.isArray(tablePaths) && tablePaths.length > 0) {
    const hasAllPaths = tablePaths.every((path) => hasPathData(payload, path));
    if (!hasAllPaths) return false;
    if (nonRootKeys.length < 1) return true;
    return nonRootKeys.some((key) => Object.prototype.hasOwnProperty.call(payload || {}, key));
  }
  if (keys.length < 1) return false;
  return keys.some((key) => Object.prototype.hasOwnProperty.call(payload || {}, key));
}

function extractReceivedTableHashes(responsePayload, tableHashes) {
  const payload = (responsePayload && typeof responsePayload === "object") ? responsePayload : {};
  const hashes = (tableHashes && typeof tableHashes === "object") ? tableHashes : {};
  const picked = {};
  ["itables", "boostables"].forEach((rootKey) => {
    const rootObj = payload?.[rootKey];
    if (!rootObj || typeof rootObj !== "object") return;
    Object.keys(rootObj).forEach((subKey) => {
      const path = `${rootKey}.${subKey}`;
      if (Object.prototype.hasOwnProperty.call(hashes, path)) {
        picked[path] = hashes[path];
      }
    });
  });
  return picked;
}

function mergeKnownHashesFromPayload(responsePayload, farmSectionHashesRef, farmTableHashesRef) {
  const payload = (responsePayload && typeof responsePayload === "object") ? responsePayload : {};
  if (payload?.sectionHashes && typeof payload.sectionHashes === "object") {
    farmSectionHashesRef.current = {
      ...(farmSectionHashesRef.current || {}),
      ...payload.sectionHashes,
    };
  }
  if (payload?.tableHashes && typeof payload.tableHashes === "object") {
    const knownFromPayload = extractReceivedTableHashes(payload, payload.tableHashes);
    farmTableHashesRef.current = {
      ...(farmTableHashesRef.current || {}),
      ...knownFromPayload,
    };
  }
}

function normalizeTryitPayload(raw) {
  const src = (raw && typeof raw === "object") ? raw : {};
  const out = {};
  Object.keys(src).forEach((key) => {
    const val = src[key];
    out[key] = (val && typeof val === "object") ? val : {};
  });
  return out;
}

function hasTryitPayloadContent(tryitPayload) {
  const payload = normalizeTryitPayload(tryitPayload);
  return Object.values(payload).some((table) => Object.keys(table || {}).length > 0);
}

function readTryitSnapshot(farmId = "") {
  try {
    const raw = localStorage.getItem(TRYIT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.payload) {
      return normalizeTryitPayload(parsed.payload);
    }
    return normalizeTryitPayload(parsed);
  } catch {
    return null;
  }
}

function writeTryitSnapshot(tryitPayload, farmId = "", options = {}) {
  try {
    const normalized = normalizeTryitPayload(tryitPayload);
    const preserveEmptyTables = Array.isArray(options?.preserveEmptyTables)
      ? options.preserveEmptyTables.map((k) => String(k || "")).filter(Boolean)
      : [];
    let merged = normalized;
    if (preserveEmptyTables.length > 0) {
      const stored = readTryitSnapshot(farmId) || {};
      merged = { ...normalized };
      preserveEmptyTables.forEach((tableKey) => {
        const nextTable = merged?.[tableKey];
        const hasNextContent = nextTable && typeof nextTable === "object" && Object.keys(nextTable).length > 0;
        if (hasNextContent) return;
        const storedTable = stored?.[tableKey];
        const hasStoredContent = storedTable && typeof storedTable === "object" && Object.keys(storedTable).length > 0;
        if (!hasStoredContent) return;
        merged[tableKey] = { ...storedTable };
      });
    }
    if (!hasTryitPayloadContent(merged)) {
      localStorage.setItem(TRYIT_STORAGE_KEY, JSON.stringify({
        frmid: String(farmId || ""),
        payload: {},
        updatedAt: Date.now(),
      }));
      return {};
    }
    localStorage.setItem(TRYIT_STORAGE_KEY, JSON.stringify({
      frmid: String(farmId || ""),
      payload: merged,
      updatedAt: Date.now(),
    }));
    return merged;
  } catch {
    return null;
  }
}

async function formatHttpErrorMessage(response, endpointLabel = "") {
  const endpoint = String(endpointLabel || "").trim();
  const endpointTxt = endpoint ? ` on ${endpoint}` : "";
  let details = "";

  try {
    const contentType = String(response?.headers?.get("content-type") || "").toLowerCase();
    if (contentType.includes("application/json")) {
      const payload = await response.json();
      details = payload?.error || payload?.message || payload?.details || payload?.msg || "";
      if (!details && typeof payload === "string") details = payload;
      if (!details && payload && typeof payload === "object") details = JSON.stringify(payload);
    } else {
      details = await response.text();
    }
  } catch {
    details = "";
  }

  details = String(details || "").replace(/\s+/g, " ").trim();
  if (details.startsWith("<!DOCTYPE") || details.startsWith("<html")) {
    details = "Internal server error";
  }
  if (details.length > 220) {
    details = `${details.slice(0, 217)}...`;
  }

  const base = `HTTP ${response?.status || "?"}${endpointTxt}`;
  return details ? `${base}: ${details}` : base;
}

function formatVipRemaining(expiresAt) {
  const ts = new Date(expiresAt).getTime();
  if (!Number.isFinite(ts) || ts <= 0) return "";
  const diffMs = ts - Date.now();
  if (diffMs <= 0) return "Expired";
  const totalMinutes = Math.ceil(diffMs / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  const parts = [];
  if (days > 0) parts.push(`${days}j`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  if (minutes > 0 && days < 1) parts.push(`${minutes}m`);
  return parts.join(" ");
}

function formatVipPromptMessage({ farmId, username, isAbo, vipExpiresAt }) {
  const lines = [
    `Your contribution helps keep the server running`,
    `your farm stays updated in real time, with no loading delays`,
    `you will have access to your farm�s data history since the beginning of the chapter`,
    `including harvests, marketplace trades, daily profits and losses, as well as tickets obtained and their price`,
    `you get access to upcoming features, including an AI that analyzes your farm and provides personalized advice (in progress)`,
    ``,
    `Farm: ${String(username || "").trim() || "Unknown"} (${Number(farmId || 0) || 0})`,
    `Subscribed: ${isAbo ? "Yes" : "No"}`,
  ];
  if (!isAbo) {
    lines.push("All donations are on the Polygon chain.");
  }
  if (isAbo) {
    const remaining = formatVipRemaining(vipExpiresAt);
    const expiryDate = vipExpiresAt
      ? new Date(vipExpiresAt).toLocaleString("en-US")
      : "";
    lines.push(`Time remaining: ${remaining || "Unknown"}`);
    if (expiryDate) {
      lines.push(`Expires at: ${expiryDate}`);
    }
  }
  return lines.join("\n");
}
function App() {
  const [initialDataSet, setInitialDataSet] = useState(null);
  const [notifListInitial, setNotifListInitial] = useState(null);
  const uiDefaults = {
    selectedInv: "home",
    selectedHomeMode: "current",
    selectedCurr: "SFL",
    selectedQuant: "unit",
    selectedQuantCook: "quant",
    selectedQuantFish: "quant",
    selectedQuantCrusta: "unit",
    selectedCostCook: "trader",
    selectedQuantity: "farm",
    selectedQuantityCook: "farm",
    cookCategories: ["base", "honey", "cheese", "fish", "cake"],
    selectedAnimalLvl: "farm",
    selectedReady: "when",
    selectedDsfl: "trader",
    selectedFromActivity: "today",
    selectedExpandType: "spring",
    selectedSeedsCM: "stock",
    selectedQuantFetch: "stock",
    activityDisplay: "item",
    selectedActivityQuestCategory: "Delivery",
    selectedDigCur: "sfl",
    selectedSeason: "all",
    selectedTrySeason: "all",
    selectedPChange: "3d",
    chapterCurrentTickets: 0,
    chapterDaysRemaining: "",
    chapterNpcSelection: {},
    chapterNpcCostOverride: {},
    chapterBountySelection: {},
    chapterBountyCostOverride: {},
    chapterBountyReplace: {},
    chapterBountyOverride: {},
    chapterBountyRewardType: "actual",
    chapterVipDone: false,
    chapterCostMode: "prod",
    chapterCostType: "average",
    invSortBy: "none",
    invSortDir: "asc",
    cookSortBy: "none",
    cookSortDir: "asc",
    invCategories: ["crop", "resources", "animals", "fruit", "buildings"],
    petView: "pets",
    fishView: "fish",
    inputValue: "",
    inputKeep: 3,
    inputFromLvl: 1,
    inputToLvl: 30,
    fromtolvltime: 0,
    fromtolvlxp: 0,
    TryChecked: false,
    CostChecked: true,
    BurnChecked: true,
    fromtoexpand: [],
    xHrvst: {},
    xHrvsttry: {},
    isOpen: {},
    customSeedCM: {},
    customQuantFetch: {},
    petFetchSelection: {},
    petFetchSelectionInitDone: false,
    petRequestSelection: {},
    petRequestSelectionInitDone: false,
    cstPrices: {},
    buyNodesQty: {},
    buyNodesTimeFromStock: false,
    buyNodesSubMode: "obsidian",
    buyNodesSubObsidian: 0,
    buyNodesBuyPerWeek: 1,
    buyNodesSplitStrategy: "short_time",
    tryProfileShareScope: ["nodes", "buy", "collectibles", "wearables", "craft", "buds", "skills", "shrines"],
    toCM: {},
    selectedHomeBlocks: {},
    selectedHomeItems: {},
    xListeCol: INV_COLUMNS_TEMPLATE,
    xListeColCook: COOK_COLUMNS_TEMPLATE,
    xListeColFish: FISH_COLUMNS_TEMPLATE,
    xListeColCrusta: CRUSTA_COLUMNS_TEMPLATE,
    xListeColCropMachine: CROPMACHINE_COLUMNS_TEMPLATE,
    xListeColPetPets: PET_PETS_COLUMNS_TEMPLATE,
    xListeColPetShrines: PET_SHRINES_COLUMNS_TEMPLATE,
    xListeColPetComponents: PET_COMPONENTS_COLUMNS_TEMPLATE,
    xListeColFlower: [['Seed', 1],
    ['Flower name', 1],
    ['Breeding', 1],
    ['Quantity in bag', 1],
    ['Found', 1]],
    xListeColBounty: [['Item name', 1],
    ['Stock', 1],
    ['Value', 1],
    ['Today', 1],
    ['Value', 1],
    ['ToolCost', 1]],
    xListeColAnimals: [['Item name', 1],
    ['LVL', 1],
    ['Prod 1', 1],
    ['Prod 2', 1],
    ['Food', 1],
    ['Food Cost', 1],
    ['Food Cost P2P', 1],
    ['Prod 1 Cost', 1],
    ['Prod 1 Cost P2P', 1],
    ['Prod 2 Cost', 1],
    ['Prod 2 Cost P2P', 1],
    ['1 love', 1],
    ['2 love', 1]],
    xListeColExpand: EXPAND_COLUMNS_TEMPLATE,
    xListeColActivity: ACTIVITY_COLUMNS_TEMPLATE,
    xListeColActivityItem: ACTIVITY_ITEM_COLUMNS_TEMPLATE,
    xListeColActivityQuest: ACTIVITY_QUEST_COLUMNS_TEMPLATE,
    xListeColBuyNodes: BUYNODES_COLUMNS_TEMPLATE,
    xListeColAuctions: AUCTIONS_COLUMNS_TEMPLATE,
  };
  const normalizeUI = (raw) => {
    const next = { ...(raw || {}) };
    const currentInvCols = Array.isArray(next.xListeCol) ? next.xListeCol : [];
    next.xListeCol = INV_COLUMNS_TEMPLATE.map((tpl, i) => {
      const cur = Array.isArray(currentInvCols[i]) ? currentInvCols[i] : null;
      const enabled = cur && (cur[1] === 1 || cur[1] === 0) ? cur[1] : tpl[1];
      return [tpl[0], enabled];
    });
    const currentCookColsRaw = Array.isArray(next.xListeColCook) ? next.xListeColCook : [];
    const currentCookCols = currentCookColsRaw.length === 12
      ? [
        ...currentCookColsRaw.slice(0, 9),
        ['Oil', 1],
        currentCookColsRaw[9],
        currentCookColsRaw[10],
        currentCookColsRaw[11],
      ]
      : currentCookColsRaw;
    next.xListeColCook = COOK_COLUMNS_TEMPLATE.map((tpl, i) => {
      const cur = Array.isArray(currentCookCols[i]) ? currentCookCols[i] : null;
      const enabled = cur && (cur[1] === 1 || cur[1] === 0) ? cur[1] : tpl[1];
      return [tpl[0], enabled];
    });
    const currentFishColsRaw = Array.isArray(next.xListeColFish) ? next.xListeColFish : [];
    const currentFishCols = currentFishColsRaw.length === 14
      ? [
        ...currentFishColsRaw.slice(0, 13),
        ['Market', 1],
        currentFishColsRaw[13],
      ]
      : currentFishColsRaw;
    next.xListeColFish = FISH_COLUMNS_TEMPLATE.map((tpl, i) => {
      const cur = Array.isArray(currentFishCols[i]) ? currentFishCols[i] : null;
      const enabled = cur && (cur[1] === 1 || cur[1] === 0) ? cur[1] : tpl[1];
      return [tpl[0], enabled];
    });
    const currentCrustaCols = Array.isArray(next.xListeColCrusta) ? next.xListeColCrusta : [];
    next.xListeColCrusta = CRUSTA_COLUMNS_TEMPLATE.map((tpl, i) => {
      const cur = Array.isArray(currentCrustaCols[i]) ? currentCrustaCols[i] : null;
      const enabled = cur && (cur[1] === 1 || cur[1] === 0) ? cur[1] : tpl[1];
      return [tpl[0], enabled];
    });
    const currentExpandColsRaw = Array.isArray(next.xListeColExpand) ? next.xListeColExpand : [];
    const currentExpandCols = currentExpandColsRaw.length === 5
      ? [
        currentExpandColsRaw[0], // Level
        currentExpandColsRaw[1], // Bumpkin
        currentExpandColsRaw[2], // From/To
        currentExpandColsRaw[3], // Nodes
        currentExpandColsRaw[3], // Time (legacy was tied to Nodes)
        currentExpandColsRaw[4], // Resources
        currentExpandColsRaw[4], // Value (legacy was tied to Resources)
      ]
      : currentExpandColsRaw;
    next.xListeColExpand = EXPAND_COLUMNS_TEMPLATE.map((tpl, i) => {
      const cur = Array.isArray(currentExpandCols[i]) ? currentExpandCols[i] : null;
      const enabled = i === 0 ? 1 : (cur && (cur[1] === 1 || cur[1] === 0) ? cur[1] : tpl[1]);
      return [tpl[0], enabled];
    });
    const currentCropMachineCols = Array.isArray(next.xListeColCropMachine) ? next.xListeColCropMachine : [];
    next.xListeColCropMachine = CROPMACHINE_COLUMNS_TEMPLATE.map((tpl, i) => {
      const cur = Array.isArray(currentCropMachineCols[i]) ? currentCropMachineCols[i] : null;
      const enabled = cur && (cur[1] === 1 || cur[1] === 0) ? cur[1] : tpl[1];
      return [tpl[0], enabled];
    });
    const currentPetPetsCols = Array.isArray(next.xListeColPetPets) ? next.xListeColPetPets : [];
    next.xListeColPetPets = PET_PETS_COLUMNS_TEMPLATE.map((tpl, i) => {
      const cur = Array.isArray(currentPetPetsCols[i]) ? currentPetPetsCols[i] : null;
      const enabled = cur && (cur[1] === 1 || cur[1] === 0) ? cur[1] : tpl[1];
      return [tpl[0], enabled];
    });
    const currentPetShrinesCols = Array.isArray(next.xListeColPetShrines) ? next.xListeColPetShrines : [];
    next.xListeColPetShrines = PET_SHRINES_COLUMNS_TEMPLATE.map((tpl, i) => {
      const cur = Array.isArray(currentPetShrinesCols[i]) ? currentPetShrinesCols[i] : null;
      const enabled = cur && (cur[1] === 1 || cur[1] === 0) ? cur[1] : tpl[1];
      return [tpl[0], enabled];
    });
    const currentPetComponentsCols = Array.isArray(next.xListeColPetComponents) ? next.xListeColPetComponents : [];
    next.xListeColPetComponents = PET_COMPONENTS_COLUMNS_TEMPLATE.map((tpl, i) => {
      const cur = Array.isArray(currentPetComponentsCols[i]) ? currentPetComponentsCols[i] : null;
      const enabled = cur && (cur[1] === 1 || cur[1] === 0) ? cur[1] : tpl[1];
      return [tpl[0], enabled];
    });
    const currentActivityCols = Array.isArray(next.xListeColActivity) ? next.xListeColActivity : [];
    next.xListeColActivity = ACTIVITY_COLUMNS_TEMPLATE.map((tpl, i) => {
      const cur = Array.isArray(currentActivityCols[i]) ? currentActivityCols[i] : null;
      const enabled = cur && (cur[1] === 1 || cur[1] === 0) ? cur[1] : tpl[1];
      return [tpl[0], enabled];
    });
    const currentActivityItemCols = Array.isArray(next.xListeColActivityItem) ? next.xListeColActivityItem : [];
    // Legacy shape had 9 columns (without Nifty/OpenSea), but Activity table reads index 9.
    const normalizedLegacyActivityItemCols = currentActivityItemCols.length === 9
      ? [
        currentActivityItemCols[0],
        currentActivityItemCols[1],
        currentActivityItemCols[2],
        currentActivityItemCols[3],
        currentActivityItemCols[4],
        currentActivityItemCols[5],
        ['Niftyswap Price', 0],
        ['OpenSea Price', 0],
        currentActivityItemCols[6],
        [(currentActivityItemCols[7]?.[1] === 1 || currentActivityItemCols[8]?.[1] === 1) ? 'Devliveries Burn' : 'Devliveries Burn', (currentActivityItemCols[7]?.[1] === 1 || currentActivityItemCols[8]?.[1] === 1) ? 1 : 0],
      ]
      : currentActivityItemCols;
    next.xListeColActivityItem = ACTIVITY_ITEM_COLUMNS_TEMPLATE.map((tpl, i) => {
      const cur = Array.isArray(normalizedLegacyActivityItemCols[i]) ? normalizedLegacyActivityItemCols[i] : null;
      const enabled = cur && (cur[1] === 1 || cur[1] === 0) ? cur[1] : tpl[1];
      return [tpl[0], enabled];
    });
    const currentActivityQuestCols = Array.isArray(next.xListeColActivityQuest) ? next.xListeColActivityQuest : [];
    next.xListeColActivityQuest = ACTIVITY_QUEST_COLUMNS_TEMPLATE.map((tpl, i) => {
      const cur = Array.isArray(currentActivityQuestCols[i]) ? currentActivityQuestCols[i] : null;
      const enabled = cur && (cur[1] === 1 || cur[1] === 0) ? cur[1] : tpl[1];
      return [tpl[0], enabled];
    });
    const currentBuyNodesCols = Array.isArray(next.xListeColBuyNodes) ? next.xListeColBuyNodes : [];
    next.xListeColBuyNodes = BUYNODES_COLUMNS_TEMPLATE.map((tpl, i) => {
      const cur = Array.isArray(currentBuyNodesCols[i]) ? currentBuyNodesCols[i] : null;
      const enabled = cur && (cur[1] === 1 || cur[1] === 0) ? cur[1] : tpl[1];
      return [tpl[0], enabled];
    });
    const currentAuctionsCols = Array.isArray(next.xListeColAuctions) ? next.xListeColAuctions : [];
    next.xListeColAuctions = AUCTIONS_COLUMNS_TEMPLATE.map((tpl, i) => {
      const cur = Array.isArray(currentAuctionsCols[i]) ? currentAuctionsCols[i] : null;
      const enabled = cur && (cur[1] === 1 || cur[1] === 0) ? cur[1] : tpl[1];
      return [tpl[0], enabled];
    });
    next.buyNodesSubMode = next.buyNodesSubMode === "week" ? "week" : "obsidian";
    next.buyNodesSubObsidian = Number.isFinite(Number(next.buyNodesSubObsidian))
      ? Math.max(0, Math.floor(Number(next.buyNodesSubObsidian)))
      : 0;
    next.buyNodesBuyPerWeek = Number.isFinite(Number(next.buyNodesBuyPerWeek))
      ? Math.max(1, Math.min(9, Math.floor(Number(next.buyNodesBuyPerWeek))))
      : 1;
    next.buyNodesSplitStrategy = (
      next.buyNodesSplitStrategy === "sunstone"
      || next.buyNodesSplitStrategy === "short_time"
    ) ? next.buyNodesSplitStrategy : "short_time";
    next.buyNodesTimeFromStock = !!next.buyNodesTimeFromStock;
    next.selectedTrySeason = (
      next.selectedTrySeason === "spring"
      || next.selectedTrySeason === "summer"
      || next.selectedTrySeason === "autumn"
      || next.selectedTrySeason === "winter"
      || next.selectedTrySeason === "all"
    ) ? next.selectedTrySeason : "all";
    const allowedTryProfileShareScope = new Set(["nodes", "buy", "collectibles", "wearables", "craft", "buds", "skills", "shrines"]);
    const normalizedTryProfileShareScope = (Array.isArray(next.tryProfileShareScope) ? next.tryProfileShareScope : [])
      .map((v) => {
        const key = String(v || "");
        if (key === "nft") return "collectibles";
        if (key === "wearable") return "wearables";
        return key;
      })
      .filter((v) => allowedTryProfileShareScope.has(v));
    next.tryProfileShareScope = normalizedTryProfileShareScope.length > 0
      ? normalizedTryProfileShareScope
      : ["nodes", "buy", "collectibles", "wearables", "craft", "buds", "skills", "shrines"];
    return next;
  };
  const [ui, setUI] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("ui"));
      return {
        ...uiDefaults,
        ...normalizeUI(stored),
      };
    } catch {
      return uiDefaults;
    }
  });
  useEffect(() => {
    localStorage.setItem("ui", JSON.stringify(ui));
  }, [ui]);
  const { inputValue, TryChecked, selectedInv, fromexpand, toexpand, selectedExpandType } = ui;
  const invPickerOptions = useMemo(
    () => INV_COLUMNS_PICKER.map((c) => ({ value: String(c.idx), label: c.label })),
    []
  );
  const invPickerValue = useMemo(
    () => INV_COLUMNS_PICKER
      .filter((c) => ui?.xListeCol?.[c.idx]?.[1] === 1)
      .map((c) => String(c.idx)),
    [ui?.xListeCol]
  );
  const invSortOptions = useMemo(() => {
    const visibleIdx = new Set(
      INV_COLUMNS_PICKER
        .filter((c) => ui?.xListeCol?.[c.idx]?.[1] === 1)
        .map((c) => c.idx)
    );
    return INV_SORT_OPTIONS_TEMPLATE
      .filter((o) => o.idx === null || visibleIdx.has(o.idx))
      .map(({ value, label }) => ({ value, label }));
  }, [ui?.xListeCol]);
  useEffect(() => {
    const current = ui?.invSortBy || "none";
    if (!invSortOptions.some((o) => o.value === current)) {
      setUIField("invSortBy", "none");
    }
  }, [ui?.invSortBy, invSortOptions]);
  const cookPickerOptions = useMemo(
    () => COOK_COLUMNS_PICKER.map((c) => ({ value: String(c.idx), label: c.label })),
    []
  );
  const cookPickerValue = useMemo(
    () => COOK_COLUMNS_PICKER
      .filter((c) => ui?.xListeColCook?.[c.idx]?.[1] === 1)
      .map((c) => String(c.idx)),
    [ui?.xListeColCook]
  );
  const cookSortOptions = useMemo(() => {
    const visibleIdx = new Set(
      COOK_COLUMNS_PICKER
        .filter((c) => ui?.xListeColCook?.[c.idx]?.[1] === 1)
        .map((c) => c.idx)
    );
    return COOK_SORT_OPTIONS_TEMPLATE
      .filter((o) => o.idx === null || visibleIdx.has(o.idx))
      .map(({ value, label }) => ({ value, label }));
  }, [ui?.xListeColCook]);
  const fishPickerOptions = useMemo(
    () => FISH_COLUMNS_PICKER.map((c) => ({ value: String(c.idx), label: c.label })),
    []
  );
  const fishPickerValue = useMemo(
    () => FISH_COLUMNS_PICKER
      .filter((c) => ui?.xListeColFish?.[c.idx]?.[1] === 1)
      .map((c) => String(c.idx)),
    [ui?.xListeColFish]
  );
  const crustaPickerOptions = useMemo(
    () => CRUSTA_COLUMNS_PICKER.map((c) => ({ value: String(c.idx), label: c.label })),
    []
  );
  const crustaPickerValue = useMemo(
    () => CRUSTA_COLUMNS_PICKER
      .filter((c) => ui?.xListeColCrusta?.[c.idx]?.[1] === 1)
      .map((c) => String(c.idx)),
    [ui?.xListeColCrusta]
  );
  const cropMachinePickerOptions = useMemo(
    () => CROPMACHINE_COLUMNS_PICKER.map((c) => ({ value: String(c.idx), label: c.label })),
    []
  );
  const cropMachinePickerValue = useMemo(
    () => CROPMACHINE_COLUMNS_PICKER
      .filter((c) => ui?.xListeColCropMachine?.[c.idx]?.[1] === 1)
      .map((c) => String(c.idx)),
    [ui?.xListeColCropMachine]
  );
  const expandPickerOptions = useMemo(
    () => EXPAND_COLUMNS_PICKER.map((c) => ({ value: String(c.idx), label: c.label })),
    []
  );
  const expandPickerValue = useMemo(
    () => EXPAND_COLUMNS_PICKER
      .filter((c) => ui?.xListeColExpand?.[c.idx]?.[1] === 1)
      .map((c) => String(c.idx)),
    [ui?.xListeColExpand]
  );
  const buyNodesPickerOptions = useMemo(
    () => BUYNODES_COLUMNS_PICKER.map((c) => ({ value: String(c.idx), label: c.label })),
    []
  );
  const buyNodesPickerValue = useMemo(
    () => BUYNODES_COLUMNS_PICKER
      .filter((c) => ui?.xListeColBuyNodes?.[c.idx]?.[1] === 1)
      .map((c) => String(c.idx)),
    [ui?.xListeColBuyNodes]
  );
  const auctionsPickerOptions = useMemo(
    () => AUCTIONS_COLUMNS_PICKER.map((c) => ({ value: String(c.idx), label: c.label })),
    []
  );
  const auctionsPickerValue = useMemo(
    () => AUCTIONS_COLUMNS_PICKER
      .filter((c) => ui?.xListeColAuctions?.[c.idx]?.[1] === 1)
      .map((c) => String(c.idx)),
    [ui?.xListeColAuctions]
  );
  const activePetColumnsPicker = useMemo(() => {
    if (ui?.petView === "shrines") {
      return {
        template: PET_SHRINES_COLUMNS_TEMPLATE,
        picker: PET_SHRINES_COLUMNS_PICKER,
        stateKey: "xListeColPetShrines",
      };
    }
    if (ui?.petView === "components") {
      return {
        template: PET_COMPONENTS_COLUMNS_TEMPLATE,
        picker: PET_COMPONENTS_COLUMNS_PICKER,
        stateKey: "xListeColPetComponents",
      };
    }
    return {
      template: PET_PETS_COLUMNS_TEMPLATE,
      picker: PET_PETS_COLUMNS_PICKER,
      stateKey: "xListeColPetPets",
    };
  }, [ui?.petView]);
  const petPickerOptions = useMemo(
    () => (activePetColumnsPicker?.picker || []).map((c) => ({ value: String(c.idx), label: c.label })),
    [activePetColumnsPicker]
  );
  const petPickerValue = useMemo(
    () => (activePetColumnsPicker?.picker || [])
      .filter((c) => ui?.[activePetColumnsPicker?.stateKey]?.[c.idx]?.[1] === 1)
      .map((c) => String(c.idx)),
    [activePetColumnsPicker, ui]
  );
  useEffect(() => {
    const current = ui?.cookSortBy || "none";
    if (!cookSortOptions.some((o) => o.value === current)) {
      setUIField("cookSortBy", "none");
    }
  }, [ui?.cookSortBy, cookSortOptions]);
  const [farmData, setFarmData] = useState([]);
  const [dataSetFarm, setdataSetFarm] = useState({});
  const [options, setOptions] = useState({});
  const [bumpkinData, setBumpkinData] = useState([]);
  const [bumpkinLoading, setBumpkinLoading] = useState(false);
  const [mutData, setmutData] = useState([]);
  const [GraphType, setGraphType] = useState('');
  const [deliveriesData, setdeliveriesData] = useState([]);
  const [priceData, setpriceData] = useState([]);
  const [tooltipData, setTooltipData] = useState(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const [vipLoading, setVipLoading] = useState(false);
  const [expandLoading, setExpandLoading] = useState(false);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [headerRequestLoading, setHeaderRequestLoading] = useState(false);
  const [autoRefreshNonce, setAutoRefreshNonce] = useState(0);
  const [autoRefreshPulse, setAutoRefreshPulse] = useState(0);
  const [autoRefreshNextAt, setAutoRefreshNextAt] = useState(0);
  const [autoRefreshDurationMs, setAutoRefreshDurationMs] = useState(60 * 1000);
  const [activeTimers, setActiveTimers] = useState([]);
  const pendingSaveRef = useRef(false);
  const pendingTryitSnapshotRef = useRef(false);
  const refreshInFlightRef = useRef(false);
  const suppressNavUntilRef = useRef(0);
  const autoRefreshHasRunRef = useRef(false);
  const autoRefreshLastPageRef = useRef("");
  const postTryCloseCoverageRef = useRef(null);
  const autoRefreshForceNormalFirstCycleRef = useRef(false);
  const deliveryLastSyncRef = useRef({ farmId: "", pulse: -1 });
  const notifBootCheckedRef = useRef("");
  const notifPromptOpenRef = useRef(false);
  const notifActivationInFlightRef = useRef(false);
  const nativePushListenersBoundRef = useRef(false);
  const auctionNotifSyncTimerRef = useRef(null);
  const auctionNotifPendingSelectionRef = useRef(null);
  const autoRefreshViewRef = useRef({
    selectedInv: "home",
    activityDisplay: "item",
    fishView: "fish",
    petView: "pets",
    showfDlvr: false,
  });
  const expandRequestSeqRef = useRef(0);
  const farmSectionHashesRef = useRef({});
  const farmTableHashesRef = useRef({});
  const loadFarmCooldownUntilRef = useRef(0);
  const loadFarmRequestInFlightRef = useRef(false);
  const loadFarmCooldownTimerRef = useRef(null);
  const loadFarmSpamClickTimesRef = useRef([]);
  const loadFarmSpamPromptOpenRef = useRef(false);
  const invBuyRefreshCooldownUntilRef = useRef(0);
  const dataSetFarmRef = useRef({});
  const deviceIdRef = useRef(getOrCreateDeviceId());
  const headerRequestCountRef = useRef(0);
  const hoveredTooltipCellRef = useRef(null);
  const [reqState, setReqState] = useState("");
  const [cdButton, setcdButton] = useState(false);
  const [iaLoading, setIaLoading] = useState(false);
  const [showfTNFT, setShowfTNFT] = useState(false);
  const [showfGraph, setShowfGraph] = useState(false);
  const [showfDlvr, setShowfDlvr] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showCadre, setShowCadre] = useState(false);
  const [sharedTryProfile, setSharedTryProfile] = useState(null);
  const [sectionsMeta, setSectionsMeta] = useState(null);
  const [sectionsMetaError, setSectionsMetaError] = useState("");
  const pageSectionRequirements = sectionsMeta?.pageSectionRequirements || null;
  const sectionPayloadKeys = sectionsMeta?.sectionKeys || null;
  const sectionTablePaths = sectionsMeta?.sectionTablePaths || null;
  const tryitConfig = sectionsMeta?.tryitConfig || null;
  const tryitAllPayloadKeys = useMemo(() => {
    const boostKeys = Array.isArray(tryitConfig?.boostTables)
      ? tryitConfig.boostTables.map((k) => String(k || "")).filter(Boolean)
      : TRYIT_FALLBACK_BOOST_KEYS;
    const itemKeys = (tryitConfig?.itemTables && typeof tryitConfig.itemTables === "object")
      ? Object.keys(tryitConfig.itemTables).map((k) => String(k || "")).filter(Boolean)
      : TRYIT_FALLBACK_ITEM_KEYS;
    return [...new Set([...boostKeys, ...itemKeys])];
  }, [tryitConfig]);
  const tryitStatefulPayloadKeys = useMemo(() => {
    if (!(tryitConfig?.itemTables && typeof tryitConfig.itemTables === "object")) {
      return ["xbuyit", "xfarmit", "xcookit"];
    }
    const keys = Object.entries(tryitConfig.itemTables)
      .filter(([, cfg]) => {
        const field = cfg?.field;
        const baseField = cfg?.baseField || field;
        return !!field && baseField === field;
      })
      .map(([payloadKey]) => String(payloadKey || "").trim())
      .filter(Boolean);
    return keys.length > 0 ? keys : ["xbuyit", "xfarmit", "xcookit"];
  }, [tryitConfig]);
  useEffect(() => {
    dataSetFarmRef.current = dataSetFarm || {};
  }, [dataSetFarm]);
  useEffect(() => {
    let cancelled = false;
    const loadSharedProfile = async () => {
      const sharedProfile = await parseTryProfileFromLocation();
      if (cancelled) return;
      if (sharedProfile && typeof sharedProfile === "object") {
        const directBoostChanges = Array.isArray(sharedProfile?.boostChanges) ? sharedProfile.boostChanges : [];
        const sharedRows = buildSharedBoostChangesRows(sharedProfile);
        const rows = directBoostChanges.length > 0
          ? directBoostChanges
          : sharedRows.length > 0
            ? sharedRows
            : buildTryProfileSummaryRows(sharedProfile).map((row) => ({
              ...row,
              status: "added",
              section: row?.section || "",
              category: row?.category || "Other",
            }));
        setSharedTryProfile({
          ...sharedProfile,
          compareMode: "shared",
          profileName: String(sharedProfile?.profileName || "Shared"),
          boostChanges: rows,
        });
      }
    };
    loadSharedProfile();
    return () => {
      cancelled = true;
    };
  }, []);
  const beginHeaderRequest = () => {
    headerRequestCountRef.current += 1;
    setHeaderRequestLoading(true);
  };
  const endHeaderRequest = () => {
    headerRequestCountRef.current = Math.max(0, headerRequestCountRef.current - 1);
    if (headerRequestCountRef.current < 1) {
      setHeaderRequestLoading(false);
    }
  };
  useEffect(() => {
    if (!pendingTryitSnapshotRef.current) return;
    pendingTryitSnapshotRef.current = false;
    const farmState = dataSetFarmRef.current || {};
    const farmId = String(farmState?.frmid || curID || dataSet?.options?.farmId || "");
    const snapshot = filterTryit(farmState, true, tryitConfig);
    if (hasTryitPayloadContent(snapshot)) {
      writeTryitSnapshot(snapshot, farmId, {
        preserveEmptyTables: tryitAllPayloadKeys,
      });
    }
  }, [dataSetFarm, tryitAllPayloadKeys, tryitConfig]);

  const getTryitRequestPayload = (farmState) => {
    const requestFarmId = String(curID || farmState?.frmid || dataSet?.options?.farmId || "");
    const stored = readTryitSnapshot(requestFarmId);
    const getByPath = (obj, path) =>
      String(path || "").split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
    const buildTryitDeltaPayload = (state) => {
      if (!tryitConfig || !Array.isArray(tryitConfig?.boostTables) || !tryitConfig?.itemTables) return null;
      const cur = state || {};
      const delta = {};
      (tryitConfig.boostTables || []).forEach((tableName) => {
        delta[tableName] = {};
        const table = cur?.boostables?.[tableName] || {};
        Object.entries(table).forEach(([item, value]) => {
          const active = Number(value?.isactive || 0);
          const currentTry = Number(value?.tryit || 0);
          if (currentTry !== active) {
            delta[tableName][item] = currentTry;
          }
        });
      });
      Object.entries(tryitConfig.itemTables || {}).forEach(([payloadKey, tableCfg]) => {
        delta[payloadKey] = {};
        const field = tableCfg?.field;
        const baseField = tableCfg?.baseField || field;
        const sources = Array.isArray(tableCfg?.sources) ? tableCfg.sources : [];
        const isStatefulToggle = tryitStatefulPayloadKeys.includes(payloadKey);
        if (!field || !baseField || sources.length < 1) return;
        sources.forEach((sourcePath) => {
          const curTable = getByPath(cur, sourcePath) || {};
          Object.entries(curTable).forEach(([item, value]) => {
            const curVal = Number(value?.[field] || 0);
            // Stateful toggles must include explicit 0/1 values to avoid reset on reload.
            if (isStatefulToggle) {
              delta[payloadKey][item] = curVal;
              return;
            }
            if (baseField === field) {
              if (curVal !== 0) {
                delta[payloadKey][item] = curVal;
              }
              return;
            }
            const baseVal = Number(value?.[baseField] ?? value?.[field] ?? 0);
            if (curVal !== baseVal) {
              delta[payloadKey][item] = curVal;
            }
          });
        });
      });
      return normalizeTryitPayload(delta);
    };
    const mergeStoredStatefulIntoDelta = (deltaPayload, storedPayload) => {
      const merged = normalizeTryitPayload(deltaPayload || {});
      const storedNorm = normalizeTryitPayload(storedPayload || {});
      tryitStatefulPayloadKeys.forEach((payloadKey) => {
        const deltaTable = (merged?.[payloadKey] && typeof merged[payloadKey] === "object") ? merged[payloadKey] : {};
        const storedTable = (storedNorm?.[payloadKey] && typeof storedNorm[payloadKey] === "object") ? storedNorm[payloadKey] : {};
        if (Object.keys(deltaTable).length < 1 && Object.keys(storedTable).length < 1) return;
        merged[payloadKey] = {
          ...storedTable,
          ...deltaTable,
        };
      });
      return merged;
    };
    const hasCanonicalTryitState = () => {
      return !!(farmState?.itables?.it && farmState?.boostables);
    };
    const hasTrySources =
      !!farmState?.itables ||
      !!farmState?.boostables ||
      !!farmState?.invData?.itables ||
      !!farmState?.invData?.boostables ||
      !!farmState?.cookData?.itables ||
      !!farmState?.fishData?.itables ||
      !!farmState?.bountyData?.itables ||
      !!farmState?.craftData?.itables ||
      !!farmState?.flowerData?.itables ||
      !!farmState?.expandPageData?.itables ||
      !!farmState?.mapData?.boostables;
    if (hasTrySources) {
      const computedDelta = buildTryitDeltaPayload(farmState || {});
      const safeDelta = mergeStoredStatefulIntoDelta(computedDelta, stored);
      if (safeDelta && hasTryitPayloadContent(safeDelta)) {
        return { tryitarrays: safeDelta, tryitMode: "delta" };
      }
      const computed = filterTryit(farmState || {}, true, tryitConfig);
      if (hasTryitPayloadContent(computed)) {
        const normalized = writeTryitSnapshot(computed, requestFarmId, {
          preserveEmptyTables: hasCanonicalTryitState() ? [] : tryitAllPayloadKeys,
        }) || computed;
        return { tryitarrays: normalized, tryitMode: "snapshot" };
      }
    }
    if (stored && hasTryitPayloadContent(stored)) {
      return { tryitarrays: stored, tryitMode: "snapshot" };
    }
    return { tryitarrays: {}, tryitMode: "active" };
  };
  useEffect(() => {
    if (sectionsMetaError) {
      setReqState(sectionsMetaError);
    }
  }, [sectionsMetaError]);
  useEffect(() => {
    const mode = ui?.selectedQuantityCook;
    if (mode !== "daily" && mode !== "dailymax") return;
    const food = dataSetFarm?.itables?.food || {};
    const pfood = dataSetFarm?.itables?.pfood || {};
    const foodKeys = Object.keys(food);
    const pfoodKeys = Object.keys(pfood);
    const allKeys = [...foodKeys, ...pfoodKeys];
    if (allKeys.length === 0) return;
    const hasCookit = allKeys.some((key) => Number((food[key] || pfood[key])?.cookit) === 1);
    if (hasCookit) return;
    const firstFoodKey = foodKeys[0];
    const firstPfoodKey = pfoodKeys[0];
    setdataSetFarm((prev) => {
      const prevItables = prev?.itables || {};
      const prevFood = prevItables?.food || {};
      const prevPfood = prevItables?.pfood || {};
      if (firstFoodKey) {
        return {
          ...prev,
          itables: {
            ...prevItables,
            food: {
              ...prevFood,
              [firstFoodKey]: {
                ...(prevFood[firstFoodKey] || {}),
                cookit: 1,
              },
            },
          },
        };
      }
      if (firstPfoodKey) {
        return {
          ...prev,
          itables: {
            ...prevItables,
            pfood: {
              ...prevPfood,
              [firstPfoodKey]: {
                ...(prevPfood[firstPfoodKey] || {}),
                cookit: 1,
              },
            },
          },
        };
      }
      return prev;
    });
    pendingTryitSnapshotRef.current = true;
    pendingSaveRef.current = true;
  }, [ui?.selectedQuantityCook, dataSetFarm?.itables?.food, dataSetFarm?.itables?.pfood]);

  const handleHomeClic = (index) => {
    //setIsOpen((prevState) => ({
    setUIField("isOpen", (prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };
  const handleInvBuyRefresh = async () => {
    const now = Date.now();
    if (now < Number(invBuyRefreshCooldownUntilRef.current || 0)) {
      return false;
    }
    invBuyRefreshCooldownUntilRef.current = now + 4000;
    try {
      await getPrices(false, true, ["inventory", "boosts"], true, "inv", true, "BUY");
      autoRefreshForceNormalFirstCycleRef.current = true;
      setAutoRefreshDurationMs(60 * 1000);
      setAutoRefreshNextAt(Date.now() + (60 * 1000));
      setAutoRefreshNonce((v) => v + 1);
      return true;
    } catch (error) {
      console.log("Inv buy refresh error", error);
      return false;
    }
  };
  const handleButtonfTNFTClick = async () => {
    const hasFullTryTables =
      hasSectionData(dataSetFarm, "boosts", sectionPayloadKeys, sectionTablePaths) &&
      hasSectionData(dataSetFarm, "inventory", sectionPayloadKeys, sectionTablePaths);
    if (!hasFullTryTables) {
      try {
        await getPrices(false, true, ["boosts", "inventory"], false, "trynft", true);
      } catch (error) {
        console.log("TryNFT preload error", error);
      }
    }
    setShowfTNFT(true);
  };
  const handleButtonfDlvrClick = async () => {
    const hasOrdersData =
      !!dataSetFarm?.orderstable &&
      !!dataSetFarm?.orderstable?.orders &&
      !!dataSetFarm?.orderstable?.chores &&
      !!dataSetFarm?.orderstable?.bounties;
    const hasDeliveryTables = hasSectionData(dataSetFarm, "deliverypage", sectionPayloadKeys, sectionTablePaths);
    const currentFarmId = String(dataSetFarm?.frmid || dataSet?.options?.farmId || "");
    const lastSync = deliveryLastSyncRef.current || { farmId: "", pulse: -1 };
    const autoRefreshSinceLastOpen =
      currentFarmId !== String(lastSync.farmId || "") ||
      Number(autoRefreshPulse) > Number(lastSync.pulse ?? -1);
    const mustSync = !hasOrdersData || !hasDeliveryTables || autoRefreshSinceLastOpen;
    if (mustSync) {
      try {
        // Force NAV check only when needed (data missing or new auto-refresh since last open).
        await getPrices(false, true, ["orders", "deliverypage"], false, "delivery", true);
        deliveryLastSyncRef.current = {
          farmId: currentFarmId,
          pulse: Number(autoRefreshPulse),
        };
      } catch (error) {
        console.log("Delivery preload error", error);
      }
    }
    setShowfDlvr(true);
  };
  const handleButtonOptionsClick = () => {
    setInitialDataSet(JSON.parse(JSON.stringify(dataSet)));
    setNotifListInitial(JSON.stringify(dataSet.options.notifList));
    setShowOptions(true);
  };
  const handleButtonHelpClick = () => {
    setShowHelp(true);
  };
  const handleButtonIAClick = async (e) => {
    if (iaLoading) return;
    setIaLoading(true);
    try {
      const { tryitarrays: tryItArrays, tryitMode } = getTryitRequestPayload(dataSetFarmRef.current || {});
      const response = await fetch("/askia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "Quelle est la meilleure stratÃ©gie aujourd'hui ?",
          farmId: curID,
          options: dataSet.options,
          tryitarrays: tryItArrays,
          tryitMode,
          //context: context,
        }),
      });
      if (response.status) {
        const responseData = await response.json();
        handleTooltip("", "askIA", responseData.answer, e);
      }
    } catch (err) {
      handleTooltip("IA indisponible", "askIA", "", e);
    } finally {
      setIaLoading(false);
    }
  };
  const handleClosefTNFT = (xdataSet, xdataSetFarm) => {
    dataSet = xdataSet;
    const prevFarmState = dataSetFarmRef.current || {};
    const safeTryPayload = { ...(xdataSetFarm || {}) };
    delete safeTryPayload.ftrades;
    delete safeTryPayload.ftradesHeader;
    if (!Object.prototype.hasOwnProperty.call(safeTryPayload, "ftrades")) {
      safeTryPayload.ftrades = prevFarmState?.ftrades;
    }
    if (!Object.prototype.hasOwnProperty.call(safeTryPayload, "ftradesHeader")) {
      safeTryPayload.ftradesHeader = prevFarmState?.ftradesHeader;
    }
    const mergedFarmState = mergeFarmStateDeep(dataSetFarmRef.current || {}, safeTryPayload);
    mergeKnownHashesFromPayload(safeTryPayload, farmSectionHashesRef, farmTableHashesRef);
    dataSetFarmRef.current = mergedFarmState;
    setdataSetFarm(mergedFarmState);
    const canonicalTryitState = {
      itables: mergedFarmState?.itables || {},
      boostables: mergedFarmState?.boostables || {},
    };
    const tryitSnapshot = filterTryit(canonicalTryitState, true, tryitConfig);
    writeTryitSnapshot(tryitSnapshot, mergedFarmState?.frmid || dataSet?.options?.farmId || curID || "", {
      preserveEmptyTables: tryitStatefulPayloadKeys,
    });
    setdeliveriesData(mergedFarmState?.orderstable || []);
    setShowfTNFT(false);
    autoRefreshHasRunRef.current = true;
    autoRefreshLastPageRef.current = String(ui?.selectedInv || "home");
    if (pageSectionRequirements) {
      const closeRefreshUI = {
        ...ui,
        selectedInv: ui?.selectedInv || "home",
      };
      const activeSections = computeRequiredSections(closeRefreshUI, pageSectionRequirements);
      getPrices(false, false, activeSections, true, closeRefreshUI.selectedInv, true, "TRYNFT_CLOSE").catch((error) => {
        console.log("TryNFT close page refresh error", error);
      });
      postTryCloseCoverageRef.current = {
        page: String(closeRefreshUI.selectedInv || "home"),
        sections: [...new Set(activeSections)],
        signature: buildTryitCoverageSignature(getTryitRequestPayload(mergedFarmState)),
        updatedAt: Date.now(),
      };
    }
    if (!mergedFarmState?.ftrades && !mergedFarmState?.ftradesHeader) {
      getPrices(false, true, ["trades"]).catch((error) => {
        console.log("TryNFT close trades sync error", error);
      });
    }
    //setCookie();
    pendingSaveRef.current = true;
  };
  const handleRefreshfTNFT = (xdataSet, xdataSetFarm) => {
    dataSet = xdataSet;
    const prevFarmState = dataSetFarmRef.current || {};
    const safeTryPayload = { ...(xdataSetFarm || {}) };
    delete safeTryPayload.ftrades;
    delete safeTryPayload.ftradesHeader;
    if (!Object.prototype.hasOwnProperty.call(safeTryPayload, "ftrades")) {
      safeTryPayload.ftrades = prevFarmState?.ftrades;
    }
    if (!Object.prototype.hasOwnProperty.call(safeTryPayload, "ftradesHeader")) {
      safeTryPayload.ftradesHeader = prevFarmState?.ftradesHeader;
    }
    const mergedFarmState = mergeFarmStateDeep(dataSetFarmRef.current || {}, safeTryPayload);
    mergeKnownHashesFromPayload(safeTryPayload, farmSectionHashesRef, farmTableHashesRef);
    dataSetFarmRef.current = mergedFarmState;
    setdataSetFarm(mergedFarmState);
    const canonicalTryitState = {
      itables: mergedFarmState?.itables || {},
      boostables: mergedFarmState?.boostables || {},
    };
    const tryitSnapshot = filterTryit(canonicalTryitState, true, tryitConfig);
    writeTryitSnapshot(tryitSnapshot, mergedFarmState?.frmid || dataSet?.options?.farmId || curID || "", {
      preserveEmptyTables: tryitStatefulPayloadKeys,
    });
    if (!mergedFarmState?.ftrades && !mergedFarmState?.ftradesHeader) {
      getPrices(false, true, ["trades"]).catch((error) => {
        console.log("TryNFT refresh trades sync error", error);
      });
    }
    //setCookie();
    pendingSaveRef.current = true;
  };
  const handleClosefGraph = () => {
    setShowfGraph(false);
  };
  const handleClosefDlvr = () => {
    setShowfDlvr(false);
  };
  const handleCloseOptions = () => {
    setShowOptions(false);
    setCookie();
    if (notifListInitial && JSON.stringify(dataSet.options.notifList) !== notifListInitial) {
      UpdateNotifList();
    }
  };
  const handleCloseHelp = () => {
    setShowHelp(false);
  };
  const handleCloseCadre = () => {
    setShowCadre(false);
  };
  const handleCloseTryProfileSummary = () => {
    setSharedTryProfile(null);
    clearTryProfileFromUrl();
  };
  function buildDisabledNotifItems() {
    return (dataSet.options?.notifList || [])
      .filter(([, enabled]) => Number(enabled) !== 1)
      .map(([key]) => key);
  }
  function buildAuctionWatchEntries(source = dataSet.options?.auctionNotifSelection) {
    const farmKey = String(dataSetFarm?.frmid || dataSet.options?.farmId || curID || "").trim();
    const allSelections = (source && typeof source === "object") ? source : {};
    const src = farmKey && allSelections?.[farmKey] && typeof allSelections[farmKey] === "object"
      ? allSelections[farmKey]
      : {};
    return Object.entries(src)
      .map(([auctionId, rawEntry]) => {
        const entry = (rawEntry && typeof rawEntry === "object") ? rawEntry : {};
        const endAt = Number(entry?.e ?? entry?.endAt ?? 0);
        const label = String(entry?.l ?? entry?.label ?? "").trim();
        const id = String(auctionId || entry?.id || "").trim();
        if (!id || !Number.isFinite(endAt) || endAt <= Date.now()) return null;
        return { id, e: endAt, l: label || id };
      })
      .filter(Boolean)
      .sort((a, b) => Number(a.e || 0) - Number(b.e || 0));
  }
  async function subscribeToPush(options = {}) {
    const forceWebRenew = options?.forceWebRenew === true;
    /* if (!dataSet.options.useNotifications) {
      return;
    } */
    try {
      if (isNativeApp) {
        const permStatus = await PushNotifications.requestPermissions();
        if (permStatus.receive === 'granted') {
          if (!nativePushListenersBoundRef.current) {
            nativePushListenersBoundRef.current = true;
            PushNotifications.addListener('registration', async (token) => {
              console.log('FCM token:', token.value);
              dataSet.options.pushToken = token.value;
              setCookie();
              const subfarm = {
                farmId: curID,
                deviceId: deviceIdRef.current,
                token: token.value,
                type: 'fcm',
                notifOffItems: buildDisabledNotifItems(),
                auctionWatch: buildAuctionWatchEntries()
              };
              await fetch('/save-subscription', {
                method: 'POST',
                body: JSON.stringify(subfarm),
                headers: { 'Content-Type': 'application/json' },
              });
              console.log('FCM subscription saved');
            });
            PushNotifications.addListener('registrationError', (err) => {
              console.error('FCM registration error:', err);
              promptInfo("Unable to activate notifications on this device right now.", "Notifications", "OK");
            });
          }
          await PushNotifications.register();
        } else {
          console.warn('Push permission not granted');
          await promptInfo("Notification permission was not granted on this device.", "Notifications", "OK");
          return false;
        }
      } else {
        function urlBase64ToUint8Array(base64String) {
          const padding = '='.repeat((4 - base64String.length % 4) % 4);
          const base64 = (base64String + padding)
            .replace(/\-/g, '+').replace(/_/g, '/');

          const rawData = atob(base64);
          return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
        }
        if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
          await promptInfo("This browser does not fully support push notifications.", "Notifications", "OK");
          return false;
        }
        const browserPermission = await Notification.requestPermission();
        if (browserPermission !== "granted") {
          await promptInfo("Browser notification permission was not granted.", "Notifications", "OK");
          return false;
        }
        const registration = await navigator.serviceWorker.ready;
        const webPushK = process.env.REACT_APP_WEBPUSH_PUBLICKEY;
        if (!webPushK) {
          throw new Error("Missing REACT_APP_WEBPUSH_PUBLICKEY");
        }
        const applicationServerKey = urlBase64ToUint8Array(webPushK);
        const subscribeWebPush = async (renewExisting = false) => {
          let subscription = await registration.pushManager.getSubscription();
          if (subscription && renewExisting) {
            try {
              await subscription.unsubscribe();
            } catch (error) {
              console.warn("Unable to unsubscribe existing web push subscription before renew:", error);
            }
            subscription = null;
          }
          if (!subscription) {
            subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey
            });
          }
          return subscription;
        };
        let subscription;
        try {
          subscription = await subscribeWebPush(forceWebRenew);
        } catch (firstError) {
          console.warn("Initial web push subscription attempt failed, retrying with forced renew:", {
            name: firstError?.name,
            message: firstError?.message,
          });
          subscription = await subscribeWebPush(true);
        }
        const subscriptionJson = subscription?.toJSON ? subscription.toJSON() : null;
        if (!subscriptionJson?.endpoint) {
          throw new Error("Invalid web push subscription payload");
        }
        const subfarm = {
          farmId: curID,
          deviceId: deviceIdRef.current,
          subscription: subscriptionJson,
          type: 'web',
          notifOffItems: buildDisabledNotifItems(),
          auctionWatch: buildAuctionWatchEntries()
        }
        const response = await fetch('/save-subscription', {
          method: 'POST',
          body: JSON.stringify(subfarm),
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
          throw new Error(`save-subscription failed (${response.status})`);
        }
        console.log('Notif on');
      }
      return true;
    } catch (error) {
      const isBraveBrowser = !isNativeApp && await detectBraveBrowser();
      console.error('subscribeToPush error:', {
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      });
      if (isBraveBrowser) {
        await promptInfo(
          "Brave accepted the site permission but is still blocking web push. In Brave, open brave://settings/privacy and enable 'Use Google services for push messaging', then restart Brave and try again.",
          "Notifications",
          "OK"
        );
      } else {
        await promptInfo("Unable to activate notifications right now on this device/browser.", "Notifications", "OK");
      }
      return false;
    }
  }
  async function UpdateNotifList() {
    const subfarm = {
      farmId: dataSetFarm?.frmid || dataSet.options?.farmId || curID,
      deviceId: deviceIdRef.current,
      type: isNativeApp ? 'fcm' : 'web',
      notifOffItems: buildDisabledNotifItems(),
      auctionWatch: buildAuctionWatchEntries()
    }
    await fetch('/notiflist-subscription', {
      method: 'POST',
      body: JSON.stringify(subfarm),
      headers: { 'Content-Type': 'application/json' },
    });
    //console.log('FCM subscription saved');
  }
  async function UpdateAuctionNotifList(auctionWatchInput = null) {
    const subfarm = {
      farmId: dataSetFarm?.frmid || dataSet.options?.farmId || curID,
      deviceId: deviceIdRef.current,
      type: isNativeApp ? 'fcm' : 'web',
      auctionWatch: Array.isArray(auctionWatchInput) ? auctionWatchInput : buildAuctionWatchEntries()
    };
    await fetch('/auctionlist-subscription', {
      method: 'POST',
      body: JSON.stringify(subfarm),
      headers: { 'Content-Type': 'application/json' },
    });
  }
  async function unsubscribeFromPush() {
    if (isNativeApp) {
      const token = dataSet.options.pushToken; //await getFCMToken();
      const subfarm = {
        farmId: curID,
        deviceId: deviceIdRef.current,
        type: 'fcm'
      };
      if (token) {
        subfarm.token = token;
      }
      await fetch('/remove-subscription', {
        method: 'POST',
        body: JSON.stringify(subfarm),
        headers: { 'Content-Type': 'application/json' },
      });
      dataSet.options.pushToken = "";
      setCookie();
      console.log(token ? 'FCM token removed' : 'FCM subscription removal requested');
    } else {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
      }
      const subfarm = {
        farmId: curID,
        deviceId: deviceIdRef.current,
        type: 'web'
      };
      if (subscription) {
        subfarm.subscription = subscription.toJSON();
      }
      await fetch('/remove-subscription', {
        method: 'POST',
        body: JSON.stringify(subfarm),
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(subscription ? 'Notif off' : 'Web subscription removal requested');
    }
  }
  async function checkDeviceSubscriptionStatus(farmId) {
    const subfarm = {
      farmId,
      deviceId: deviceIdRef.current,
    };
    const response = await fetch('/subscription-status', {
      method: 'POST',
      body: JSON.stringify(subfarm),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Subscription status error (${response.status})`);
    }
    return response.json();
  }
  async function handleNotificationToggle(nextValue, options = {}) {
    const fromUserGesture = options?.fromUserGesture === true;
    const farmId = String(curID || dataSet.options?.farmId || "").trim();
    if (!curID) {
      setOptionField("useNotifications", nextValue);
      return;
    }
    if (!nextValue) {
      setOptionField("useNotifications", false);
      resetMultiFarmNotifPromptLocal();
      await unsubscribeFromPush();
      setNotifFarmEnabledLocal(farmId, false);
      console.log("useNotif:", false);
      return;
    }
    if (isNativeApp) {
      setOptionField("useNotifications", true);
      const activated = await subscribeToPush();
      setNotifFarmEnabledLocal(farmId, activated);
      console.log("useNotif:", activated);
      return;
    }
    if (!fromUserGesture) {
      setOptionField("useNotifications", false);
      setNotifFarmEnabledLocal(farmId, false);
      setShowOptions(true);
      await promptInfo(
        "Browser notifications must be activated from a direct click in Options. Tick Notifications again to reactivate them.",
        "Notifications",
        "OK"
      );
      return;
    }
    setOptionField("useNotifications", true);
    let activated = false;
    notifActivationInFlightRef.current = true;
    try {
      activated = await subscribeToPush();
    } finally {
      notifActivationInFlightRef.current = false;
    }
    if (!activated) {
      setOptionField("useNotifications", false);
    }
    setNotifFarmEnabledLocal(farmId, activated);
    console.log("useNotif:", activated);
  }

  const handleUIChange = (e) => {
    if (!e || !e.target) return;
    const t = e.target;
    const name = t.name;
    if (!name) return;
    let value;
    if (t.type === "checkbox") {
      if (name.includes(".")) {
        const [root, key] = name.split(".", 2);
        setUI(prev => ({
          ...(prev ?? {}),
          [root]: {
            ...(prev?.[root] ?? {}),
            [key]: !!t.checked,
          },
        }));
        return;
      } else value = !!t.checked;
    } else value = t.value;

    if (name.includes(":")) {
      const [root, item] = name.split(":", 2);
      setdataSetFarm(prev => {
        const tableContainers = [
          {
            get: (p) => p?.itables,
            set: (p, tables) => ({ ...(p || {}), itables: tables }),
          },
          {
            get: (p) => p?.invData?.itables,
            set: (p, tables) => ({
              ...(p || {}),
              invData: { ...(p?.invData || {}), itables: tables },
            }),
          },
          {
            get: (p) => p?.cookData?.itables,
            set: (p, tables) => ({
              ...(p || {}),
              cookData: { ...(p?.cookData || {}), itables: tables },
            }),
          },
          {
            get: (p) => p?.fishData?.itables,
            set: (p, tables) => ({
              ...(p || {}),
              fishData: { ...(p?.fishData || {}), itables: tables },
            }),
          },
          {
            get: (p) => p?.bountyData?.itables,
            set: (p, tables) => ({
              ...(p || {}),
              bountyData: { ...(p?.bountyData || {}), itables: tables },
            }),
          },
          {
            get: (p) => p?.craftData?.itables,
            set: (p, tables) => ({
              ...(p || {}),
              craftData: { ...(p?.craftData || {}), itables: tables },
            }),
          },
          {
            get: (p) => p?.flowerData?.itables,
            set: (p, tables) => ({
              ...(p || {}),
              flowerData: { ...(p?.flowerData || {}), itables: tables },
            }),
          },
          {
            get: (p) => p?.expandPageData?.itables,
            set: (p, tables) => ({
              ...(p || {}),
              expandPageData: { ...(p?.expandPageData || {}), itables: tables },
            }),
          },
        ];
        const allTables = tableContainers.map((container) => container.get(prev) || {});
        const it = allTables.map((t) => t?.it).find((t) => t && Object.keys(t).length > 0) || {};
        const food = allTables.map((t) => t?.food).find((t) => t && Object.keys(t).length > 0) || {};
        const pfood = allTables.map((t) => t?.pfood).find((t) => t && Object.keys(t).length > 0) || {};
        let tableKey = null;
        if (it[item]) tableKey = "it";
        else if (food[item]) tableKey = "food";
        else if (pfood[item]) tableKey = "pfood";
        else return prev;
        let current = {};
        for (let i = 0; i < tableContainers.length; i++) {
          const tables = tableContainers[i].get(prev) || {};
          if (tables?.[tableKey]?.[item]) {
            current = tables[tableKey][item];
            break;
          }
        }
        const nextBinary = value ? 1 : 0;
        if (root === "cookit" && nextBinary === 0 && Number(current?.cookit) === 1) {
          const foodCount = Object.values(food).reduce((acc, obj) => acc + (Number(obj?.cookit) === 1 ? 1 : 0), 0);
          const pfoodCount = Object.values(pfood).reduce((acc, obj) => acc + (Number(obj?.cookit) === 1 ? 1 : 0), 0);
          if ((foodCount + pfoodCount) <= 1) return prev;
        }
        const nextItem = {
          ...current,
          [root]: nextBinary,
        };
        const next = { ...(prev || {}) };
        let updated = next;
        tableContainers.forEach((container) => {
          const tables = container.get(updated) || {};
          const table = tables?.[tableKey] || {};
          if (!table[item]) return;
          const nextTables = {
            ...tables,
            [tableKey]: {
              ...table,
              [item]: nextItem,
            },
          };
          updated = container.set(updated, nextTables);
        });
        return updated;
      });
      pendingTryitSnapshotRef.current = true;
      pendingSaveRef.current = true;
      return;
    }

    if (name.includes(".")) {
      const [root, key] = name.split(".", 2);
      const parsedValue = String(value ?? "").trim();
      const isHarvestCounter = root === "xHrvst" || root === "xHrvsttry";
      const parsed = isHarvestCounter
        ? Number(parsedValue.replace(/[^0-9.]/g, ""))
        : parseInt(parsedValue.replace(/\D/g, ""), 10);
      const normalized = Number.isFinite(parsed) ? parsed : 0;

      setUI(prev => ({
        ...(prev ?? {}),
        [root]: {
          ...(prev?.[root] ?? {}),
          [key]: normalized,
        },
      }));
      return;
    }

    setUI(prev => ({ ...(prev ?? {}), [name]: value }));
  };
  const setUIField = (name, valueOrUpdater) => {
    setUI((prev) => {
      const prevValue = prev?.[name];
      const nextValue =
        typeof valueOrUpdater === "function"
          ? valueOrUpdater(prevValue)
          : valueOrUpdater;
      return {
        ...(prev ?? {}),
        [name]: nextValue,
      };
    });
  };
  const setOptionField = (name, valueOrUpdater) => {
    setOptions((prev) => {
      const prevValue = prev?.[name];
      const nextValue =
        typeof valueOrUpdater === "function"
          ? valueOrUpdater(prevValue)
          : valueOrUpdater;
      const nextOptions = {
        ...(prev ?? {}),
        [name]: nextValue,
      };
      dataSet.options = nextOptions;
      setCookie();
      return nextOptions;
    });
  };

  const handleOptionChange = (eventOrValue, fieldName = null) => {
    let xvalue = 0;
    let name = "";
    if (eventOrValue?.target) {
      const t = eventOrValue.target;
      name = t.name;
      if (t.type === "checkbox") {
        xvalue = !!t.checked;
      } else {
        const raw = t.value;
        if (raw === null || raw === undefined || raw === "") {
          xvalue = 0;
        } else if (typeof raw === "number") {
          xvalue = raw;
        } else {
          if (name === "tradeTax") {
            xvalue = Number(String(raw).replace(/[^0-9.]/g, ""));
          } else {
            xvalue = Number(String(raw).replace(/\D/g, ""));
          }
        }
      }
    } else {
      xvalue = Number(eventOrValue);
      name = fieldName;
    }
    if (!name) {
      if (Array.isArray(eventOrValue)) {
        if (JSON.stringify(dataSet.options.notifList) !== JSON.stringify(eventOrValue)) {
          resetMultiFarmNotifPromptLocal();
          dataSet.options.notifList = eventOrValue;
          setOptions({ ...dataSet.options, notifList: eventOrValue });
          //UpdateNotifListDebounced();
        }
        return;
      }
      return;
    }
    /* let notifListTimeout;
    function UpdateNotifListDebounced() {
      clearTimeout(notifListTimeout);
      notifListTimeout = setTimeout(() => {
        UpdateNotifList();
      }, 300);
    } */
    if (isNaN(xvalue)) xvalue = 0;
    if (xvalue < 0) xvalue = 1;
    if (name.startsWith("animalLvl_")) {
      const animal = name.replace("animalLvl_", "");
      const newAnimalLvl = { ...(dataSet.options.animalLvl || {}), [animal]: xvalue };
      const newOptions = { ...dataSet.options, animalLvl: newAnimalLvl };
      dataSet.options = newOptions;
      setOptions(newOptions);
      return;
    }
    if (name === "useNotifications") {
      resetMultiFarmNotifPromptLocal();
      handleNotificationToggle(!!xvalue, { fromUserGesture: !!eventOrValue?.target });
      return;
    }
    switch (name) {
      case "FarmTime":
        if (xvalue > 24) xvalue = 24;
        dataSet.options.inputFarmTime = xvalue;
        setOptions({ ...dataSet.options });
        //setInputFarmTime(xvalue);
        break;
      case "CoinsRatio":
        dataSet.options.coinsRatio = xvalue;
        setOptions({ ...dataSet.options });
        //setInputCoinsRatio(xvalue);
        break;
      case "GemsRatio":
        dataSet.options.gemsRatio = xvalue;
        setOptions({ ...dataSet.options });
        //setInputGemsRatio(xvalue);
        break;
      default:
        try {
          if (name === "auctionNotifSelection") {
            resetMultiFarmNotifPromptLocal();
          }
          dataSet.options[name] = xvalue;
          setOptions({ ...dataSet.options });
        } catch (error) {
          console.error("Error updating option:" + name + ": ", error);
        }
      //console.warn("Champ inconnu :", name);
    }
    //setCookie();
  };
  const syncAuctionNotifSelection = async (selectionSource = null) => {
    if (!dataSet.options?.useNotifications) return;
    if (!curID) return;
    try {
      await UpdateAuctionNotifList(buildAuctionWatchEntries(selectionSource || dataSet.options?.auctionNotifSelection));
    } catch (error) {
      console.error("Error syncing auction notifications:", error);
    }
  };
  const scheduleAuctionNotifSelectionSync = (selectionSource = null) => {
    auctionNotifPendingSelectionRef.current = selectionSource || dataSet.options?.auctionNotifSelection || null;
    if (auctionNotifSyncTimerRef.current) {
      clearTimeout(auctionNotifSyncTimerRef.current);
    }
    auctionNotifSyncTimerRef.current = setTimeout(() => {
      auctionNotifSyncTimerRef.current = null;
      const pendingSelection = auctionNotifPendingSelectionRef.current;
      auctionNotifPendingSelectionRef.current = null;
      syncAuctionNotifSelection(pendingSelection);
    }, AUCTION_NOTIF_SYNC_DEBOUNCE_MS);
  };
  useEffect(() => {
    return () => {
      if (auctionNotifSyncTimerRef.current) {
        clearTimeout(auctionNotifSyncTimerRef.current);
        auctionNotifSyncTimerRef.current = null;
      }
    };
  }, []);
  function handleSetHrvMax(TryChecked) {
    const it = dataSetFarm?.itables?.it
      || dataSetFarm?.invData?.itables?.it
      || dataSetFarm?.cookData?.itables?.it;
    if (!it) return;
    const next = {};
    for (const item in it) {
      const dc = TryChecked
        ? (it[item]?.dailycycletry ?? it[item]?.dailycycle ?? 0)
        : (it[item]?.dailycycle ?? 0);

      if (dc > 0) next[item] = Number(dc);
    }
    setUI((prev) => ({
      ...prev,
      ...(TryChecked
        ? { xHrvsttry: next }
        : { xHrvst: next }),
    }));
  }
  const handleButtonClick = async (context = null) => {
    const registerLoadFarmSpamAttempt = () => {
      const nowTs = Date.now();
      const recent = (loadFarmSpamClickTimesRef.current || []).filter((ts) => (nowTs - ts) <= LOAD_FARM_SPAM_WINDOW_MS);
      recent.push(nowTs);
      loadFarmSpamClickTimesRef.current = recent;
      if (recent.length < LOAD_FARM_SPAM_THRESHOLD) return;
      if (loadFarmSpamPromptOpenRef.current) return;
      loadFarmSpamPromptOpenRef.current = true;
      loadFarmSpamClickTimesRef.current = [];
      promptInfo(
        "No need to spam this button. The server can take up to 20 seconds to provide up-to-date farm data. You have a 20-second auto-refresh on page load, so just wait for the data to update.",
        "Please wait",
        "Got it"
      ).finally(() => {
        loadFarmSpamPromptOpenRef.current = false;
      });
    };

    const { inputValue } = ui;
    if (inputValue === null || inputValue === "" || inputValue === 0) return;
    if (!pageSectionRequirements || !sectionPayloadKeys || !sectionTablePaths) {
      setReqState("Initialization in progress, please retry in a second.");
      return;
    }
    const now = Date.now();
    if (loadFarmRequestInFlightRef.current) {
      registerLoadFarmSpamAttempt();
      return;
    }
    if (now < loadFarmCooldownUntilRef.current) {
      registerLoadFarmSpamAttempt();
      return;
    }
    loadFarmSpamClickTimesRef.current = [];
    loadFarmRequestInFlightRef.current = true;
    loadFarmCooldownUntilRef.current = now + LOAD_FARM_COOLDOWN_MS;
    setcdButton(true);
    if (loadFarmCooldownTimerRef.current) {
      clearTimeout(loadFarmCooldownTimerRef.current);
    }
    loadFarmCooldownTimerRef.current = setTimeout(() => {
      if (!loadFarmRequestInFlightRef.current && Date.now() >= loadFarmCooldownUntilRef.current) {
        setcdButton(false);
      }
    }, LOAD_FARM_COOLDOWN_MS);
    activeTimers.forEach(timerId => {
      clearInterval(timerId);
    });
    try {
      //lastClickedInputValue.current = inputValue;
      const normalizedInputId = String(inputValue ?? "").trim();
      const currentLoadedFarmId = String(dataSetFarmRef.current?.frmid || dataSet?.options?.farmId || "").trim();
      const normalizedInputUsername = normalizedInputId.toLowerCase();
      const currentLoadedUsername = String(
        dataSet?.options?.username || dataSetFarmRef.current?.username || ""
      ).trim().toLowerCase();
      const keepCurrentViewWhileRefreshing = buttonClicked && normalizedInputId !== "" && (
        normalizedInputId === currentLoadedFarmId ||
        (normalizedInputUsername !== "" && normalizedInputUsername === currentLoadedUsername)
      );
      curID = inputValue;
      if (!keepCurrentViewWhileRefreshing) {
        farmSectionHashesRef.current = {};
        farmTableHashesRef.current = {};
        dataSetFarmRef.current = {};
        setdataSetFarm({});
      }
      const requiredSections = computeRequiredSections(ui, pageSectionRequirements);
      // Include trades on initial load to avoid an immediate extra NAV from HeaderTrades preload.
      const includeSections = [...new Set([...requiredSections, "trades"])];
      if (context === "EnterPressed") { setFarmData([]); }
      const { tryitarrays: tryItArrays, tryitMode } = getTryitRequestPayload(dataSetFarmRef.current || {});
      //setInputValue(lastClickedInputValue.current);
      const fetchFarmData = async (retryCount = 0) => {
        beginHeaderRequest();
        try {
          const response = await fetch(API_URL + "/getfarm", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              frmid: curID,
              deviceId: deviceIdRef.current,
              options: dataSet.options,
              tryitarrays: tryItArrays,
              tryitMode,
              include: includeSections,
              knownTableHashes: { ...(farmTableHashesRef.current || {}) },
              page: String(ui?.selectedInv || "home"),
              context: context || "manualLoad",
            }),
          });
          if (response.status === 202) {
            setReqState(
              <div>
                <img src="./icon/goblin_carry.gif" alt="Your farm is coming." />
                Your farm is coming.
              </div>
            );
            //console.log("Farm data not yet available. Retrying...");
            if (retryCount < 5) {
              setTimeout(() => fetchFarmData(retryCount + 1), 5000);
            } else {
              //console.error("Max retry attempts reached. Farm data still not available.");
              setReqState("Farm data not available after multiple attempts.");
            }
          } else if (response.status === 200) {
            const responseData = await response.json();
            if (Array.isArray(responseData?.priceData) && responseData.priceData.length > 0) {
              setpriceData(JSON.parse(JSON.stringify(responseData.priceData)));
              dataSet.options.usdSfl = responseData.priceData[2];
            }
            buttonClicked = true;
            setAutoRefreshNonce((v) => v + 1);
            dataSet.options.username = responseData.username;
            dataSet.options.farmId = responseData.frmid;
            dataSet.isBanned = responseData.frmData.isbanned ?
              <div style={{ color: "red", margin: "0", padding: "0" }}><img src={"./icon/ui/suspicious.png"} />
                <span>BANNED {responseData.frmData.isbannedstatus}</span></div>
              : "";
            dataSet.options.isAbo = responseData.isabo;
            dataSet.isVip = responseData.frmData.vip;
            dataSet.dateVip = responseData.frmData.datevip;
            dataSet.dailychest = responseData.frmData.dailychest;
            dataSet.taxFreeSFL = frmtNb(responseData.frmData.taxFreeSFL);
            dataSet.bumpkin = responseData.Bumpkin[0];
            //dateSeason = new Date(responseData.constants.dateSeason);
            dataSet.tktName = responseData.constants.tktName;
            dataSet.imgtkt = responseData.constants.imgtkt;
            //dataSet.options.tradeTax = responseData.tradeTax;
            if (!dataSet?.options?.tradeTax || dataSet?.options?.autoTradeTax) { dataSet.options.tradeTax = responseData.frmData.tradeTax; }
            if (dataSet?.options?.autoCoinRatio) { dataSet.options.coinsRatio = responseData.bestCoinRatio?.ratio || 0; }
            const shouldFetchBumpkin = (() => {
              if (selectedInv !== "home") return false;
              const currentFarmId = String(curID ?? "");
              const memoryImgFarmId = String(dataSet?.bumpkinImgFarmId ?? "");
              if (dataSet?.bumpkinImg && memoryImgFarmId === currentFarmId) return false;
              try {
                const storedDataRaw = localStorage.getItem("SFLManData");
                if (!storedDataRaw) return true;
                const storedData = JSON.parse(storedDataRaw);
                const cachedFarmId = String(storedData?.dataSet?.options?.farmId ?? storedData?.lastID ?? "");
                const cachedBumpkinImg = storedData?.dataSet?.bumpkinImg;
                if (cachedBumpkinImg && cachedFarmId === currentFarmId) {
                  dataSet.bumpkinImg = cachedBumpkinImg;
                  dataSet.bumpkinImgFarmId = currentFarmId;
                  return false;
                }
              } catch { }
              return true;
            })();
            if (shouldFetchBumpkin) {
              setBumpkinLoading(true);
              try {
                const response = await fetch(API_URL + "/getbumpkin", {
                  method: 'GET',
                  headers: {
                    //tokenuri: bumpkinData[0].tkuri,
                    //bknid: 1, //bumpkinData[0].id,
                    frmid: curID,
                    username: dataSet.options.username,
                    tknuri: dataSet.bumpkin.tkuri,
                  }
                });
                if (response.ok) {
                  const data = await response.json();
                  //bkn = data.responseBumpkin;
                  let imageData = data.responseImage;
                  //imageData = await magentaToAlpha(imageData, { r: 255, g: 0, b: 255, tol: 24 });
                  //setImageData(`data:image/png;base64,${imageData}`);
                  //dataSet.bumpkinImg = `data:image/png;base64,${imageData}`;
                  dataSet.bumpkinImg = imageData;
                  dataSet.bumpkinImgFarmId = String(curID ?? "");
                  //setBumpkinDataOC(data.responseBkn);
                  //bumpkinData[0].Bknlvl = data.Bknlvl;
                }
              } finally {
                setBumpkinLoading(false);
              }
            } else {
              setBumpkinLoading(false);
            }
            setReqState('');
            if (responseData?.sectionHashes && typeof responseData.sectionHashes === "object") {
              farmSectionHashesRef.current = {
                ...(farmSectionHashesRef.current || {}),
                ...responseData.sectionHashes,
              };
            }
            if (responseData?.tableHashes && typeof responseData.tableHashes === "object") {
              const knownFromPayload = extractReceivedTableHashes(responseData, responseData.tableHashes);
              farmTableHashesRef.current = {
                ...(farmTableHashesRef.current || {}),
                ...knownFromPayload,
              };
            }
            const mergedInitialFarm = mergeFarmStateDeep(dataSetFarmRef.current || {}, responseData);
            dataSetFarmRef.current = mergedInitialFarm;
            setFarmData(mergedInitialFarm.frmData);
            setBumpkinData(mergedInitialFarm.Bumpkin);
            setUIField("selectedExpandType", responseData.frmData.expandData.type);
            //setUIField("selectedInv", "home");
            //setSelectedExpandType(responseData.frmData.expandData.type);
            //setfromtoexpand(responseData.expandData);
            getFromToExpand(fromexpand || 1, toexpand || 10, responseData.frmData.expandData.type);
            //setanimalData(responseData.Animals);
            refreshDataSet(mergedInitialFarm);
            const { frmData, expandData, Fish, taxFreeSFL } = mergedInitialFarm;
            dataSet.balance = getBalanceValue(frmData.balance, "sfl");
            dataSet.coins = getBalanceValue(frmData.balance, "coins");
            const balance = getBalanceValue(frmData.balance, "sfl");
            const withdrawreduc = (expandData?.type === "desert" || expandData?.type === "spring" || expandData?.type === "volcano") ? 2.5 : 0;
            const withdrawtax = (balance < 10 ? 30 : balance < 100 ? 25 : balance < 1000 ? 20 : balance < 5000 ? 15 : 10) - withdrawreduc;
            dataSet.withdrawtax = withdrawtax;
            const withdrawSFLbeyondTaxFree = Number(taxFreeSFL) - Number(balance);
            const withdrawsflFree = (withdrawSFLbeyondTaxFree < 0) ? Number(taxFreeSFL) : Number(balance);
            const withdrawsflNotFree = (withdrawsflFree >= Number(balance)) ? 0 : (Number(balance) - withdrawsflFree);
            const withdrawSflNotFreeTaxed = (withdrawsflNotFree > 0) ? (withdrawsflNotFree - (withdrawsflNotFree * (withdrawtax / 100))) : 0;
            const sflwithdraw = frmtNb(withdrawsflFree + withdrawSflNotFreeTaxed);
            dataSet.sflwithdraw = sflwithdraw;
            const xfishcastmax = Fish && (!TryChecked ? Fish.CastMax : Fish.CastMaxtry);
            const xfishcost = Fish && ((!TryChecked ? Fish.CastCost : Fish.CastCosttry) / dataSet.options.coinsRatio);
            dataSet.fishcasts = Fish && (Fish.casts + "/" + xfishcastmax);
            dataSet.fishcosts = Fish && (parseFloat(Fish.casts * xfishcost).toFixed(3) + "/" + parseFloat(xfishcastmax * xfishcost).toFixed(3));
            setdataSetFarm({ ...mergedInitialFarm });
            dataSet.updated = formatUpdated(frmData?.updated);
            if (dataSet.options.firstLoad) {
              dataSet.options.firstLoad = false
              handleButtonHelpClick();
            }
            if (context === "optionChanged") {

            }
            if (mergedInitialFarm.mutantsHeader || mergedInitialFarm.mutantchickens) {
              setMutants(mergedInitialFarm);
            }
            //setRefresh(new Date().getMilliseconds());
            setdeliveriesData(mergedInitialFarm.orderstable);
            setCookie();
          } else {
            setReqState(await formatHttpErrorMessage(response, "/getfarm"));
            dataSet.updated = formatUpdated(farmData?.updated);
            const newdataSetFarm = { ...dataSetFarm };
            setdataSetFarm(newdataSetFarm);
            //console.error("Error fetching farm data:", response.status);
          }
        } catch (error) {
          //setReqState(`Error : ${response.status}`);
          //console.error("Error during fetchFarmData:", error);
          setBumpkinLoading(false);
          setReqState(`Error : ${error.message}`);
          dataSet.updated = formatUpdated(farmData?.updated);
          const newdataSetFarm = { ...dataSetFarm };
          setdataSetFarm(newdataSetFarm);
          throw (error);
        } finally {
          endHeaderRequest();
        }
      };
      await fetchFarmData();
      /* if (selectedInv === "activity") {
        getActivity();
      } */
      lastID = curID;
    } catch (error) {
      //setReqState(`Error : ${error}`);
      throw (error);
      //console.log(`Error : ${error}`);
      //localStorage.clear();
      //console.log("Error, cleared local data");
    } finally {
      loadFarmRequestInFlightRef.current = false;
      if (loadFarmCooldownTimerRef.current) {
        clearTimeout(loadFarmCooldownTimerRef.current);
      }
      const remainingCooldown = Math.max(0, loadFarmCooldownUntilRef.current - Date.now());
      loadFarmCooldownTimerRef.current = setTimeout(() => {
        if (!loadFarmRequestInFlightRef.current && Date.now() >= loadFarmCooldownUntilRef.current) {
          setcdButton(false);
        }
      }, remainingCooldown);
    }
  };

  const handleTraderClick = () => {
    setGraphType("Marketplace");
    setShowfGraph(true);
  };
  const handleNiftyClick = () => {
    setGraphType("Nifty");
    setShowfGraph(true);
  };
  const handleOSClick = () => {
    setGraphType("OpenSea");
    setShowfGraph(true);
  };
  const handleTradeListClick = async (frmid, element, platform) => {
    platformListings = platform;
    if (platformListings === "OS") {
      const response = await fetch(API_URL + "/get50listing", {
        method: 'GET',
        headers: {
          frmid: frmid,
          listid: element,
          platform: platform,
        }
      });
      if (response.ok) {
        try {
          const responseData = await response.json();
          if (responseData !== 'error') {
            //const responseData = response.body;
            setlistingsData(responseData);
            setShowCadre(true);
            //console.log(responseData);
          }
        } catch (error) {
          console.log(error)
        }
      } else {
        console.log(response);
      }
    }
  }
  const handleAdminClick = async (event) => {
    const farmId = Number(dataSetFarm?.frmid || dataSet?.options?.farmId || 0);
    if (farmId !== 1972) { return; }
    try {
      setAdminLoading(true);
      const responseData = await fetchAdminView({ mode: "summary" }, true);
      setAdminData(responseData);
      setShowAdmin(true);
      setReqState("");
    } catch (error) {
      const msg = String(error?.message || "Admin error");
      if (msg.toLowerCase().includes("cancelled")) { return; }
      setReqState(msg);
    } finally {
      setAdminLoading(false);
    }
  };
  const requestVipPayment = async ({ farmId, username, isAbo, vipExpiresAt, tokenSymbol }) => {
    const response = await fetch(API_URL + "/request-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        farmId: Number(farmId || 0),
        username: String(username || ""),
        isAbo: !!isAbo,
        vipExpiresAt: vipExpiresAt || null,
        tokenSymbol: String(tokenSymbol || "USDC").toUpperCase(),
      }),
    });
    if (!response.ok) {
      const message = await formatHttpErrorMessage(response, "/request-payment");
      throw new Error(message);
    }
    return await response.json();
  };
  const confirmVipPayment = async ({ paymentId, txHash }) => {
    const response = await fetch(API_URL + "/confirm-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        paymentId: String(paymentId || ""),
        txHash: String(txHash || ""),
      }),
    });
    if (!response.ok) {
      const message = await formatHttpErrorMessage(response, "/confirm-payment");
      throw new Error(message);
    }
    return await response.json();
  };
  const handleVipClick = async () => {
    const farmId = Number(dataSetFarm?.frmid || dataSet?.options?.farmId || 0);
    if (!farmId || farmId === 1972) { return; }
    const username = String(dataSet?.options?.username || dataSetFarm?.username || "");
    const isAbo = !!dataSet?.options?.isAbo;
    const vipExpiresAt = dataSet?.dateVip || dataSetFarm?.frmData?.datevip || 0;
    const action = await promptChoice(
      formatVipPromptMessage({ farmId, username, isAbo, vipExpiresAt }),
      "VIP",
      [
        { value: "usdc", label: "Donate in USDC", primary: true, iconSrc: "./usdc.png" },
        { value: "flower", label: "Donate in FLOWER", iconSrc: "./icon/res/flowertoken.webp" },
        { value: "close", label: "Close" },
      ]
    );
    if (action !== "usdc" && action !== "flower") return;
    try {
      setVipLoading(true);
      const responseData = await requestVipPayment({
        farmId,
        username,
        isAbo,
        vipExpiresAt,
        tokenSymbol: action === "flower" ? "FLOWER" : "USDC",
      });
      const paymentAction = await promptChoice(
        String(responseData?.message || `Payment request sent for farm ${farmId}.`),
        "VIP",
        [
          { value: "paid", label: "I donated on Polygon", primary: true },
          { value: "close", label: "Close" },
        ]
      );
      if (paymentAction !== "paid") {
        setReqState("");
        return;
      }
      const txHash = await promptInput(
        "Paste the PolygonScan link or the transaction hash.",
        "VIP",
        "0x... or https://polygonscan.com/tx/...",
        "",
        "Validate",
        "Cancel"
      );
      if (txHash === null) {
        setReqState("");
        return;
      }
      const confirmation = await confirmVipPayment({
        paymentId: responseData?.paymentId,
        txHash,
      });
      dataSet.options.isAbo = true;
      setdataSetFarm((prev) => ({ ...(prev || {}), isabo: true }));
      try {
        await handleButtonClick("manualLoad");
      } catch {
        // Keep the confirmation visible even if the refresh fails.
      }
      await promptInfo(
        String(confirmation?.message || `Payment confirmed for farm ${farmId}.`),
        "VIP",
        "Close"
      );
      setReqState("");
    } catch (error) {
      const msg = String(error?.message || "VIP error");
      setReqState(msg);
      await promptInfo(msg, "VIP", "Close");
    } finally {
      setVipLoading(false);
    }
  };
  const fetchAdminView = async (payload = {}, allowPrompt = true) => {
    let response = await fetch(API_URL + "/getadminstats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload || {}),
    });
    if (response.status === 401 && allowPrompt) {
      const password = await promptPass();
      if (password === null) {
        throw new Error("Admin login cancelled");
      }
      const loginResponse = await fetch(API_URL + "/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      if (!loginResponse.ok) {
        const loginMsg = await formatHttpErrorMessage(loginResponse, "/admin/login");
        throw new Error(loginMsg);
      }
      response = await fetch(API_URL + "/getadminstats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload || {}),
      });
    }
    if (!response.ok) {
      const message = await formatHttpErrorMessage(response, "/getadminstats");
      throw new Error(message);
    }
    return await response.json();
  };
  const handleTooltip = async (item, context, value, event) => {
    try {
      const currentCell = event?.currentTarget?.closest?.(".tooltipcell");
      if (currentCell) {
        currentCell.classList.remove("tooltipcell-hover");
        if (hoveredTooltipCellRef.current === currentCell) {
          hoveredTooltipCellRef.current = null;
        }
      }
      const { clientX, clientY } = event;
      let bdrag = true;
      if (context === "trades") { bdrag = false }
      if (context === "username") { bdrag = false }
      if (context === "askIA") { bdrag = false }
      setTooltipData({
        x: clientX,
        y: clientY,
        item,
        context,
        value,
        bdrag
      });
      //console.log(item, context, value, event);
    } catch (error) {
      console.log(error)
    }
  }
  const clearHoveredTooltipCell = () => {
    if (!hoveredTooltipCellRef.current) return;
    hoveredTooltipCellRef.current.classList.remove("tooltipcell-hover");
    hoveredTooltipCellRef.current = null;
  };
  const setHoveredTooltipCell = (cell) => {
    if (cell === hoveredTooltipCellRef.current) return;
    clearHoveredTooltipCell();
    if (!cell || !document.body.contains(cell)) return;
    cell.classList.add("tooltipcell-hover");
    hoveredTooltipCellRef.current = cell;
  };
  const handleTooltipCellMouseOver = (event) => {
    const cell = event.target?.closest?.(".tooltipcell") || null;
    if (!cell) return;
    setHoveredTooltipCell(cell);
  };
  const handleTooltipCellMouseOut = (event) => {
    const currentCell = event.target?.closest?.(".tooltipcell") || null;
    if (!currentCell || hoveredTooltipCellRef.current !== currentCell) return;
    const nextCell = event.relatedTarget?.closest?.(".tooltipcell") || null;
    if (nextCell === currentCell) return;
    if (nextCell) {
      setHoveredTooltipCell(nextCell);
      return;
    }
    clearHoveredTooltipCell();
  };
  const handleDonClick = (address, element) => {
    const textarea = document.createElement('textarea');
    textarea.value = address;
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    if (success) {
      const tooltip = document.createElement('div');
      tooltip.classList.add('tooltipfrmid');
      tooltip.textContent = address + ' copied !';
      const rect = element.getBoundingClientRect();
      tooltip.style.top = rect.top + 40 + 'px';
      tooltip.style.left = rect.left - 70 + 'px';
      document.body.appendChild(tooltip);
      setTimeout(() => {
        document.body.removeChild(tooltip);
      }, 2000);
      document.body.removeChild(textarea);
    };
  }

  const data = useMemo(() => ({
    dataSet,
    dataSetFarm,
    farmData,
    bumpkinData,
    bumpkinLoading,
    priceData,
    tooltipData
  }), [
    dataSet,
    dataSetFarm,
    farmData,
    bumpkinData,
    bumpkinLoading,
    priceData,
    tooltipData
  ]);
  useEffect(() => {
    return () => {
      clearHoveredTooltipCell();
    };
  }, []);
  const config = useMemo(() => ({
    API_URL,
    tryitConfig,
  }), [
    API_URL,
    tryitConfig,
  ]);
  const actions = useMemo(() => ({
    handleUIChange,
    handleOptionChange,
    setUIField,
    setOptionField,
    syncAuctionNotifSelection: scheduleAuctionNotifSelectionSync,
    handleTooltip,
    handleHomeClic,
    handleTraderClick,
    handleNiftyClick,
    handleOSClick,
    handleTradeListClick,
    handleRefreshfTNFT,
    handleSetHrvMax,
    handleInvBuyRefresh
  }), [
    handleUIChange,
    handleOptionChange,
    setUIField,
    setOptionField,
    scheduleAuctionNotifSelectionSync,
    handleTooltip,
    handleHomeClic,
    handleTraderClick,
    handleNiftyClick,
    handleOSClick,
    handleTradeListClick,
    handleRefreshfTNFT,
    handleSetHrvMax,
    handleInvBuyRefresh
  ]);
  const img = useMemo(() => ({
    imgsfl,
    imgSFL,
    imgcoins,
    imgCoins,
    imgxp,
    imgrdy,
    imgwinter,
    imgspring,
    imgsummer,
    imgautumn,
    imgcrop,
    imgwood,
    imgstone,
    imgbeehive,
    imgcow,
    imgsheep,
    imgflowerbed,
    imgchkn,
    imgpet,
    imgcrustacean,
    imgexchng,
    imgExchng,
    imgbuyit,
    imgna,
    imgrod,
  }), [
    imgsfl,
    imgSFL,
    imgcoins,
    imgCoins,
    imgxp,
    imgrdy,
    imgwinter,
    imgspring,
    imgsummer,
    imgautumn,
    imgcrop,
    imgwood,
    imgstone,
    imgbeehive,
    imgcow,
    imgsheep,
    imgflowerbed,
    imgchkn,
    imgpet,
    imgcrustacean,
    imgexchng,
    imgExchng,
    imgbuyit,
    imgna,
    imgrod,
  ]);
  const ctx = useMemo(() => ({ data, config, ui, actions, img }), [data, config, ui, actions, img]);

  function PBarSFL() {
    const maxh = 255;
    if (hasBalanceData(farmData.balance)) {
      const previousQuantity = getBalanceValue(farmData.previousBalance, "sfl");
      const Quantity = getBalanceValue(farmData.balance, "sfl");
      const difference = Quantity - previousQuantity;
      const absDifference = Math.abs(difference);
      const isNegativeDifference = difference < 0;
      const hoardPercentage = Math.floor((absDifference / maxh) * 100);
      return (
        hoardPercentage > 0 && (
          <div className={`progress-barb ${isNegativeDifference ? 'negative' : ''}`}>
            <div className="progress" style={{ width: `${hoardPercentage}%` }}>
              <span className="progress-text">
                {isNegativeDifference ? frmtNb(absDifference) : `${frmtNb(difference)}/${frmtNb(maxh)}`}
              </span>
            </div>
          </div>
        )
      );
    }
  }
  async function getPrices(onlyPrices, withSectionLoader = false, forcedSections = null, forceRecalc = false, forcedPage = null, alwaysCheckServer = false, requestTag = "") {
    if (!onlyPrices && (!pageSectionRequirements || !sectionPayloadKeys || !sectionTablePaths)) {
      setReqState(sectionsMetaError || "Config sections manquante");
      return;
    }
    const currentFarmState = dataSetFarmRef.current || {};
    const { tryitarrays: tryItArrays, tryitMode } = getTryitRequestPayload(currentFarmState);
    const includeSource = (Array.isArray(forcedSections) && forcedSections.length > 0)
      ? forcedSections
      : computeRequiredSections(ui, pageSectionRequirements);
    const requestedPage = (forcedPage !== null && forcedPage !== undefined && String(forcedPage).trim() !== "")
      ? String(forcedPage).trim()
      : ((Array.isArray(forcedSections) && forcedSections.length === 1)
        ? String(forcedSections[0])
        : String(ui?.selectedInv || "home"));
    const includeSet = new Set(includeSource);
    if (!withSectionLoader) {
      includeSet.add("trades");
      includeSet.add("core");
    }
    if (!onlyPrices && showfDlvr) {
      includeSet.add("orders");
      includeSet.add("deliverypage");
    }
    const include = [...includeSet];
    const includeMissingOnly = include.filter((section) =>
      !hasSectionData(currentFarmState, section, sectionPayloadKeys, sectionTablePaths)
    );
    const includeToRequest = (withSectionLoader && !forceRecalc && !alwaysCheckServer)
      ? includeMissingOnly
      : include;
    const hasAllRequestedSectionsLocal = includeMissingOnly.length < 1;
    const hasAllIncludeToRequestLocal = includeToRequest.every((section) =>
      hasSectionData(currentFarmState, section, sectionPayloadKeys, sectionTablePaths)
    );
    if (!onlyPrices && withSectionLoader && !forceRecalc && !alwaysCheckServer && hasAllRequestedSectionsLocal) {
      setReqState('');
      return;
    }
    if (!onlyPrices && withSectionLoader) {
      setSectionsLoading(true);
    }
    const knownHashes = { ...(farmSectionHashesRef.current || {}) };
    const knownTableHashes = { ...(farmTableHashesRef.current || {}) };
    includeToRequest.forEach((section) => {
      if (!hasSectionData(currentFarmState, section, sectionPayloadKeys, sectionTablePaths)) {
        delete knownHashes[section];
        const missingSectionPaths = Array.isArray(sectionTablePaths?.[section])
          ? sectionTablePaths[section]
          : [];
        missingSectionPaths.forEach((path) => {
          // Keep known table hashes when the local cache already has that table path.
          // This preserves cross-page delta efficiency for shared tables (e.g. itables.it).
          if (!hasPathData(currentFarmState, path)) {
            delete knownTableHashes[path];
          }
        });
      }
    });
    const requestMode = withSectionLoader ? "nav" : "refresh";
    const requestFarmId = curID || dataSetFarm?.frmid || dataSet?.options?.farmId || "";
    let vHeaders = onlyPrices ? {
      onlyprices: "true",
    } : {
      frmid: requestFarmId,
      deviceId: deviceIdRef.current,
      options: dataSet.options,
      selectedTrySeason: String(ui?.selectedTrySeason || "all").toLowerCase(),
      include: [...new Set(includeToRequest)],
      page: requestedPage,
      knownHashes,
      knownTableHashes,
      mode: requestMode,
      forceRecalc: !!forceRecalc,
      tryitarrays: tryItArrays,
      tryitMode,
      requestTag: String(requestTag || ""),
    };
    if (!onlyPrices && shouldDebugHashFlow()) {
      const knownTableCount = Object.keys(knownTableHashes || {}).length;
      const knownSectionCount = Object.keys(knownHashes || {}).length;
      const includeTxt = Array.isArray(includeToRequest) ? includeToRequest.join(",") : "";
      // Debug only: client-side hash flow visibility.
      console.log(
        `[hashflow][client:req] mode:${requestMode} page:${String(requestedPage || "unknown")} ` +
        `knownTables:${knownTableCount} knownSections:${knownSectionCount} ` +
        `sample:[${sampleHashKeys(knownTableHashes, 5)}] include:[${includeTxt}]`
      );
    }
    //console.log("dataSetFarm dans getPrices :", dataSetFarm);
    const isRefreshRequest = !onlyPrices && !withSectionLoader;
    if (isRefreshRequest) {
      refreshInFlightRef.current = true;
    }
    if (!onlyPrices) {
      beginHeaderRequest();
    }
    try {
      const response = await fetch(API_URL + "/getdatacrypto", {
        //method: 'GET',
        //headers: vHeaders
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vHeaders),
      });
      if (response.ok) {
        const responseData = await response.json();
        const respData = responseData.allData;
        let mergedFarmData = currentFarmState;
        setpriceData(JSON.parse(JSON.stringify(responseData.priceData)));
        if (respData !== "" && respData !== undefined) {
          if (respData?.sectionHashes && typeof respData.sectionHashes === "object") {
            farmSectionHashesRef.current = {
              ...(farmSectionHashesRef.current || {}),
              ...respData.sectionHashes,
            };
          }
          if (respData?.tableHashes && typeof respData.tableHashes === "object") {
            const knownFromPayload = extractReceivedTableHashes(respData, respData.tableHashes);
            farmTableHashesRef.current = {
              ...(farmTableHashesRef.current || {}),
              ...knownFromPayload,
            };
          }
          mergedFarmData = mergeFarmStateDeep(currentFarmState, respData);
          //setdataSetFarm(respData);
          setFarmData(mergedFarmData.frmData || {});
          dataSet.options.isAbo = mergedFarmData.isabo;
          dataSet.isVip = mergedFarmData?.frmData?.vip;
          dataSet.dateVip = mergedFarmData?.frmData?.datevip;
          dataSet.dailychest = mergedFarmData?.frmData?.dailychest;
          dataSet.taxFreeSFL = frmtNb(mergedFarmData?.frmData?.taxFreeSFL);
          dataSet.bumpkin = mergedFarmData?.Bumpkin?.[0];
          setBumpkinData(mergedFarmData?.Bumpkin || []);
          const { frmData, expandData, Fish, taxFreeSFL } = mergedFarmData;
          dataSet.balance = getBalanceValue(frmData.balance, "sfl");
          dataSet.coins = getBalanceValue(frmData.balance, "coins");
          const balance = getBalanceValue(frmData.balance, "sfl");
          dataSet.updated = formatUpdated(frmData?.updated);
          let refreshOptions = false;
          if (dataSet?.options?.tradeTax !== frmData?.tradeTax && dataSet?.options?.tradeTax > 0 && dataSet.options.autoTradeTax) {
            dataSet.options.tradeTax = frmData?.tradeTax;
            refreshOptions = true;
            //console.log("reset Tax");
          }
          if (dataSet?.options?.autoCoinRatio) {
            dataSet.options.coinsRatio = responseData?.bestCoinRatio?.ratio || dataSet.options.coinsRatio;
            refreshOptions = true;
          }
          const nextGemsRatio = computeGemsRatio(
            dataSet?.options?.gemsPack || 7400,
            dataSet?.options?.usdSfl
          );
          if (nextGemsRatio > 0 && Number(dataSet?.options?.gemsRatio || 0) !== nextGemsRatio) {
            dataSet.options.gemsRatio = nextGemsRatio;
            refreshOptions = true;
          }
          if (refreshOptions) {
            const newOptions = { ...dataSet.options };
            dataSet.options = newOptions;
            setOptions(newOptions);
          }
          const withdrawreduc = (expandData?.type === "desert" || expandData?.type === "spring" || expandData?.type === "volcano") ? 2.5 : 0;
          const withdrawtax = (balance < 10 ? 30 : balance < 100 ? 25 : balance < 1000 ? 20 : balance < 5000 ? 15 : 10) - withdrawreduc;
          dataSet.withdrawtax = withdrawtax;
          const withdrawSFLbeyondTaxFree = Number(taxFreeSFL) - Number(balance);
          const withdrawsflFree = (withdrawSFLbeyondTaxFree < 0) ? Number(taxFreeSFL) : Number(balance);
          const withdrawsflNotFree = (withdrawsflFree >= Number(balance)) ? 0 : (Number(balance) - withdrawsflFree);
          const withdrawSflNotFreeTaxed = (withdrawsflNotFree > 0) ? (withdrawsflNotFree - (withdrawsflNotFree * (withdrawtax / 100))) : 0;
          const sflwithdraw = frmtNb(withdrawsflFree + withdrawSflNotFreeTaxed);
          dataSet.sflwithdraw = sflwithdraw;
          const xfishcastmax = Fish && (!TryChecked ? Fish.CastMax : Fish.CastMaxtry);
          const xfishcost = Fish && ((!TryChecked ? Fish.CastCost : Fish.CastCosttry) / dataSet.options.coinsRatio);
          dataSet.fishcasts = Fish && (Fish.casts + "/" + xfishcastmax);
          dataSet.fishcosts = Fish && (parseFloat(Fish.casts * xfishcost).toFixed(3) + "/" + parseFloat(xfishcastmax * xfishcost).toFixed(3));
          setdataSetFarm((prevFarmState) => {
            const mergedLatest = mergeFarmStateDeep(prevFarmState, respData);
            dataSetFarmRef.current = mergedLatest;
            return { ...mergedLatest };
          });
          setdeliveriesData(mergedFarmData?.orderstable || []);
        }
        const priceData = responseData.priceData;
        const balanceUSD = frmtNb(Number(dataSet?.balance || 0) * Number(priceData[2]));
        dataSet.balanceUSD = balanceUSD;
        const usdwithdraw = frmtNb(Number(dataSet?.sflwithdraw || 0) * Number(priceData[2]));
        dataSet.usdwithdraw = usdwithdraw;
        dataSet.options.usdSfl = responseData.priceData[2];
        const nextGemsRatio = computeGemsRatio(
          dataSet?.options?.gemsPack || 7400,
          dataSet?.options?.usdSfl
        );
        if (nextGemsRatio > 0 && Number(dataSet?.options?.gemsRatio || 0) !== nextGemsRatio) {
          const newOptions = { ...dataSet.options, gemsRatio: nextGemsRatio };
          dataSet.options = newOptions;
          setOptions(newOptions);
        }
        //NFTPrice();
        //xinitprc = true;
        setReqState('');
        if (respData?.mutantsHeader || respData?.mutantchickens) {
          setMutants(mergedFarmData);
          //setsTickets(respData.sTickets);
        }
      } else {
        console.log(`Error : ${response.status}`);
        setReqState(await formatHttpErrorMessage(response, "/getdatacrypto"));
        dataSet.updated = formatUpdated(farmData?.updated);
        const newdataSetFarm = { ...(dataSetFarmRef.current || {}) };
        setdataSetFarm(newdataSetFarm);
        //localStorage.clear();
        //console.log("Cleared local data");
      }
    } finally {
      if (!onlyPrices) {
        endHeaderRequest();
      }
      if (isRefreshRequest) {
        refreshInFlightRef.current = false;
        suppressNavUntilRef.current = Date.now() + 1200;
      }
      if (!onlyPrices && withSectionLoader) {
        setSectionsLoading(false);
      }
    }
  }
  function setMutants(dataSetMutant) {
    const normalizedHeader = Array.isArray(dataSetMutant?.mutantsHeader)
      ? dataSetMutant.mutantsHeader
      : [];
    const extractFirstRewardItem = (entry) => {
      if (!entry) return null;
      if (Array.isArray(entry) && entry.length > 0) {
        if (Array.isArray(entry[0])) return extractFirstRewardItem(entry[0]);
        if (entry[0] && typeof entry[0] === "object") return entry[0];
        if (typeof entry[0] === "string") return { name: entry[0] };
      }
      if (typeof entry === "object" && !Array.isArray(entry)) {
        if (entry.name || entry.item || entry.key || entry.id) {
          return { ...entry, name: entry.name || entry.item || entry.key || entry.id };
        }
        const firstKey = Object.keys(entry)[0];
        if (firstKey) return { name: firstKey };
      }
      return null;
    };
    const tableMutant = normalizedHeader.length > 0
      ? normalizedHeader
      : (
        Array.isArray(dataSetMutant?.mutantchickens)
          ? dataSetMutant.mutantchickens.map((entry) => extractFirstRewardItem(entry)).filter(Boolean)
          : []
      );
    const MutItems = tableMutant.map((mutEntry, index) => {
      const itemObj = extractFirstRewardItem(mutEntry) || mutEntry || {};
      const itemName = itemObj?.name;
      let itemImg = itemObj?.img || imgna;
      if (!itemObj?.img && dataSetMutant?.boostables?.nft?.[itemName]) { itemImg = dataSetMutant?.boostables?.nft?.[itemName]?.img; }
      if (!itemObj?.img && dataSetMutant?.itables?.mutant?.[itemName]) { itemImg = dataSetMutant?.itables?.mutant?.[itemName]?.img; }
      return (
        <img key={`mut-${index}-${itemName || "na"}`} src={itemImg} alt={''} className="nftico" title={itemName || "Mutant"} />
      )
    });
    const txtMutants = tableMutant.length > 0 && <><span style={{ fontSize: "11px" }}>Mutant found : {MutItems}</span></>;
    setmutData(txtMutants);
  }
  useEffect(() => {
    if (!dataSetFarm?.mutantsHeader && !dataSetFarm?.mutantchickens) return;
    setMutants(dataSetFarm);
  }, [dataSetFarm?.mutantsHeader, dataSetFarm?.mutantchickens]);
  function setsTickets(tabletk) {
    /* if (tabletk.length > 1) {
      //setticketsData(<div><img src={dataSet.imgtkt} alt={''} className="itico" />{tabletk[1].amount}</div>);
    } else {
      //setticketsData("");
    } */
  }

  useEffect(() => {
    if (!pendingSaveRef.current) return;
    pendingSaveRef.current = false;
    setCookie();
  }, [dataSetFarm, options]);
  useEffect(() => {
    const loadSectionsMeta = async () => {
      try {
        const response = await fetch(API_URL + "/getsectionsmeta", { method: "GET" });
        if (!response.ok) {
          setSectionsMeta(null);
          setSectionsMetaError(`Config sections introuvable (${response.status})`);
          return;
        }
        const meta = await response.json();
        const pageReq = meta?.pageSectionRequirements;
        const secKeys = meta?.sectionKeys;
        const secTablePaths = meta?.sectionTablePaths;
        const trConfig = meta?.tryitConfig;
        const valid =
          pageReq && typeof pageReq === "object" &&
          secKeys && typeof secKeys === "object" &&
          secTablePaths && typeof secTablePaths === "object" &&
          trConfig && typeof trConfig === "object" &&
          Array.isArray(trConfig?.boostTables) && trConfig.boostTables.length > 0 &&
          trConfig?.itemTables && typeof trConfig.itemTables === "object" &&
          Array.isArray(pageReq?.home) &&
          Array.isArray(secKeys?.core);
        if (!valid) {
          setSectionsMeta(null);
          setSectionsMetaError("Config sections invalide (backend)");
          return;
        }
        setSectionsMeta({
          pageSectionRequirements: pageReq,
          sectionKeys: secKeys,
          sectionTablePaths: secTablePaths,
          tryitConfig: trConfig,
        });
        setSectionsMetaError("");
      } catch {
        setSectionsMeta(null);
        setSectionsMetaError("Impossible de charger la config sections");
      }
    };
    loadSectionsMeta();
    if (isNativeApp) {
      StatusBar.setOverlaysWebView({ overlay: false });
    }
    loadCookie();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          //console.log('Service Worker enregistrÃ© avec succÃ¨s:', registration);
        })
        .catch(error => {
          console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
        });
    }
    //setXListeCol();
  }, []);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const refreshSectionsKey = useMemo(
    () => buildSectionsKey(computeRequiredSections(ui, pageSectionRequirements)),
    [ui?.selectedInv, ui?.activityDisplay, ui?.fishView, ui?.petView, pageSectionRequirements]
  );
  const autoRefreshEnabled = options?.autoRefresh !== false;
  const autoRefreshActive = !!(autoRefreshEnabled && buttonClicked && dataSetFarm?.frmid && !showfTNFT && !showfGraph);
  const autoRefreshResetKey = `${dataSetFarm?.frmid || ""}|${autoRefreshNonce}|${showfTNFT ? 1 : 0}|${showfGraph ? 1 : 0}|${autoRefreshPulse}`;
  const hasLoadedFarm = !!(
    buttonClicked &&
    String(dataSetFarm?.frmid || dataSet?.options?.farmId || "").trim()
  );
  useEffect(() => {
    autoRefreshViewRef.current = {
      selectedInv: ui?.selectedInv || "home",
      activityDisplay: ui?.activityDisplay || "item",
      fishView: ui?.fishView || "fish",
      petView: ui?.petView || "pets",
      showfDlvr: !!showfDlvr,
    };
  }, [ui?.selectedInv, ui?.activityDisplay, ui?.fishView, ui?.petView, showfDlvr]);
  useEffect(() => {
    const normalDuration = 60 * 1000;
    const firstDuration = autoRefreshForceNormalFirstCycleRef.current
      ? normalDuration
      : (dataSet?.options?.isAbo ? normalDuration : 20 * 1000);
    autoRefreshForceNormalFirstCycleRef.current = false;
    let firstCyclePending = true;
    const fetchData = async () => {
      try {
        if (!autoRefreshEnabled) return;
        if (!buttonClicked) return;
        if (!dataSetFarm?.frmid) return;
        if (showfTNFT || showfGraph) return;
        if (document.visibilityState !== "visible") return;
        const view = autoRefreshViewRef.current || {};
        const refreshUI = {
          selectedInv: view.selectedInv || "home",
          activityDisplay: view.activityDisplay || "item",
          fishView: view.fishView || "fish",
          petView: view.petView || "pets",
        };
        const sections = computeRequiredSections(refreshUI, pageSectionRequirements);
        const includeSections = [...new Set([
          ...(Array.isArray(sections) ? sections : []),
          "trades",
          ...(view.showfDlvr ? ["orders", "deliverypage"] : []),
        ])];
        await getPrices(false, false, includeSections, true, view.selectedInv || "home");
        autoRefreshHasRunRef.current = true;
        autoRefreshLastPageRef.current = String(view.selectedInv || "home");
        setAutoRefreshPulse((v) => v + 1);
        setAutoRefreshDurationMs(normalDuration);
        setAutoRefreshNextAt(Date.now() + normalDuration);
      } catch (error) {
        console.log(`Error: ${error}`);
        dataSet.updated = formatUpdated(farmData?.updated);
        const newdataSetFarm = { ...dataSetFarm };
        setdataSetFarm(newdataSetFarm);
      }
    };
    const clearAllTimers = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    const startTimers = () => {
      clearAllTimers();
      if (!autoRefreshEnabled || !buttonClicked || !dataSetFarm?.frmid || showfTNFT || showfGraph) {
        setAutoRefreshNextAt(0);
        return;
      }
      const initialDuration = firstCyclePending ? firstDuration : normalDuration;
      setAutoRefreshDurationMs(initialDuration);
      setAutoRefreshNextAt(Date.now() + initialDuration);
      if (firstCyclePending && initialDuration !== normalDuration) {
        timeoutRef.current = setTimeout(() => {
          fetchData()
            .catch((error) => console.log(`Error: ${error}`))
            .finally(() => {
              firstCyclePending = false;
              setAutoRefreshDurationMs(normalDuration);
              setAutoRefreshNextAt(Date.now() + normalDuration);
              intervalRef.current = setInterval(() => {
                fetchData().catch((error) => console.log(`Error: ${error}`));
              }, normalDuration);
            });
        }, initialDuration);
        return;
      }
      firstCyclePending = false;
      intervalRef.current = setInterval(() => {
        fetchData().catch((error) => console.log(`Error: ${error}`));
      }, normalDuration);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        startTimers();
      } else {
        clearAllTimers();
      }
    };
    startTimers();
    if (!autoRefreshEnabled) {
      setAutoRefreshNextAt(0);
      setAutoRefreshDurationMs(normalDuration);
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      clearAllTimers();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dataSetFarm?.frmid, autoRefreshNonce, showfTNFT, showfGraph, pageSectionRequirements, autoRefreshEnabled]);
  useEffect(() => {
    getFromToExpand(Number(fromexpand) + 1, Number(toexpand), selectedExpandType);
  }, [fromexpand, toexpand, selectedExpandType]);
  useEffect(() => {
    if (!dataSetFarm?.frmid) return;
    if (refreshInFlightRef.current) return;
    const runNavLoadIfNeeded = () => {
      if (!dataSetFarm?.frmid) return;
      if (refreshInFlightRef.current) return;
      const currentPage = String(ui?.selectedInv || "home");
      const shouldForceNavAfterRefreshElsewhere =
        autoRefreshHasRunRef.current &&
        autoRefreshLastPageRef.current !== "" &&
        autoRefreshLastPageRef.current !== currentPage;
      const required = computeRequiredSections(ui, pageSectionRequirements);
      const currentTrySignature = buildTryitCoverageSignature(getTryitRequestPayload(dataSetFarmRef.current || {}));
      const coverage = postTryCloseCoverageRef.current;
      const isCoveredByRecentTryClose = !!(
        shouldForceNavAfterRefreshElsewhere &&
        coverage &&
        coverage.signature === currentTrySignature &&
        required.every((section) => Array.isArray(coverage.sections) && coverage.sections.includes(section))
      );
      const hasAllSections = required.every((section) => hasSectionData(dataSetFarm, section, sectionPayloadKeys, sectionTablePaths));
      if (hasAllSections && (!shouldForceNavAfterRefreshElsewhere || isCoveredByRecentTryClose)) {
        if (isCoveredByRecentTryClose) {
          autoRefreshHasRunRef.current = false;
        }
        return;
      }
      getPrices(false, true, null, false, null, shouldForceNavAfterRefreshElsewhere).catch((error) => {
        console.log(`Error: ${error}`);
      });
      if (shouldForceNavAfterRefreshElsewhere) {
        autoRefreshHasRunRef.current = false;
      }
    };
    const suppressUntil = Number(suppressNavUntilRef.current || 0);
    const now = Date.now();
    if (now < suppressUntil) {
      const retryInMs = Math.max(40, suppressUntil - now + 10);
      const timer = setTimeout(() => {
        runNavLoadIfNeeded();
      }, retryInMs);
      return () => clearTimeout(timer);
    }
    runNavLoadIfNeeded();
  }, [ui?.selectedInv, ui?.activityDisplay, ui?.fishView, ui?.petView, dataSetFarm, dataSetFarm?.frmid, pageSectionRequirements, sectionPayloadKeys, sectionTablePaths]);
  useEffect(() => {
    const farmId = String(curID || dataSet.options?.farmId || "").trim();
    if (!farmId) return;
    if (!dataSet.options?.useNotifications) return;
    const checkKey = `${farmId}|${deviceIdRef.current}`;
    if (notifBootCheckedRef.current === checkKey) return;
    notifBootCheckedRef.current = checkKey;
    let cancelled = false;
    const run = async () => {
      try {
        const status = await checkDeviceSubscriptionStatus(farmId);
        if (cancelled) return;
        if (status?.active) {
          setNotifFarmEnabledLocal(farmId, true);
          return;
        }
        setNotifFarmEnabledLocal(farmId, false);
        if (notifActivationInFlightRef.current) return;
        if (notifPromptOpenRef.current) return;
        const notifPrefs = readNotifPrefs();
        const otherEnabledFarmIds = getOtherEnabledNotifFarmIdsLocal(farmId);
        if (otherEnabledFarmIds.length > 0) {
          if (notifPrefs.skipMultiFarmPrompt) return;
          notifPromptOpenRef.current = true;
          const choice = await promptChoice(
            "Notifications are already active on another farm on this device. Do you want to activate them on this farm too?",
            "Notifications",
            [
              { value: "activate", label: "Activate here too", primary: true },
              { value: "later", label: "Not for now" },
              { value: "skip-multi", label: "Don't ask again" },
            ]
          );
          notifPromptOpenRef.current = false;
          if (cancelled) return;
          if (choice === "skip-multi") {
            setSkipMultiFarmNotifPromptLocal(true);
            return;
          }
          if (choice !== "activate") return;
          await handleNotificationToggle(true, { fromUserGesture: isNativeApp });
          return;
        }
        notifPromptOpenRef.current = true;
        const confirmed = await promptConfirm(
          "Notifications are no longer active on this device. Do you want to reactivate them now?",
          "Notifications",
          "Reactivate",
          "Later"
        );
        notifPromptOpenRef.current = false;
        if (cancelled || !confirmed) return;
        await handleNotificationToggle(true, { fromUserGesture: isNativeApp });
      } catch (error) {
        notifPromptOpenRef.current = false;
        console.error("Notification startup status check failed:", error);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [curID, dataSet.options?.farmId, dataSet.options?.useNotifications]);
  useEffect(() => {
    const it = dataSetFarm?.itables?.it
      || dataSetFarm?.invData?.itables?.it
      || dataSetFarm?.cookData?.itables?.it;
    if (!it) return;
    const nextHrvst = {};
    const nextHrvstTry = {};
    for (const item in it) {
      const dc = it[item]?.dailycycle ?? 0;
      const dcTry = it[item]?.dailycycletry ?? dc;
      if (dc > 0) nextHrvst[item] = Math.ceil(Number(dc));
      if (dcTry > 0) nextHrvstTry[item] = Math.ceil(Number(dcTry));
    }
    setUI((prev) => ({
      ...prev,
      xHrvst: { ...nextHrvst, ...(prev.xHrvst ?? {}) },
      xHrvsttry: { ...nextHrvstTry, ...(prev.xHrvsttry ?? {}) },
    }));
  }, [dataSetFarm]);

  const pageOptions = [
    { value: "home", label: "Home", iconSrc: "./icon/ui/playercount.png" },
    { value: "inv", label: "Farm", iconSrc: "./icon/tools/shovel.png" },
    { value: "cook", label: "Cook", iconSrc: "./icon/food/chef_hat.png" },
    { value: "fish", label: "Fish", iconSrc: "./icon/fish/anchovy.png" },
    { value: "flower", label: "Flower", iconSrc: "./icon/flower/red_pansy.webp" },
    { value: "bounty", label: "Dig", iconSrc: "./icon/tools/sand_shovel.png" },
    { value: "animal", label: "Animals", iconSrc: imgchkn },
    { value: "pet", label: "Pets", iconSrc: "./icon/ui/petegg.png" },
    { value: "craft", label: "Craft", iconSrc: "./icon/craft/bee_box.webp" },
    { value: "cropmachine", label: "Crop Machine", iconSrc: "./icon/skillr/efficiency_ext_module.png" },
    { value: "map", label: "Map", iconSrc: "./icon/ui/world.png" },
    { value: "expand", label: "Expand", iconSrc: "./icon/tools/hammer.png" },
    { value: "buynodes", label: "Buy nodes", iconSrc: "./icon/res/sunstone_rock_1.webp" },
    { value: "factions", label: "Factions", iconSrc: "./icon/ui/factions.webp" },
    { value: "market", label: "Market", iconSrc: imgexchng },
    { value: "chapter", label: "Chapter", iconSrc: "./icon/ui/chapter.webp" },
    { value: "auctions", label: "Auctions", iconSrc: "./icon/ui/calendar.webp" },
    ...(dataSet.options.isAbo
      ? [{ value: "activity", label: "Activity", iconSrc: "./icon/ui/stopwatch.png" }]
      : []),
    { value: "toplists", label: "Lists", iconSrc: "./icon/ui/trophy.png" },
  ];
  const requiredSectionsForView = useMemo(
    () => computeRequiredSections(ui, pageSectionRequirements),
    [ui?.selectedInv, ui?.activityDisplay, ui?.fishView, ui?.petView, pageSectionRequirements]
  );
  const isCurrentPageDataReady = useMemo(
    () => requiredSectionsForView.every((section) => hasSectionData(dataSetFarm, section, sectionPayloadKeys, sectionTablePaths)),
    [requiredSectionsForView, dataSetFarm, sectionPayloadKeys, sectionTablePaths]
  );
  const canRenderCurrentPage = useMemo(
    () => isCurrentPageDataReady,
    [isCurrentPageDataReady]
  );
  const isAdminFarm = Number(dataSetFarm?.frmid || dataSet?.options?.farmId || 0) === 1972;

  return (
    <>
      <div
        className="App"
        onMouseOver={handleTooltipCellMouseOver}
        onMouseOut={handleTooltipCellMouseOut}
        onMouseLeave={clearHoveredTooltipCell}
      >
        <div className="top-frame">
          <h1 className="App-h1">
            <div className="vertical">
              <div onClick={(e) => handleTooltip("", "username", "", e)}>
                {dataSet?.options?.username && dataSet?.options?.username !== "" ? dataSet.options.username + (bumpkinData[0]?.lvl > 0 ? (" lvl" + bumpkinData[0]?.lvl) : "") :
                  <span>Farm ID or name</span>}</div>
              <div class="horizontal">
                <input
                  type="text"
                  name="inputValue"
                  //value={inputValue}
                  // onChange={handleInputChange}
                  value={ui?.inputValue ?? ""}
                  onChange={handleUIChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleButtonClick("EnterPressed");
                    }
                  }}
                  style={{ width: '65px' }}
                />
                <div className="coach-search-refresh-target" style={{ position: "relative", left: -4, top: 0 }}>
                  <button
                    name="getFarm"
                    onClick={() => {
                      handleButtonClick();
                    }}
                    className="button"
                    style={{ left: 1, top: 3, zIndex: 2 }}
                    disabled={!sectionsMeta}
                  >
                    <img src="./icon/ui/search.png" alt="" className="resico" />
                  </button>
                  <div
                    className="coach-autorefresh-target"
                    style={{ position: "absolute", left: -1, top: 0, pointerEvents: "none", zIndex: 1 }}
                  >
                    <AutoRefreshProgress
                      active={autoRefreshActive}
                      resetKey={autoRefreshResetKey}
                      durationMs={autoRefreshDurationMs}
                      deadlineMs={autoRefreshNextAt}
                      variant="circle"
                    />
                  </div>
                </div>
              </div>
              <div style={{
                pointerEvents: 'none',
                fontSize: '9px',
                color: 'gray',
              }}>{farmData?.updated ? (<UpdatedSince unixTime={farmData?.updated} />) : ""}</div>
              {hasLoadedFarm ? (
                <div className="vertical" style={{ transform: 'translate(105px, 0%)' }}>
                  <div className="horizontal">
                    <button onClick={handleButtonfTNFTClick} title="NFT" class="button coach-boosts-btn">
                      <img src="./icon/ui/lightning.png" alt="" className="itico" />
                    </button>
                    <FormControlLabel
                      className="coach-tryset-switch"
                      labelPlacement="top"
                      control={
                        <Switch
                          name="TryChecked"
                          checked={!!ui.TryChecked}
                          onChange={handleUIChange}
                          color="primary"
                          size="small"
                          sx={{
                            '& .MuiSwitch-track': {
                              backgroundColor: 'gray',
                            },
                            transform: 'translate(10%, 0%)',
                          }}
                        />
                      }
                      label={TryChecked ? 'Tryset' : 'Activeset'}
                      sx={{
                        margin: 0,
                        alignItems: 'center',
                        '& .MuiFormControlLabel-label': {
                          fontSize: '10px',
                          marginBottom: '1px',
                        },
                      }}
                    />
                  </div>
                  <button style={{ top: '3px' }} onClick={handleButtonfDlvrClick} title="Deliveries" class="button"><img src="./icon/ui/chores.webp" alt="" className="itico" /></button>
                </div>
              ) : ""}
            </div>
            <div class="h1-container"><img src={logo} alt="" className="App-logo" />Sunflower Manager</div>
            {hasLoadedFarm ? (
              <div className="currencies">
                <div className="currency-controls">
                  {/* <div className="selectcurrback">
                    <FormControl id="formselectcurr" className="selectcurr" size="small">
                      <InputLabel>Currency</InputLabel>
                      <Select name={"selectedCurr"} value={ui.selectedCurr} onChange={handleUIChange}>
                        <MenuItem value="SFL">
                          <img src={imgsfl} alt="SFL" className="nodico" />
                        </MenuItem>
                        <MenuItem value="MATIC">
                          <img src="./matic.png" alt="MATIC" className="curr-icon" />
                        </MenuItem>
                        <MenuItem value="USDC">
                          <img src="./usdc.png" alt="USDC" className="curr-icon" />
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </div> */}
                  <div className="currency-top-row">
                    <div className="horizontal currency-actions" style={{ margin: "0", padding: "0" }}>
                      {isAdminFarm ? (
                        <button
                          onClick={handleAdminClick}
                          title="Admin"
                          className="button"
                          disabled={adminLoading}
                        >
                          <img src={adminLoading ? "./icon/ui/syncing.gif" : imgadmin} alt="" className="itico" />
                        </button>
                      ) : onDev && (
                        <button
                          onClick={handleVipClick}
                          title="VIP"
                          className="button"
                          disabled={vipLoading}
                        >
                          <img src={vipLoading ? "./icon/ui/syncing.gif" : imgadmin} alt="" className="itico" />
                        </button>
                      )}
                      {dataSet.options.isAbo ? <button onClick={(e) => handleButtonIAClick(e)} className="button" disabled={iaLoading} title={iaLoading ? "Loading" : "Ask IA"}>
                        <img src={iaLoading ? "./icon/ui/syncing.gif" : "./icon/ui/bumpkin.png"} alt="" className="itico" />
                      </button> : null}
                    </div>
                    <DList
                      name="selectedCurr"
                      options={[
                        { value: "SFL", label: "Flower", iconSrc: imgsfl },
                        { value: "MATIC", label: "POL", iconSrc: "./matic.png" },
                        { value: "USDC", label: "USDC", iconSrc: "./usdc.png" },
                      ]}
                      value={ui.selectedCurr}
                      onChange={handleUIChange}
                      iconOnly={true}
                      height={38}
                    />
                  </div>
                  <div className="horizontal currency-secondary-actions" style={{ margin: "0", padding: "0" }}>
                    <button onClick={handleButtonOptionsClick} title="Options" class="button"><img src="./options.png" alt="" className="itico" /></button>
                    <button onClick={handleButtonHelpClick} title="Help" className="button coach-help-btn"><img src="./icon/nft/na.png" alt="" className="itico" /></button>
                  </div>
                </div>
                <div className="currency-pair">
                  <div className="currency"><img src={imgsfl} alt="" className="nodico" />{Number.isFinite(Number(priceData?.[2])) ? Number(priceData[2]).toFixed(3) : "--"}</div>
                  <div className="currency"><img src="./matic.png" alt="" className="curr-icon" />{Number.isFinite(Number(priceData?.[1])) ? Number(priceData[1]).toFixed(3) : "--"}</div>
                </div>
              </div>
            ) : ("")}
          </h1>
          <div style={{ marginTop: 0, margin: 0, padding: 0 }}>
            <div class="horizontal" style={{ margin: "0", padding: "0" }}>
              {hasLoadedFarm ? (<>
                <div class="horizontal" onClick={(e) => handleTooltip("", "balance", "", e)} style={{ margin: "0", padding: "0" }}>
                  {imgSFL}{frmtNb(dataSet.balance)} {imgCoins}{parseFloat(dataSet.coins).toFixed(0)}{dataSet.isBanned ? dataSet.isBanned : null}
                </div>
                <span>{mutData ? mutData : null}</span>
              </>) : null}
              <p className="reqstat">{reqState}</p>
              {sectionsMetaError ? (
                <p className="reqstat" style={{ color: "red" }}>
                  {sectionsMetaError}
                </p>
              ) : null}
            </div>
            {hasLoadedFarm ? (<>
              <HeaderTrades
                API_URL={API_URL}
                farmId={String(dataSetFarm?.frmid || "")}
                options={dataSet.options}
                currentPage={ui?.selectedInv}
                dataSetFarm={dataSetFarm}
                onTooltip={(e, payload) => handleTooltip("", "trades", payload || "", e)}
                onTradesUpdate={(payload) => {
                  if (!payload) return;
                  const hasTradesField = Object.prototype.hasOwnProperty.call(payload, "ftrades");
                  const hasHeaderField = Object.prototype.hasOwnProperty.call(payload, "ftradesHeader");
                  const hasNonEmptyTrades = !!(payload?.ftrades && typeof payload.ftrades === "object" && Object.keys(payload.ftrades).length > 0);
                  const hasNonEmptyHeader = Array.isArray(payload?.ftradesHeader) && payload.ftradesHeader.length > 0;
                  if (hasTradesField || hasHeaderField) {
                    if (!hasNonEmptyTrades && !hasNonEmptyHeader) return;
                    setdataSetFarm((prev) => ({
                      ...(prev || {}),
                      ...(hasNonEmptyTrades ? { ftrades: payload.ftrades } : {}),
                      ...(hasNonEmptyHeader ? { ftradesHeader: payload.ftradesHeader } : {}),
                    }));
                    return;
                  }
                  setdataSetFarm((prev) => ({ ...(prev || {}), ftrades: payload }));
                }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <DList
                  name="selectedInv"
                  options={pageOptions}
                  value={ui.selectedInv}
                  onChange={handleUIChange}
                  className={selectedInv === "market" ? "header-market-select" : "header-page-select"}
                  width={130}
                  height={25}
                  maxListHeight={null}
                />
                {(sectionsLoading || headerRequestLoading) ? (
                  <img
                    src="./icon/ui/syncing.gif"
                    alt="Loading sections"
                    className="itico"
                    style={{ width: 14, height: 14, opacity: 0.9 }}
                  />
                ) : null}
                {selectedInv === "animal" && (
                  <DList
                    name="selectedAnimalLvl"
                    options={[
                      { value: "farm", label: "Farm" },
                      { value: "all", label: "All lvl" },
                    ]}
                    value={ui.selectedAnimalLvl}
                    onChange={handleUIChange}
                    height={20}
                  />
                )}
                {selectedInv === "home" && (
                  <DList
                    name="selectedHomeMode"
                    options={[
                      { value: "current", label: "Current harvests" },
                      { value: "daily", label: "Daily harvests" },
                    ]}
                    value={ui.selectedHomeMode}
                    onChange={handleUIChange}
                    height={20}
                  />
                )}
                {selectedInv === "activity" && (
                  <DList
                    name="activityDisplay"
                    options={[
                      { value: "day", label: "Day" },
                      { value: "item", label: "Item" },
                      { value: "quest", label: "Quest" },
                    ]}
                    value={ui.activityDisplay}
                    onChange={handleUIChange}
                    height={20}
                  />
                )}
                {selectedInv === "expand" && (
                  <>
                    <DList
                      name="selectedExpandType"
                      title="Island"
                      options={[
                        { value: "basic", label: "Basic" },
                        { value: "spring", label: "Spring" },
                        { value: "desert", label: "Desert" },
                        { value: "volcano", label: "Volcan" },
                      ]}
                      value={ui.selectedExpandType}
                      onChange={handleUIChange}
                      height={20}
                    />
                    {expandLoading ? (
                      <img
                        src="./icon/ui/syncing.gif"
                        alt="Loading island data"
                        className="itico"
                        style={{ width: 14, height: 14, opacity: 0.9 }}
                      />
                    ) : null}
                    <DList
                      options={expandPickerOptions}
                      value={expandPickerValue}
                      multiple={true}
                      closeOnSelect={false}
                      emitEvent={false}
                      onChange={(selectedValues) => {
                        const selectedSet = new Set((selectedValues || []).map(String));
                        const next = (ui.xListeColExpand || EXPAND_COLUMNS_TEMPLATE).map((col, idx) => {
                          const isPickerCol = EXPAND_COLUMNS_PICKER.some((c) => c.idx === idx);
                          if (!isPickerCol) return col;
                          return [col[0], selectedSet.has(String(idx)) ? 1 : 0];
                        });
                        setUIField("xListeColExpand", next);
                      }}
                      listIcon="./options.png"
                      iconOnly={true}
                      height={28}
                      menuMinWidth={220}
                    />
                  </>
                )}
                {selectedInv === "cropmachine" && (
                  <DList
                    options={cropMachinePickerOptions}
                    value={cropMachinePickerValue}
                    multiple={true}
                    closeOnSelect={false}
                    emitEvent={false}
                    onChange={(selectedValues) => {
                      const selectedSet = new Set((selectedValues || []).map(String));
                      const next = (ui.xListeColCropMachine || CROPMACHINE_COLUMNS_TEMPLATE).map((col, idx) => {
                        const isPickerCol = CROPMACHINE_COLUMNS_PICKER.some((c) => c.idx === idx);
                        if (!isPickerCol) return col;
                        return [col[0], selectedSet.has(String(idx)) ? 1 : 0];
                      });
                      setUIField("xListeColCropMachine", next);
                    }}
                    listIcon="./options.png"
                    iconOnly={true}
                    height={28}
                    menuMinWidth={220}
                  />
                )}
                {selectedInv === "buynodes" && (
                  <DList
                    options={buyNodesPickerOptions}
                    value={buyNodesPickerValue}
                    multiple={true}
                    closeOnSelect={false}
                    emitEvent={false}
                    onChange={(selectedValues) => {
                      const selectedSet = new Set((selectedValues || []).map(String));
                      const next = (ui.xListeColBuyNodes || BUYNODES_COLUMNS_TEMPLATE).map((col, idx) => {
                        const isPickerCol = BUYNODES_COLUMNS_PICKER.some((c) => c.idx === idx);
                        if (!isPickerCol) return col;
                        return [col[0], selectedSet.has(String(idx)) ? 1 : 0];
                      });
                      setUIField("xListeColBuyNodes", next);
                    }}
                    listIcon="./options.png"
                    iconOnly={true}
                    height={28}
                    menuMinWidth={220}
                  />
                )}
                {selectedInv === "auctions" && (
                  <DList
                    options={auctionsPickerOptions}
                    value={auctionsPickerValue}
                    multiple={true}
                    closeOnSelect={false}
                    emitEvent={false}
                    onChange={(selectedValues) => {
                      const selectedSet = new Set((selectedValues || []).map(String));
                      const next = (ui.xListeColAuctions || AUCTIONS_COLUMNS_TEMPLATE).map((col, idx) => {
                        const isPickerCol = AUCTIONS_COLUMNS_PICKER.some((c) => c.idx === idx);
                        if (!isPickerCol) return col;
                        return [col[0], selectedSet.has(String(idx)) ? 1 : 0];
                      });
                      setUIField("xListeColAuctions", next);
                    }}
                    listIcon="./options.png"
                    iconOnly={true}
                    height={28}
                    menuMinWidth={220}
                  />
                )}
                {selectedInv === "pet" && (
                  <>
                    <DList
                      name="petView"
                      options={[
                        { value: "pets", label: "Pets", iconSrc: imgpet },
                        { value: "shrines", label: "Shrines", iconSrc: imgshrine },
                        { value: "components", label: "Fetch", iconSrc: imgacorn },
                      ]}
                      value={ui.petView}
                      onChange={handleUIChange}
                      height={20}
                    />
                    <DList
                      options={petPickerOptions}
                      value={petPickerValue}
                      multiple={true}
                      closeOnSelect={false}
                      emitEvent={false}
                      onChange={(selectedValues) => {
                        const selectedSet = new Set((selectedValues || []).map(String));
                        const picker = activePetColumnsPicker?.picker || [];
                        const template = activePetColumnsPicker?.template || [];
                        const stateKey = activePetColumnsPicker?.stateKey;
                        if (!stateKey) return;
                        const next = (ui?.[stateKey] || template).map((col, idx) => {
                          const isPickerCol = picker.some((c) => c.idx === idx);
                          if (!isPickerCol) return col;
                          return [col[0], selectedSet.has(String(idx)) ? 1 : 0];
                        });
                        setUIField(stateKey, next);
                      }}
                      listIcon="./options.png"
                      iconOnly={true}
                      height={28}
                      menuMinWidth={220}
                    />
                  </>
                )}
                {selectedInv === "fish" && (
                  <>
                    <DList
                      name="fishView"
                      options={[
                        { value: "fish", label: "Fish", iconSrc: "./icon/fish/anchovy.png" },
                        { value: "crustacean", label: "Crustaceans", iconSrc: imgcrustacean },
                      ]}
                      value={ui.fishView}
                      onChange={handleUIChange}
                      height={20}
                    />
                    <DList
                      options={ui.fishView === "crustacean" ? crustaPickerOptions : fishPickerOptions}
                      value={ui.fishView === "crustacean" ? crustaPickerValue : fishPickerValue}
                      multiple={true}
                      closeOnSelect={false}
                      emitEvent={false}
                      onChange={(selectedValues) => {
                        const selectedSet = new Set((selectedValues || []).map(String));
                        if (ui.fishView === "crustacean") {
                          const next = (ui.xListeColCrusta || CRUSTA_COLUMNS_TEMPLATE).map((col, idx) => {
                            const isPickerCol = CRUSTA_COLUMNS_PICKER.some((c) => c.idx === idx);
                            if (!isPickerCol) return col;
                            return [col[0], selectedSet.has(String(idx)) ? 1 : 0];
                          });
                          setUIField("xListeColCrusta", next);
                          return;
                        }
                        const next = (ui.xListeColFish || FISH_COLUMNS_TEMPLATE).map((col, idx) => {
                          const isPickerCol = FISH_COLUMNS_PICKER.some((c) => c.idx === idx);
                          if (!isPickerCol) return col;
                          return [col[0], selectedSet.has(String(idx)) ? 1 : 0];
                        });
                        setUIField("xListeColFish", next);
                      }}
                      listIcon="./options.png"
                      iconOnly={true}
                      height={28}
                      menuMinWidth={220}
                    />
                  </>
                )}
                {selectedInv === "cook" && (
                  <>
                    <DList
                      options={cookPickerOptions}
                      value={cookPickerValue}
                      multiple={true}
                      closeOnSelect={false}
                      emitEvent={false}
                      onChange={(selectedValues) => {
                        const selectedSet = new Set((selectedValues || []).map(String));
                        const next = (ui.xListeColCook || COOK_COLUMNS_TEMPLATE).map((col, idx) => {
                          const isPickerCol = COOK_COLUMNS_PICKER.some((c) => c.idx === idx);
                          if (!isPickerCol) return col;
                          return [col[0], selectedSet.has(String(idx)) ? 1 : 0];
                        });
                        setUIField("xListeColCook", next);
                      }}
                      listIcon="./options.png"
                      iconOnly={true}
                      height={28}
                      menuMinWidth={250}
                    />
                    <DList
                      name="cookCategories"
                      title="Categories"
                      options={[
                        { value: "base", label: "Base", iconSrc: "./icon/food/chef_hat.png" },
                        { value: "honey", label: "Honey", iconSrc: "./icon/res/honey.png" },
                        { value: "cheese", label: "Cheese", iconSrc: "./icon/food/cheese.webp" },
                        { value: "fish", label: "Fish", iconSrc: "./icon/fish/anchovy.png" },
                        { value: "cake", label: "Cake", iconSrc: "./icon/food/carrot_cake.png" },
                      ]}
                      multiple={true}
                      closeOnSelect={false}
                      value={ui.cookCategories || ["base", "honey", "cheese", "fish", "cake"]}
                      onChange={handleUIChange}
                      height={20}
                    />
                    <DList
                      name="cookSortBy"
                      title="Sort"
                      options={cookSortOptions}
                      value={ui.cookSortBy || "none"}
                      onChange={handleUIChange}
                      height={20}
                    />
                    <DList
                      name="cookSortDir"
                      title="Direction"
                      options={[
                        { value: "asc", label: "Asc" },
                        { value: "desc", label: "Desc" },
                      ]}
                      value={ui.cookSortDir || "asc"}
                      onChange={handleUIChange}
                      height={20}
                    />
                  </>
                )}
                {selectedInv === "inv" && (
                  <>
                    <DList
                      options={invPickerOptions}
                      value={invPickerValue}
                      multiple={true}
                      closeOnSelect={false}
                      emitEvent={false}
                      onChange={(selectedValues) => {
                        const selectedSet = new Set((selectedValues || []).map(String));
                        const next = (ui.xListeCol || INV_COLUMNS_TEMPLATE).map((col, idx) => {
                          const isPickerCol = INV_COLUMNS_PICKER.some((c) => c.idx === idx);
                          if (!isPickerCol) return col;
                          return [col[0], selectedSet.has(String(idx)) ? 1 : 0];
                        });
                        setUIField("xListeCol", next);
                      }}
                      listIcon="./options.png"
                      iconOnly={true}
                      height={28}
                      menuMinWidth={220}
                    />
                    <DList
                      name="invCategories"
                      title="Categories"
                      options={[
                        { value: "crop", label: "Crop", iconSrc: "./icon/res/soil.png" },
                        { value: "resources", label: "Resources", iconSrc: "./icon/res/stone_small.png" },
                        { value: "animals", label: "Animals", iconSrc: "./icon/res/cow.webp" },
                        { value: "fruit", label: "Fruit", iconSrc: "./icon/res/apple.png" },
                        { value: "buildings", label: "Buildings", iconSrc: "./icon/building/kitchen_icon.png" },
                      ]}
                      multiple={true}
                      closeOnSelect={false}
                      value={ui.invCategories || ["crop", "resources", "animals", "fruit", "buildings"]}
                      onChange={handleUIChange}
                      height={20}
                    />
                    <DList
                      name="invSortBy"
                      title="Sort"
                      options={invSortOptions}
                      value={ui.invSortBy || "none"}
                      onChange={handleUIChange}
                      height={20}
                    />
                    <DList
                      name="invSortDir"
                      title="Direction"
                      options={[
                        { value: "asc", label: "Asc" },
                        { value: "desc", label: "Desc" },
                      ]}
                      value={ui.invSortDir || "asc"}
                      onChange={handleUIChange}
                      height={20}
                    />
                  </>
                )}
              </div>
            </>) : null}
          </div>
        </div>
        <div className="table-container">
          {buttonClicked ?
            <AppCtx.Provider value={ctx}>
              {canRenderCurrentPage ? <PanelTable /> : <div>Loading page data...</div>}
            </AppCtx.Provider> : null}
        </div>
        {showOptions && (
          <ModalOptions onClose={() => {
            handleCloseOptions();
            const hasChanged = JSON.stringify(initialDataSet) !== JSON.stringify(dataSet);
            if (hasChanged) {
              handleButtonClick("optionChanged");
            }
          }}
            dataSet={dataSet.options}
            onOptionChange={handleOptionChange}
            API_URL={API_URL}
          />
        )}
        {showAdmin && (
          <ModalAdmin
            onClose={() => setShowAdmin(false)}
            value={adminData}
            onAdminFetch={fetchAdminView}
          />
        )}
        {showfGraph && (
          <ModalGraph onClose={handleClosefGraph}
            graphtype={GraphType}
            frmid={dataSet.options.farmId}
            username={dataSet.options.username}
            dataSetFarm={dataSetFarm}
            API_URL={API_URL} />
        )}
        {showfTNFT && (
          <AppCtx.Provider value={ctx}>
            <ModalTNFT onClose={handleClosefTNFT}
            />
          </AppCtx.Provider>
        )}
        {showfDlvr && (
          <AppCtx.Provider value={ctx}>
            <ModalDlvr
              onClose={() => { handleClosefDlvr() }}
              tableData={dataSetFarm?.orderstable || deliveriesData}
              imgtkt={dataSet.imgtkt}
              coinsRatio={dataSet.options.coinsRatio}
              autoRefreshEnabled={autoRefreshEnabled}
              autoRefreshActive={autoRefreshActive}
              autoRefreshResetKey={autoRefreshResetKey}
              autoRefreshNextAt={autoRefreshNextAt}
            />
          </AppCtx.Provider>
        )}
        {showCadre && (
          <Cadre onClose={handleCloseCadre} tableData={listingsData} Platform={platformListings} frmid={curID} />
        )}
        {showHelp && (
          <PageCoach
            onClose={handleCloseHelp}
            currentPage={ui?.selectedInv || "home"}
          />
        )}
        {sharedTryProfile ? (
          <TryProfileSummaryModal
            profile={sharedTryProfile}
            onClose={handleCloseTryProfileSummary}
          />
        ) : null}
        {tooltipData && (
          <Tooltip
            onClose={() => setTooltipData(null)}
            clickPosition={tooltipData}
            item={tooltipData.item}
            context={tooltipData.context}
            value={tooltipData.value}
            dataSet={dataSet}
            dataSetFarm={dataSetFarm}
            bdrag={tooltipData.bdrag}
            forTry={TryChecked}
          />
        )}
      </div >
    </>
  );
  function setCookie() {
    try {
      const bvversion = vversion;
      let xdataSetFarm = JSON.parse(JSON.stringify(dataSetFarm));
      //delete xdataSetFarm?.frmData;
      //delete xdataSetFarm?.initialIntervalDone;
      var dataToStore = {
        //ui: ui,
        dataSetFarm: xdataSetFarm,
        dataSet: dataSet,
        vversion: bvversion,
        lastID: lastID,
      };
      var dataToStoreString = JSON.stringify(dataToStore);
      //document.cookie = "sflman=" + dataToStoreString + ";expires=31 Dec 2024 23:59:59 UTC;";
      localStorage.setItem("SFLManData", dataToStoreString);
      //console.log("setC: " + dataToStoreString);
    }
    catch {
      localStorage.removeItem("SFLManData");
      //localStorage.clear();
      console.log("Error, cleared local data");
    }
  }
  function loadCookie() {
    try {
      //var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)sflman\s*=\s*([^;]*).*$)|^.*$/, "$1");
      const cookieValue = localStorage.getItem("SFLManData");
      if (!cookieValue) {
        dataSet.options.firstLoad = true;
      }
      if (cookieValue) {
        var loadedData = JSON.parse(cookieValue);
        //console.log("loadC: " + loadedData);
        let validCookie = true;
        //if (!loadedData.dataSetFarm?.itables) { validCookie = false; }
        if ((loadedData.vversion !== vversion) || !validCookie) {
          DefaultOptions();
          localStorage.removeItem("SFLManData");
          console.log("Cleared local data to fit newer version");
          return;
        }
        vversion = loadedData.vversion;
        setdataSetFarm(loadedData.dataSetFarm);
        dataSet = loadedData.dataSet;
        dataSet.updated = 0;
        lastID = loadedData.lastID || 0;
        DefaultOptions();
        try {
          const storedUI = JSON.parse(localStorage.getItem("ui"));
          setUI({ ...uiDefaults, ...normalizeUI(storedUI) });
        } catch {
          setUI(uiDefaults);
        }
      } else {
        DefaultOptions();
      }
    }
    catch (error) {
      localStorage.removeItem("SFLManData");
      //localStorage.clear();
      console.log("Load Error, cleared local data");
      console.log(error);
    }
    function DefaultOptions() {
      if (!dataSet.options?.inputFarmTime) { dataSet.options.inputFarmTime = 15 }
      if (!dataSet.options?.inputMaxBB) { dataSet.options.inputMaxBB = 1 }
      if (!dataSet.options?.inputKeep) { dataSet.options.inputKeep = 3 }
      //if (!dataSet.options?.tradeTax) { dataSet.options.tradeTax = 10 }
      if (dataSet.options?.autoTradeTax === undefined) { dataSet.options.autoTradeTax = 1 }
      if (dataSet.options?.autoRefresh === undefined) { dataSet.options.autoRefresh = true }
      if (!dataSet.options?.gemsRatio) { dataSet.options.gemsRatio = 0.07 }
      if (!dataSet.options?.gemsPack) { dataSet.options.gemsPack = 7400 }
      if (!dataSet.options?.coinsRatio) { dataSet.options.coinsRatio = 1000 }
      if (!dataSet.options?.inputMaxBB) { dataSet.options.inputMaxBB = 1 }
      if (!dataSet.options?.animalLvl) { dataSet.options.animalLvl = {} }
      if (!dataSet.options?.animalLvl?.Chicken) { dataSet.options.animalLvl.Chicken = 7 }
      if (!dataSet.options?.animalLvl?.Cow) { dataSet.options.animalLvl.Cow = 7 }
      if (!dataSet.options?.animalLvl?.Sheep) { dataSet.options.animalLvl.Sheep = 7 }
      if (!dataSet.options?.auctionNotifSelection || typeof dataSet.options.auctionNotifSelection !== "object") { dataSet.options.auctionNotifSelection = {} }
      if (!dataSet.options?.usePriceFood) { dataSet.options.usePriceFood = 1 }
      if (!dataSet.options?.oilFood) { dataSet.options.oilFood = 0 }
      if (dataSet.options?.chumFishCost === undefined) { dataSet.options.chumFishCost = 0 }
      setOptions(dataSet.options);
    }
  }
  async function getxpFromToLvl(xfrom, xto, xdxp) {
    const responseLVL = await fetch(API_URL + "/getfromtolvl", {
      method: 'GET',
      headers: {
        frmid: dataSet.farmId,
        from: xfrom,
        to: xto,
        xdxp: xdxp,
      }
    });
    if (responseLVL.ok) {
      const responseDataLVL = await responseLVL.json();
      //console.log(responseData);
      //setpriceData(JSON.parse(JSON.stringify(responseData.priceData)));
      setUIField("fromtolvltime", responseDataLVL.time);
      //setfromtolvltime(responseDataLVL.time);
      setUIField("fromtolvlxp", responseDataLVL.xp);
      //setfromtolvlxp(responseDataLVL.xp);
    } else {
      console.log(`Error : ${responseLVL.status}`);
    }
  }
  async function getFromToExpand(xfrom, xto, xtype) {
    const reqSeq = ++expandRequestSeqRef.current;
    setExpandLoading(true);
    try {
      const responseExpand = await fetch(API_URL + "/getfromtoexpand", {
        method: 'GET',
        headers: {
          frmid: dataSet.farmId,
          from: xfrom,
          to: xto,
          type: xtype,
          spot: dataSetFarm.spot || 0
        }
      });
      if (responseExpand.ok) {
        const responseDataExp = await responseExpand.json();
        if (reqSeq === expandRequestSeqRef.current) {
          //console.log(responseData);
          //setpriceData(JSON.parse(JSON.stringify(responseData.priceData)));
          //setfromtoexpand(responseDataExp);
          //setUIField("fromtoexpand", responseDataExp);
          dataSet.fromtoexpand = responseDataExp;
        }
      } else {
        console.log(`Error : ${responseExpand.status}`);
      }
    } catch (error) {
      console.log("getFromToExpand error", error);
    } finally {
      if (reqSeq === expandRequestSeqRef.current) {
        setExpandLoading(false);
      }
    }
  }
  function refreshDataSet(dataSetRefresh) {
    const invIt = dataSetRefresh?.itables?.it;
    if (invIt) {
      if (!dataSet.options?.animalLvl) {
        dataSet.options.animalLvl = Object.fromEntries(
          Object.keys(dataSetRefresh?.Animals || {}).map(animal => [animal, 5])
        );
      }
      if (!dataSet.options?.notifList) {
        dataSet.options.notifList = Object.keys(invIt)
          .filter(key =>
            !(invIt[key]?.matcat === 2) &&
            !(key === "Wild Mushroom") &&
            !(key === "Magic Mushroom")
          )
          .map(key => [key, 1]);
        dataSet.options.notifList.push(['Bee Swarm', 1]);
      }
      if (dataSet.options.notifList.some(([key]) => key === 'Wild Mushroom')) {
        dataSet.options.notifList = dataSet.options.notifList.filter(([key]) => key !== 'Wild Mushroom');
      }
      if (dataSet.options.notifList.some(([key]) => key === 'Magic Mushroom')) {
        dataSet.options.notifList = dataSet.options.notifList.filter(([key]) => key !== 'Magic Mushroom');
      }
      if (!dataSet.options.notifList.some(([key]) => key === 'Market Sold')) {
        dataSet.options.notifList.push(['Market Sold', 1]);
      }
      if (!dataSet.options.notifList.some(([key]) => key === 'Animal needs love')) {
        dataSet.options.notifList.push(['Animal needs love', 1]);
      }
      if (!dataSet.options.notifList.some(([key]) => key === 'Crustaceans')) {
        dataSet.options.notifList.push(['Crustaceans', 1]);
      }
      if (!dataSet.options.notifList.some(([key]) => key === 'Auctions')) {
        dataSet.options.notifList.push(['Auctions', 1]);
      }
    }
  }
}

export default App;




