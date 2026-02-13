import React, { useEffect, useState, useRef } from 'react';

const imgrdy = './icon/ui/expression_alerted.png';

export function frmtNb(nombre, decimal=2) {
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
    if (chiffreSupZero === null) { return nombreNumerique.toFixed(decimal) }
    if (Math.abs(Math.floor(nombre)) > 0) {
      if (Math.abs(Math.floor(nombre)) < 5) {
        return nombreNumerique.toFixed(3);
      } else {
        return nombreNumerique.toFixed(decimal);
      }
    } else {
      return nombreStr.slice(0, chiffreSupZero + 3);
    }
  } else {
    return nombreStr;
  }
}

export function flattenCompoit(rawCompo) {
  const out = {};
  const walk = (tree) => {
    if (!tree || typeof tree !== "object") return;
    Object.entries(tree).forEach(([name, rawNode]) => {
      if (typeof rawNode === "number") {
        out[name] = (out[name] || 0) + Number(rawNode || 0);
        return;
      }
      const qty = Number(rawNode?.qty ?? rawNode?.quant ?? rawNode?.q ?? 0) || 0;
      const children = rawNode?.compoit && typeof rawNode.compoit === "object" ? rawNode.compoit : null;
      if (children && Object.keys(children).length > 0) {
        walk(children);
      } else {
        out[name] = (out[name] || 0) + qty;
      }
    });
  };
  walk(rawCompo || {});
  return out;
}

export function convTime(nombre) {
  if (nombre > 0 && nombre !== Infinity) {
    //if (nombre === "-Infinity" || nombre === "Infinity" || nombre === 0 || nombre === NaN) { return "00:00:00" }
    const heures = Math.floor(nombre * 24);
    const minutes = Math.floor(nombre * 24 * 60) % 60;
    const secondes = Math.floor(nombre * 24 * 60 * 60) % 60;
    const jours = Math.floor(heures / 24);
    const heuresFormat = heures % 24;
    const jourStr = jours > 0 ? jours.toString().padStart(2, '0') + ':' : '';
    const heureStr = heuresFormat.toString().padStart(2, '0');
    const minuteStr = minutes.toString().padStart(2, '0');
    const secondeStr = secondes.toString().padStart(2, '0');
    return jourStr + heureStr + ':' + minuteStr + ':' + secondeStr;
  } else {
    return '00:00:00';
  }
}

export function convtimenbr(tempsFormat) {
  if (tempsFormat !== "" && tempsFormat !== 0) {
    const tempsArray = tempsFormat.split(':');
    let jours, heures, minutes, secondes;
    if (tempsArray.length === 3) {
      jours = 0;
      heures = parseInt(tempsArray[0], 10);
      minutes = parseInt(tempsArray[1], 10);
      secondes = parseInt(tempsArray[2], 10);
    } else if (tempsArray.length === 4) {
      jours = parseInt(tempsArray[0], 10);
      heures = parseInt(tempsArray[1], 10);
      minutes = parseInt(tempsArray[2], 10);
      secondes = parseInt(tempsArray[3], 10);
    } else {
      return 0;
    }
    var totalSecondes = (jours * 86400 + heures * 3600 + minutes * 60 + secondes);
    const nombre = totalSecondes / (24 * 60 * 60);
    return nombre;
  } else {
    return 0;
  }
}

export function formatUpdated(unixTime) {
  const tsNum = Number(unixTime);
  if (!Number.isFinite(tsNum) || tsNum <= 0) return "never updated";
  const ts = tsNum < 1e12 ? tsNum * 1000 : tsNum;
  const diffMs = Date.now() - ts;
  if (diffMs < 0) return "in the future";
  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return `${seconds} sec ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    const remMinutes = minutes % 60;
    return `${hours} hour${hours !== 1 ? "s" : ""}${remMinutes ? ` ${remMinutes} min` : ""} ago`;
  }
  const days = Math.floor(hours / 24);
  const remHours = hours % 24;
  const remMinutes = minutes % 60;
  return `${days} day${days !== 1 ? "s" : ""}` +
    (remHours ? ` ${remHours} hour${remHours !== 1 ? "s" : ""}` : "") +
    (remMinutes ? ` ${remMinutes} min` : "") +
    " ago";
}
export function timeToDays(time) {
  if(!time) return;
  const parts = time.split(":").map(Number);
  const pad = (n) => String(n).padStart(2, "0");
  if (parts.length === 4) {
    const [d, h, m, s] = parts;
    return d > 0
      ? `${d}d ${pad(h)}:${pad(m)}:${pad(s)}`
      : `${pad(h)}:${pad(m)}:${pad(s)}`;
  }
  if (parts.length === 3) {
    const [h, m, s] = parts;
    const d = Math.floor(h / 24);
    const hh = h % 24;
    return d > 0
      ? `${d}d ${pad(hh)}:${pad(m)}:${pad(s)}`
      : `${pad(hh)}:${pad(m)}:${pad(s)}`;
  }
  return time;
}
export function ColorValue(value, minValue = 1, maxValue = 10) {
  if (value <= minValue) {
    return "red";
  }
  if (!isFinite(value)) {
    return `rgb(${0}, ${255}, ${0})`;
  }
  /* if (value >= maxV) {
    return "green";
  } */
  //const normalizedValue = Math.min((value - 1) / (20 - 1), 1);
  //console.log(normalizedValue);
  //const red = Math.round((1 - normalizedValue) * 255);
  //const green = Math.round(255);
  const normalizedValue = (value - minValue) / (maxValue - minValue);
  const red = Math.round(255 * (1 - normalizedValue));
  const green = 255;
  const blue = 0;
  return `rgb(${red}, ${green}, ${blue})`;
}
export function ColorValueP(value, maxAbs = 50) {
  if (!Number.isFinite(value)) return "rgb(255,255,0)";
  const v = Math.max(-maxAbs, Math.min(maxAbs, value));
  const n = v / maxAbs;
  let r, g;
  if (n >= 0) {
    r = Math.round(255 * (1 - n));
    g = 255;
  } else {
    r = 255;
    g = Math.round(255 * (1 + n));
  }
  return `rgb(${r}, ${g}, 0)`;
}

export function formatdate(timestamp) {
    if (timestamp < 3600 * 1000 * 24) { timestamp -= 3600 * 1000 }
    if (timestamp <= 0) { return 0 }
    var dateActuelle = new Date(timestamp);
    //var jours = dateActuelle.getDate();
    var heures = dateActuelle.getHours();
    var minutes = dateActuelle.getMinutes();
    //var secondes = dateActuelle.getSeconds();
    var dateFormatee = (
        //(jours < 10 ? "0" : "") + jours + ":" +
        (heures < 10 ? "0" : "") + heures + ":" +
        (minutes < 10 ? "0" : "") + minutes //+ ":" +
        //(secondes < 10 ? "0" : "") + secondes
    );
    return dateFormatee;
}
export function Timer({ timestamp, index, onTimerFinish }) {
  const [timeLeft, setTimeLeft] = useState(timestamp - Date.now());
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTimeLeft => prevTimeLeft - 1000);
      if (timeLeft <= 0) {
        clearInterval(timer);
        if (onTimerFinish) {
          onTimerFinish(index);
        }
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [timeLeft, index, onTimerFinish]);
  const formatTime = (time) => {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return `${hours}:${minutes}:${seconds}`;
  };
  return (
    <span>
      {timeLeft > 0 ? (
        <span>{formatTime(timeLeft)}</span>
      ) : (
        <img src={imgrdy} alt="" />
      )}
    </span>
  );
}

export function filterTryit(dataSet, toArray) {
  const { it = {}, food = {} } = dataSet?.itables || {};
  const result = {};
  const boostables = dataSet?.boostables;
  if (boostables) {
    for (const boostableName in boostables) {
      let bTable = [];
      const boostable = boostables[boostableName];
      Object.entries(boostable).forEach(([item]) => { bTable[item] = boostable[item].tryit; });
      const tableToArray = Object.entries(bTable)
        .filter(([key, value]) => value !== 0)
        .map(([key, value]) => ({ name: key, value }))
        .reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {});
      result[boostableName] = tableToArray;
    }
    let bFarm = {};
    let bCook = {};
    let bTryBuy = {};
    let bTrySpot = {};
    let bTrySpot2 = {};
    let bTrySpot3 = {};
    Object.entries(it).forEach(([item]) => { bFarm[item] = it[item].farmit; });
    Object.entries(food).forEach(([item]) => { bCook[item] = food[item].cookit; });
    Object.entries(it).forEach(([item]) => { bTryBuy[item] = it[item].buyit; });
    Object.entries(it).forEach(([item]) => { bTrySpot[item] = it[item].spottry; });
    Object.entries(it).forEach(([item]) => { bTrySpot2[item] = it[item].spot2try; });
    Object.entries(it).forEach(([item]) => { bTrySpot3[item] = it[item].spot3try; });
    result.xbuyit = ConvToArray(bTryBuy);
    result.xspottry = ConvToArray(bTrySpot);
    result.xspot2try = ConvToArray(bTrySpot2);
    result.xspot3try = ConvToArray(bTrySpot3);
    result.xfarmit = ConvToArray(bFarm);
    result.xcookit = ConvToArray(bCook);
  }
  return result;
  function ConvToArray(tableVar) {
    const table = Object.entries(tableVar)
      .filter(([key, value]) => value !== 0)
      .map(([key, value]) => ({ name: key, value }))
      .reduce((acc, item) => { acc[item.name] = item.value; return acc; }, {});
    return table;
  }
}

export function getMaxValue(value1, value2, value3) {
  const positiveValues = [parseFloat(value1).toFixed(20), parseFloat(value2).toFixed(20), parseFloat(value3).toFixed(20)].filter(value => value > 0);
  return positiveValues.length > 0 ? parseFloat(Math.max(...positiveValues)).toFixed(20).toString() : null;
};

export function PBar(val, pval, max, left, width = 60) {
  const maxh = max;
  const maxTxt = formatKNumber(maxh);
  const previousQuantity = Math.ceil(pval);
  const Quantity = Math.ceil(val) || 0;
  const harvestLeft = left || 0;
  const harvestLeftTxt = formatKNumber(harvestLeft);
  const difference = Quantity - previousQuantity;
  const differenceTxt = formatKNumber(difference);
  const absDifference = (difference);
  const isNegativeDifference = difference < 0;
  const progressPct = Math.max(
    0,
    Math.floor((absDifference / maxh) * 100)
  );
  const harvestPct = Math.max(
    0,
    Math.floor((harvestLeft / maxh) * 100)
  );
  const safeHarvestPct = Math.min(harvestPct, 100 - progressPct) || 0;
  return (
    <div className={`progress-barb ${isNegativeDifference ? 'negative' : ''}`} style={{ width }}>
      <div
        className="progress"
        style={{ width: `${progressPct}%` }}
      >
        <span className="progress-text">
          {isNegativeDifference
            ? differenceTxt
            : `${differenceTxt}${harvestLeft ? ("+" + harvestLeftTxt) : ""}/${maxTxt}`}
        </span>
      </div>
      {safeHarvestPct > 0 && (
        <div
          className="progress-harvest"
          style={{ width: `${safeHarvestPct}%` }}
        >
          {/* <span className="progress-text">
            {frmtNb(harvestLeft)}
          </span> */}
        </div>
      )}
    </div>
  );
}
export function formatKNumber(n) {
  if (n >= 1_000_000) {
    return (n / 1_000_000).toFixed(3).replace(/\.?0+$/, "") + "m";
  }
  if (n >= 1_000) {
    return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return String(n);
}
