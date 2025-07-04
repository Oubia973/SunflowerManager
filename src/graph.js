import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { format, parseISO } from 'date-fns';

Chart.register(...registerables);
const idName = {};
var logarithmicScale = true;
//var lastIndexClicked = 0;
var clickedIndex = [];

function Graph({ data, vals, it }) {
  const chartRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      for (let item in it) {
        if (!idName[it[item].id]) { idName[it[item].id] = {} }
        if (it[item].color) {
          idName[it[item].id].name = item;
          idName[it[item].id].color = it[item].color;
          idName[it[item].id].cat = it[item].cat;
        }
      }
      const datasets = {};
      data.sort((a, b) => parseISO(a.date) - parseISO(b.date));
      data.forEach(entry => {
        const date = parseISO(entry.date);
        const dateLabel = format(date, 'yyyy-MM-dd HH:mm:ss');
        const id = entry.id;
        if (idName[id] && (selectedCategory === 'all' || categoryGroups[selectedCategory].includes(idName[id].cat))) {
          const xname = idName[id].name;
          if (!datasets[id]) {
            datasets[id] = {
              //label: `${idName[id].name}`,
              label: xname,
              data: [],
              borderColor: idName[id].color,
              backgroundColor: idName[id].color,
              borderWidth: 2,
              pointRadius: 1,
              fill: false,
              cubicInterpolationMode: 'monotone',
              tension: 0.4,
              //spanGaps: true
            };
          }
          let unitValue;
          if (vals === "price") {
            logarithmicScale = true;
            unitValue = frmtNb(entry.unit);
          }
          if (vals === "supply") {
            logarithmicScale = false;
            if (entry.supply > 0) { unitValue = frmtNb(entry.supply / Math.pow(10, 18)) };
          }
          if (vals === "ntrade") {
            logarithmicScale = false;
            unitValue = entry.ntrade;
          }
          datasets[id].data.push({ x: dateLabel, y: unitValue });
        }
        else {
          //console.log(id + " no name");
        }
      });

      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const ctx = document.getElementById('myChart').getContext('2d');
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: Object.values(datasets),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
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
              //autoSkip: true,
            },
            y: {
              type: logarithmicScale ? 'logarithmic' : 'linear',
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
            //mode: 'nearest',
            //axis: 'x',
            //intersect: false
          },
          plugins: {
            /*decimation: {
              enabled: true,
              algorithm: 'lttb',
              samples: 50,
            }, */
            legend: {
              position: 'left', // Déplacer la légende à gauche
              labels: {
                boxWidth: 20,
                boxHeight: 20,
                padding: 10,
                usePointStyle: true,
              },
              onHover: handleHover,
              onLeave: handleLeave,
              onClick: handleClic,
              maxHeight: 400, // Limiter la hauteur de la légende
              overflowY: 'auto', // Ajouter une barre de défilement
              //display: false,
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              itemSort: (a, b) => b.parsed.y - a.parsed.y,
              callbacks: {
                title: (context) => {
                  const dateLabel = context[0].parsed.x;
                  return format(dateLabel, 'yyyy-MM-dd HH:mm:ss');
                },
                label: (context) => {
                  const datasetLabel = context.dataset.label;
                  const value = context.parsed.y;
                  return `${datasetLabel}: ${value}`;
                },
              },
            },
          },
        },
      });
    }
  }, [data, vals, selectedCategory]);
  const categoryGroups = {
    "crops": ["crop"],
    "wood minerals": ["wood", "mineral", "gem"],
    "fruits honey": ["fruit", "honey", "mushroom"],
    "animals": ["animal"]
  };
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <button onClick={() => setSelectedCategory('all')}>All</button>
        {Object.keys(categoryGroups).map(group => (
          <button key={group} onClick={() => setSelectedCategory(group)}>{group}</button>
        ))}
      </div>
      <canvas id="myChart"></canvas>
    </div>
  );
}
const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
const rgbToHex = (rgb) => {
  const result = rgb.match(/\d+/g).map((num) => {
    const hex = parseInt(num).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  });
  return `#${result.join('')}`;
};
const darkenColor = (hex, amount) => {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  r = Math.max(0, r - amount);
  g = Math.max(0, g - amount);
  b = Math.max(0, b - amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};
const handleHover = (evt, item, legend) => {
  const activeDataset = legend.chart.data.datasets[item.datasetIndex];
  const label = activeDataset.label;
  legend.chart.data.datasets.forEach(dataset => {
    const idInfo = Object.keys(idName).find(id => idName[id].name === dataset.label);
    const hexColor = rgbToHex(idName[idInfo].color);
    if (dataset.label === label) {
      dataset.borderColor = idName[idInfo].color;
      dataset.backgroundColor = idName[idInfo].color;
      dataset.borderWidth = 4;
    } else {
      dataset.borderColor = darkenColor(hexColor, 200);
      dataset.backgroundColor = darkenColor(hexColor, 200);
      dataset.borderWidth = 1;
    }
  });
  legend.chart.update();
};
const handleLeave = (evt, item, legend) => {
  legend.chart.data.datasets.forEach(dataset => {
    const idInfo = Object.keys(idName).find(id => idName[id].name === dataset.label);
    dataset.borderColor = idName[idInfo].color;
    dataset.backgroundColor = idName[idInfo].color;
    dataset.borderWidth = 2;
  });
  legend.chart.update();
};
const handleClic = (event, legendItem, legend) => {
  const datasetIndex = legendItem.datasetIndex;
  const clickedDataset = legend.chart.data.datasets[datasetIndex];
  if (clickedIndex.length === 0) {
    legend.chart.data.datasets.forEach((dataset, index) => {
      dataset.hidden = true;
    });
  }
  clickedDataset.hidden = false;
  if (clickedIndex.includes(datasetIndex)) {
    legend.chart.data.datasets.forEach((dataset, index) => {
      dataset.hidden = false;
    });
    clickedIndex = [];
  } else {
    clickedIndex.push(datasetIndex);
  }
  //clickedDataset.hidden = !clickedDataset.hidden;
  legend.chart.update();
}
function frmtNb(nombre) {
  const nombreNumerique = parseFloat(nombre);
  var nombreStr = nombreNumerique.toString();
  const positionE = nombreStr.indexOf("e");
  if (positionE !== -1) {
    const nombreNumeriqueCorr = Number(nombreStr).toFixed(20);
    nombreStr = nombreNumeriqueCorr.toString();
  }
  if (isNaN(nombreNumerique)) {
    return "0";
  }
  const positionVirgule = nombreStr.indexOf(".");
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
    } else {
      return nombreStr.slice(0, chiffreSupZero + 2);
    }
  } else {
    return nombreStr;
  }
}

export default Graph;