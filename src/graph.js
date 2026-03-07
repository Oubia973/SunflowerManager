import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { format, parseISO } from 'date-fns';

Chart.register(...registerables);

const categoryGroups = {
  "crops": ["crop"],
  "wood minerals": ["wood", "mineral", "gem"],
  "fruits honey": ["fruit", "honey", "mushroom"],
  "animals": ["animal"],
  "pets": ["pet"],
};

function Graph({ data, vals, dataSetFarm, graphMeta = {}, selectedCategory = 'all', legendResetToken = 0 }) {
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

  const datasets = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    const grouped = {};
    const sortedData = [...data].sort((a, b) => parseISO(a.date) - parseISO(b.date));

    sortedData.forEach((entry) => {
      const info = idName[entry.id] || {
        name: `#${entry.id}`,
        color: "#6b7280",
        cat: "",
        img: "./icon/nft/na.png",
        active: 0,
        inactive: 0,
        listed: 0,
      };

      if (selectedCategory !== 'all' && !categoryGroups[selectedCategory]?.includes(info.cat)) {
        return;
      }

      if (!grouped[entry.id]) {
        grouped[entry.id] = {
          label: info.name,
          icon: info.img || "./icon/nft/na.png",
          active: Number(info.active || 0),
          inactive: Number(info.inactive || 0),
          listed: Number(info.listed || 0),
          data: [],
          borderColor: info.color,
          backgroundColor: info.color,
          borderWidth: 2,
          pointRadius: 0.8,
          pointHitRadius: 8,
          fill: false,
          cubicInterpolationMode: 'monotone',
          tension: 0.35,
        };
      }

      const date = parseISO(entry.date);
      const dateLabel = format(date, 'yyyy-MM-dd HH:mm:ss');

      let unitValue = null;
      let pointActive = null;
      let pointInactive = null;
      let pointListed = null;
      if (vals === 'price') {
        unitValue = Number(entry.unit);
      } else if (vals === 'supply') {
        const normalizeSupplyValue = (value) => {
          const n = Number(value ?? 0);
          if (!Number.isFinite(n)) return 0;
          return n > 1000000000000 ? n / Math.pow(10, 18) : n;
        };
        unitValue = normalizeSupplyValue(entry.supply);
        pointActive = normalizeSupplyValue(entry.supply);
        pointInactive = normalizeSupplyValue(entry.supplyInactive);
        pointListed = normalizeSupplyValue(entry.supplyListed);
      } else if (vals === 'ntrade') {
        unitValue = entry.ntrade;
      }

      grouped[entry.id].data.push({
        x: dateLabel,
        y: unitValue,
        active: pointActive,
        inactive: pointInactive,
        listed: pointListed,
      });
    });

    return Object.values(grouped).sort((a, b) => a.label.localeCompare(b.label));
  }, [data, idName, selectedCategory, vals]);

  const isLogarithmicScale = vals === 'price';
  const tooltipTitle = (context) => {
    const dateLabel = context[0].parsed.x;
    return format(dateLabel, 'yyyy-MM-dd HH:mm:ss');
  };
  const tooltipLabel = (context) => {
    const datasetLabel = context.dataset.label;
    const value = context.parsed.y;
    if (vals === 'price') {
      return `${datasetLabel}: ${frmtNb(value)}`;
    }
    if (vals === 'supply') {
      const active = Number(context.raw?.active ?? value ?? 0);
      const inactive = Number(context.raw?.inactive ?? 0);
      const listed = Number(context.raw?.listed ?? 0);
      const total = active + inactive;
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
    setHiddenLabels(new Set());
    setSoloLabel(null);
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
            legend: {
              display: false,
            },
            tooltip: {
              mode: 'index',
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
    chartRef.current.options.plugins.tooltip.callbacks.title = tooltipTitle;
    chartRef.current.options.plugins.tooltip.callbacks.label = tooltipLabel;
    chartRef.current.data.datasets.forEach((dataset, index) => {
      chartRef.current.setDatasetVisibility(index, !hiddenLabels.has(dataset.label));
    });
    chartRef.current.update();
  }, [datasets, isLogarithmicScale, vals, hiddenLabels]);

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
        {datasets.map((dataset) => {
          const isHidden = hiddenLabels.has(dataset.label);
          const isSoloActive = soloLabel === dataset.label && hiddenLabels.size > 0;
          return (
            <div
              key={dataset.label}
              className={`graph-legend-item ${isHidden ? 'is-hidden' : ''} ${isSoloActive ? 'is-solo-active' : ''}`}
              style={{ borderColor: dataset.borderColor }}
            >
              <button
                type="button"
                className="graph-legend-main"
                title="Afficher / masquer"
                onClick={() => toggleLegendItem(dataset.label)}
              >
                <img src={dataset.icon || "./icon/nft/na.png"} alt="" className="graph-legend-item-icon" />
                <span className="graph-legend-label">{dataset.label}</span>
              </button>
              <button
                type="button"
                className="graph-legend-solo"
                title="N'afficher que cet objet"
                aria-label={`Solo ${dataset.label}`}
                onClick={() => soloLegendItem(dataset.label)}
              >
                <img src="./icon/ui/lightning.png" alt="" className="graph-legend-solo-icon" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="graph-canvas-wrap">
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
