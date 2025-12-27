import React from "react";

function CounterInput({ value, onChange, min = 0, max = 99, activate = true }) {
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
    if (value > min && activate) onChange(value - 1);
  };

  const increment = () => {
    if (value < max && activate) onChange(value + 1);
  };

  return (
    <div style={containerStyle}>
      <button style={btnStyle} onClick={decrement}>−</button>
      <div style={valueStyle}>{value}</div>
      <button style={btnStyle} onClick={increment}>+</button>
    </div>
  );
}

export default CounterInput;