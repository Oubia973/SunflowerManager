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