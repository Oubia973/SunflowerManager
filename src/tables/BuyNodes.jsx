import React from "react";
import { useAppCtx } from "../context/AppCtx";
import CounterInput from "../counterinput.js";
import { convTime, convtimenbr, frmtNb, timeToDays } from "../fct.js";

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
  const {
    data: { dataSetFarm },
    ui: { buyNodesQty, xListeColBuyNodes, TryChecked, buyNodesTimeFromStock },
    actions: { handleUIChange },
  } = useAppCtx();

  const buyNodesData = dataSetFarm?.buyNodesData || {};
  const buyNodesFrmData = buyNodesData?.frmData || {};
  const buyNodesObsidian = buyNodesData?.itables?.it?.Obsidian || {};
  const nodeT1 = buyNodesFrmData?.nodes || dataSetFarm?.frmData?.nodes || {};
  const nodeBought = buyNodesFrmData?.nodeBought || dataSetFarm?.frmData?.nodeBought || {};
  const buyMap = buyNodesQty || {};
  const columns = Array.isArray(xListeColBuyNodes) ? xListeColBuyNodes : BUYNODES_COLUMNS_TEMPLATE;
  const isColOn = (idx) => columns?.[idx]?.[1] === 1;
  const key = (name) => (TryChecked ? `${name}try` : name);
  const stickyHeadStyle = { position: "sticky", left: 0, zIndex: 4 };
  const stickyCellStyle = { position: "sticky", left: 0, zIndex: 3 };

  let grandTotalSunstone = 0;
  let grandTotalObsidian = 0;
  const obsidianTime = String(buyNodesObsidian?.[key("time")] || buyNodesObsidian?.time || "00:00:00");
  const obsidianCycleDays = convtimenbr(obsidianTime);
  const lavaOwned = toInt(buyNodesObsidian?.[key("spot")] ?? nodeT1?.["Lava Pit"] ?? 0);
  const obsidianYieldByNode = Number(buyNodesObsidian?.[key("myield")] || buyNodesObsidian?.myield || 0);
  const obsidianByCycle = lavaOwned > 0
    ? (obsidianYieldByNode * lavaOwned)
    : Number(buyNodesObsidian?.[key("harvestnode")] || buyNodesObsidian?.harvestnode || 0);
  const obsidianInStock = Number(buyNodesObsidian?.instock || 0);
  const getObsidianDuration = (amount) => {
    const rawQty = Number(amount || 0);
    const qty = buyNodesTimeFromStock ? Math.max(0, rawQty - obsidianInStock) : rawQty;
    if (qty <= 0) return timeToDays("00:00:00");
    if (obsidianCycleDays <= 0 || obsidianByCycle <= 0) return "--:--:--";
    const fullCyclesNeeded = Math.ceil(qty / obsidianByCycle);
    const daysNeeded = fullCyclesNeeded * obsidianCycleDays;
    return timeToDays(convTime(daysNeeded));
  };

  const rows = NODE_PRICE_CONFIG.map((node) => {
    const owned = toInt(nodeT1?.[node.key] ?? 0);
    const bought = toInt(nodeBought?.[node.key] ?? 0);
    const buyCount = toInt(buyMap?.[node.key] || 0);
    const nodesAfter = owned + buyCount;
    const nextPrice = node.basePrice + ((bought + buyCount) * node.increase);
    const totalSunstone = getTotalSunstoneCost(node.basePrice, node.increase, bought, buyCount);
    const totalObsidian = totalSunstone * OBSIDIAN_PER_SUNSTONE;
    const totalObsidianTime = getObsidianDuration(totalObsidian);
    grandTotalSunstone += totalSunstone;
    grandTotalObsidian += totalObsidian;

    return (
      <tr key={node.key}>
        <td id="iccolumn" className="tdcenter" style={stickyCellStyle}>
          <img src={node.iconSrc} alt={node.key} className="itico" />
        </td>
        {isColOn(0) ? <td className="tditem">{node.key}</td> : null}
        {isColOn(1) ? <td className="tdcenter">{frmtNb(node.basePrice)}</td> : null}
        {isColOn(2) ? <td className="tdcenter">+{frmtNb(node.increase)}</td> : null}
        {isColOn(3) ? <td className="tdcenter">{frmtNb(owned)}</td> : null}
        {isColOn(4) ? <td className="tdcenter">{frmtNb(bought)}</td> : null}
        {isColOn(5) ? (
          <td className="tdcenter">
            <CounterInput
              value={buyCount}
              onChange={(newValue) => {
                const nextValue = Math.max(0, Math.round(Number(newValue) || 0));
                handleUIChange({ target: { name: `buyNodesQty.${node.key}`, value: nextValue } });
              }}
              min={0}
              max={999}
            />
          </td>
        ) : null}
        {isColOn(6) ? <td className="tdcenter">{frmtNb(nodesAfter)}</td> : null}
        {isColOn(7) ? <td className="tdcenter">{frmtNb(nextPrice)}</td> : null}
        {isColOn(8) ? <td className="tdcenter">{frmtNb(totalSunstone)}</td> : null}
        {isColOn(9) ? <td className="tdcenter">{frmtNb(totalObsidian)}</td> : null}
        {isColOn(10) ? <td className="tdcenter">{totalObsidianTime}</td> : null}
      </tr>
    );
  });
  const grandTotalObsidianTime = getObsidianDuration(grandTotalObsidian);

  return (
    <table className="table">
      <thead>
        <tr>
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
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
}
