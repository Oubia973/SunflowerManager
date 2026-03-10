import React, { useEffect, useMemo, useState } from "react";
import DList from "../dlist.jsx";
import {
  normalizeToken,
  inferCategoryTokens,
  BOOST_ITEM_CATEGORY_ALIASES,
} from "../tryNftTaxonomy.js";

function TryProfileSummaryModal({ profile, onClose }) {
  const rows = useMemo(
    () => (Array.isArray(profile?.boostChanges) ? profile.boostChanges : []),
    [profile]
  );
  const impacts = Array.isArray(profile?.impacts) ? profile.impacts : [];
  const compareMode = String(profile?.compareMode || "active");
  const profileName = String(profile?.profileName || "").trim();
  const [impactMetric, setImpactMetric] = useState("dailysfl");
  const [masonryCols, setMasonryCols] = useState(2);
  const boostIconMap = (profile?.boostIconMap && typeof profile.boostIconMap === "object") ? profile.boostIconMap : {};
  const boostCategoryMap = (profile?.boostCategoryMap && typeof profile.boostCategoryMap === "object") ? profile.boostCategoryMap : {};
  const itemIconMap = (profile?.itemIconMap && typeof profile.itemIconMap === "object") ? profile.itemIconMap : {};
  const scopeLabel = (profile?.mode === "all")
    ? "All"
    : (Array.isArray(profile?.parts) ? profile.parts.join(", ") : "");
  useEffect(() => {
    const computeCols = () => {
      const vw = Number(window?.innerWidth || 0);
      const modalW = Math.min(1100, Math.floor(vw * 0.92));
      if (modalW < 620) return 1;
      if (modalW < 900) return 2;
      return 3;
    };
    const apply = () => setMasonryCols(computeCols());
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);
  const grouped = useMemo(() => {
    const acc = {};
    rows.forEach((r) => {
      if (!acc[r.section]) acc[r.section] = [];
      acc[r.section].push(r);
    });
    return acc;
  }, [rows]);
  const skillsPointsInfo = useMemo(() => {
    const skillRows = rows.filter((r) => String(r?.section || "").toLowerCase() === "skill");
    if (skillRows.length < 1) return null;
    const rowPoints = (r) => {
      const p = Number(r?.points || 0);
      return Number.isFinite(p) && p > 0 ? p : 1;
    };
    const added = skillRows.reduce((n, r) => n + (String(r?.status || "") === "added" ? rowPoints(r) : 0), 0);
    const removed = skillRows.reduce((n, r) => n + (String(r?.status || "") === "removed" ? rowPoints(r) : 0), 0);
    const net = added - removed;
    return { added, removed, net };
  }, [rows]);
  const buildCategoryMap = (sectionName, sectionRows) => {
    const cap = (txt) => {
      const s = String(txt || "").trim();
      if (!s) return "Other";
      return s.charAt(0).toUpperCase() + s.slice(1);
    };
    const resolveRowCategory = (row) => {
      const explicit = String(row?.category || "").trim();
      const fallbackCat = boostCategoryMap?.[`${String(row?.table || "").toLowerCase()}|${String(row?.name || "")}`]
        || boostCategoryMap?.[String(row?.name || "")]
        || "";
      const explicitNorm = normalizeToken(explicit);
      if (explicitNorm && explicitNorm !== "other") return cap(explicit);
      const fallbackNorm = normalizeToken(fallbackCat);
      if (fallbackNorm && fallbackNorm !== "other") return cap(fallbackCat);
      const tokens = [
        ...inferCategoryTokens(row?.boost),
        String(row?.name || ""),
        String(row?.section || ""),
      ]
        .map((v) => normalizeToken(v))
        .filter(Boolean);
      for (const tk of tokens) {
        const mapped = BOOST_ITEM_CATEGORY_ALIASES?.[tk];
        if (mapped) return cap(mapped);
      }
      return "Other";
    };
    const out = {};
    (sectionRows || []).forEach((r) => {
      const key = resolveRowCategory(r);
      if (!out[key]) out[key] = [];
      out[key].push(r);
    });
    return out;
  };
  const formatCat = (cat) => {
    const txt = String(cat || "other").trim();
    if (!txt) return "Other";
    return txt.charAt(0).toUpperCase() + txt.slice(1);
  };
  const normalizeImpactEntry = (entry) => {
    if (Array.isArray(entry)) {
      const hasExtended = entry.length >= 13;
      const yTry = Number(entry?.[1] || 0);
      const yBase = Number(entry?.[2] || 0);
      const yPct = Number(entry?.[3] || 0);
      const hTry = hasExtended ? Number(entry?.[4] || 0) : yTry;
      const hBase = hasExtended ? Number(entry?.[5] || 0) : yBase;
      const hPct = hasExtended ? Number(entry?.[6] || 0) : yPct;
      const dTry = hasExtended ? Number(entry?.[7] || 0) : yTry;
      const dBase = hasExtended ? Number(entry?.[8] || 0) : yBase;
      const dPct = hasExtended ? Number(entry?.[9] || 0) : yPct;
      return {
        name: String(entry?.[0] || ""),
        yield: yTry,
        yieldBase: yBase,
        yieldPct: yPct,
        harvest: hTry,
        harvestBase: hBase,
        harvestPct: hPct,
        dailysfl: dTry,
        dailysflBase: dBase,
        dailysflPct: dPct,
        img: hasExtended ? String(entry?.[10] || "") : String(entry?.[4] || ""),
        cat: hasExtended ? String(entry?.[11] || "other") : String(entry?.[5] || "other"),
        buyit: hasExtended ? Number(entry?.[12] || 0) === 1 : false,
      };
    }
    return entry || {};
  };
  const impactsByCategory = useMemo(() => {
    const out = {};
    impacts.forEach((entry) => {
      const normalized = normalizeImpactEntry(entry);
      const cat = formatCat(normalized?.cat || "other");
      if (!out[cat]) out[cat] = [];
      out[cat].push(normalized);
    });
    return out;
  }, [impacts]);
  const boostSectionFrames = useMemo(() => {
    return Object.entries(grouped).map(([section, sectionRows]) => {
      const categories = Object.entries(buildCategoryMap(section, sectionRows)).map(([cat, catRows]) => ({
        key: `${section}-${cat}`,
        category: cat,
        rows: catRows,
      }));
      return {
        key: `section-${section}`,
        section,
        categories,
      };
    });
  }, [grouped]);
  const impactMetricOptions = [
    { value: "yield", label: "Yield" },
    { value: "harvest", label: "Harvest" },
    { value: "dailysfl", label: "Daily SFL" },
  ];
  const metricLabel = impactMetric === "harvest" ? "Harvest" : impactMetric === "dailysfl" ? "Daily SFL" : "Yield";
  const metricValue = (entry) => {
    if (impactMetric === "harvest") return Number(entry?.harvest || 0);
    if (impactMetric === "dailysfl") return Number(entry?.dailysfl || 0);
    return Number(entry?.yield || 0);
  };
  const metricBaseValue = (entry) => {
    if (impactMetric === "harvest") return Number(entry?.harvestBase || 0);
    if (impactMetric === "dailysfl") return Number(entry?.dailysflBase || 0);
    return Number(entry?.yieldBase || 0);
  };
  const metricPct = (entry) => {
    if (impactMetric === "harvest") return Number(entry?.harvestPct || 0);
    if (impactMetric === "dailysfl") return Number(entry?.dailysflPct || 0);
    return Number(entry?.yieldPct || 0);
  };

  const compareLabel = compareMode === "zero"
    ? "vs zero boost"
    : compareMode === "shared"
      ? "vs active at share time"
      : "vs active";

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0, 0, 0, 0.72)",
      zIndex: 3000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 12,
    }}>
      <div style={{
        width: "min(1100px, 92vw)",
        minWidth: 0,
        maxWidth: "92vw",
        maxHeight: "92vh",
        overflow: "auto",
        display: "block",
        background: "#1f1a1a",
        border: "1px solid #524141",
        borderRadius: 8,
        color: "#e6f2e4",
      }}>
        <div
          style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 12px",
          borderBottom: "1px solid #524141",
          position: "sticky",
          top: 0,
          zIndex: 5,
          background: "#1f1a1a",
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{profileName} Summary</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              {scopeLabel || "custom"} | Compare: {compareLabel}
              {skillsPointsInfo ? (
                <span style={{ marginLeft: 8 }}>
                  | Skills points: <span style={{ color: "#7fe36f", fontWeight: 700 }}>+{skillsPointsInfo.added}</span>
                  {" / "}
                  <span style={{ color: "#ff7f7f", fontWeight: 700 }}>-{skillsPointsInfo.removed}</span>
                  {" "}(
                  <span style={{ color: skillsPointsInfo.net >= 0 ? "#7fe36f" : "#ff7f7f", fontWeight: 700 }}>
                    {skillsPointsInfo.net >= 0 ? "+" : "-"}{Math.abs(skillsPointsInfo.net)}
                  </span>
                  )
                </span>
              ) : null}
            </div>
          </div>
          <button class="button" onClick={onClose}>
            <img src="./icon/ui/cancel.png" alt="Close" className="resico" />
          </button>
        </div>
        <div style={{ display: "block", width: "100%" }}>
        <div style={{ padding: 12, display: "block", width: "100%", boxSizing: "border-box" }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Boosts</div>
          {rows.length < 1 ? (
            <div>No change on boosts in this profile.</div>
          ) : (
            <div
              style={{
                columnCount: masonryCols,
                columnGap: 8,
                width: "100%",
              }}
            >
              {boostSectionFrames.map((sectionFrame) => (
                <div
                  key={sectionFrame.key}
                  style={{
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 7,
                    padding: 5,
                    background: "rgba(255,255,255,0.02)",
                    boxSizing: "border-box",
                    display: "inline-block",
                    width: "100%",
                    breakInside: "avoid",
                    marginBottom: 6,
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 4 }}>{sectionFrame.section}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 4 }}>
                    {sectionFrame.categories.map((frame) => (
                      <div
                        key={frame.key}
                        style={{
                          border: "1px solid rgba(255,255,255,0.16)",
                          borderRadius: 6,
                          padding: 5,
                          background: "rgba(255,255,255,0.015)",
                        }}
                      >
                        <div style={{ fontSize: 11, opacity: 0.9, marginBottom: 4, fontWeight: 700 }}>
                          {String(frame.category || "")}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {frame.rows.map((row, idx) => (
                            <div
                              key={`${frame.key}-${row.name}-${idx}`}
                              style={{
                                border: "1px solid rgba(255,255,255,0.15)",
                                borderRadius: 14,
                                padding: "3px 8px",
                                fontSize: 12,
                                background: "rgba(255,255,255,0.03)",
                              }}
                              title={row.boost || ""}
                            >
                              {(row.img || boostIconMap?.[`${String(row?.table || "").toLowerCase()}|${row.name}`] || boostIconMap?.[row.name]) ? (
                                <img
                                  src={row.img || boostIconMap?.[`${String(row?.table || "").toLowerCase()}|${row.name}`] || boostIconMap?.[row.name]}
                                  alt=""
                                  style={{ width: 14, height: 14, verticalAlign: "middle", marginRight: 5 }}
                                />
                              ) : null}
                              {row?.status === "added" ? (
                                <span style={{ color: "#7fe36f", fontWeight: 700, marginRight: 3 }}>+</span>
                              ) : row?.status === "removed" ? (
                                <span style={{ color: "#ff7f7f", fontWeight: 700, marginRight: 3 }}>-</span>
                              ) : null}
                              {row.name}
                              {row?.nameSuffix ? <span style={{ fontSize: 10, opacity: 0.9, marginLeft: 3 }}>{row.nameSuffix}</span> : null}
                              {row?.status === "changed" ? (
                                <>
                                  <span style={{ fontSize: 10, opacity: 0.95, marginLeft: 4 }}>
                                    {String(row?.finalValue || "")}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: 10,
                                      opacity: 0.95,
                                      marginLeft: 3,
                                      color: Number(row?.delta || 0) >= 0 ? "#7fe36f" : "#ff7f7f",
                                      fontWeight: 700,
                                    }}
                                  >
                                    {String(row?.diffText || "")}
                                  </span>
                                </>
                              ) : row?.changeText ? (
                                <span style={{ fontSize: 10, opacity: 0.85, marginLeft: 4 }}>
                                  {row.changeText}
                                </span>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ padding: "0 12px 12px 12px", display: "block", width: "100%", boxSizing: "border-box" }}>
          <div style={{ fontWeight: 700, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
            <span>Impacted Items</span>
            <DList
              name="impactMetric"
              options={impactMetricOptions}
              value={impactMetric}
              onChange={(e) => setImpactMetric(String(e?.target?.value || "dailysfl"))}
              height={22}
            />
          </div>
          {impacts.length < 1 ? (
            <div>No impacted item found for this comparison.</div>
          ) : (
            <div
              style={{
                columnCount: masonryCols,
                columnGap: 8,
                width: "100%",
              }}
            >
              {Object.entries(impactsByCategory).map(([cat, list]) => (
                <div
                  key={`impact-${cat}`}
                  style={{
                    display: "block",
                    width: "100%",
                    breakInside: "avoid",
                    boxSizing: "border-box",
                    marginBottom: 8,
                    border: "1px solid rgba(255,255,255,0.16)",
                    borderRadius: 6,
                    padding: 6,
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <div style={{ fontSize: 11, opacity: 0.9, marginBottom: 5, fontWeight: 700 }}>
                    {cat}
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left", fontSize: 10, opacity: 0.75, fontWeight: 600, paddingBottom: 3 }}>Item</th>
                        <th style={{ textAlign: "right", fontSize: 10, opacity: 0.75, fontWeight: 600, paddingBottom: 3 }}>Before</th>
                        <th style={{ textAlign: "right", fontSize: 10, opacity: 0.75, fontWeight: 600, paddingBottom: 3 }}>{metricLabel}</th>
                        <th style={{ textAlign: "right", fontSize: 10, opacity: 0.75, fontWeight: 600, paddingBottom: 3 }}>%</th>
                      </tr>
                    </thead>
                    <tbody>
                    {list.map((entry, idx) => {
                      const pct = metricPct(entry);
                      const isPos = pct >= 0;
                      const isZero = Math.abs(pct) < 1e-9;
                      return (
                        <tr key={`${cat}-${String(entry?.name || "")}-${idx}`}>
                          <td style={{ padding: "2px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {(entry?.img || itemIconMap?.[String(entry?.name || "")]) ? (
                              <img
                                src={String(entry?.img || itemIconMap?.[String(entry?.name || "")] || "")}
                                alt=""
                                style={{ width: 14, height: 14, verticalAlign: "middle", marginRight: 5 }}
                              />
                            ) : null}
                            {Number(entry?.buyit || 0) === 1 ? (
                              <img
                                src="./icon/ui/exchange.png"
                                alt=""
                                style={{ width: 12, height: 12, verticalAlign: "middle", marginRight: 4 }}
                              />
                            ) : null}
                            {String(entry?.name || "")}
                          </td>
                          <td style={{ textAlign: "right", padding: "2px 0", fontSize: 11, opacity: 0.85, whiteSpace: "nowrap" }}>
                            {metricBaseValue(entry).toFixed(2)}
                          </td>
                          <td style={{ textAlign: "right", padding: "2px 0", fontSize: 11, opacity: 0.85, whiteSpace: "nowrap" }}>
                            {metricValue(entry).toFixed(2)}
                          </td>
                          <td style={{ textAlign: "right", padding: "2px 0", color: isZero ? "#9aa0a6" : (isPos ? "#7fe36f" : "#ff7f7f"), whiteSpace: "nowrap", fontWeight: 700 }}>
                            {(isPos ? "+" : "-") + Math.abs(pct).toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

export default TryProfileSummaryModal;
