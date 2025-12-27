import React, { useEffect, useState, useRef } from 'react';

const imgrdy = './icon/ui/expression_alerted.png';

export function frmtNb(nombre) {
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
    if (chiffreSupZero === null) { return nombreNumerique.toFixed(2) }
    if (Math.abs(Math.floor(nombre)) > 0) {
      if (Math.abs(Math.floor(nombre)) < 5) {
        return nombreNumerique.toFixed(3);
      } else {
        return nombreNumerique.toFixed(2);
      }
    } else {
      return nombreStr.slice(0, chiffreSupZero + 3);
    }
  } else {
    return nombreStr;
  }
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

export function getMaxValue (value1, value2, value3) {
  const positiveValues = [parseFloat(value1).toFixed(20), parseFloat(value2).toFixed(20), parseFloat(value3).toFixed(20)].filter(value => value > 0);
  return positiveValues.length > 0 ? parseFloat(Math.max(...positiveValues)).toFixed(20).toString() : null;
};