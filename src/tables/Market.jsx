import React, { useEffect, useState } from "react";
import { useAppCtx } from "../context/AppCtx";
import { frmtNb } from '../fct.js';
const imgsfl = <img src="./icon/res/flowertoken.webp" alt="" className="itico" title="Flower" />;
const imgna = <img src="./icon/nft/na.png" alt="" className="itico" title="" />;
async function getMarket(dataSetFarm, API_URL) {
  const farmId = dataSetFarm?.frmid;
  const userName = dataSetFarm?.username;
  if (!farmId) return null;
  const res = await fetch(API_URL + "/getmarket", {
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
export default function MarketTable() {
  const {
    data: { dataSet, dataSetFarm },
    ui: { selectedInv, Refresh, xListeColBounty },
    config: { API_URL },
  } = useAppCtx();
  const [market, setMarket] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (selectedInv !== "market") return;
      setLoading(true);
      try {
        const data = await getMarket(dataSetFarm, API_URL);
        if (!cancelled) setMarket(data);
      } catch (e) {
        console.log(e);
        if (!cancelled) setMarket(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [selectedInv, Refresh, dataSetFarm, API_URL]);
  if (selectedInv !== "market") return null;
  if (loading) return <div>Loading market…</div>;
  const friends = market?.friends;
  if (!friends) return null;
  const {
    offers,
    trades,
    totalTrades,
    weeklyFlowerEarned,
    weeklyFlowerSpent,
  } = market;
  return (
    <>
      <div>Total Trades: {totalTrades}</div>
      <div>
        Weekly Flower Earned: {frmtNb(weeklyFlowerEarned)} - Weekly Flower Spent:{" "}
        {frmtNb(weeklyFlowerSpent)}
      </div>
      <OffersTable
        elements={offers}
        dataSet={dataSet}
        dataSetFarm={dataSetFarm}
        xListeColBounty={xListeColBounty}
      />
      <TradesTable
        elements={trades}
        dataSet={dataSet}
        dataSetFarm={dataSetFarm}
        xListeColBounty={xListeColBounty}
      />
    </>
  );
}

function OffersTable({ elements, dataSet, dataSetFarm, xListeColBounty }) {
  if (!elements || Object.keys(elements).length === 0) return null;
  const { it, fish, flower, bounty, craft, mutant, petit } = dataSetFarm.itables;
  const { nft, nftw } = dataSetFarm.boostables;
  const keys = Object.keys(elements);
  const rows = keys.map((k) => {
    const cobj = elements[k];
    const itemName = Object.keys(cobj.items)[0];
    const itemQuant = Object.values(cobj.items)[0];
    let itemObj = { img: "./icon/nft/na.png", cost: 0, costp2pt: 0, pricemsfl: 0 };
    if (it?.[itemName]) itemObj = it[itemName];
    if (fish?.[itemName]) itemObj = fish[itemName];
    if (flower?.[itemName]) itemObj = flower[itemName];
    if (bounty?.[itemName]) itemObj = bounty[itemName];
    if (craft?.[itemName]) itemObj = craft[itemName];
    if (mutant?.[itemName]) itemObj = mutant[itemName];
    if (petit?.[itemName]) itemObj = petit[itemName];
    if (nft?.[itemName]) itemObj = nft[itemName];
    if (nftw?.[itemName]) itemObj = nftw[itemName];
    const ico = <img src={itemObj?.img || imgna.props.src} alt="" className="nodico" title={itemName} />;
    const icost = (((itemObj.cost || 0) * itemQuant) / (dataSet?.options?.coinsRatio || 1)) || 0;
    const icostp2pt = itemObj.costp2pt || 0;
    const ipricemsfl = itemObj.pricemsfl || 0;
    const icostm =
      icostp2pt > 0
        ? frmtNb(icostp2pt * itemQuant)
        : ipricemsfl > 0
        ? parseFloat(ipricemsfl * itemQuant).toFixed(0)
        : "";
    const isfl = cobj.sfl || 0;
    const ts = Number(cobj.createdAt);
    const createdDate = Number.isFinite(ts) ? new Date(ts < 1e12 ? ts * 1000 : ts) : null;
    const icreatedAt = createdDate ? createdDate.toLocaleString() : "";
    return (
      <tr key={k}>
        <td id="iccolumn">{ico}</td>
        {xListeColBounty?.[0]?.[1] === 1 ? <td className="tditem">{itemName}</td> : null}
        {xListeColBounty?.[1]?.[1] === 1 ? <td className="tdcenter">{itemQuant}</td> : null}
        {xListeColBounty?.[1]?.[1] === 1 ? <td className="tdcenter">{isfl}</td> : null}
        {xListeColBounty?.[5]?.[1] === 1 ? <td className="tdcenter">{icostm}</td> : null}
        {xListeColBounty?.[4]?.[1] === 1 ? <td className="tdcenter">{parseFloat(icost).toFixed(3)}</td> : null}
        {xListeColBounty?.[5]?.[1] === 1 ? <td className="tdcenter">{icreatedAt}</td> : null}
      </tr>
    );
  });

  return (
    <>
      <h2 style={{ margin: 0 }}>Offers</h2>
      <table className="table">
        <thead>
          <tr>
            <th className="th-icon"></th>
            {xListeColBounty?.[0]?.[1] === 1 ? <th className="thcenter">Name</th> : null}
            {xListeColBounty?.[1]?.[1] === 1 ? <th className="tdcenter">Quantity</th> : null}
            {xListeColBounty?.[1]?.[1] === 1 ? <th className="thcenter">Offer</th> : null}
            {xListeColBounty?.[5]?.[1] === 1 ? <th className="thcenter">Market {imgsfl}</th> : null}
            {xListeColBounty?.[4]?.[1] === 1 ? <th className="thcenter">Prod {imgsfl}</th> : null}
            {xListeColBounty?.[5]?.[1] === 1 ? <th className="thcenter">Since</th> : null}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </>
  );
}

function TradesTable({ elements, dataSet, dataSetFarm, xListeColBounty }) {
  if (!elements || Object.keys(elements).length === 0) return null;
  const { it, fish, flower, bounty, craft, mutant, petit } = dataSetFarm.itables;
  const { nft, nftw } = dataSetFarm.boostables;
  function keyInTable(table, id) {
    if (!table) return null;
    const keyFound = Object.keys(table).find((key) => Number(table[key].id) === Number(id));
    return keyFound || null;
  }
  const keys = Object.keys(elements);
  let totSell = 0;
  let totBuy = 0;
  const rows = keys.map((k) => {
    const cobj = elements[k];
    const itemId = cobj.itemId;
    let itemName = "ID: " + itemId;
    let itemObj = { img: "./icon/nft/na.png", cost: 0, costp2pt: 0 };
    if (cobj.collection === "collectibles" || cobj.collection === "resources" || cobj.collection === "temporary") {
      const found =
        keyInTable(it, itemId) ||
        keyInTable(fish, itemId) ||
        keyInTable(flower, itemId) ||
        keyInTable(bounty, itemId) ||
        keyInTable(craft, itemId) ||
        keyInTable(mutant, itemId) ||
        keyInTable(nft, itemId) ||
        keyInTable(petit, itemId);
      if (found) itemName = found;
    }
    if (cobj.collection === "wearables") {
      itemName = "Wearable ID: " + itemId;
      const found = keyInTable(nftw, itemId);
      if (found) itemName = found;
    }
    if (cobj.collection === "buds") {
      itemName = "Bud #" + itemId;
      itemObj.img = "./icon/nft/budplaza.png";
    }
    if (it?.[itemName]) itemObj = it[itemName];
    if (fish?.[itemName]) itemObj = fish[itemName];
    if (flower?.[itemName]) itemObj = flower[itemName];
    if (bounty?.[itemName]) itemObj = bounty[itemName];
    if (craft?.[itemName]) itemObj = craft[itemName];
    if (mutant?.[itemName]) itemObj = mutant[itemName];
    if (nft?.[itemName]) itemObj = nft[itemName];
    if (nftw?.[itemName]) itemObj = nftw[itemName];
    if (petit?.[itemName]) itemObj = petit[itemName];
    const ico = <img src={itemObj?.img || "./icon/nft/na.png"} alt="" className="nodico" title={itemName} />;
    const iFrom = cobj.fulfilledBy?.username || "?";
    const iTo = cobj.initiatedBy?.username || "?";
    const txtFrom = cobj.fulfilledBy?.username === dataSetFarm.username ? <b>{iFrom}</b> : iFrom;
    const txtTo = cobj.initiatedBy?.username === dataSetFarm.username ? <b>{iTo}</b> : iTo;
    const iQuant = cobj.quantity || 0;
    const iType = cobj.source || "?";
    const icost = frmtNb(((itemObj.cost || 0) * iQuant) / (dataSet?.options?.coinsRatio || 1));
    const icostm = itemObj.costp2pt || 0;
    const isfl = cobj.sfl || 0;
    const ts = Number(cobj.fulfilledAt);
    const createdDate = Number.isFinite(ts) ? new Date(ts < 1e12 ? ts * 1000 : ts) : null;
    const icreatedAt = createdDate ? createdDate.toLocaleString() : "";
    totSell += cobj.initiatedBy?.username === dataSetFarm.username ? isfl : 0;
    totBuy += cobj.fulfilledBy?.username === dataSetFarm.username ? isfl : 0;
    return (
      <tr key={k}>
        {xListeColBounty?.[0]?.[1] === 1 ? <td className="tdcenter">{txtTo}</td> : null}
        {xListeColBounty?.[0]?.[1] === 1 ? <td className="tdcenter">{txtFrom}</td> : null}
        {xListeColBounty?.[0]?.[1] === 1 ? <td className="tdcenter">{iType}</td> : null}
        <td id="iccolumn">{ico}</td>
        {xListeColBounty?.[0]?.[1] === 1 ? <td className="tditem">{itemName}</td> : null}
        {xListeColBounty?.[0]?.[1] === 1 ? <td className="tdcenter">{iQuant}</td> : null}
        {xListeColBounty?.[1]?.[1] === 1 ? <td className="tdcenter">{isfl}</td> : null}
        {xListeColBounty?.[4]?.[1] === 1 ? <td className="tdcenter">{icostm ? frmtNb(icostm) : ""}</td> : null}
        {xListeColBounty?.[4]?.[1] === 1 ? <td className="tdcenter">{icost}</td> : null}
        {xListeColBounty?.[5]?.[1] === 1 ? <td className="tdcenter">{icreatedAt}</td> : null}
      </tr>
    );
  });
  return (
    <>
      <h2 style={{ margin: 0 }}>Trades</h2>
      <div style={{ marginBottom: 6 }}>
        Total Buy: {frmtNb(totBuy)} {imgsfl} — Total Sell: {frmtNb(totSell)} {imgsfl}
      </div>
      <table className="table">
        <thead>
          <tr>
            {xListeColBounty?.[0]?.[1] === 1 ? <th className="thcenter">To</th> : null}
            {xListeColBounty?.[0]?.[1] === 1 ? <th className="thcenter">From</th> : null}
            {xListeColBounty?.[0]?.[1] === 1 ? <th className="thcenter">Type</th> : null}
            <th className="th-icon"></th>
            {xListeColBounty?.[0]?.[1] === 1 ? <th className="thcenter">Name</th> : null}
            {xListeColBounty?.[0]?.[1] === 1 ? <th className="thcenter">Qty</th> : null}
            {xListeColBounty?.[1]?.[1] === 1 ? <th className="thcenter">SFL</th> : null}
            {xListeColBounty?.[4]?.[1] === 1 ? <th className="thcenter">Market {imgsfl}</th> : null}
            {xListeColBounty?.[4]?.[1] === 1 ? <th className="thcenter">Prod {imgsfl}</th> : null}
            {xListeColBounty?.[5]?.[1] === 1 ? <th className="thcenter">Date</th> : null}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </>
  );
}
