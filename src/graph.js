import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { format, parseISO } from 'date-fns';
import DList from "./dlist.jsx";

Chart.register(...registerables);
const imgsfl = './icon/res/flowertoken.webp';
const imgusdc = "./usdc.png";
const BOOST_PRICE_UNIT_OPTIONS = [
  { value: "flower", label: "Flower", iconSrc: imgsfl },
  { value: "usdc", label: "USDC", iconSrc: imgusdc },
];

const SEASON_ORDER = ["spring", "summer", "autumn", "winter"];
const SEASON_STYLES = {
  spring: {
    icon: "./icon/ui/spring.webp",
    fillStart: "rgba(104, 179, 91, 0.18)",
    fillEnd: "rgba(104, 179, 91, 0.04)",
    line: "rgba(104, 179, 91, 0.34)",
  },
  summer: {
    icon: "./icon/ui/summer.webp",
    fillStart: "rgba(230, 185, 59, 0.18)",
    fillEnd: "rgba(230, 185, 59, 0.04)",
    line: "rgba(230, 185, 59, 0.34)",
  },
  autumn: {
    icon: "./icon/ui/autumn.webp",
    fillStart: "rgba(205, 120, 54, 0.18)",
    fillEnd: "rgba(205, 120, 54, 0.04)",
    line: "rgba(205, 120, 54, 0.34)",
  },
  winter: {
    icon: "./icon/ui/winter.webp",
    fillStart: "rgba(87, 168, 224, 0.18)",
    fillEnd: "rgba(87, 168, 224, 0.04)",
    line: "rgba(87, 168, 224, 0.34)",
  },
};
const seasonImageCache = {};

function getStartOfMonday(dateValue) {
  const date = new Date(dateValue);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + offset);
  return date;
}

function getSeasonAtMonday(cursorMs, currentSeason, currentMondayMs) {
  const normalizedSeason = SEASON_ORDER.includes(currentSeason) ? currentSeason : "spring";
  const baseIndex = SEASON_ORDER.indexOf(normalizedSeason);
  const weekOffset = Math.round((cursorMs - currentMondayMs) / (7 * 24 * 60 * 60 * 1000));
  const seasonIndex = ((baseIndex + weekOffset) % SEASON_ORDER.length + SEASON_ORDER.length) % SEASON_ORDER.length;
  return SEASON_ORDER[seasonIndex];
}

function getSeasonImage(iconSrc) {
  if (!iconSrc) return null;
  if (!seasonImageCache[iconSrc]) {
    const img = new Image();
    img.src = iconSrc;
    seasonImageCache[iconSrc] = img;
  }
  return seasonImageCache[iconSrc];
}

const mondayMidnightLinePlugin = {
  id: 'mondayMidnightLine',
  beforeDatasetsDraw(chart) {
    const xScale = chart?.scales?.x;
    const chartArea = chart?.chartArea;
    if (!xScale || !chartArea) return;

    const minMs = Number(xScale.min);
    const maxMs = Number(xScale.max);
    if (!Number.isFinite(minMs) || !Number.isFinite(maxMs) || maxMs <= minMs) return;

    const currentSeason = String(chart?.options?.plugins?.mondayMidnightLine?.currentSeason || "spring").toLowerCase();
    const currentMondayMs = getStartOfMonday(Date.now()).getTime();
    const firstVisibleMondayMs = getStartOfMonday(minMs).getTime();
    let cursorMs = firstVisibleMondayMs;
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const { ctx } = chart;
    ctx.save();
    ctx.beginPath();
    ctx.rect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
    ctx.clip();

    while (cursorMs <= maxMs) {
      const nextCursorMs = cursorMs + weekMs;
      const segmentStartMs = Math.max(cursorMs, minMs);
      const segmentEndMs = Math.min(nextCursorMs, maxMs);
      const startX = xScale.getPixelForValue(segmentStartMs);
      const endX = xScale.getPixelForValue(segmentEndMs);
      const seasonKey = getSeasonAtMonday(cursorMs, currentSeason, currentMondayMs);
      const seasonStyle = SEASON_STYLES[seasonKey] || SEASON_STYLES.spring;

      if (Number.isFinite(startX) && Number.isFinite(endX) && endX > startX) {
        const gradient = ctx.createLinearGradient(startX, chartArea.top, endX, chartArea.top);
        gradient.addColorStop(0, seasonStyle.fillStart);
        gradient.addColorStop(1, seasonStyle.fillEnd);
        ctx.fillStyle = gradient;
        ctx.fillRect(startX, chartArea.top, endX - startX, chartArea.bottom - chartArea.top);
      }
      cursorMs = nextCursorMs;
    }

    cursorMs = firstVisibleMondayMs;
    ctx.strokeStyle = 'rgba(236, 253, 255, 0.24)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);

    while (cursorMs <= maxMs) {
      const x = xScale.getPixelForValue(cursorMs);
      if (Number.isFinite(x) && x >= chartArea.left && x <= chartArea.right) {
        const seasonKey = getSeasonAtMonday(cursorMs, currentSeason, currentMondayMs);
        const seasonStyle = SEASON_STYLES[seasonKey] || SEASON_STYLES.spring;
        ctx.beginPath();
        ctx.strokeStyle = seasonStyle.line;
        ctx.moveTo(x, chartArea.top);
        ctx.lineTo(x, chartArea.bottom);
        ctx.stroke();

        const seasonImage = getSeasonImage(seasonStyle.icon);
        if (seasonImage && !seasonImage.complete && !seasonImage.__mondayRedrawBound) {
          seasonImage.__mondayRedrawBound = true;
          seasonImage.onload = () => {
            chart.draw();
          };
        }
        if (seasonImage?.complete) {
          const iconSize = 18;
          const iconX = x - (iconSize / 2);
          const iconY = chartArea.bottom - iconSize - 4;
          ctx.save();
          ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
          ctx.shadowBlur = 4;
          ctx.drawImage(seasonImage, iconX, iconY, iconSize, iconSize);
          ctx.restore();
        }
      }
      cursorMs += weekMs;
    }

    ctx.restore();
  },
};

Chart.register(mondayMidnightLinePlugin);

const categoryGroups = {
  "crops": ["crop"],
  "wood minerals": ["wood", "mineral", "gem"],
  "fruits honey": ["fruit", "honey", "mushroom"],
  "animals": ["animal"],
  "pets": ["pet"],
};

function parseGraphDate(value) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const raw = String(value || "").trim();
  if (!raw) return null;

  const iso = parseISO(raw);
  if (!Number.isNaN(iso.getTime())) return iso;

  const shortUsMatch = raw.match(/^(\d{2})\/(\d{2})\/(\d{2})$/);
  if (shortUsMatch) {
    const [, mm, dd, yy] = shortUsMatch;
    const d = new Date(Date.UTC(2000 + Number(yy), Number(mm) - 1, Number(dd), 12, 0, 0));
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function Graph({ data, vals, dataSetFarm, graphMeta = {}, selectedCategory = 'all', legendResetToken = 0, isLoading = false }) {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  const mergedGraphTables = useMemo(() => {
    const sources = [
      dataSetFarm,
      dataSetFarm?.invData,
      dataSetFarm?.cookData,
      dataSetFarm?.fishData,
      dataSetFarm?.bountyData,
      dataSetFarm?.craftData,
      dataSetFarm?.flowerData,
      dataSetFarm?.expandPageData,
      dataSetFarm?.animalData,
      dataSetFarm?.petData,
      dataSetFarm?.mapData,
      dataSetFarm?.cropMachineData,
      dataSetFarm?.buyNodesData,
    ];

    const merged = { it: {}, petit: {} };
    sources.forEach((src) => {
      const tables = src?.itables;
      if (!tables || typeof tables !== "object") return;
      if (tables.it && typeof tables.it === "object") {
        Object.assign(merged.it, tables.it);
      }
      if (tables.petit && typeof tables.petit === "object") {
        Object.assign(merged.petit, tables.petit);
      }
    });

    return merged;
  }, [dataSetFarm]);

  const { it, petit } = mergedGraphTables;

  const [hiddenLabels, setHiddenLabels] = useState(new Set());
  const [soloLabel, setSoloLabel] = useState(null);
  const [selectedBoostNft, setSelectedBoostNft] = useState([]);
  const [selectedBoostNftw, setSelectedBoostNftw] = useState([]);
  const [boostPriceUnit, setBoostPriceUnit] = useState("flower");
  const [boostSelectionCleared, setBoostSelectionCleared] = useState(false);
  const boostAutoInitDoneRef = useRef(false);
  const prevCategoryRef = useRef(selectedCategory);
  const legendResetMountedRef = useRef(false);
  const usdPerSfl = Number(dataSetFarm?.priceData?.[2] || 0);

  const pickOneRandom = (arr) => {
    if (!Array.isArray(arr) || arr.length < 1) return [];
    const index = Math.floor(Math.random() * arr.length);
    return [arr[index]];
  };

  const boostKeys = useMemo(() => {
    const nftByName = new Set();
    const nftwByName = new Set();

    Object.entries(graphMeta || {}).forEach(([idKey, meta]) => {
      const name = String(meta?.name || "").trim();
      const boostTable = String(meta?.boostTable || "").toLowerCase().trim();
      if (boostTable === "nft") {
        if (name) nftByName.add(name);
      }
      if (boostTable === "nftw") {
        if (name) nftwByName.add(name);
      }
    });

    Object.entries(dataSetFarm?.boostables?.nft || {}).forEach(([name, item]) => {
      if (name) nftByName.add(name);
    });

    Object.entries(dataSetFarm?.boostables?.nftw || {}).forEach(([name, item]) => {
      if (name) nftwByName.add(name);
    });

    return { nftByName, nftwByName };
  }, [dataSetFarm, graphMeta]);

  const boostSupplyByName = useMemo(() => {
    const out = {};
    const add = (table) => {
      Object.entries(table || {}).forEach(([name, row]) => {
        out[String(name || "")] = {
          supply: Number(row?.supply || 0),
          inactive: Number(row?.inactive || 0),
          listed: Number(row?.listed || 0),
        };
      });
    };
    add(dataSetFarm?.boostables?.nft || {});
    add(dataSetFarm?.boostables?.nftw || {});
    return out;
  }, [dataSetFarm]);

  const idName = useMemo(() => {
    const map = {};

    for (const item in it) {
      if (!map[it[item].id]) {
        map[it[item].id] = {};
      }
      if (it[item].color) {
        map[it[item].id].name = item;
        map[it[item].id].color = it[item].color;
        map[it[item].id].cat = it[item].cat;
        map[it[item].id].img = it[item].img;
        map[it[item].id].active = Number(it[item].supply || 0);
        map[it[item].id].inactive = Number(it[item].inactive || 0);
        map[it[item].id].listed = Number(it[item].listed || 0);
      }
    }

    for (const item in petit) {
      if (!map[petit[item].id]) {
        map[petit[item].id] = {};
      }
      if (petit[item].color) {
        map[petit[item].id].name = item;
        map[petit[item].id].color = petit[item].color;
        map[petit[item].id].cat = petit[item].cat;
        map[petit[item].id].img = petit[item].img;
        map[petit[item].id].active = Number(petit[item].supply || 0);
        map[petit[item].id].inactive = Number(petit[item].inactive || 0);
        map[petit[item].id].listed = Number(petit[item].listed || 0);
      }
    }

    Object.keys(graphMeta || {}).forEach((idKey) => {
      const id = Number(idKey);
      if (!Number.isFinite(id)) return;
      const meta = graphMeta[idKey] || graphMeta[id] || {};
      if (!map[id]) map[id] = {};
      map[id].name = map[id].name || meta.name || `#${id}`;
      map[id].color = map[id].color || meta.color || "#6b7280";
      map[id].cat = map[id].cat || meta.cat || "";
      map[id].img = map[id].img || meta.img || "./icon/nft/na.png";
      map[id].active = Number(map[id].active ?? meta.active ?? 0);
      map[id].inactive = Number(map[id].inactive ?? meta.inactive ?? 0);
      map[id].listed = Number(map[id].listed ?? meta.listed ?? 0);
    });

    return map;
  }, [it, petit, graphMeta]);

  const randomBoostColor = (key) => {
    const txt = String(key || "");
    let hash = 0;
    for (let i = 0; i < txt.length; i += 1) {
      hash = ((hash << 5) - hash) + txt.charCodeAt(i);
      hash |= 0;
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 78%, 58%)`;
  };

  const datasets = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    const grouped = {};
    const sortedData = [...data]
      .map((entry) => ({ entry, parsedDate: parseGraphDate(entry?.date) }))
      .filter(({ parsedDate }) => !!parsedDate)
      .sort((a, b) => a.parsedDate - b.parsedDate);

    sortedData.forEach(({ entry, parsedDate }) => {
      const rowBoostTable = String(entry?.boostTable || "").toLowerCase().trim();
      const rowName = String(entry?.name || "").trim();
      const rowImg = String(entry?.img || "").trim();
      const rowColor = String(entry?.color || "").trim();
      const rowPriceUnitBase = String(entry?.priceUnitBase || "").toLowerCase().trim();
      const infoBase = idName[entry.id] || {
        name: `#${entry.id}`,
        color: "#6b7280",
        cat: "",
        img: "./icon/nft/na.png",
        active: 0,
        inactive: 0,
        listed: 0,
      };
      const info = {
        ...infoBase,
        name: rowName || infoBase.name,
        img: rowImg || infoBase.img,
        color: rowColor || infoBase.color,
      };

      if (selectedCategory === 'boost') {
        const isBoostByTable = rowBoostTable === "nft" || rowBoostTable === "nftw";
        const isBoostByName = boostKeys.nftByName.has(info.name) || boostKeys.nftwByName.has(info.name);
        if (!isBoostByTable && !isBoostByName) return;
      } else if (selectedCategory !== 'all' && !categoryGroups[selectedCategory]?.includes(info.cat)) {
        return;
      }

      const groupKey = selectedCategory === 'boost' ? `${rowBoostTable || "boost"}:${entry.id}` : String(entry.id);
      if (!grouped[groupKey]) {
        const boostStroke = selectedCategory === 'boost' ? randomBoostColor(groupKey) : info.color;
        grouped[groupKey] = {
          key: groupKey,
          id: Number(entry.id),
          boostTable: rowBoostTable,
          priceUnitBase: rowPriceUnitBase || "flower",
          label: info.name,
          icon: info.img || "./icon/nft/na.png",
          active: Number(info.active || 0),
          inactive: Number(info.inactive || 0),
          listed: Number(info.listed || 0),
          data: [],
          borderColor: boostStroke,
          backgroundColor: boostStroke,
          borderWidth: 2,
          pointRadius: 0.8,
          pointHitRadius: 8,
          fill: false,
          cubicInterpolationMode: 'monotone',
          tension: 0.35,
        };
      }

      const dateLabel = format(parsedDate, 'yyyy-MM-dd HH:mm:ss');

      let unitValue = null;
      let pointActive = null;
      let pointInactive = null;
      let pointListed = null;
      if (vals === 'price') {
        unitValue = Number(entry.unit);
        if (selectedCategory === 'boost' && usdPerSfl > 0) {
          const baseUnit = rowPriceUnitBase || "flower";
          if (baseUnit === "flower" && boostPriceUnit === "usdc") {
            unitValue = unitValue * usdPerSfl;
          } else if (baseUnit === "usdc" && boostPriceUnit === "flower") {
            unitValue = unitValue / usdPerSfl;
          }
        }
      } else if (vals === 'supply') {
        const normalizeSupplyValue = (value) => {
          const n = Number(value ?? 0);
          if (!Number.isFinite(n)) return 0;
          return n > 1000000000000 ? n / Math.pow(10, 18) : n;
        };
        if (selectedCategory === 'boost' && boostSupplyByName[info.name]) {
          const localSupply = boostSupplyByName[info.name];
          unitValue = normalizeSupplyValue(localSupply.supply);
          pointActive = normalizeSupplyValue(localSupply.supply);
          pointInactive = normalizeSupplyValue(localSupply.inactive);
          pointListed = normalizeSupplyValue(localSupply.listed);
        } else {
          unitValue = normalizeSupplyValue(entry.supply);
          pointActive = normalizeSupplyValue(entry.supply);
          pointInactive = normalizeSupplyValue(entry.supplyInactive);
          pointListed = normalizeSupplyValue(entry.supplyListed);
        }
      } else if (vals === 'ntrade') {
        unitValue = entry.ntrade;
      }

      grouped[groupKey].data.push({
        x: dateLabel,
        y: unitValue,
        active: pointActive,
        inactive: pointInactive,
        listed: pointListed,
      });
    });

    Object.values(grouped).forEach((dataset) => {
      const pointCount = Array.isArray(dataset?.data) ? dataset.data.length : 0;
      if (pointCount <= 1) {
        dataset.pointRadius = 4;
        dataset.pointHoverRadius = 6;
      } else if (pointCount <= 3) {
        dataset.pointRadius = 2.4;
        dataset.pointHoverRadius = 5;
      }
    });

    return Object.values(grouped).sort((a, b) => a.label.localeCompare(b.label));
  }, [data, idName, selectedCategory, vals, boostKeys, boostPriceUnit, usdPerSfl, boostSupplyByName]);

  const boostNftLegendOptions = useMemo(() => {
    return datasets
      .filter((dataset) => {
        return dataset?.boostTable === "nft" || boostKeys.nftByName.has(dataset.label);
      })
      .map((dataset) => ({
        value: dataset.key,
        label: dataset.label,
        iconSrc: dataset.icon || "./icon/nft/na.png",
      }));
  }, [datasets, boostKeys]);

  const boostNftwLegendOptions = useMemo(() => {
    return datasets
      .filter((dataset) => {
        return dataset?.boostTable === "nftw" || boostKeys.nftwByName.has(dataset.label);
      })
      .map((dataset) => ({
        value: dataset.key,
        label: dataset.label,
        iconSrc: dataset.icon || "./icon/nft/na.png",
      }));
  }, [datasets, boostKeys]);

  useEffect(() => {
    const wasBoost = prevCategoryRef.current === "boost";
    const isBoost = selectedCategory === "boost";
    if (isBoost && !wasBoost) {
      boostAutoInitDoneRef.current = false;
      setBoostSelectionCleared(false);
      setSelectedBoostNftw([]);
    }
    if (!isBoost && wasBoost) {
      setBoostSelectionCleared(false);
      boostAutoInitDoneRef.current = false;
    }
    prevCategoryRef.current = selectedCategory;
  }, [selectedCategory]);

  useEffect(() => {
    const allowed = new Set(boostNftLegendOptions.map((opt) => opt.value));
    setSelectedBoostNft((prev) => {
      const kept = (Array.isArray(prev) ? prev : []).filter((value) => allowed.has(value));
      return kept;
    });
  }, [boostNftLegendOptions]);

  useEffect(() => {
    const allowed = new Set(boostNftwLegendOptions.map((opt) => opt.value));
    setSelectedBoostNftw((prev) => {
      const kept = (Array.isArray(prev) ? prev : []).filter((value) => allowed.has(value));
      return kept;
    });
  }, [boostNftwLegendOptions]);

  useEffect(() => {
    if (selectedCategory !== "boost") return;
    if (boostSelectionCleared) return;
    if (boostAutoInitDoneRef.current) return;
    if (boostNftLegendOptions.length < 1) return;
    if (Array.isArray(selectedBoostNft) && selectedBoostNft.length > 0) {
      boostAutoInitDoneRef.current = true;
      return;
    }
    boostAutoInitDoneRef.current = true;
    setSelectedBoostNft(pickOneRandom(boostNftLegendOptions.map((opt) => opt.value)));
  }, [selectedCategory, boostNftLegendOptions, selectedBoostNft, boostSelectionCleared]);

  const effectiveHiddenLabels = useMemo(() => {
    if (selectedCategory !== 'boost') return hiddenLabels;
    const selectedSet = new Set([...(selectedBoostNft || []), ...(selectedBoostNftw || [])]);
    const next = new Set();
    datasets.forEach((dataset) => {
      if (!selectedSet.has(dataset.key)) next.add(dataset.key);
    });
    return next;
  }, [selectedCategory, hiddenLabels, selectedBoostNft, selectedBoostNftw, datasets]);

  const isLogarithmicScale = vals === 'price' && selectedCategory !== 'boost';
  const currentSeason = String(dataSetFarm?.frmData?.curSeason || "spring").toLowerCase();
  const tooltipTitle = (context) => {
    const dateLabel = context[0].parsed.x;
    return format(dateLabel, 'yyyy-MM-dd HH:mm:ss');
  };
  const tooltipLabel = (context) => {
    const datasetLabel = context.dataset.label;
    const value = context.parsed.y;
    if (vals === 'price') {
      const unitTxt = (selectedCategory === "boost")
        ? (boostPriceUnit === "flower" ? " Flower" : " USDC")
        : "";
      return `${datasetLabel}: ${frmtNb(value)}${unitTxt}`;
    }
    if (vals === 'supply') {
      const active = Number(context.raw?.active ?? value ?? 0);
      const inactive = Number(context.raw?.inactive ?? 0);
      const listed = Number(context.raw?.listed ?? 0);
      const total = active + inactive;
      if (selectedCategory === "boost") {
        return `${datasetLabel}: Active ${frmtNb(active)} | Total ${frmtNb(total)}`;
      }
      const listedPct = active > 0 ? ((listed / active) * 100).toFixed(2) : "0.00";
      return `${datasetLabel}: Active ${frmtNb(active)} | Total ${frmtNb(total)} | Listed ${listedPct}%`;
    }
    return `${datasetLabel}: ${frmtNb(value)}`;
  };

  useEffect(() => {
    const existingLabels = new Set(datasets.map((dataset) => dataset.label));
    setHiddenLabels((prev) => {
      const next = new Set([...prev].filter((label) => existingLabels.has(label)));
      if (next.size === prev.size) return prev;
      return next;
    });
  }, [datasets]);

  useEffect(() => {
    if (!soloLabel) return;
    const labelExists = datasets.some((dataset) => dataset.label === soloLabel);
    if (!labelExists) {
      setSoloLabel(null);
    }
  }, [datasets, soloLabel]);

  useEffect(() => {
    if (!legendResetMountedRef.current) {
      legendResetMountedRef.current = true;
      return;
    }
    setHiddenLabels(new Set());
    setSoloLabel(null);
    setSelectedBoostNft([]);
    setSelectedBoostNftw([]);
    setBoostSelectionCleared(true);
    boostAutoInitDoneRef.current = true;
  }, [legendResetToken]);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (!chartRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          normalized: true,
          layout: {
            padding: {
              bottom: 4,
            },
          },
          animation: {
            duration: 680,
            easing: 'easeOutQuart',
          },
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
              },
              title: {
                display: false,
                text: 'Date',
              },
              grid: {
                display: true,
                color: 'rgba(61, 61, 61, 0.27)',
              },
            },
            y: {
              type: isLogarithmicScale ? 'logarithmic' : 'linear',
              ticks: {
                callback: (v) => frmtNb(v),
              },
              title: {
                display: false,
                text: 'Price',
              },
              grid: {
                display: true,
                color: 'rgba(83, 83, 83, 0.56)',
              },
            },
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false,
          },
          plugins: {
            mondayMidnightLine: {
              currentSeason,
            },
            legend: {
              display: false,
            },
            tooltip: {
              mode: 'x',
              intersect: false,
              itemSort: (a, b) => b.parsed.y - a.parsed.y,
              callbacks: {
                title: tooltipTitle,
                label: tooltipLabel,
              },
            },
          },
        },
      });
      return;
    }

    chartRef.current.data.datasets = datasets;
    chartRef.current.options.scales.y.type = isLogarithmicScale ? 'logarithmic' : 'linear';
    chartRef.current.options.scales.y.min = undefined;
    chartRef.current.options.scales.y.max = undefined;
    chartRef.current.options.plugins.mondayMidnightLine.currentSeason = currentSeason;
    chartRef.current.options.plugins.tooltip.callbacks.title = tooltipTitle;
    chartRef.current.options.plugins.tooltip.callbacks.label = tooltipLabel;
    chartRef.current.data.datasets.forEach((dataset, index) => {
      const visibilityKey = selectedCategory === "boost" ? dataset.key : dataset.label;
      chartRef.current.setDatasetVisibility(index, !effectiveHiddenLabels.has(visibilityKey));
    });
    chartRef.current.update();
  }, [datasets, isLogarithmicScale, vals, effectiveHiddenLabels, selectedCategory, currentSeason]);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  const toggleLegendItem = (label) => {
    setSoloLabel(null);
    setHiddenLabels((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const soloLegendItem = (label) => {
    const allLabels = datasets.map((dataset) => dataset.label);
    const isAlreadySolo =
      soloLabel === label &&
      hiddenLabels.size === Math.max(allLabels.length - 1, 0) &&
      !hiddenLabels.has(label);

    if (isAlreadySolo) {
      setSoloLabel(null);
      setHiddenLabels(new Set());
      return;
    }

    setSoloLabel(label);
    setHiddenLabels(new Set(allLabels.filter((itemLabel) => itemLabel !== label)));
  };

  return (
    <div className="graph-root">
      <div className="graph-legend-grid">
        {selectedCategory === 'boost' ? (
          <>
            <DList
              name="graphBoostPriceUnit"
              title="Price"
              options={BOOST_PRICE_UNIT_OPTIONS}
              value={boostPriceUnit}
              onChange={(event) => setBoostPriceUnit(String(event?.target?.value || "flower"))}
              iconOnly={true}
              menuIconOnly={true}
              width={38}
              height={28}
            />
            <DList
              name="graphBoostNft"
              title="Collectibles"
              options={boostNftLegendOptions}
              multiple={true}
              value={selectedBoostNft}
              onChange={(event) => setSelectedBoostNft(event.target.value)}
              searchable={true}
              closeOnSelect={false}
              width={280}
              menuMinWidth={280}
            />
            <DList
              name="graphBoostNftw"
              title="Wearables"
              options={boostNftwLegendOptions}
              multiple={true}
              value={selectedBoostNftw}
              onChange={(event) => setSelectedBoostNftw(event.target.value)}
              searchable={true}
              closeOnSelect={false}
              width={280}
              menuMinWidth={280}
            />
          </>
        ) : (
          datasets.map((dataset) => {
            const isHidden = effectiveHiddenLabels.has(dataset.label);
            const isSoloActive = soloLabel === dataset.label && effectiveHiddenLabels.size > 0;
            return (
              <div
                key={dataset.label}
                className={`graph-legend-item ${isHidden ? 'is-hidden' : ''} ${isSoloActive ? 'is-solo-active' : ''}`}
                style={{ borderColor: dataset.borderColor }}
              >
                <button
                  type="button"
                  className="graph-legend-main"
                  title="Show / Hide"
                  onClick={() => toggleLegendItem(dataset.label)}
                >
                  <img src={dataset.icon || "./icon/nft/na.png"} alt="" className="graph-legend-item-icon" />
                  <span className="graph-legend-label">{dataset.label}</span>
                </button>
                <button
                  type="button"
                  className="graph-legend-solo"
                  title="Only show this"
                  aria-label={`Solo ${dataset.label}`}
                  onClick={() => soloLegendItem(dataset.label)}
                >
                  <img src="./icon/ui/lightning.png" alt="" className="graph-legend-solo-icon" />
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="graph-canvas-wrap">
        <div className={`graph-loading-indicator ${isLoading ? "is-visible" : ""}`} aria-hidden={!isLoading}>
          <span className="graph-loading-spinner"></span>
        </div>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

function frmtNb(nombre) {
  const nombreNumerique = parseFloat(nombre);
  let nombreStr = nombreNumerique.toString();
  const positionE = nombreStr.indexOf('e');
  if (positionE !== -1) {
    const nombreNumeriqueCorr = Number(nombreStr).toFixed(20);
    nombreStr = nombreNumeriqueCorr.toString();
  }
  if (isNaN(nombreNumerique)) {
    return '0';
  }
  const positionVirgule = nombreStr.indexOf('.');
  if (positionVirgule !== -1) {
    let chiffreSupZero = null;
    for (let i = positionVirgule + 1; i < nombreStr.length; i++) {
      if (nombreStr[i] !== '0') {
        chiffreSupZero = i;
        break;
      }
    }
    if (chiffreSupZero === null) {
      return nombreNumerique.toFixed(2);
    }
    return nombreStr.slice(0, chiffreSupZero + 2);
  }
  return nombreStr;
}

export default Graph;
