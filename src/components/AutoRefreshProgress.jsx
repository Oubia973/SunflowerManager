import React, { useEffect, useMemo, useState } from "react";

export default function AutoRefreshProgress({
  active = false,
  resetKey = "",
  durationMs = 60 * 1000,
  deadlineMs = 0,
  variant = "circle",
  color = "#4caf50",
  circleSize = 34,
  circleRadius = 16,
  circleStrokeWidth = 3,
  circleStyle = null,
  barWidth = 48,
  barHeight = 5,
  barBorder = "1px solid #555",
  barBackground = "#111",
  barFillStyle = null,
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) {
      setProgress(0);
      return undefined;
    }
    const hasDeadline = Number(deadlineMs) > 0;
    let startAt = Date.now();
    if (!hasDeadline) setProgress(0);
    const tick = () => {
      if (document.visibilityState !== "visible") return;
      if (hasDeadline) {
        const remain = Math.max(0, Number(deadlineMs) - Date.now());
        const next = Math.min(((durationMs - remain) / durationMs) * 100, 100);
        setProgress(next);
        return;
      }
      const elapsed = Date.now() - startAt;
      const next = Math.min((elapsed / durationMs) * 100, 100);
      if (next >= 100) {
        startAt = Date.now();
        setProgress(0);
        return;
      }
      setProgress(next);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [active, durationMs, resetKey, deadlineMs]);

  const clamped = useMemo(
    () => Math.max(0, Math.min(100, Number(progress || 0))),
    [progress]
  );

  if (variant === "bar") {
    return (
      <div
        style={{
          width: `${barWidth}px`,
          height: `${barHeight}px`,
          border: barBorder,
          borderRadius: "10px",
          overflow: "hidden",
          background: barBackground,
        }}
      >
        <div
          style={{
            width: `${clamped}%`,
            height: "100%",
            background: color,
            transition: "width 0.25s linear",
            ...(barFillStyle || {}),
          }}
        />
      </div>
    );
  }

  const circumference = 2 * Math.PI * circleRadius;
  return (
    <svg
      style={circleStyle || { position: "absolute", left: -1, zIndex: 1, pointerEvents: "none" }}
      width={circleSize}
      height={circleSize + 1}
    >
      <circle
        cx={circleRadius + 2}
        cy={circleRadius + 2}
        r={circleRadius}
        stroke={color}
        strokeWidth={circleStrokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - clamped / 100)}
        style={{ transition: "stroke-dashoffset 0.5s linear" }}
      />
    </svg>
  );
}
