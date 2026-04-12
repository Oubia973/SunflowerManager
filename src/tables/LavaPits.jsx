import React from "react";
import { useAppCtx } from "../context/AppCtx";
import { frmtNb } from "../fct.js";

const CARD_STYLE = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 8,
};

function renderMetricBadge(title, value, iconSrc, iconTitle) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "4px 8px",
        border: "1px solid rgb(90, 90, 90)",
        borderRadius: "6px",
        background: "rgba(0, 0, 0, 0.28)",
        width: "fit-content",
        maxWidth: "100%",
      }}
    >
      {iconSrc ? <img src={iconSrc} alt="" className="itico" title={iconTitle || title} /> : null}
      <span style={{ fontSize: 12, opacity: 0.8 }}>{title}</span>
      <strong style={{ fontSize: 14, lineHeight: 1 }}>{value}</strong>
    </div>
  );
}

function renderStatusPill(label, tone = "neutral") {
  const palette = tone === "good"
    ? { bg: "rgba(57, 186, 103, 0.16)", bd: "rgba(57, 186, 103, 0.4)", fg: "#8DFFAA" }
    : tone === "bad"
      ? { bg: "rgba(217, 78, 78, 0.16)", bd: "rgba(217, 78, 78, 0.38)", fg: "#FF9C9C" }
      : { bg: "rgba(255,255,255,0.06)", bd: "rgba(255,255,255,0.12)", fg: "rgba(255,255,255,0.92)" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 8px",
        borderRadius: 999,
        background: palette.bg,
        border: `1px solid ${palette.bd}`,
        color: palette.fg,
        fontSize: 12,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function renderBoostIcons(boosts = []) {
  if (!Array.isArray(boosts) || boosts.length < 1) return <span style={{ opacity: 0.45 }}>-</span>;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
      {boosts.map((boost) => (
        <img
          key={`${boost.tableName || "boost"}:${boost.name || ""}`}
          src={boost.img || "./icon/nft/na.png"}
          alt={boost.name || ""}
          className="itico"
          title={boost.name || "Boost"}
        />
      ))}
    </span>
  );
}

export default function LavaPitsTable() {
  const {
    data: { dataSetFarm },
    ui: { selectedInv },
    img: {
      imgSFL,
      imgCoins,
      imgrdy,
      imgexchng,
    }
  } = useAppCtx();

  if (selectedInv !== "lavapits") return null;

  const lavaPitsData = dataSetFarm?.lavaPitsData || {};
  const summary = lavaPitsData?.summary || {};
  const seasonSummaries = Array.isArray(lavaPitsData?.seasonSummaries) ? lavaPitsData.seasonSummaries : [];
  const projections = Array.isArray(lavaPitsData?.projections) ? lavaPitsData.projections : [];

  if (!summary || seasonSummaries.length < 1) {
    return <div>Loading lava pit data...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          flexWrap: "wrap",
          padding: "2px 0 4px 0",
        }}
      >
        {renderMetricBadge("Existing Lava Pits", frmtNb(summary.existingPits, 0), "./icon/res/lava_pit.webp", "Lava Pit")}
        {renderMetricBadge("Cycles per Pit / day", frmtNb(summary.pitCyclesPerDay), "./icon/ui/stopwatch.png", "Cycles")}
        {renderMetricBadge("Obsidian per Pit / day", frmtNb(summary.obsidianPerPitPerDay), "./icon/res/obsidian.webp", "Obsidian")}
      </div>

      {summary.note ? (
        <div style={{ ...CARD_STYLE, padding: "6px 10px", fontSize: 12, opacity: 0.92 }}>
          {summary.note}
        </div>
      ) : null}

      {seasonSummaries.map((season) => (
        <div key={season.seasonKey} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              ...CARD_STYLE,
              padding: "8px 10px",
              flexWrap: "wrap",
            }}
          >
            <img src={season.seasonIcon} alt={season.seasonLabel} className="seasonico" />
            <strong>{season.seasonLabel}</strong>
            {renderStatusPill(
              `${frmtNb(season.supportablePitCount, 0)} lava pits possible`,
              Number(season.supportablePitCount || 0) >= Number(summary.existingPits || 0) ? "good" : "bad"
            )}
            <span style={{ opacity: 0.85 }}>{season.summaryText}</span>
            {season.weakestResourceName ? (
              <span style={{ marginLeft: "auto", fontSize: 12, opacity: 0.95, display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span>Main problem: {season.weakestResourceName}</span>
                {renderStatusPill(`add ${season.weakestNodeName || "boosts"}`)}
              </span>
            ) : null}
          </div>

          <table className="table">
            <thead>
              <tr>
                <th className="thcenter">Resource</th>
                <th className="thcenter">Used / day</th>
                <th className="thcenter">Made / day</th>
                <th className="thcenter">Left after pits</th>
                <th className="thcenter">Buy{imgSFL} / day</th>
                <th className="thcenter">Best next node</th>
                <th className="thcenter">Missing boosts</th>
              </tr>
            </thead>
            <tbody>
              {season.ingredients.map((row) => (
                <tr key={`${season.seasonKey}-${row.itemName}`}>
                  <td className="tditem">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <img src={row.itemImg || "./icon/nft/na.png"} alt="" className="itico" title={row.itemName} />
                      {row.itemName}
                    </span>
                  </td>
                  <td className="tdcenter">{frmtNb(row.demandPerDay)}</td>
                  <td className="tdcenter">{frmtNb(row.supplyPerDay)}</td>
                  <td className="tdcenter" style={{ color: Number(row.balancePerDay || 0) >= 0 ? "#7CFF92" : "#FF8F8F" }}>
                    {Number(row.balancePerDay || 0) >= 0 ? "+" : ""}{frmtNb(row.balancePerDay)}
                  </td>
                  <td className="tdcenter">
                    {Number(row.marketBuyCostPerDay || 0) > 0 ? frmtNb(row.marketBuyCostPerDay) : "0"}
                  </td>
                  <td className="tdcenter">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <img src={row.nodeImg || "./icon/ui/lightning.png"} alt="" className="itico" title={row.nodeName} />
                      {renderStatusPill(row.nodeName || "Node")}
                    </span>
                  </td>
                  <td className="tdcenter">{renderBoostIcons(row.missingBoosts)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            ...CARD_STYLE,
            padding: "8px 10px",
          }}
        >
          <img src="./icon/res/lava_pit.webp" alt="" className="itico" title="Lava Pit" />
          <strong>Projection</strong>
          <span style={{ opacity: 0.8 }}>what happens now, and with +1, +2, +3 lava pits</span>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th className="thcenter">Season</th>
              <th className="thcenter">Lava Pits</th>
              <th className="thcenter">Scenario</th>
              <th className="thcenter" colSpan={5}>Resources left / day</th>
            </tr>
          </thead>
          <tbody>
            {projections.map((row) => {
              const rowResources = Array.isArray(row.resources) ? row.resources : [];
              const displayResources = rowResources.slice(0, 5);
              return (
                <tr key={`${row.seasonKey}-${row.delta}`}>
                  <td className="tdcenter">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <img src={row.seasonIcon} alt={row.seasonLabel} className="seasonico" />
                      {row.seasonLabel}
                    </span>
                  </td>
                  <td className="tdcenter">{frmtNb(row.pitCount, 0)}</td>
                  <td className="tdcenter">
                    {renderStatusPill(row.delta > 0 ? `+${row.delta}` : "Current", row.delta > 0 ? "neutral" : "good")}
                  </td>
                  {displayResources.map((resource) => {
                    const balance = Number(resource?.balancePerDay || 0);
                    return (
                      <td
                        key={`${row.seasonKey}-${row.delta}-${resource.itemName}`}
                        className="tdcenter"
                        style={{ color: balance >= 0 ? "#7CFF92" : "#FF8F8F", whiteSpace: "nowrap" }}
                        title={resource.itemName}
                      >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <span>{balance >= 0 ? "+" : ""}{frmtNb(balance)}</span>
                          <img src={resource.itemImg || "./icon/nft/na.png"} alt="" className="itico" title={resource.itemName} />
                        </span>
                      </td>
                    );
                  })}
                  {Array.from({ length: Math.max(0, 5 - displayResources.length) }).map((_, idx) => (
                    <td key={`${row.seasonKey}-${row.delta}-empty-${idx}`} className="tdcenter" style={{ opacity: 0.35 }}>-</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
