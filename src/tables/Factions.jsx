import React, { useEffect, useState } from "react";
import { useAppCtx } from "../context/AppCtx";
import { frmtNb, PBar } from "../fct.js";

const imgna = "./icon/nft/na.png";
const FACTION_ORDER = ["sunflorians", "nightshades", "bumpkins", "goblins"];
const FACTION_LABELS = {
  sunflorians: "SUNFLORIANS",
  nightshades: "NIGHTSHADES",
  bumpkins: "BUMPKINS",
  goblins: "GOBLINS",
};
const FACTION_TEXT_COLOR = {
  sunflorians: "#fddd37",
  nightshades: "#b778ff",
  bumpkins: "#5fb4ff",
  goblins: "#75d04f",
};
const FACTION_BADGE = {
  sunflorians: "./icon/ui/factions.webp",
  nightshades: "./icon/ui/factions.webp",
  bumpkins: "./icon/ui/factions.webp",
  goblins: "./icon/ui/factions.webp",
};
// const FACTION_PET = {
//   sunflorians: "./icon/pet/phoenix.webp",
//   nightshades: "./icon/pet/owl.webp",
//   bumpkins: "./icon/pet/warthog.webp",
//   goblins: "./icon/pet/dragon.webp",
// };
export default function FactionsTable() {
  const {
    data: { dataSet, dataSetFarm },
    ui: { selectedInv, Refresh },
    config: { API_URL },
    img: { imgExchng },
  } = useAppCtx();
  const [factions, setFactions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [factionsDate, setFactionsDate] = useState(null);
  const TEN_MIN = 10 * 60 * 1000;

  async function getFactions(dataSetFarm, API_URL) {
    const farmId = dataSetFarm?.frmid;
    const userName = dataSetFarm?.username;
    if (!farmId) return null;
    const res = await fetch(API_URL + "/getfactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ frmid: farmId, username: userName }),
    });
    if (!res.ok) {
      console.log(`Error : ${res.status}`);
      return null;
    }
    return res.json();
  }

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (selectedInv !== "factions") return;
      const now = Date.now();
      const last = factionsDate ? new Date(factionsDate).getTime() : 0;
      if (factions && now - last < TEN_MIN) return;
      setLoading(true);
      try {
        const data = await getFactions(dataSetFarm, API_URL);
        setFactionsDate(new Date());
        if (!cancelled) setFactions(data);
      } catch (e) {
        console.log(e);
        if (!cancelled) setFactions(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [selectedInv, Refresh, dataSetFarm, API_URL, factionsDate, factions]);

  if (selectedInv !== "factions") return null;
  if (loading) return <div>Loading...</div>;
  if (!factions || typeof factions !== "object") return null;

  const factionKeys = FACTION_ORDER.filter((key) => factions[key]);
  if (!factionKeys.length) return null;

  return (
    <div className="factions-grid">
      {factionKeys.map((factionKey) => (
        <FactionCard
          key={factionKey}
          factionKey={factionKey}
          factionData={factions[factionKey]}
          dataSet={dataSet}
          dataSetFarm={dataSetFarm}
          imgExchng={imgExchng}
        />
      ))}
    </div>
  );
}

function FactionCard({ factionKey, factionData, dataSet, dataSetFarm, imgExchng }) {
  if (!factionData || !dataSetFarm?.itables) return null;

  const petRequests = factionData?.pet?.requests || [];
  const kitchenRequests = factionData?.kitchen?.requests || [];
  const petCurXP = Number(factionData?.petCurXP || 0);
  const petGoal = Number(factionData?.petGoal || 0);
  const streak = Number(factionData?.streak || 0);
  const progress = petGoal > 0 ? Math.max(0, (petCurXP / petGoal) * 100) : 0;
  const currentFactionName =
    dataSetFarm?.faction?.factionName ||
    dataSetFarm?.frmData?.faction?.factionName ||
    "";
  const currentFactionKey = normalizeFactionName(currentFactionName);
  const isCurrentFaction = currentFactionKey === normalizeFactionName(factionKey);
  const isEligible = Boolean(
    dataSetFarm?.isElligible ??
    dataSetFarm?.isEligible ??
    dataSetFarm?.faction?.isEligible ??
    dataSetFarm?.frmData?.faction?.isEligible
  );
  const showContributingMember = isCurrentFaction;
  const contributingIcon = isEligible ? "./icon/ui/confirm.png" : "./icon/ui/cancel.png";
  const memberFaction = dataSetFarm?.frmData?.faction || dataSetFarm?.faction || {};
  const activeStreakForCurrent = Number(memberFaction?.activeStreak ?? streak);
  const displayedStreakForCurrent = Number(memberFaction?.streak ?? streak);
  const streakToMul = (v) => (v >= 8 ? 1.5 : v >= 6 ? 1.3 : v >= 4 ? 1.2 : v >= 2 ? 1.1 : 1);
  const shownStreak = isCurrentFaction ? displayedStreakForCurrent : streak;
  const activeStreak = isCurrentFaction ? activeStreakForCurrent : streak;
  const activeBonusPct = Math.round((streakToMul(activeStreak) - 1) * 100);
  const nextBonusPct = Math.round((streakToMul(shownStreak) - 1) * 100);
  const isPendingNextWeek = isCurrentFaction && shownStreak > activeStreak;

  // const nextWeekGoal = petGoal * 1.25;
  // const badge = FACTION_BADGE[factionKey] || "./icon/ui/factions.webp";
  // const petImage = FACTION_PET[factionKey] || "./icon/pet/owl.webp";
  // const mood = PET_MOOD[factionKey] || "hungry";

  const petRows = petRequests.map((req, idx) => {
    const name = req.food;
    const quantity = Number(req.quantity || 0);
    let item = null;
    if (/doll/i.test(name)) {
      item = dataSetFarm?.itables?.craft?.[name] || findItemInAllTables(name, dataSetFarm);
    } else {
      item = dataSetFarm?.itables?.food?.[name] || findItemInAllTables(name, dataSetFarm);
    }
    // const xp = Number(item?.xp || 0) * quantity;
    const prodCost = getProdCost(item, quantity, dataSet?.options?.coinsRatio || 1);
    const p2pCost = getP2PCost(item, quantity);
    const icon = item?.img || imgna;
    return (
      <tr key={`${factionKey}-pet-${idx}`}>
        <td className="factions-item-cell">
          <img src={icon} alt="" className="itico" title={name} />
          <span>{quantity}x {name}</span>
        </td>
        {/* <td className="factions-num">{xp > 0 ? frmtNb(xp) : "0"}</td> */}
        <td className="factions-num factions-col-cost">{prodCost > 0 ? frmtNb(prodCost) : "0.00"}</td>
        <td className="factions-num factions-col-cost">{p2pCost > 0 ? frmtNb(p2pCost) : "0.00"}</td>
      </tr>
    );
  });

  const kitchenRows = kitchenRequests.map((req, idx) => {
    const name = req.item;
    const quantity = Number(req.amount || 0);
    const item = findItemInAllTables(name, dataSetFarm);
    const prodCost = getProdCost(item, quantity, dataSet?.options?.coinsRatio || 1);
    const p2pCost = getP2PCost(item, quantity);
    const icon = item?.img || imgna;
    return (
      <tr key={`${factionKey}-kitchen-${idx}`}>
        <td className="factions-item-cell">
          <img src={icon} alt="" className="itico" title={name} />
          <span>{quantity}x {name}</span>
        </td>
        <td className="factions-num factions-col-cost">{prodCost > 0 ? frmtNb(prodCost) : "0.00"}</td>
        <td className="factions-num factions-col-cost">{p2pCost > 0 ? frmtNb(p2pCost) : "0.00"}</td>
      </tr>
    );
  });

  const progressPct = Math.max(0, Math.min(100, Math.floor(progress)));
  const factionColor = FACTION_TEXT_COLOR[factionKey] || "#ffffff";
  const factionBgDark = toRgba(factionColor, 0.1);
  const factionBgDarker = toRgba(factionColor, 0.075);
  return (
    <article
      className="factions-card"
      style={{
        "--factions-accent-dark": factionBgDark,
        "--factions-accent-darker": factionBgDarker,
      }}
    >
      <header className="factions-head">
        <span className="factions-head-title">
          {/* <img src={badge} alt="" className="factions-badge" /> */}
          <span style={{ color: FACTION_TEXT_COLOR[factionKey] || "#ffffff" }}>
            {FACTION_LABELS[factionKey] || factionKey.toUpperCase()}
          </span>
        </span>
      </header>

      <section className="factions-block">
        <h3>Pet</h3>
        <div className="factions-pet-summary">
          {/* <img src={petImage} alt="" className="factions-pet-icon" /> */}
          <div className="factions-pet-meta">
            <div className="factions-streak">
              Streak {shownStreak} ({activeBonusPct}% active)
              {isPendingNextWeek ? ` - +${nextBonusPct}% next week` : ""}
              {/* <span>{mood}</span> */}
            </div>
            <div className="factions-progress-wrap">{PBar(petCurXP, 0, petGoal || 1, 0, 269)}</div>
            <div className="factions-progress-meta">
              <span className="factions-progress-pct-inline">{progressPct}%</span>
              {showContributingMember ? (
                <span className="factions-contrib">
                  <img src={contributingIcon} alt="" className="itico" />
                  Contributing member
                </span>
              ) : null}
            </div>
            {/* <div className="factions-progress-pct"></div> */}
            {/* <div className="factions-xp">{frmtNb(petCurXP)} / {frmtNb(petGoal)}</div> */}
            {/* <div className="factions-next-week">Next week {frmtNb(nextWeekGoal)} (+25%)</div> */}
          </div>
        </div>
        <table className="factions-table">
          <thead>
            <tr>
              <th>Item</th>
              {/* <th>XP</th> */}
              <th className="factions-col-cost">Cost</th>
              <th className="factions-col-cost">{imgExchng}</th>
            </tr>
          </thead>
          <tbody>{petRows}</tbody>
        </table>
      </section>

      <section className="factions-block">
        <h3>Kitchen</h3>
        <table className="factions-table">
          <thead>
            <tr>
              <th>Item</th>
              <th className="factions-col-cost">Cost</th>
              <th className="factions-col-cost">{imgExchng}</th>
            </tr>
          </thead>
          <tbody>{kitchenRows}</tbody>
        </table>
      </section>
    </article>
  );
}

function findItemInAllTables(itemName, dataSetFarm) {
  const tables = [
    dataSetFarm?.itables?.it,
    dataSetFarm?.itables?.fish,
    dataSetFarm?.itables?.flower,
    dataSetFarm?.itables?.bounty,
    dataSetFarm?.itables?.craft,
    dataSetFarm?.itables?.mutant,
    dataSetFarm?.itables?.petit,
    dataSetFarm?.itables?.food,
    dataSetFarm?.boostables?.nft,
    dataSetFarm?.boostables?.nftw,
  ];
  for (const table of tables) {
    if (table?.[itemName]) return table[itemName];
  }
  return null;
}

function getP2PCost(itemObj, quantity) {
  if (!itemObj) return 0;
  const qty = Number(quantity || 0);
  const costp2pt = Number(itemObj.costp2pt || 0);
  const pricemsfl = Number(itemObj.pricemsfl || 0);
  if (costp2pt > 0) return costp2pt * qty;
  if (pricemsfl > 0) return pricemsfl * qty;
  return 0;
}

function getProdCost(itemObj, quantity, coinsRatio) {
  if (!itemObj) return 0;
  const qty = Number(quantity || 0);
  const ratio = Number(coinsRatio || 1) || 1;
  const cost = Number(itemObj.cost || 0);
  return (cost * qty) / ratio;
}

function normalizeFactionName(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/_/g, "");
}

function toRgba(hex, alpha) {
  const h = String(hex || "").replace("#", "");
  if (h.length !== 6) return `rgba(255, 255, 255, ${alpha})`;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
