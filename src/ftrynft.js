import React, { useEffect, useRef, useState } from 'react';
import { useAppCtx } from "./context/AppCtx";
import { Switch, FormControlLabel } from '@mui/material';
import CounterInput from "./counterinput.js";
import DList from "./dlist.jsx";
import { frmtNb, ColorValue, mergeFarmStateDeep, getOrCreateDeviceId } from './fct.js';
import Help from './fhelp.js';

let helpImage = "./image/helptrynft.jpg";

const imgsfl = './icon/res/flowertoken.webp';
const imgSFL = <img src={imgsfl} alt={''} className="itico" title="Flower" />;
const imgusdc = "./usdc.png";
const BOOST_TAB_KEYS = ["collectibles", "wearables", "craft", "buds", "skills", "shrines"];
const BOOST_CATEGORY_LABELS = {
  collectibles: "Collectibles",
  wearables: "Wearables",
  craft: "Craft",
  buds: "Buds",
  skills: "Skills",
  shrines: "Shrines",
};
const BOOST_TYPE_ALIASES = {
  harvest: "yield",
  production: "yield",
  output: "yield",
  speed: "time",
  duration: "time",
  cooldown: "time",
  discount: "cost",
  price: "cost",
  experience: "xp",
};
const BOOST_ITEM_CATEGORY_ALIASES = {
  crop: "crop",
  crops: "crop",
  fruit: "fruit",
  fruits: "fruit",
  flower: "flower",
  flowers: "flower",
  fish: "fish",
  fishing: "fish",
  cast: "fish",
  wood: "wood",
  tree: "wood",
  trees: "wood",
  stone: "mineral",
  mineral: "mineral",
  minerals: "mineral",
  mining: "mineral",
  animal: "animal",
  animals: "animal",
  barn: "animal",
  building: "building",
  buildings: "building",
  craft: "building",
  greenhouse: "greenhouse",
  cook: "cook",
  cooking: "cook",
  food: "cook",
  bees: "bees",
  compost: "compost",
  bud: "bud",
  buds: "bud",
  shrine: "shrine",
  shrines: "shrine",
  dig: "dig",
  digs: "dig",
  digging: "dig",
  treasure: "dig",
  treasures: "dig",
  bounty: "dig",
  pet: "pet",
  pets: "pet",
};
const NFT_PRICE_COLUMN_OPTIONS = [
  { value: "opensea", label: "OpenSea", iconSrc: "./icon/ui/openseaico.png" },
  { value: "market", label: "Market", iconSrc: "./icon/ui/exchange.png" },
];
const NFT_PRICE_UNIT_OPTIONS = [
  { value: "flower", label: "Flower", iconSrc: imgsfl },
  { value: "usdc", label: "USDC", iconSrc: imgusdc },
];
const NFT_TOTAL_COST_OPTIONS = [
  { value: "opensea", label: "OpenSea", iconSrc: "./icon/ui/openseaico.png" },
  { value: "market", label: "Market", iconSrc: "./icon/ui/exchange.png" },
];

function ModalTNFT({ onClose }) {
  const {
    data: { dataSet, dataSetFarm, priceData },
    ui: {
      TryChecked,
    },
    actions: {
      handleUIChange,
      handleTooltip,
      handleRefreshfTNFT,
    },
    config: { API_URL, tryitConfig },
  } = useAppCtx();
  const frmid = dataSet.options.farmId;
  const [dataSetLocal, setdataSetLocal] = useState(dataSetFarm);
  const activeBaselineRef = useRef(JSON.parse(JSON.stringify(dataSetFarm || {})));
  const deepClone = (obj) => JSON.parse(JSON.stringify(obj || {}));
  const lastSentTryRef = useRef(null);
  const hasTryNftTables = !!dataSetLocal?.boostables && !!dataSetLocal?.itables?.it;
  const [tableNFT, settableNFT] = useState([]);
  const [tableContent, settableContent] = useState([]);
  const [TotalCostDisplay, setTotalCostDisplay] = useState("market");
  //const [tooltipData, setTooltipData] = useState(null);
  const [tableFlexDirection, setTableFlexDirection] = useState('row');
  const [tableView, setTableView] = useState('both');
  const [showHelp, setShowHelp] = useState(false);
  const [cdButton, setcdButton] = useState(false);
  const [iTotBuyCheck, setTotBuyCheck] = useState(false);
  const [selectedBoostTab, setSelectedBoostTab] = useState("collectibles");
  const [boostTypeFilters, setBoostTypeFilters] = useState([]);
  const [boostCategoryFilters, setBoostCategoryFilters] = useState([]);
  const [nftPriceCols, setNftPriceCols] = useState(["market"]);
  const [nftPriceUnit, setNftPriceUnit] = useState("flower");
  const deviceId = getOrCreateDeviceId();
  function key(name) {
    if (name === "active") { return TryChecked ? "tryit" : "isactive"; }
    return TryChecked ? name + "try" : name;
  }
  const closeModal = () => {
    onClose(dataSet, dataSetLocal);
  };
  useEffect(() => {
    if (!hasTryNftTables) return;
    const baseIt = activeBaselineRef.current?.itables?.it;
    if (!baseIt || Object.keys(baseIt).length < 1) {
      activeBaselineRef.current = deepClone(dataSetLocal);
    }
    const sentIt = lastSentTryRef.current?.itables?.it;
    if (!sentIt || Object.keys(sentIt).length < 1) {
      lastSentTryRef.current = deepClone(dataSetLocal);
    }
  }, [hasTryNftTables, dataSetLocal]);
  const handleChangeTotalCostDisplay = (event) => {
    const selectedValue = event.target.value;
    setTotalCostDisplay(selectedValue);
  }
  const handleButtonHelpClick = () => {
    setShowHelp(true);
  };
  const handleCloseHelp = () => {
    setShowHelp(false);
  };
  const Refresh = async () => {
    if (cdButton) return;
    try {
      if (!tryitConfig || !Array.isArray(tryitConfig?.boostTables) || !tryitConfig?.itemTables) {
        console.log("Tryit config missing");
        return;
      }
      const cur = dataSetLocal || {};
      const base = lastSentTryRef.current || dataSetLocal || {};
      const tryItPacked = { mode: "idx-v1", tables: {} };
      const getByPath = (obj, path) => {
        return String(path || "").split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
      };
      const getPayloadOrderedKeys = (payloadKey) => {
        if ((tryitConfig?.boostTables || []).includes(payloadKey)) {
          return Object.keys(cur?.boostables?.[payloadKey] || {});
        }
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
          if (curVal !== baseVal) {
            packedEntries.push([idx, curVal]);
          }
        });
        if (packedEntries.length > 0) {
          tryItPacked.tables[tableName] = packedEntries;
        }
      });
      Object.entries(tryitConfig?.itemTables || {}).forEach(([payloadKey, tableCfg]) => {
        const field = tableCfg?.field;
        const sources = Array.isArray(tableCfg?.sources) ? tableCfg.sources : [];
        if (!field || sources.length < 1) return;
        const orderedKeys = getPayloadOrderedKeys(payloadKey);
        const packedEntries = [];
        const readValueFromSources = (itemKey) => {
          for (let i = 0; i < sources.length; i += 1) {
            const table = getByPath(cur, sources[i]) || {};
            if (Object.prototype.hasOwnProperty.call(table, itemKey)) {
              return Number(table[itemKey]?.[field] || 0);
            }
          }
          return 0;
        };
        const readBaseValueFromSources = (itemKey) => {
          for (let i = 0; i < sources.length; i += 1) {
            const table = getByPath(base, sources[i]) || {};
            if (Object.prototype.hasOwnProperty.call(table, itemKey)) {
              return Number(table[itemKey]?.[field] || 0);
            }
          }
          return 0;
        };
        orderedKeys.forEach((itemKey, idx) => {
          const curVal = readValueFromSources(itemKey);
          const baseVal = readBaseValueFromSources(itemKey);
          if (curVal !== baseVal) {
            packedEntries.push([idx, curVal]);
          }
        });
        if (packedEntries.length > 0) {
          tryItPacked.tables[payloadKey] = packedEntries;
        }
      });
      const headers = {
        frmid: frmid,
        deviceId,
        options: {
          ...dataSet.options,
          username: dataSet?.options?.username || dataSet?.username || dataSetLocal?.username || "",
        },
        username: dataSet?.options?.username || dataSet?.username || dataSetLocal?.username || "",
        tryitarrays: {},
        tryitpacked: tryItPacked,
        tryitMode: "delta",
        include: ["core", "inventory", "boosts"],
        page: "trynft",
        knownHashes: (dataSetLocal?.sectionHashes && typeof dataSetLocal.sectionHashes === "object")
          ? dataSetLocal.sectionHashes
          : {},
        knownTableHashes: (dataSetLocal?.tableHashes && typeof dataSetLocal.tableHashes === "object")
          ? dataSetLocal.tableHashes
          : {},
      };
      //const bodyStr = JSON.stringify(headers);
      //const tables = headers?.tryitpacked?.tables || {};
      //const tableKeys = Object.keys(tables);
      //const entries = tableKeys.reduce((n, k) => n + (Array.isArray(tables[k]) ? tables[k].length : 0), 0);
      //console.log("settry req ko:", (bodyStr.length / 1024).toFixed(2), "tables:", tableKeys.length, "entries:", entries);
      const response = await fetch(API_URL + "/settry", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(headers)
      });
      if (response.ok) {
        const responseData = await response.json();
        const mergedData = mergeFarmStateDeep(dataSetLocal, responseData);
        setdataSetLocal(mergedData);
        // Delta baseline must follow what we sent, not what server returned partially.
        lastSentTryRef.current = deepClone(cur);
        handleRefreshfTNFT(dataSet, mergedData);
      } else {
        if (response.status === 429) {
          console.log('Too many requests, wait a few seconds');
        } else {
          console.log(`Error : ${response.status}`);
        }
      }
      setcdButton(true);
      setTimeout(() => {
        setcdButton(false);
      }, 2000);
    } catch (error) {
      console.log(`Error : ${error}`);
    }
  };
  const Reset = () => {
    try {
      const baseline = activeBaselineRef.current || {};
      const baselineIt = baseline?.itables?.it || {};
      const newDataSet = {
        ...dataSetLocal,
        boostables: {
          ...dataSetLocal.boostables,
          nft: Object.fromEntries(Object.entries(dataSetLocal.boostables.nft).map(([key, value]) => [key, { ...value, tryit: value.isactive }])),
          nftw: Object.fromEntries(Object.entries(dataSetLocal.boostables.nftw).map(([key, value]) => [key, { ...value, tryit: value.isactive }])),
          buildng: Object.fromEntries(Object.entries(dataSetLocal.boostables.buildng).map(([key, value]) => [key, { ...value, tryit: value.isactive }])),
          skill: Object.fromEntries(Object.entries(dataSetLocal.boostables.skill).map(([key, value]) => [key, { ...value, tryit: value.isactive }])),
          skilllgc: Object.fromEntries(Object.entries(dataSetLocal.boostables.skilllgc).map(([key, value]) => [key, { ...value, tryit: value.isactive }])),
          bud: Object.fromEntries(Object.entries(dataSetLocal.boostables.bud).map(([key, value]) => [key, { ...value, tryit: value.isactive }])),
          shrine: Object.fromEntries(Object.entries(dataSetLocal.boostables.shrine).map(([key, value]) => [key, { ...value, tryit: value.isactive }])),
        },
        itables: {
          ...dataSetLocal.itables,
          //it: Object.fromEntries(Object.entries(dataSetLocal.it).map(([key, value]) => [key, { ...value, spottry: value.spot }])),
          it: Object.fromEntries(
            Object.entries(dataSetLocal.itables.it).map(([key, value]) => [
              key,
              {
                ...value,
                // Reset to active spots captured at modal load.
                spottry: baselineIt?.[key]?.spot ?? value.spot ?? 0,
                spot2try: baselineIt?.[key]?.spot2 ?? value.spot2 ?? 0,
                spot3try: baselineIt?.[key]?.spot3 ?? value.spot3 ?? 0,
              },
            ])
          ),
        }
      };
      setdataSetLocal(newDataSet);
      handleRefreshfTNFT(dataSet, newDataSet);
    } catch (error) {
      console.log(`Error : ${error}`);
    }
  };
  const SetZero = () => {
    try {
      const newDataSet = {
        ...dataSetLocal,
        boostables: {
          ...dataSetLocal.boostables,
          nft: Object.fromEntries(
            Object.entries(dataSetLocal.boostables.nft).map(([key, value]) => [key, { ...value, tryit: 0 }])
          ),
          nftw: Object.fromEntries(
            Object.entries(dataSetLocal.boostables.nftw).map(([key, value]) => [key, { ...value, tryit: 0 }])
          ),
          buildng: Object.fromEntries(
            Object.entries(dataSetLocal.boostables.buildng).map(([key, value]) => [key, { ...value, tryit: 0 }])
          ),
          skill: Object.fromEntries(
            Object.entries(dataSetLocal.boostables.skill).map(([key, value]) => [key, { ...value, tryit: 0 }])
          ),
          skilllgc: Object.fromEntries(
            Object.entries(dataSetLocal.boostables.skilllgc).map(([key, value]) => [key, { ...value, tryit: 0 }])
          ),
          bud: Object.fromEntries(
            Object.entries(dataSetLocal.boostables.bud).map(([key, value]) => [key, { ...value, tryit: 0 }])
          ),
          shrine: Object.fromEntries(
            Object.entries(dataSetLocal.boostables.shrine).map(([key, value]) => [key, { ...value, tryit: 0 }])
          ),
        }
      };
      setdataSetLocal(newDataSet);
      handleRefreshfTNFT(dataSet, newDataSet);
      //setNFT(dataSetLocal);
    } catch (error) {
      console.log(`Error : ${error}`);
    }
  };
  const getTabEntries = (xboostables, tabKey) => {
    if (!xboostables) { return []; }
    if (tabKey === "collectibles") { return Object.entries(xboostables.nft || {}); }
    if (tabKey === "wearables") { return Object.entries(xboostables.nftw || {}); }
    if (tabKey === "craft") { return Object.entries(xboostables.buildng || {}); }
    if (tabKey === "buds") { return Object.entries(xboostables.bud || {}); }
    if (tabKey === "skills") {
      return [...Object.entries(xboostables.skill || {}), ...Object.entries(xboostables.skilllgc || {})];
    }
    if (tabKey === "shrines") { return Object.entries(xboostables.shrine || {}); }
    return [];
  };
  const getBoostTokenList = (value) => {
    if (value === null || value === undefined) { return []; }
    const arr = Array.isArray(value) ? value : [value];
    return arr
      .map((v) => String(v || "").trim())
      .filter(Boolean);
  };
  const normalizeToken = (token, aliasMap = {}) => {
    const txt = String(token || "")
      .toLowerCase()
      .replace(/[_-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!txt) { return ""; }
    const singular = txt.endsWith("s") && txt.length > 3 ? txt.slice(0, -1) : txt;
    return aliasMap[singular] || aliasMap[txt] || singular;
  };
  const formatTokenLabel = (token) => {
    if (!token) { return ""; }
    if (token.toLowerCase() === "xp") { return "XP"; }
    return token
      .split(" ")
      .map((part) => part ? part.charAt(0).toUpperCase() + part.slice(1) : part)
      .join(" ");
  };
  const inferTypeTokens = (boostText) => {
    const txt = String(boostText || "").toLowerCase();
    const inferred = [];
    if (/xp|experience/.test(txt)) { inferred.push("xp"); }
    if (/yield|harvest|production|produce|output/.test(txt)) { inferred.push("yield"); }
    if (/time|faster|speed|cooldown|duration/.test(txt)) { inferred.push("time"); }
    if (/cost|discount|price|cheaper/.test(txt)) { inferred.push("cost"); }
    return inferred;
  };
  const inferCategoryTokens = (boostText) => {
    const txt = String(boostText || "").toLowerCase();
    const inferred = [];
    if (/\b(fish|fishing|fisher|cast|rod|chum|school)\b/.test(txt)) { inferred.push("fish"); }
    if (/\b(dig|digging|treasure|bounty|artifact|excavate|excavation)\b/.test(txt)) { inferred.push("dig"); }
    if (/\b(crop|crops|seed|harvest)\b/.test(txt)) { inferred.push("crop"); }
    if (/\b(fruit|fruits|tree|trees|orchard)\b/.test(txt)) { inferred.push("fruit"); }
    if (/\b(flower|flowers|bloom|blossom)\b/.test(txt)) { inferred.push("flower"); }
    if (/\b(mine|mining|mineral|stone|ore)\b/.test(txt)) { inferred.push("mineral"); }
    if (/\b(animal|animals|barn|egg|milk|wool)\b/.test(txt)) { inferred.push("animal"); }
    if (/\b(cook|cooking|food|meal|kitchen)\b/.test(txt)) { inferred.push("cook"); }
    if (/\b(bee|bees|hive|honey)\b/.test(txt)) { inferred.push("bees"); }
    if (/\b(compost|fertili[sz]er)\b/.test(txt)) { inferred.push("compost"); }
    if (/\b(bud|buds)\b/.test(txt)) { inferred.push("bud"); }
    if (/\b(shrine|shrines)\b/.test(txt)) { inferred.push("shrine"); }
    if (/\b(pet|pets)\b/.test(txt)) { inferred.push("pet"); }
    if (/\b(wood|chop|tree)\b/.test(txt)) { inferred.push("wood"); }
    return inferred;
  };
  const resolveItemCategoryTokens = (boostItemTokens) => {
    const itables = dataSetLocal?.itables?.it || {};
    const itemCategoryIndex = {};
    for (const [itemName, itemData] of Object.entries(itables)) {
      const normName = normalizeToken(itemName);
      const cat = normalizeToken(itemData?.cat || itemData?.scat || itemData?.matcat || "");
      if (normName && cat && !itemCategoryIndex[normName]) {
        itemCategoryIndex[normName] = cat;
      }
    }
    return Array.from(new Set(
      boostItemTokens
        .map((token) => normalizeToken(token))
        .map((token) => BOOST_ITEM_CATEGORY_ALIASES[token] || itemCategoryIndex[token] || "")
        .filter(Boolean)
    ));
  };
  const getBoostMeta = (value) => {
    const typeRaw = [
      ...getBoostTokenList(value?.boosttype),
      ...inferTypeTokens(value?.boost),
    ];
    const explicitCategoryRaw = [
      ...getBoostTokenList(value?.boostit),
      ...getBoostTokenList(value?.cat),
      ...getBoostTokenList(value?.scat),
    ];
    const inferredCategoryRaw = explicitCategoryRaw.length > 0 ? [] : inferCategoryTokens(value?.boost);
    const categoryRaw = [
      ...explicitCategoryRaw,
      ...inferredCategoryRaw,
    ];
    const typeTokens = Array.from(new Set(typeRaw
      .map((token) => normalizeToken(token, BOOST_TYPE_ALIASES))
      .filter(Boolean)));
    const categoryTokens = resolveItemCategoryTokens(categoryRaw);
    return { typeTokens, categoryTokens };
  };
  const matchesTokenFilter = (selectedSet, tokens) => {
    if (selectedSet.size === 0) { return { wanted: false, match: true }; }
    if (!tokens.length) { return { wanted: true, match: null }; }
    return { wanted: true, match: tokens.some((token) => selectedSet.has(token)) };
  };
  const currentTabEntries = getTabEntries(dataSetLocal?.boostables, selectedBoostTab);
  const boostTypeTokens = Array.from(new Set(
    currentTabEntries.flatMap(([, value]) => getBoostMeta(value).typeTokens)
  )).sort((a, b) => a.localeCompare(b));
  const boostCategoryTokens = Array.from(new Set(
    currentTabEntries.flatMap(([, value]) => getBoostMeta(value).categoryTokens)
  )).sort((a, b) => a.localeCompare(b));
  const boostTypeOptions = boostTypeTokens.map((value) => ({ value, label: formatTokenLabel(value) }));
  const boostCategoryOptions = boostCategoryTokens.map((value) => ({ value, label: formatTokenLabel(value) }));
  const handleTabChange = (tabKey) => {
    setSelectedBoostTab(tabKey);
    setBoostTypeFilters([]);
    setBoostCategoryFilters([]);
  };
  const applyBoostFilters = (itemName, value) => {
    const { typeTokens, categoryTokens } = getBoostMeta(value);
    const selectedTypeSet = new Set((boostTypeFilters || []).map((v) => String(v).toLowerCase()));
    const selectedCategorySet = new Set((boostCategoryFilters || []).map((v) => String(v).toLowerCase()));
    const typeEval = matchesTokenFilter(selectedTypeSet, typeTokens);
    const categoryEval = matchesTokenFilter(selectedCategorySet, categoryTokens);
    if (typeEval.wanted && typeEval.match !== true) { return false; }
    if (categoryEval.wanted && categoryEval.match !== true) { return false; }
    return true;
  };
  const filterPanelStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    flex: '1 1 320px',
    maxWidth: '100%',
    overflowX: 'visible',
    overflowY: 'visible',
    paddingBottom: 2,
  };
  const actionBarStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
    flex: '1 1 320px',
  };
  const viewBarStyle = {
    display: 'flex',
    gap: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'nowrap',
    flex: '0 0 auto',
  };
  const headerRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    columnGap: 8,
    rowGap: 6,
  };
  const categoryButtonStyle = (isActive) => ({
    opacity: 1,
    border: isActive ? "1px solid rgba(123, 193, 125, 0.9)" : "1px solid rgba(255, 255, 255, 0.12)",
    flex: '0 0 auto',
    borderRadius: 999,
    padding: '4px 10px',
    color: 'var(--text-color)',
    background: isActive
      ? 'linear-gradient(180deg, rgba(123, 193, 125, 0.25) 0%, rgba(123, 193, 125, 0.08) 100%)'
      : 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
    boxShadow: isActive
      ? '0 0 0 1px rgba(123, 193, 125, 0.12), 0 6px 14px rgba(0, 0, 0, 0.2)'
      : '0 2px 8px rgba(0, 0, 0, 0.15)',
    fontWeight: isActive ? 600 : 500,
    fontSize: 12,
    transition: 'all 120ms ease',
    whiteSpace: 'nowrap',
  });
  const switchWrapStyle = {
    marginLeft: 14,
    paddingLeft: 10,
    borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
    display: 'inline-flex',
    alignItems: 'center',
  };
  const dlistMinWidth = 140;
  const handleBoostTypeChange = (selectedValues) => {
    const values = (selectedValues || []).map((v) => String(v).toLowerCase());
    setBoostTypeFilters(Array.from(new Set(values)));
  };
  const handleBoostCategoryChange = (selectedValues) => {
    const values = (selectedValues || []).map((v) => String(v).toLowerCase());
    setBoostCategoryFilters(Array.from(new Set(values)));
  };
  const handleNftPriceColsChange = (selectedValues) => {
    const values = (selectedValues || [])
      .map((v) => String(v).toLowerCase())
      .filter((v) => v === "opensea" || v === "market");
    setNftPriceCols(Array.from(new Set(values)));
  };
  const handleNftPriceUnitChange = (event) => {
    const selectedValue = String(event?.target?.value || "usdc").toLowerCase();
    setNftPriceUnit(selectedValue === "usdc" ? "usdc" : "flower");
  };
  const handleTryitChange = (item, base, baseName) => {
    const boostables = dataSetLocal?.boostables ?? {};
    const currentBase = boostables?.[baseName] ?? base ?? {};
    if (Object.prototype.hasOwnProperty.call(currentBase, item)) {
      const newBase = {
        ...currentBase,
        [item]: {
          ...currentBase[item],
          tryit: currentBase[item]?.tryit === 1 ? 0 : 1,
        },
      };
      const newDataSetLocal = {
        ...dataSetLocal,
        boostables: {
          ...boostables,
          [baseName]: newBase,
        },
      };
      setdataSetLocal(newDataSetLocal);
      handleRefreshfTNFT(dataSet, newDataSetLocal);
      setTotBuyCheck(true);
    }

    /* if (base.hasOwnProperty(item)) {
      const newbase = { ...base, [item]: { ...base[item], tryit: base[item].tryit === 1 ? 0 : 1 } };
      const newDataSetLocal = { ...dataSetLocal, [baseName]: newbase };
      setdataSetLocal(newDataSetLocal);
      onReset(dataSet, newDataSetLocal);
      setTotBuyCheck(true);
    } */
  };
  const handleBuyitChange = (item) => {
    const itables = dataSetLocal?.itables ?? {};
    const it = itables?.it ?? {};
    if (!Object.prototype.hasOwnProperty.call(it, item)) return;
    const newIt = { ...it, [item]: { ...it[item], buyit: it[item]?.buyit === 1 ? 0 : 1, }, };
    const newDataSetLocal = { ...dataSetLocal, itables: { ...itables, it: newIt, }, };
    setdataSetLocal(newDataSetLocal);
    handleRefreshfTNFT(dataSet, newDataSetLocal);

    /* const it = { ...dataSetLocal.itables.it };
    const newbase = { ...it, [item]: { ...it[item], buyit: it[item].buyit === 1 ? 0 : 1 } };
    const newDataSetLocal = { ...dataSetLocal, ["it"]: newbase };
    setdataSetLocal(newDataSetLocal);
    onReset(dataSet, newDataSetLocal); */
  };
  const handleBuyitTotalChange = () => {
    const { it } = dataSetLocal.itables;
    for (let item in it) {
      it[item].buyit = iTotBuyCheck ? it[item].buyit === 0 ? 1 : 0 : 1;
    }
    const newDataSetLocal = { ...dataSetLocal };
    setdataSetLocal(newDataSetLocal);
  };
  const handleSpottryChange = (item, value, tier) => {
    const { it } = dataSetLocal.itables;
    const keySpot = "spot" + (tier || "") + "try";
    const xOtherTier = tier ? (tier === "3" ? "2" : "3") : "";
    const keySpotOther = "spot" + xOtherTier + "try";
    const getSpotValue = (itemObj) => (
      xOtherTier
        ? (itemObj.spottry >= value + itemObj[keySpotOther] ? value : itemObj.spottry - itemObj[keySpotOther])
        : value
    );
    const isCrop = it[item]?.cat === "crop" && !it[item]?.greenhouse;
    let newIt = { ...it };
    if (isCrop) {
      Object.keys(newIt).forEach((itemKey) => {
        if (newIt[itemKey]?.cat === "crop" && !newIt[itemKey]?.greenhouse) {
          const xvalue = getSpotValue(newIt[itemKey]);
          newIt[itemKey] = { ...newIt[itemKey], [keySpot]: xvalue };
        }
      });
    } else {
      const xvalue = getSpotValue(it[item]);
      newIt = { ...it, [item]: { ...it[item], [keySpot]: xvalue }, };
    }
    const newDataSetLocal = { ...dataSetLocal, itables: { ...dataSetLocal.itables, it: newIt, }, };
    //const newbase = { ...it, [item]: { ...it[item], [keySpot]: xvalue } };
    //const newDataSetLocal = { ...dataSetLocal, ["it"]: newbase };
    setdataSetLocal(newDataSetLocal);
    handleRefreshfTNFT(dataSet, newDataSetLocal);
  };
  function setContent(xit) {
    if (xit) {
      const itEntries = Object.entries(xit);
      const inventoryItems = itEntries.map(([item], index) => {
        const cobj = xit[item];
        const ico = cobj ? cobj.img : '';
        const ido = cobj ? cobj.id : 0;
        const costp = cobj ? (cobj.cost / dataSet.options.coinsRatio) : 0;
        const costptry = cobj ? (cobj.costtry / dataSet.options.coinsRatio) : 0;
        const costp2pt = cobj ? cobj.costp2pt : 0;
        const time = cobj ? cobj.time : 0;
        const timetry = cobj ? cobj.timetry : 0;
        const imyield = cobj ? cobj.myield : 0;
        const imyieldtry = cobj ? cobj.myieldtry : 0;
        const iharvest = cobj ? cobj.harvest : 0;
        const iharvesttry = cobj ? cobj.harvesttry : 0;
        const iharvestdmaxtry = cobj ? cobj.harvestdmaxtry : 0;
        const idsfl = cobj ? cobj.dailysfl : 0;
        const idsfltry = cobj ? cobj.dailysfltry : 0;
        const ibuyit = cobj ? cobj.buyit : 0;
        //const idsfl = cobj ? cobj.dsfltry : 0;
        //const tradeTax = (100 - dataSet.options.tradeTax) / 100;
        //let idsfl = !isNaN(((costp2pt * tradeTax) - costptry) * (iharvestdmaxtry)) ? (((costp2pt * tradeTax) - costptry) * (iharvestdmaxtry)) : 0;
        //if ((parseFloat(costp2pt).toFixed(3) === parseFloat(costptry).toFixed(3)) && idsfl < 0) { idsfl = 0; }
        //const iharvestdmax = cobj ? cobj.harvestdmax : 0;
        //const iharvestdmaxtry = cobj ? cobj.harvestdmaxtry : 0;
        const timechg = (((timmeto1(timetry) - timmeto1(time)) / timmeto1(time)) * 100) || 0;
        const txtTimeChg = timechg ? timechg === Infinity ? "ꝏ" : parseFloat(timechg).toFixed(0) : "";
        const costpchg = (((costptry - costp) / costp) * 100) || 0;
        const txtCostpChg = costpchg ? costpchg === Infinity ? "ꝏ" : parseFloat(costpchg).toFixed(0) : "";
        const imyieldchg = (((imyieldtry - imyield) / imyield) * 100) || 0;
        const txtMyieldChg = imyieldchg ? imyieldchg === Infinity ? "ꝏ" : parseFloat(imyieldchg).toFixed(0) : "";
        const iharvestchg = (((iharvesttry - iharvest) / iharvest) * 100) || 0;
        const txtHarvestChg = iharvestchg ? iharvestchg === Infinity ? "ꝏ" : parseFloat(iharvestchg).toFixed(0) : "";
        const idsflchg = (((idsfltry - idsfl) / Math.abs(idsfl)) * 100) || 0;
        const txtDsflChg = idsflchg ? !isFinite(idsflchg) ? "ꝏ" : parseFloat(idsflchg).toFixed(0) : "";
        const cellDSflStyle = {};
        cellDSflStyle.color = ColorValue(TryChecked ? idsfltry : idsfl, 0, 10);
        const xtime = TryChecked ? timetry : time;
        const xcost = TryChecked ? costptry : costp;
        const xmyield = TryChecked ? imyieldtry : imyield;
        const xharvest = TryChecked ? iharvesttry : iharvest;
        const xdsfl = TryChecked ? idsfltry : idsfl;
        const isTieredNode = (item === "Wood" || item === "Stone" || item === "Iron" || item === "Gold");
        return (
          <tr key={index}>
            <td style={{ display: 'none' }}>{ido}</td>
            <td id="iccolumn"><i><img src={ico} alt={''} className="itico" title={item} /></i></td>
            {/* <td className="tditem">{item}</td> */}
            <td className="tdcenter tooltipcell"
              onClick={(e) => handleTooltip(item, "trynft", "timechg", e)}>{xtime}</td>
            <td className={parseFloat(timechg).toFixed(0) > 0 ? 'chgneg tooltipcell' : parseFloat(timechg).toFixed(0) < 0 ? 'chgpos tooltipcell' : 'chgeq tooltipcell'}
              onClick={(e) => handleTooltip(item, "trynft", "timechg", e)}>{txtTimeChg}</td>
            <td className="tdcenter tooltipcell"
              onClick={(e) => handleTooltip(item, "trynft", "costchg", e)}>{frmtNb(xcost)}</td>
            <td className={parseFloat(costpchg).toFixed(0) > 0 ? 'chgneg tooltipcell' : parseFloat(costpchg).toFixed(0) < 0 ? 'chgpos tooltipcell' : 'chgeq tooltipcell'}
              onClick={(e) => handleTooltip(item, "trynft", "costchg", e)}>{txtCostpChg}</td>
            <td className="tdcenter tooltipcell"
              onClick={(e) => handleTooltip(item, "trynft", "yieldchg", e)}>{parseFloat(xmyield).toFixed(2)}</td>
            <td className={parseFloat(imyieldchg).toFixed(0) > 0 ? 'chgpos tooltipcell' : parseFloat(imyieldchg).toFixed(0) < 0 ? 'chgneg tooltipcell' : 'chgeq tooltipcell'}
              onClick={(e) => handleTooltip(item, "trynft", "yieldchg", e)}>{txtMyieldChg}</td>
            <td className="tdcenter tooltipcell"
              onClick={(e) => handleTooltip(item, "trynft", "yieldchg", e)}>{parseFloat(xharvest).toFixed(2)}</td>
            <td className={parseFloat(iharvestchg).toFixed(0) > 0 ? 'chgpos tooltipcell' : parseFloat(iharvestchg).toFixed(0) < 0 ? 'chgneg tooltipcell' : 'chgeq tooltipcell'}
              onClick={(e) => handleTooltip(item, "trynft", "yieldchg", e)}>{txtHarvestChg}</td>
            <td className="tdcenter">
              {/* <input
                type="checkbox"
                name={`buyit:${item}`}
                checked={ibuyit === 1}
                onChange={handleUIChange}
              /> */}
              <input type="checkbox" checked={ibuyit} onChange={() => handleBuyitChange(item)} />
            </td>
            <td className="tdcenter tooltipcell"
              onClick={(e) => handleTooltip(item, "dailysfl", (TryChecked ? "trynft" : ""), e)} style={{ ...cellDSflStyle }}>{parseFloat(xdsfl).toFixed(2)}</td>
            <td className={parseFloat(idsflchg).toFixed(0) > 0 ? 'chgpos tooltipcell' : parseFloat(idsflchg).toFixed(0) < 0 ? 'chgneg tooltipcell' : 'chgeq tooltipcell'}
              onClick={(e) => handleTooltip(item, "dailysfl", (TryChecked ? "trynft" : ""), e)}>{txtDsflChg}</td>
            <td className="tdcenter">
              <CounterInput
                value={xit[item][key("spot")]}
                onChange={value => handleSpottryChange(item, value, "")}
                min={0}
                max={99}
                activate={TryChecked}
              />
            </td>
            {isTieredNode ? <td className="tdcenter">
              <CounterInput
                value={xit[item][key("spot2")]}
                onChange={value => handleSpottryChange(item, value, "2")}
                min={0}
                max={99}
                activate={TryChecked}
              />
            </td> : null}
            {isTieredNode ? <td className="tdcenter">
              <CounterInput
                value={xit[item][key("spot3")]}
                onChange={value => handleSpottryChange(item, value, "3")}
                min={0}
                max={99}
                activate={TryChecked}
              />
            </td> : null}
          </tr>
        );
      });
      const xtableContent = (
        <>
          <thead>
            <tr>
              <td style={{ display: 'none' }}>ID</td>
              <th className="th-icon">   </th>
              {/* <th>Item</th> */}
              <th>Time</th>
              <th>%</th>
              <th>Cost</th>
              <th>%</th>
              <th>Yield</th>
              <th>%</th>
              <th>Harvest</th>
              <th>%</th>
              <th>Buy
                {/* <div><input type="checkbox" checked={iTotBuyCheck} onChange={() => handleBuyitTotalChange(item)} /></div> */}
              </th>
              <th>Daily<div>{imgSFL}</div></th>
              <th>%</th>
              <th>Nodes</th>
              <th>Tier2</th>
              <th>Tier3</th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems}
          </tbody>
        </>
      );
      settableContent(xtableContent);
      //tableContent = xtableContent;
    }
  }
  function setNFT(xdataSetFarm) {
    if (!xdataSetFarm?.boostables) {
      settableNFT([]);
      return;
    }
    const { nft, nftw, buildng, skill, skilllgc, bud, shrine } = xdataSetFarm.boostables;
    const showNFT = selectedBoostTab === "collectibles";
    const showNFTW = selectedBoostTab === "wearables";
    const showCraft = selectedBoostTab === "craft";
    const showBud = selectedBoostTab === "buds";
    const showSkill = selectedBoostTab === "skills";
    const showShrine = selectedBoostTab === "shrines";
    let totalCost = 0;
    let totalCostM = 0;
    let totalCostactiv = 0;
    let totalCostactivM = 0;
    const nftEntries = nft && Object.entries(nft);
    const nftwEntries = nftw && Object.entries(nftw);
    const buildEntries = buildng && Object.entries(buildng);
    const skillEntries = skill && Object.entries(skill);
    const skilllgcEntries = skilllgc && Object.entries(skilllgc);
    const shrineEntries = shrine && Object.entries(shrine);
    const budEntries = bud && Object.entries(bud);
    const imgOS = <img src='./icon/ui/openseaico.png' alt={''} className="nftico" />;
    const imgexchng = <img src='./icon/ui/exchange.png' alt={''} className="nftico" />;
    const showTotal = (showNFTW || showNFT);
    const showOpenSeaCol = showTotal && nftPriceCols.includes("opensea");
    const showMarketCol = showTotal && nftPriceCols.includes("market");
    const parseNumOrNull = (v) => {
      if (v === null || v === undefined || v === "") { return null; }
      if (typeof v === "number") { return Number.isFinite(v) ? v : null; }
      let txt = String(v ?? "").trim();
      if (!txt) { return null; }
      // Keep only numeric signs/separators, then normalize locale formats.
      txt = txt.replace(/[^\d.,-]/g, "");
      if (!txt) { return null; }
      const lastComma = txt.lastIndexOf(",");
      const lastDot = txt.lastIndexOf(".");
      if (lastComma > -1 && lastDot > -1) {
        const decimalSep = lastComma > lastDot ? "," : ".";
        const thousandsSep = decimalSep === "," ? "." : ",";
        txt = txt.replace(new RegExp(`\\${thousandsSep}`, "g"), "");
        if (decimalSep === ",") { txt = txt.replace(",", "."); }
      } else if (lastComma > -1) {
        txt = txt.replace(",", ".");
      }
      const n = Number(txt);
      return Number.isFinite(n) ? n : null;
    };
    const toNum = (v) => {
      const n = parseNumOrNull(v);
      return n === null ? 0 : n;
    };
    const isOn = (v) => v === 1 || v === true;
    const usdPerSfl = Number(priceData?.[2] ?? dataSet?.options?.usdSfl ?? 0);
    const toDisplayPrice = (value) => {
      const parsed = parseNumOrNull(value);
      if (parsed === null) { return null; }
      const base = parsed;
      if (nftPriceUnit === "flower") {
        return usdPerSfl > 0 ? (base / usdPerSfl) : base;
      }
      return base;
    };
    const formatPriceCell = (value) => {
      const displayed = toDisplayPrice(value);
      if (displayed === null) { return ""; }
      return frmtNb(displayed, 2);
    };

    const addTotalsFromEntries = (entries, mode) => {
      if (!entries) { return; }
      for (const [, value] of entries) {
        if (!value) { continue; }
        if (mode === "price") {
          if (isOn(value.tryit)) {
            totalCost += toNum(value.price);
            totalCostM += toNum(value.pricem);
          }
          if (isOn(value.isactive)) {
            totalCostactiv += toNum(value.price);
            totalCostactivM += toNum(value.pricem);
          }
          continue;
        }
        if (mode === "points") {
          if (isOn(value.tryit)) {
            totalCost += toNum(value.points);
            totalCostM += toNum(value.pricem);
          }
          if (isOn(value.isactive)) {
            totalCostactiv += toNum(value.points);
            totalCostactivM += toNum(value.pricem);
          }
        }
      }
    };

    if (showNFT) { addTotalsFromEntries(nftEntries, "price"); }
    if (showNFTW) { addTotalsFromEntries(nftwEntries, "price"); }
    if (showCraft) { addTotalsFromEntries(buildEntries, "price"); }
    if (showBud) { addTotalsFromEntries(budEntries, "price"); }
    if (showShrine) { addTotalsFromEntries(shrineEntries, "price"); }
    if (showSkill) { addTotalsFromEntries(skillEntries, "points"); }

    var NFT = [];
    //settableNFT("");
    if (nftEntries && showNFT) {
      for (const [item, value] of nftEntries) {
        if (!applyBoostFilters(item, value)) { continue; }
        let isupply = 0;
        if (value.supply) { isupply = value.supply };
        NFT.push(
          <tr key={item}>
            <td className="tditemright">{item}</td>
            <td className="tdcenter" id="iccolumn"><i><img src={value.img} alt={''} className="nftico" /></i></td>
            <td className="tdcenter">
              <input type="checkbox" checked={nft[item].tryit} onChange={() => handleTryitChange(item, nft, "nft")} />
            </td>
            <td className="tdcenter">
              <input type="checkbox" className={'checkbox-disabled'} checked={value.isactive} />
            </td>
            {showOpenSeaCol ? (<td className="tdcenter">{formatPriceCell(value.price)}</td>) : ("")}
            {showMarketCol ? (<td className="tdcenter">{formatPriceCell(value.pricem || 0)}</td>) : ("")}
            <td className="tdcenter tooltipcell" onClick={(e) => handleTooltip(item, "trynftsupply", "nft", e)}>{isupply}</td>
            <td className="tditemnft" style={{ color: `rgb(190, 190, 190)` }}>{value.boost}</td>
          </tr>
        );
      }
    }
    if (nftwEntries && showNFTW) {
      for (const [itemw, valuew] of nftwEntries) {
        if (!applyBoostFilters(itemw, valuew)) { continue; }
        let isupplyw = 0;
        if (valuew.supply) { isupplyw = valuew.supply };
        NFT.push(
          <tr key={itemw}>
            <td className="tditemright">{itemw}</td>
            <td className="tdcenter" id="iccolumn"><i><img src={valuew.img} alt={''} className="nftico" /></i></td>
            <td className="tdcenter">
              <input type="checkbox" checked={nftw[itemw].tryit} onChange={() => handleTryitChange(itemw, nftw, "nftw")} />
            </td>
            <td className="tdcenter">
              <input type="checkbox" className={'checkbox-disabled'} checked={valuew.isactive} />
            </td>
            {showOpenSeaCol ? (<td className="tdcenter">{formatPriceCell(valuew.price)}</td>) : ("")}
            {showMarketCol ? (<td className="tdcenter">{formatPriceCell(valuew.pricem || 0)}</td>) : ("")}
            <td className="tdcenter tooltipcell" onClick={(e) => handleTooltip(itemw, "trynftsupply", "nftw", e)}>{isupplyw}</td>
            <td className="tditemnft" style={{ color: `rgb(190, 190, 190)` }}>{valuew.boost}</td>
          </tr>
        );
      }
    }
    if (buildEntries && showCraft) {
      for (const [itemb, valueb] of buildEntries) {
        if (!applyBoostFilters(itemb, valueb)) { continue; }
        let isupplyb = 0;
        if (valueb.supply) { isupplyb = valueb.supply };
        NFT.push(
          <tr key={itemb}>
            <td className="tditemright">{itemb}</td>
            <td className="tdcenter" id="iccolumn"><i><img src={valueb.img} alt={''} className="nftico" /></i></td>
            <td className="tdcenter">
              <input type="checkbox" checked={buildng[itemb].tryit} onChange={() => handleTryitChange(itemb, buildng, "buildng")} />
            </td>
            <td className="tdcenter">
              <input type="checkbox" className={'checkbox-disabled'} checked={valueb.isactive} />
            </td>
            <td className="tdcenter">{isupplyb}</td>
            <td className="tditemnft" style={{ color: `rgb(190, 190, 190)` }}>{valueb.boost}</td>
          </tr>
        );
      }
    }
    if (skillEntries && showSkill) {
      let tierPoints = {};
      const catPoints = {
        Crops: { 2: 3, 3: 7 },
        Fruits: { 2: 2, 3: 5 },
        Trees: { 2: 2, 3: 5 },
        Fishing: { 2: 2, 3: 5 },
        Animals: { 2: 4, 3: 8 },
        Greenhouse: { 2: 2, 3: 5 },
        Mining: { 2: 3, 3: 7 },
        Cooking: { 2: 2, 3: 5 },
        "Bees Flowers": { 2: 2, 3: 5 },
        Machinery: { 2: 2, 3: 5 },
        Compost: { 2: 3, 3: 7 }
      };
      // Prerequisite check must use all selected skills, even if some are hidden by filters.
      for (const [items, values] of skillEntries) {
        const cat = skill?.[items]?.cat;
        const tier = skill?.[items]?.tier;
        if (!cat || !tier) { continue; }
        if (!tierPoints[cat]) { tierPoints[cat] = {}; }
        if (!tierPoints[cat][tier]) { tierPoints[cat][tier] = 0; }
        if (isOn(values?.tryit)) {
          tierPoints[cat][tier] += toNum(values?.points);
        }
      }
      let currentCategory = null;
      for (const [items, values] of skillEntries) {
        if (!applyBoostFilters(items, values)) { continue; }
        if (values.cat !== currentCategory) {
          currentCategory = values.cat;
          NFT.push(
            <tr key={`skill-cat-${currentCategory}`}>
              <td colSpan={5} style={{ textAlign: "center", fontWeight: "bold" }}>
                {currentCategory}
              </td>
            </tr>
          );
        }
        const cellStyle = {};
        cellStyle.backgroundColor = skill[items].tier === 1 ? `rgba(0, 116, 25, 0.63)` : skill[items].tier === 2 ? `rgba(0, 2, 116, 0.63)` : `rgba(114, 116, 0, 0.63)`;
        if (skill[items].tier === 2 && ((catPoints[skill[items].cat]?.[2] || 0) > (tierPoints[skill[items].cat]?.[1] || 0))) {
          cellStyle.backgroundColor = `rgba(255, 94, 94, 0.63)`;
        }
        if (skill[items].tier === 3 && ((catPoints[skill[items].cat]?.[3] || 0) > ((tierPoints[skill[items].cat]?.[1] || 0) + (tierPoints[skill[items].cat]?.[2] || 0)))) {
          cellStyle.backgroundColor = `rgba(255, 94, 94, 0.63)`;
        }
        NFT.push(
          <tr key={items}>
            <td className="tditemright" style={cellStyle}>{items}</td>
            <td className="tdcenter" id="iccolumn"><i><img src={values.img} alt={''} className="nftico" /></i></td>
            <td className="tdcenter">
              <input type="checkbox" checked={skill[items].tryit} onChange={() => handleTryitChange(items, skill, "skill")} />
            </td>
            <td className="tdcenter">
              <input type="checkbox" className={'checkbox-disabled'} checked={values.isactive} />
            </td>
            <td className="tditemnft" style={{ color: `rgb(190, 190, 190)` }}>{values.boost}</td>
          </tr>
        );
      }
    }
    if (skilllgcEntries && showSkill) {
      const visibleSkilllgcEntries = skilllgcEntries.filter(([items, values]) => applyBoostFilters(items, values));
      if (visibleSkilllgcEntries.length > 0) {
        NFT.push(
          <tr key="skill-legacy-title">
            <td colSpan={5} style={{ textAlign: "center", fontWeight: "bold" }}>
              Badges (Legacy skills not obtainable anymore)
            </td>
          </tr>
        );
      }
      for (const [items, values] of visibleSkilllgcEntries) {
        /* if (values.tryit) {
          totalCost += Number(values.points);
          totalCostM += Number(values.pricem) || 0;
        }
        if (values.isactive) {
          totalCostactiv += Number(values.points);
          totalCostactivM += Number(values.pricem) || 0;
        } */
        const cellStyle = {};
        //cellStyle.backgroundColor = xskill[items].tier === 1 ? `rgba(0, 116, 25, 0.63)` : xskill[items].tier === 2 ? `rgba(0, 2, 116, 0.63)` : `rgba(114, 116, 0, 0.63)`;
        NFT.push(
          <tr key={items}>
            <td className="tditemright" style={cellStyle}>{items}</td>
            <td className="tdcenter" id="iccolumn"><i><img src={values.img} alt={''} className="nftico" /></i></td>
            <td className="tdcenter">
              <input type="checkbox" checked={skilllgc[items].tryit} onChange={() => handleTryitChange(items, skilllgc, "skilllgc")} />
            </td>
            <td className="tdcenter">
              <input type="checkbox" className={'checkbox-disabled'} checked={values.isactive} />
            </td>
            <td className="tditemnft" style={{ color: `rgb(190, 190, 190)` }}>{values.boost}</td>
          </tr>
        );
      }
    }
    if (budEntries && showBud) {
      for (const [itembd, valuebd] of budEntries) {
        if (!applyBoostFilters(itembd, valuebd)) { continue; }
        NFT.push(
          <tr key={itembd}>
            <td className="tditemright">{itembd}</td>
            <td className="tdcenter" id="iccolumn"><i><img src={valuebd.img} alt={''} className="nftico" /></i></td>
            <td className="tdcenter">
              <input type="checkbox" checked={bud[itembd].tryit} onChange={() => handleTryitChange(itembd, bud, "bud")} />
            </td>
            <td className="tdcenter">
              <input type="checkbox" className={'checkbox-disabled'} checked={valuebd.isactive} />
            </td>
            <td className="tditemnft" style={{ color: `rgb(190, 190, 190)` }}>{valuebd.boost}</td>
          </tr>
        );
      }
    }
    if (shrineEntries && showShrine) {
      for (const [itemb, valueb] of shrineEntries) {
        if (!applyBoostFilters(itemb, valueb)) { continue; }
        let isupplyb = 0;
        if (valueb.supply) { isupplyb = valueb.supply || 0 };
        NFT.push(
          <tr key={itemb}>
            <td className="tditemright">{itemb}</td>
            <td className="tdcenter" id="iccolumn"><i><img src={valueb.img} alt={''} className="nftico" /></i></td>
            <td className="tdcenter">
              <input type="checkbox" checked={shrine[itemb].tryit} onChange={() => handleTryitChange(itemb, shrine, "shrine")} />
            </td>
            <td className="tdcenter">
              <input type="checkbox" className={'checkbox-disabled'} checked={valueb.isactive} />
            </td>
            <td className="tdcenter">{isupplyb}</td>
            <td className="tditemnft" width="500px" style={{ color: `rgb(190, 190, 190)` }}>{valueb.boost}</td>
          </tr>
        );
      }
    }
    const totalCostToDisplayRaw = (TotalCostDisplay === "opensea" || showSkill) ? totalCost : totalCostM;
    const totalCostToDisplay = (!showSkill && nftPriceUnit === "flower" && usdPerSfl > 0)
      ? totalCostToDisplayRaw / usdPerSfl
      : totalCostToDisplayRaw;
    const totalCostactivDisplay = (nftPriceUnit === "flower" && usdPerSfl > 0) ? (totalCostactiv / usdPerSfl) : totalCostactiv;
    const totalCostactivMDisplay = (nftPriceUnit === "flower" && usdPerSfl > 0) ? (totalCostactivM / usdPerSfl) : totalCostactivM;
    /* NFT.unshift(
      <tr key="total">
        <td colSpan="3">Total</td>
        <td className="tdcenter">{frmtNb(totalCost)}</td>
      </tr>
    ); */
    const txtTotal = (showSkill || showTotal) && "Total ";
    const widthTotal = showTotal ? 150 : 140;
    const xtableNFT = (
      <>
        <thead>
          <tr>
            {/* <td style={{ display: 'none' }}>ID</td> */}
            <th style={{ width: widthTotal }} colSpan={2}>Item</th>
            {/* <th className="tdcenter"> </th> */}
            <th className="tdcenter">Try</th>
            <th className="tdcenter" style={{ fontSize: "10px" }}>Active</th>
            {showOpenSeaCol ? (<th className="tdcenter">{imgOS}</th>) : ("")}
            {showMarketCol ? (<th className="tdcenter">{imgexchng}</th>) : ("")}
            {(showTotal || showCraft || showShrine) ? (<th className="tdcenter">Supply</th>) : ("")}
            <th style={{ width: `150px` }}>Boost</th>
          </tr>
          <tr key="total">
            <td align="right" style={{ width: widthTotal, whiteSpace: "nowrap" }} colSpan={2}>{txtTotal}{showTotal &&
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, flexWrap: "nowrap" }}>
                {(showOpenSeaCol && showMarketCol) ? (
                  <DList
                    name="TotalCostDisplay"
                    options={NFT_TOTAL_COST_OPTIONS}
                    value={TotalCostDisplay}
                    onChange={handleChangeTotalCostDisplay}
                    iconOnly={true}
                    menuIconOnly={true}
                    width={38}
                    height={28}
                  />
                ) : null}
                <DList
                  name="nftPriceUnit"
                  options={NFT_PRICE_UNIT_OPTIONS}
                  value={nftPriceUnit}
                  onChange={handleNftPriceUnitChange}
                  iconOnly={true}
                  menuIconOnly={true}
                  width={38}
                  height={28}
                />
              </span>}</td>
            {/* <td className="tdcenter"></td> */}
            <td className="tdcenter">{(showTotal || showSkill) && frmtNb(totalCostToDisplay, 2)}</td>
            <td className="tdcenter">{showSkill ? parseFloat(totalCostactiv).toFixed(0) : ""}</td>
            {showOpenSeaCol ? (<td className="tdcenter">{frmtNb(totalCostactivDisplay, 2)}</td>) : ("")}
            {showMarketCol ? (<td className="tdcenter">{frmtNb(totalCostactivMDisplay, 2)}</td>) : ("")}
            {(showTotal || showCraft || showShrine) ? (<td></td>) : ("")}
            <td></td>
          </tr>
        </thead>
        <tbody>
          {NFT}
        </tbody>
      </>
    );
    settableNFT(xtableNFT);
    //tableNFT = xtableNFT;
  }
  /* useEffect(() => {
    Refresh();
  }, []); */
  useEffect(() => {
    if (!hasTryNftTables) { return; }
    setNFT(dataSetLocal);
    setContent(dataSetLocal.itables.it);
  }, [dataSetLocal, TotalCostDisplay, TryChecked, selectedBoostTab, boostTypeFilters, boostCategoryFilters, nftPriceCols, nftPriceUnit, hasTryNftTables]);

  const tableStyle = {
    flexDirection: tableFlexDirection,
    display: 'flex',
    flex: 1,
    minHeight: 0,
    overflow: 'visible'
  };
  return (
    <div style={{
      position: 'fixed',
      top: '0',
      width: '100%',
      backgroundColor: 'var(--background-color)',
      justifyContent: 'center',
      zIndex: '990',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        maxHeight: '100vh'
      }}>
        {/* <h2>Try NFT</h2> */}
        <div style={headerRowStyle}>
          <div style={actionBarStyle}>
            <button onClick={closeModal} class="button"><img src="./icon/ui/cancel.png" alt="" className="resico" /></button>
            <button
              onPointerDown={(e) => {
                const el = e.currentTarget;
                if (el.dataset.locked === "1") {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                el.dataset.locked = "1";
              }}
              onClick={(e) => {
                const el = e.currentTarget;
                if (el.disabled) return;
                Refresh();
                el.disabled = true;
                el.classList.add("is-wait");
                setTimeout(() => {
                  el.disabled = false;
                  el.classList.remove("is-wait");
                  el.dataset.locked = "";
                }, 2000);
              }}
              //onClick={Refresh}
              class="button"
              disabled={cdButton}>
              <img src="./icon/ui/refresh.png" alt="" className="resico" />
            </button>
            <button onClick={Reset} title="Reset to active set" class="button">
              <img src="./icon/ui/resettry.png" alt="" className="resico" />
            </button>
            <button onClick={SetZero} title="Disable all NFT/Skill boosts" class="button">
              <img src="./icon/ui/noboosttry.png" alt="" className="resico" />
            </button>
            <button onClick={handleButtonHelpClick} title="Help" class="button"><img src="./icon/nft/na.png" alt="" className="itico" /></button>
            <div style={switchWrapStyle}>
              <FormControlLabel
                control={
                  <Switch
                    name="TryChecked"
                    checked={TryChecked}
                    onChange={handleUIChange}
                    color="primary"
                    size="small"
                    sx={{
                      '& .MuiSwitch-track': {
                        backgroundColor: 'rgba(140, 140, 140, 0.7)',
                      },
                    }}
                  />
                }
                label={TryChecked ? 'Tryset' : 'Activeset'}
                sx={{
                  marginRight: 0,
                  '& .MuiFormControlLabel-label': {
                    fontSize: '11px',
                    lineHeight: 1,
                  }
                }}
              />
            </div>
          </div>
          <div style={viewBarStyle}>
            <DList
              options={NFT_PRICE_COLUMN_OPTIONS}
              value={nftPriceCols}
              multiple={true}
              closeOnSelect={false}
              emitEvent={false}
              onChange={handleNftPriceColsChange}
              listIcon="./options.png"
              iconOnly={true}
              height={28}
              menuMinWidth={160}
            />
            <button class="button"
              onClick={() => setTableFlexDirection(dir => dir === 'row' ? 'column' : 'row')}
            >
              {tableFlexDirection === 'row' ? <img src="./icon/ui/horizontal.png" alt="" className="resico" /> : <img src="./icon/ui/vertical.png" alt="" className="resico" />}
            </button>
            <button class="button"
              onClick={() => setTableView(view =>
                view === 'both' ? 'left' : view === 'left' ? 'right' : 'both'
              )}
            >
              {tableView === 'both' ? <img src="./icon/ui/crops.png" alt="" className="resico" /> : tableView === 'left' ? <img src="./icon/ui/lightning.png" alt="" className="resico" />
                : <img src="./icon/ui/cropslightning.png" alt="" className="resico" />}
            </button>
          </div>
          <div style={filterPanelStyle}>
            {BOOST_TAB_KEYS.map((category) => (
              <button
                key={category}
                onClick={() => handleTabChange(category)}
                style={categoryButtonStyle(selectedBoostTab === category)}
                title="Select tab"
              >
                {BOOST_CATEGORY_LABELS[category]}
              </button>
            ))}
            <DList
              placeholder="Type"
              options={boostTypeOptions}
              value={boostTypeFilters}
              multiple={true}
              closeOnSelect={false}
              emitEvent={false}
              onChange={handleBoostTypeChange}
              //width={115}
              height={20}
              menuMinWidth={dlistMinWidth}
            />
            <DList
              placeholder="Category"
              options={boostCategoryOptions}
              value={boostCategoryFilters}
              multiple={true}
              closeOnSelect={false}
              emitEvent={false}
              onChange={handleBoostCategoryChange}
              //width={115}
              height={20}
              menuMinWidth={dlistMinWidth}
            />
          </div>
        </div>
        {!hasTryNftTables ? (
          <div style={{ padding: '12px 8px' }}>Loading TryNFT tables...</div>
        ) : (
          <div style={tableStyle}>
            {(tableView === 'both' || tableView === 'left') && (
              <div style={{
                flex: 1,
                overflow: 'auto',
                minHeight: 0,
                display: tableView === 'right' ? 'none' : 'block'
              }}>
                <table>{tableContent}</table>
              </div>
            )}
            {(tableView === 'both' || tableView === 'right') && (
              <div style={{
                flex: 1,
                overflow: 'auto',
                minHeight: 0,
                display: tableView === 'left' ? 'none' : 'block'
              }}>
                <table>{tableNFT}</table>
              </div>
            )}
          </div>
        )}
      </div>
      {/* {tooltipData && (
        <Tooltip
          onClose={() => setTooltipData(null)}
          clickPosition={tooltipData}
          item={tooltipData.item}
          context={tooltipData.context}
          value={tooltipData.value}
          dataSet={dataSet}
          dataSetFarm={dataSetLocal}
          ForTry={TryChecked}
        />
      )} */}
      {showHelp && (
        <Help onClose={handleCloseHelp} image={helpImage} />
      )}
    </div>
  );
}
function timmeto1(inputTime) {
  const timeComponents = inputTime.split(':').map(Number);
  const [hours, minutes, seconds] = timeComponents;
  const decimalHours = hours + minutes / 60 + seconds / 3600;
  const normalizedTime = decimalHours / 24;
  return normalizedTime;
}

export default ModalTNFT;


