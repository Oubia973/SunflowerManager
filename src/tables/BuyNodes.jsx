import React, { useEffect, useRef, useState } from "react";
import { useAppCtx } from "../context/AppCtx";
import { CircularProgress } from "@mui/material";
import CounterInput from "../counterinput.js";
import DList from "../dlist.jsx";
import { frmtNb, timeToDays } from "../fct.js";

const OBSIDIAN_PER_SUNSTONE = 3;
const BUYNODES_COLUMNS_TEMPLATE = [
  ["Node", 1],
  ["Base", 1],
  ["Increase", 1],
  ["Owned", 1],
  ["Bought", 1],
  ["Buy", 1],
  ["Nodes after", 1],
  ["Next Price", 1],
  ["Sunstone Total", 1],
  ["Obsidian Total", 1],
  ["Obsidian Time", 1],
  ["Bought to reach", 1],
  // ["Priority", 1],
  // ["Remaining Obs", 1],
];

const NODE_PRICE_CONFIG = [
  { key: "Crop Plot", basePrice: 3, increase: 2, iconSrc: "./icon/res/soil.png" },
  { key: "Fruit Patch", basePrice: 5, increase: 5, iconSrc: "./icon/res/apple_tree.png" },
  { key: "Tree", basePrice: 4, increase: 3, iconSrc: "./icon/res/harvested_tree.png" },
  { key: "Stone Rock", basePrice: 4, increase: 3, iconSrc: "./icon/res/stone_small.png" },
  { key: "Iron Rock", basePrice: 7, increase: 5, iconSrc: "./icon/res/iron_small.png" },
  { key: "Gold Rock", basePrice: 10, increase: 6, iconSrc: "./icon/res/gold_small.png" },
  { key: "Crimstone Rock", basePrice: 20, increase: 20, iconSrc: "./icon/res/crimstone_rock_5.webp" },
  { key: "Flower Bed", basePrice: 30, increase: 25, iconSrc: "./icon/flower/flower_bed_modal.png" },
  { key: "Oil Reserve", basePrice: 40, increase: 20, iconSrc: "./icon/res/oil.webp" },
  { key: "Lava Pit", basePrice: 40, increase: 40, iconSrc: "./icon/res/lava_pit.webp" },
];

function toInt(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.floor(n));
}

function getTotalSunstoneCost(basePrice, increase, alreadyBought, buyCount) {
  if (buyCount <= 0) return 0;
  const firstPurchasePrice = basePrice + (alreadyBought * increase);
  return (buyCount * (2 * firstPurchasePrice + ((buyCount - 1) * increase))) / 2;
}

export default function BuyNodesTable() {
  const stickyBarRef = useRef(null);
  const buyNodesHeaderRowRef = useRef(null);
  const [buyNodesHeaderStickyTop, setBuyNodesHeaderStickyTop] = useState(0);
  const [buyNodesHeaderRowHeight, setBuyNodesHeaderRowHeight] = useState(0);
  const {
    data: { dataSetFarm },
    ui: {
      buyNodesQty,
      xListeColBuyNodes,
      TryChecked,
      buyNodesTimeFromStock,
      buyNodesSubMode,
      buyNodesSubObsidian,
      buyNodesBuyPerWeek,
      buyNodesSplitStrategy,
    },
    config: { API_URL },
    actions: { handleUIChange },
  } = useAppCtx();

  const buyNodesData = dataSetFarm?.buyNodesData || {};
  const buyNodesFrmData = buyNodesData?.frmData || {};
  const buyNodesObsidian = buyNodesData?.itables?.it?.Obsidian || dataSetFarm?.itables?.it?.Obsidian || {};
  const nodeT1 = buyNodesFrmData?.nodes || dataSetFarm?.frmData?.nodes || {};
  const nodeBought = buyNodesFrmData?.nodeBought || dataSetFarm?.frmData?.nodeBought || {};
  const buyMap = buyNodesQty || {};
  const columns = Array.isArray(xListeColBuyNodes) ? xListeColBuyNodes : BUYNODES_COLUMNS_TEMPLATE;
  const isColOn = (idx) => columns?.[idx]?.[1] === 1;
  const key = (name) => (TryChecked ? `${name}try` : name);
  const stickyHeadStyle = { position: "sticky", left: 0, zIndex: 4 };
  const stickyCellStyle = { position: "sticky", left: 0, zIndex: 3 };
  useEffect(() => {
    const updateBuyNodesHeaderTop = () => {
      setBuyNodesHeaderStickyTop(stickyBarRef.current?.offsetHeight || 0);
      setBuyNodesHeaderRowHeight(buyNodesHeaderRowRef.current?.offsetHeight || 0);
    };
    const raf = requestAnimationFrame(updateBuyNodesHeaderTop);
    window.addEventListener("resize", updateBuyNodesHeaderTop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateBuyNodesHeaderTop);
    };
  }, [xListeColBuyNodes, buyNodesSubMode, buyNodesSubObsidian, buyNodesBuyPerWeek]);

  const obsidianTime = String(buyNodesObsidian?.[key("time")] || buyNodesObsidian?.time || "00:00:00");
  const obsidianBuyUnitPrice = Number(buyNodesObsidian?.costp2pt ?? 0) || 0;
  const obsidianSpot = toInt(buyNodesObsidian?.[key("spot")] ?? nodeT1?.["Lava Pit"] ?? 0);
  const obsidianMyield = Number(buyNodesObsidian?.[key("myield")] || buyNodesObsidian?.myield || 0);
  const obsidianHarvestNode = Number(buyNodesObsidian?.[key("harvestnode")] || buyNodesObsidian?.harvestnode || 0);
  const obsidianInStock = Number(buyNodesObsidian?.instock || 0);
  const isWeekMode = (buyNodesSubMode || "obsidian") === "week";
  const rowsBase = NODE_PRICE_CONFIG.map((node) => {
    const owned = toInt(nodeT1?.[node.key] ?? 0);
    const bought = toInt(nodeBought?.[node.key] ?? 0);
    const buyCount = toInt(buyMap?.[node.key] || 0);
    const nodesAfter = owned + buyCount;
    const nextPrice = node.basePrice + ((bought + buyCount) * node.increase);
    const totalSunstone = getTotalSunstoneCost(node.basePrice, node.increase, bought, buyCount);
    const totalObsidian = totalSunstone * OBSIDIAN_PER_SUNSTONE;
    return {
      ...node,
      owned,
      bought,
      buyCount,
      nodesAfter,
      nextPrice,
      totalSunstone,
      totalObsidian,
    };
  });
  const grandTotalSunstone = rowsBase.reduce((sum, row) => sum + row.totalSunstone, 0);
  const grandTotalObsidian = rowsBase.reduce((sum, row) => sum + row.totalObsidian, 0);

  const [calcPlans, setCalcPlans] = useState([]);
  const [grandCalcPlan, setGrandCalcPlan] = useState({ time: "--:--:--", boughtObs: 0, boughtPrice: 0 });
  const [isCalcLoading, setIsCalcLoading] = useState(false);
  const calcReqSeqRef = useRef(0);
  const totalsPayload = rowsBase.map((r) => r.totalObsidian);
  useEffect(() => {
    const reqId = ++calcReqSeqRef.current;
    setIsCalcLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(API_URL + "/getbuynodescalc", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            totals: totalsPayload,
            cycleTime: obsidianTime,
            myield: obsidianMyield,
            spot: obsidianSpot,
            harvestnode: obsidianHarvestNode,
            unitPrice: obsidianBuyUnitPrice,
            useStock: !!buyNodesTimeFromStock,
            instock: obsidianInStock,
            subMode: isWeekMode ? "week" : "obsidian",
            subObsidian: Math.max(0, Number(buyNodesSubObsidian || 0)),
            subPerWeek: Math.max(1, Math.min(9, Number(buyNodesBuyPerWeek || 1))),
            splitStrategy: (
              buyNodesSplitStrategy === "sunstone"
              || buyNodesSplitStrategy === "short_time"
            ) ? buyNodesSplitStrategy : "short_time",
            lineEnabled: rowsBase.map((r) => Number(r?.buyCount || 0) > 0),
            sunstones: rowsBase.map((r) => Number(r?.totalSunstone || 0)),
          }),
        });
        if (!response.ok) return;
        const payload = await response.json();
        if (reqId !== calcReqSeqRef.current) return;
        const plans = Array.isArray(payload?.plans) ? payload.plans : [];
        setCalcPlans(plans);
        setGrandCalcPlan(payload?.grandPlan || { time: "--:--:--", boughtObs: 0, boughtPrice: 0 });
      } catch {
      } finally {
        if (reqId === calcReqSeqRef.current) {
          setIsCalcLoading(false);
        }
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [
    API_URL,
    obsidianTime,
    obsidianMyield,
    obsidianSpot,
    obsidianHarvestNode,
    obsidianBuyUnitPrice,
    buyNodesTimeFromStock,
    obsidianInStock,
    isWeekMode,
    buyNodesSubObsidian,
    buyNodesBuyPerWeek,
    buyNodesSplitStrategy,
    totalsPayload.join("|"),
  ]);

  const rows = rowsBase.map((row, idx) => {
    const obsidianPlan = calcPlans?.[idx] || { time: "--:--:--", priority: 0, remainingObs: 0, boughtObs: 0, boughtPrice: 0 };
    const isDone = String(obsidianPlan?.time || "") === "00:00:00";
    const hasBuy = Number(row?.buyCount || 0) > 0;
    const timeCell = !hasBuy
      ? ""
      : (isDone ? "Done" : (row.totalObsidian > 0 ? timeToDays(obsidianPlan.time || "--:--:--") : ""));
    return (
      <tr key={row.key}>
        <td id="iccolumn" className="tdcenter" style={stickyCellStyle}>
          <img src={row.iconSrc} alt={row.key} className="itico" />
        </td>
        {isColOn(0) ? <td className="tditem">{row.key}</td> : null}
        {isColOn(1) ? <td className="tdcenter">{frmtNb(row.basePrice)}</td> : null}
        {isColOn(2) ? <td className="tdcenter">+{frmtNb(row.increase)}</td> : null}
        {isColOn(3) ? <td className="tdcenter">{frmtNb(row.owned)}</td> : null}
        {isColOn(4) ? <td className="tdcenter">{frmtNb(row.bought)}</td> : null}
        {isColOn(5) ? (
          <td className="tdcenter">
            <CounterInput
              value={row.buyCount}
              onChange={(newValue) => {
                const nextValue = Math.max(0, Math.round(Number(newValue) || 0));
                handleUIChange({ target: { name: `buyNodesQty.${row.key}`, value: nextValue } });
              }}
              min={0}
              max={999}
            />
          </td>
        ) : null}
        {isColOn(6) ? <td className="tdcenter">{frmtNb(row.nodesAfter)}</td> : null}
        {isColOn(7) ? <td className="tdcenter">{frmtNb(row.nextPrice)}</td> : null}
        {isColOn(8) ? <td className="tdcenter">{frmtNb(row.totalSunstone)}</td> : null}
        {isColOn(9) ? <td className="tdcenter">{frmtNb(row.totalObsidian)}</td> : null}
        {isColOn(10) ? <td className="tdcenter">{timeCell}</td> : null}
        {(isColOn(11) && isWeekMode) ? (
          <td className="tdcenter">
            {Number(obsidianPlan?.boughtObs || 0) > 0 ? (
              <span style={{ fontSize: "11px", opacity: 0.95, display: "inline-flex", alignItems: "center", gap: "2px" }}>
                {frmtNb(obsidianPlan.boughtObs)}<img src="./icon/res/obsidian.webp" alt="" className="itico" title="Obsidian" />
                <span>&nbsp;/&nbsp;</span>
                {frmtNb(obsidianPlan.boughtPrice)}<img src="./icon/res/flowertoken.webp" alt="" className="itico" title="Flower" />
              </span>
            ) : null}
          </td>
        ) : null}
        {/* {isColOn(12) ? <td className="tdcenter">{Number(obsidianPlan?.priority || 0) > 0 ? `#${frmtNb(obsidianPlan.priority, 0)}` : ""}</td> : null} */}
        {/* {isColOn(13) ? <td className="tdcenter">{Number(obsidianPlan?.remainingObs || 0) > 0 ? frmtNb(obsidianPlan.remainingObs) : ""}</td> : null} */}
      </tr>
    );
  });
  const linePlans = rowsBase.map((_, idx) => calcPlans?.[idx] || { boughtObs: 0, boughtPrice: 0 });
  const grandBoughtObsFromLines = linePlans.reduce((sum, p) => sum + Number(p?.boughtObs || 0), 0);
  const grandBoughtPriceFromLines = linePlans.reduce((sum, p) => sum + Number(p?.boughtPrice || 0), 0);
  const anyBuy = rowsBase.some((row) => Number(row?.buyCount || 0) > 0);
  const grandPlan = grandCalcPlan || { time: "--:--:--", boughtObs: 0, boughtPrice: 0 };
  const grandDone = String(grandPlan?.time || "") === "00:00:00";
  const grandTotalObsidianTime = !anyBuy
    ? ""
    : (grandDone ? "Done" : (grandTotalObsidian > 0 ? timeToDays(grandPlan.time || "--:--:--") : ""));
  const buyObsidianTotalPrice = Math.max(0, Number(buyNodesSubObsidian || 0)) * obsidianBuyUnitPrice;
  const buyPerWeekTotalPrice = Math.max(1, Math.min(9, Number(buyNodesBuyPerWeek || 1))) * obsidianBuyUnitPrice;

  return (
    <>
      <div
        ref={stickyBarRef}
        style={{
          position: "sticky",
          top: "0px",
          left: "0px",
          zIndex: 7,
          display: "flex",
          gap: "8px",
          alignItems: "center",
          flexWrap: "wrap",
          padding: "2px 0 4px 0",
          background: "rgb(18, 8, 2)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            gap: "4px",
            padding: "4px 8px",
            border: "1px solid rgb(90, 90, 90)",
            borderRadius: "6px",
            background: "rgba(0, 0, 0, 0.28)",
            width: "fit-content",
            maxWidth: "100%",
          }}
        >
          <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", whiteSpace: "nowrap" }}>
            <input
              type="radio"
              name="buyNodesSubMode"
              value="obsidian"
              checked={(buyNodesSubMode || "obsidian") !== "week"}
              onChange={handleUIChange}
            />
            <span>Buy Obsidians</span>
            <input
              type="number"
              min={0}
              step={1}
              name="buyNodesSubObsidian"
              value={buyNodesSubObsidian ?? 0}
              onChange={(e) => {
                const nextValue = Math.max(0, Math.floor(Number(e?.target?.value) || 0));
                handleUIChange({ target: { name: "buyNodesSubObsidian", value: nextValue } });
              }}
              style={{ width: "38px" }}
            />
            <span style={{ fontSize: "11px", opacity: 0.95, display: "inline-flex", alignItems: "center", gap: "2px" }}>
              {frmtNb(buyObsidianTotalPrice)}
              <img src="./icon/res/flowertoken.webp" alt="" className="itico" title="Flower" />
            </span>
            {isCalcLoading ? <CircularProgress size={12} sx={{ color: "rgb(255, 205, 96)" }} /> : null}
          </label>
          <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", whiteSpace: "nowrap" }}>
            <input
              type="radio"
              name="buyNodesSubMode"
              value="week"
              checked={(buyNodesSubMode || "obsidian") === "week"}
              onChange={handleUIChange}
            />
            <span>Buy per week</span>
            <CounterInput
              value={Math.max(1, Math.min(9, Number(buyNodesBuyPerWeek || 1)))}
              onChange={(newValue) => {
                const nextValue = Math.max(1, Math.min(9, Math.round(Number(newValue) || 1)));
                handleUIChange({ target: { name: "buyNodesBuyPerWeek", value: nextValue } });
              }}
              min={1}
              max={9}
            />
            <span style={{ fontSize: "11px", opacity: 0.95, display: "inline-flex", alignItems: "center", gap: "2px" }}>
              {frmtNb(buyPerWeekTotalPrice)}
              <img src="./icon/res/flowertoken.webp" alt="" className="itico" title="Flower" />
            </span>
            <span style={{ marginLeft: "8px" }}>Split</span>
            <DList
              name="buyNodesSplitStrategy"
              value={buyNodesSplitStrategy || "short_time"}
              onChange={handleUIChange}
              options={[
                { value: "short_time", label: "Shortest to Done First" },
                { value: "sunstone", label: "Highest Sunstone First" },
              ]}
              height={20}
            />
          </label>
        </div>
      </div>
      <table
        className="table buynodes-table"
        style={{
          "--buynodes-head-top": `${buyNodesHeaderStickyTop}px`,
          "--buynodes-head-row-h": `${buyNodesHeaderRowHeight}px`,
        }}
      >
        <thead>
          <tr ref={buyNodesHeaderRowRef}>
            <th id="ichcolumn" className="thcenter" style={stickyHeadStyle}></th>
            {isColOn(0) ? <th className="thcenter">Node</th> : null}
            {isColOn(1) ? <th className="thcenter">
              <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", lineHeight: 1.05 }}>
                <span>Base</span>
                <img src="./icon/res/sunstone.png" alt="" className="itico" title="Sunstone" />
              </span>
            </th> : null}
            {isColOn(2) ? (
              <th className="thcenter">
                <span style={{ display: "inline-flex", flexDirection: "column", lineHeight: 1.05 }}>
                  <span>Increase</span>
                  <span style={{ fontSize: "10px", opacity: 0.9 }}>price</span>
                </span>
              </th>
            ) : null}
            {isColOn(3) ? <th className="thcenter">
              <span style={{ display: "inline-flex", flexDirection: "column", lineHeight: 1.05 }}>
                <span>Nodes</span>
                <span style={{ fontSize: "10px", opacity: 0.9 }}>on farm</span>
              </span>
            </th> : null}
            {isColOn(4) ? <th className="thcenter">Bought</th> : null}
            {isColOn(5) ? <th className="thcenter">Buy</th> : null}
            {isColOn(6) ? (
              <th className="thcenter">
                <span style={{ display: "inline-flex", flexDirection: "column", lineHeight: 1.05 }}>
                  <span>Nodes</span>
                  <span style={{ fontSize: "10px", opacity: 0.9 }}>after</span>
                </span>
              </th>
            ) : null}
            {isColOn(7) ? <th className="thcenter">Next Price</th> : null}
            {isColOn(8) ? (
              <th className="thcenter">
                <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", lineHeight: 1.05 }}>
                  <span>Total</span>
                  <img src="./icon/res/sunstone.png" alt="" className="itico" title="Sunstone" />
                </span>
              </th>
            ) : null}
            {isColOn(9) ? (
              <th className="thcenter">
                <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", lineHeight: 1.05 }}>
                  <span>Total</span>
                  <img src="./icon/res/obsidian.webp" alt="" className="itico" title="Obsidian" />
                </span>
              </th>
            ) : null}
            {isColOn(10) ? (
              <th className="thcenter">
                <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", lineHeight: 1.05 }}>
                  <span>Total Time</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <img src="./icon/res/obsidian.webp" alt="" className="itico" title="Obsidian" />
                    <label style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 400, opacity: 0.95 }}>
                      <input
                        type="checkbox"
                        name="buyNodesTimeFromStock"
                        checked={!!buyNodesTimeFromStock}
                        onChange={handleUIChange}
                      />
                      from stock
                    </label>
                  </span>
                </span>
              </th>
            ) : null}
            {(isColOn(11) && isWeekMode) ? (
              <th className="thcenter">
                <span style={{ display: "inline-flex", flexDirection: "column", lineHeight: 1.05 }}>
                  <span>Buy to reach</span>
                  <span style={{ fontSize: "10px", opacity: 0.9 }}>
                    Total <img src="./icon/res/obsidian.webp" alt="" className="itico" title="Obsidian" /> / price
                  </span>
                </span>
              </th>
            ) : null}
            {/* {isColOn(12) ? <th className="thcenter">Priority</th> : null} */}
            {/* {isColOn(13) ? <th className="thcenter">Remaining Obs</th> : null} */}
          </tr>
          <tr>
            <td id="iccolumn" className="ttcenter" style={stickyHeadStyle}></td>
            {isColOn(0) ? <td className="ttcenter">TOTAL</td> : null}
            {isColOn(1) ? <td className="ttcenter"></td> : null}
            {isColOn(2) ? <td className="ttcenter"></td> : null}
            {isColOn(3) ? <td className="ttcenter"></td> : null}
            {isColOn(4) ? <td className="ttcenter"></td> : null}
            {isColOn(5) ? <td className="ttcenter"></td> : null}
            {isColOn(6) ? <td className="ttcenter"></td> : null}
            {isColOn(7) ? <td className="ttcenter"></td> : null}
            {isColOn(8) ? <td className="ttcenter">{frmtNb(grandTotalSunstone)}</td> : null}
            {isColOn(9) ? <td className="ttcenter">{frmtNb(grandTotalObsidian)}</td> : null}
            {isColOn(10) ? <td className="ttcenter">{grandTotalObsidianTime}</td> : null}
            {(isColOn(11) && isWeekMode) ? (
              <td className="ttcenter">
                {Number(grandBoughtObsFromLines || 0) > 0 ? (
                  <span style={{ fontSize: "11px", opacity: 0.95, display: "inline-flex", alignItems: "center", gap: "2px" }}>
                    {frmtNb(grandBoughtObsFromLines)}<img src="./icon/res/obsidian.webp" alt="" className="itico" title="Obsidian" />
                    <span>&nbsp;/&nbsp;</span>
                    {frmtNb(grandBoughtPriceFromLines)}<img src="./icon/res/flowertoken.webp" alt="" className="itico" title="Flower" />
                  </span>
                ) : null}
              </td>
            ) : null}
            {/* {isColOn(12) ? <td className="ttcenter"></td> : null} */}
            {/* {isColOn(13) ? <td className="ttcenter"></td> : null} */}
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </>
  );
}
