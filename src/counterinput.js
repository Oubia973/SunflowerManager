import React from "react";

function CounterInput({ value, onChange, min = 0, max = 99, activate = true }) {
  const toNumber = (input, fallback = 0) => {
    const parsed = Number(input);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const currentValue = toNumber(value, min);
  const minValue = toNumber(min, 0);
  const maxValue = Math.max(minValue, toNumber(max, 99));
  const flooredMax = Math.floor(maxValue);
  const hasFractionalCap = Math.abs(maxValue - flooredMax) > Number.EPSILON;
  const displayValue = Number.isInteger(currentValue) ? currentValue : currentValue.toFixed(1);

  const getPrevValue = () => {
    if (currentValue <= minValue) return minValue;
    if (hasFractionalCap && currentValue > flooredMax) {
      return Math.max(minValue, flooredMax);
    }
    return Math.max(minValue, currentValue - 1);
  };

  const getNextValue = () => {
    if (currentValue >= maxValue) return maxValue;
    if (currentValue < flooredMax) {
      return Math.min(flooredMax, currentValue + 1);
    }
    return maxValue;
  };
  const btnStyle = {
    padding: "0px 0px",
    border: "none",
    background: activate ? '#ffffffff' : '#7a7a7a',
    cursor: "pointer",
    fontSize: "14px",
  };

  const containerStyle = {
    display: "inline-flex",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: "8px",
    overflow: "hidden",
    fontFamily: "sans-serif",
  };

  const valueStyle = {
    padding: "0px 0px",
    minWidth: "20px",
    textAlign: "center",
    fontSize: "14px",
  };

  const decrement = () => {
    if (activate && currentValue > minValue) onChange(getPrevValue());
  };

  const increment = () => {
    if (activate && currentValue < maxValue) onChange(getNextValue());
  };

  return (
    <div style={containerStyle}>
      <button style={btnStyle} onClick={decrement}>−</button>
      <div style={valueStyle}>{displayValue}</div>
      <button style={btnStyle} onClick={increment}>+</button>
    </div>
  );
}

export default CounterInput;
