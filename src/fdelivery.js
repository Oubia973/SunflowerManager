import React, { useEffect, useState } from 'react';
import { useAppCtx } from "./context/AppCtx";
import { frmtNb, PBar, timeToDays } from './fct.js';
import { Switch, FormControlLabel } from '@mui/material';
import Tooltip from "./tooltip.js";
const imgno = './icon/ui/cancel.png';
const imgyes = './icon/ui/confirm.png';
const imgrdy = './icon/ui/expression_alerted.png';
const imgheart = './icon/ui/expression_love.png';
const imgsfl = './icon/res/flowertoken.webp';
const imgcoins = './icon/res/coins.png';
const imggems = './icon/res/gem.webp';
const imgexchng = './icon/ui/exchange.png';
const imgna = './icon/nft/na.png';
//const imgtkt = './icon/res/' + imgtktname;

function ModalDlvr({ onClose, tableData, imgtkt, coinsRatio }) {
  const closeModal = () => {
    onClose();
  };
  const {
    data: { dataSet, dataSetFarm },
    ui: {
      TryChecked,
    },
    actions: {
      handleUIChange,
      handleTooltip
    },
    img: {
      imgrdy,
      imgexchng,
      imgExchng,
      imgna,
    }
  } = useAppCtx();
  const { it, food, fish, pfood, bounty, crustacean, craft, petit, flower, tool, mutant, compost } = dataSetFarm.itables;
  const [Delivery, setDelivery] = useState(tableData);
  const [selectedCost, setSelectedCost] = useState('trader');
  const [tableDeliveries, settableDeliveries] = useState([]);
  const [tableChores, settableChores] = useState([]);
  const [tableBounties, settableBounties] = useState([]);
  const [tooltipData, setTooltipData] = useState(null);
  const ximgno = <img src={imgno} alt="" />;
  const ximgyes = <img src={imgyes} alt="" />;
  const ximgrdy = <img src={imgrdy} alt="" />;
  const ximgheart = <img src={imgheart} alt="" style={{ width: '12px', height: '12px' }} />;
  const imgtktname = imgtkt.split('/').pop();
  const imgbtkt = <img src={imgtkt} alt="" title="TKT" style={{ width: '15px', height: '15px' }} />;
  const imgbsfl = <img src={imgsfl} alt="" title="SFL" style={{ width: '15px', height: '15px' }} />;
  const imgbcoins = <img src={imgcoins} alt="" title="Coins" style={{ width: '15px', height: '15px' }} />;
  const imgbgems = <img src={imggems} alt="" title="Coins" style={{ width: '15px', height: '15px' }} />;
  function key(name) {
    if (name === "active") { return TryChecked ? "tryit" : "isactive"; }
    return TryChecked ? name + "try" : name;
  }
  const decodeHtmlEntities = (txt) => String(txt || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
  const normalizeItemName = (txt) => decodeHtmlEntities(txt).replace(/\s+/g, " ").trim();
  const getItemBase = (name) => (
    it?.[name] || food?.[name] || pfood?.[name] || fish?.[name] || bounty?.[name] || crustacean?.[name] || craft?.[name] || petit?.[name] || flower?.[name] || tool?.[name] || mutant?.[name] || compost?.[name] || null
  );
  const parseOrderItems = (rawItems) => {
    const parsed = {};
    const add = (rawName, rawQty) => {
      const name = normalizeItemName(rawName);
      if (!name) { return; }
      const qtyNum = Number(String(rawQty || 1).replace(",", "."));
      const qty = Number.isFinite(qtyNum) && qtyNum > 0 ? qtyNum : 1;
      parsed[name] = (parsed[name] || 0) + qty;
    };
    if (Array.isArray(rawItems)) {
      rawItems.forEach((entry) => {
        if (!entry) { return; }
        if (typeof entry === "string") { add(entry, 1); return; }
        add(entry.name, entry.qty ?? entry.quantity ?? 1);
      });
      return parsed;
    }
    if (rawItems && typeof rawItems === "object" && !Array.isArray(rawItems)) {
      Object.entries(rawItems).forEach(([name, qty]) => add(name, qty));
      return parsed;
    }
    return parsed;
  };
  const getOrderItemMarketUnit = (itemBase) => {
    const prodUnit = Number(itemBase?.[key("cost")] ?? itemBase?.cost ?? 0) / coinsRatio;
    const marketTrader = Number(itemBase?.[key("costp2pt")] ?? itemBase?.costp2pt ?? 0);
    const marketNifty = Number(itemBase?.[key("costp2pn")] ?? itemBase?.costp2pn ?? 0);
    const marketOpenSea = Number(itemBase?.[key("costp2po")] ?? itemBase?.costp2po ?? 0);
    const marketShop = Number(itemBase?.costshop || 0) / coinsRatio;
    let marketUnit = 0;
    if (selectedCost === "shop") { marketUnit = marketShop; }
    if (selectedCost === "trader") { marketUnit = marketTrader; }
    if (selectedCost === "nifty") { marketUnit = marketNifty; }
    if (selectedCost === "opensea") { marketUnit = marketOpenSea; }
    return marketUnit > 0 ? marketUnit : prodUnit;
  };
  const computeOrderItemsCosts = (itemsMap) => {
    let totalCost = 0;
    let totalMarket = 0;
    Object.entries(itemsMap || {}).forEach(([itemName, qty]) => {
      const low = String(itemName).toLowerCase();
      const qtyNum = Number(qty || 0);
      if (low === "coins") {
        const coinValue = (1 / coinsRatio) * qtyNum;
        totalCost += coinValue;
        totalMarket += coinValue;
        return;
      }
      const itemBase = getItemBase(itemName);
      if (!itemBase) { return; }
      const unitCost = Number(itemBase?.[key("cost")] ?? itemBase?.cost ?? 0) / coinsRatio;
      const unitMarket = getOrderItemMarketUnit(itemBase);
      totalCost += unitCost * qtyNum;
      totalMarket += unitMarket * qtyNum;
    });
    return { totalCost, totalMarket };
  };
  const renderOrderItems = (itemsMap) => {
    const entries = Object.entries(itemsMap || {});
    if (entries.length === 0) { return ""; }
    return (
      <span style={{ display: "inline-flex", gap: 0, flexWrap: "wrap", justifyContent: "center" }}>
        {entries.map(([itemName, qty]) => {
          const low = String(itemName).toLowerCase();
          const itemBase = getItemBase(itemName);
          const itemImg = low === "coins" ? imgcoins : (itemBase?.img || imgna);
          const itemLabel = low === "coins" ? "Coins" : itemName;
            return (
            <span key={itemName} style={{ display: "inline-flex", alignItems: "center", gap: 1, whiteSpace: "nowrap" }}>
                <span style={{ fontSize: "12px", lineHeight: 1 }}>{frmtNb(qty)}</span>
                <img src={itemImg} alt="" title={itemLabel} style={{ width: "15px", height: "15px" }} />
              </span>
            );
        })}
      </span>
    );
  };
  const getOrderRewardData = (orderItem) => {
    const rewardImg = orderItem?.[key("rewardimg")] || orderItem?.rewardimg || imgna;
    const rewardQtyRaw = orderItem?.[key("rewardqty")] ?? orderItem?.rewardqty ?? 0;
    const rewardQtyNum = Number(rewardQtyRaw);
    const istkt = rewardImg === imgtkt || String(rewardImg).includes(imgtktname) || String(rewardImg).includes("ticket");
    const issfl = rewardImg === imgsfl || String(rewardImg).includes("flowertoken.webp");
    const iscoins = rewardImg === imgcoins || String(rewardImg).includes("coins.png");
    const isgems = rewardImg === imggems || String(rewardImg).includes("gem");
    return { rewardImg, quantreward: Number.isFinite(rewardQtyNum) ? rewardQtyNum : 0, istkt, issfl, iscoins, isgems };
  };
  const handleChangeCost = (event) => {
    const selectedValue = event.target.value;
    setSelectedCost(selectedValue);
  }
  /* const handleTooltip = async (item, context, value, event) => {
    try {
      const { clientX, clientY } = event;
      setTooltipData({
        x: clientX,
        y: clientY,
        item,
        context,
        value
      });
      //console.log(responseData);
    } catch (error) {
      console.log(error)
    }
  } */
  function setDeliveries() {
    const inventoryEntries = Object.entries(tableData.orders);
    let totCost = 0;
    let totCostp2p = 0;
    let totCostR = 0;
    let totCostp2pR = 0;
    let totCmp = 0;
    let totSkp = 0;
    let totSFL = 0;
    let totTKT = 0;
    let totCoins = 0;
    let totCoinsR = 0;
    const inventoryItems = inventoryEntries.map(([item], index) => {
      //Object.values(tableData.orders).map((order, index) => (
      //const OrderItem = item[1];
      const OrderItem = tableData.orders[item];
      var xfrom = "";
      const ofrom = item;
      //const xtentacle = ofrom === "shelly" ? " (" + tableData.wklcth + "/8)" : "";
      xfrom = "./icon/pnj/" + ofrom + ".png";
      if (ofrom === "pumpkin' pete") { xfrom = "./icon/pnj/pumpkinpete.png" }
      const { quantreward, istkt, issfl, iscoins } = getOrderRewardData(OrderItem);
      const rewardQty = Number(quantreward || 0);
      const imgComplete = OrderItem.completed ? ximgyes : (OrderItem.instock || 0) > 0 ? ximgheart : ximgno;
      //const coinrewardconvertsfl = iscoins && quantreward + imgbcoins + '(' + quantreward / 320 + imgbsfl + ')';
      //const textReward = iscoins ? coinrewardconvertsfl : issfl ? quantreward + imgbsfl : quantreward + imgbtkt;
      const txtcoinsconv = '(' + frmtNb(rewardQty / coinsRatio);
      const txtendcoinsconv = ')';
      const textReward = iscoins ?
        (<>{rewardQty}{imgbcoins}{txtcoinsconv}{imgbsfl}{txtendcoinsconv}</>) :
        issfl ?
          (<>{rewardQty}{imgbsfl}</>) :
          (<>{rewardQty}{imgbtkt}</>);
      const rawOrderItems = OrderItem[key("itemsList")] ?? OrderItem.itemsList ?? OrderItem[key("itemsMap")] ?? OrderItem.itemsMap;
      const orderItemsMap = parseOrderItems(rawOrderItems);
      const computedCosts = computeOrderItemsCosts(orderItemsMap);
      const costProd = computedCosts.totalCost;
      const costp2pNum = computedCosts.totalMarket;
      const costp2p = frmtNb(costp2pNum);
      const addRatio = iscoins && costProd > 0;
      const ratioCoins = addRatio ? frmtNb(rewardQty / costProd) : "";
      const convRewardSfl = iscoins ? rewardQty / coinsRatio : issfl ? rewardQty : 0;
      const addRatioDone = addRatio && OrderItem.completed;
      totCostR += addRatioDone ? costProd : 0;
      totCostp2pR += addRatioDone ? costp2pNum : 0;
      totCoinsR += addRatioDone ? rewardQty : 0;
      if (OrderItem.completed) {
        totCost += costProd;
        totCostp2p += costp2pNum;
        if (istkt) { totTKT += rewardQty }
        if (issfl) { totSFL += rewardQty }
        if (iscoins) { totCoins += rewardQty }
      }
      if (OrderItem.nbcompleted > 0) { totCmp += OrderItem.nbcompleted }
      if (OrderItem.nbskipped > 0) { totSkp += OrderItem.nbskipped }
      const costTkt = (istkt && rewardQty > 0) ? frmtNb(costProd / rewardQty) : "";
      const bakcGreen = 'rgba(10, 54, 18, 0.71)';
      const bakcRed = 'rgba(54, 10, 10, 0.71)';
      const bakcYellow = 'rgba(66, 70, 12, 0.71)';
      const cellRewardStyle = {};
      if (((costp2p < convRewardSfl) && (costProd < convRewardSfl)) && (!istkt)) {
        cellRewardStyle.backgroundColor = bakcGreen;
      }
      if (((costp2p > convRewardSfl) || (costProd > convRewardSfl)) && (!istkt)) {
        cellRewardStyle.backgroundColor = bakcRed;
      }
      const cellCostStyle = {};
      if (((costProd > convRewardSfl) && (costProd < convRewardSfl)) && (!istkt)) {
        cellCostStyle.backgroundColor = bakcGreen;
      }
      const cellMarketStyle = {};
      if (((costp2p > convRewardSfl) && (costp2p > costProd)) && (!istkt)) {
        cellMarketStyle.backgroundColor = bakcGreen;
      }
      if ((frmtNb(costp2p) === frmtNb(convRewardSfl)) && (!istkt)) {
        cellMarketStyle.backgroundColor = bakcYellow;
      }
      return (
        <tr key={index}>
          <td id="iccolumn" className="tdcenter"><img src={xfrom} alt="" title={ofrom} style={{ width: '25px', height: '25px' }} /></td>
          <td className="tdcenter tooltipcell" onClick={(e) => handleTooltip(ofrom, "deliverycost", { items: orderItemsMap, market: selectedCost }, e)}>{renderOrderItems(orderItemsMap)}</td>
          <td className="tdcenter">{imgComplete}</td>
          {/* <td className="tdcenter" dangerouslySetInnerHTML={{ __html: OrderItem.reward }}>{coinrewardconvertsfl}</td> */}
          <td className="tdcenter" style={cellRewardStyle}>{textReward}</td>
          <td className="tdcenter tooltipcell" style={cellCostStyle} onClick={(e) => handleTooltip(ofrom, "deliverycost", { items: orderItemsMap, market: selectedCost }, e)}>{frmtNb(costProd)}</td>
          <td className="tdcenter tooltipcell" style={cellMarketStyle} onClick={(e) => handleTooltip(ofrom, "deliverycost", { items: orderItemsMap, market: selectedCost }, e)}>{costp2p}</td>
          <td
            className={`tdcenter${iscoins ? " tooltipcell" : ""}`}
            onClick={iscoins ? (e) => handleTooltip(ofrom, "deliveryratio", {
              type: "row",
              from: ofrom,
              isCoinsReward: true,
              rewardCoins: rewardQty,
              rewardSfl: convRewardSfl,
              cost: costProd,
              market: costp2pNum,
              ratio: addRatio ? (rewardQty / costProd) : 0
            }, e) : undefined}
          >
            {ratioCoins}
          </td>
          <td className="tdcenter">{costTkt}</td>
          <td className="date">{OrderItem.readyAt}</td>
          <td className="tdcenter">{OrderItem.nbcompleted}</td>
          <td className="tdcenter">{OrderItem.nbskipped}</td>
        </tr>
      )
      //))
    });
    const ratioCoins = (totCostR > 0 && totCoinsR > 0) ? frmtNb(totCoinsR / totCostR) : "";
    const tableContent = (
      <>
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>Items</th>
              <th> </th>
              <th className="thcenter">Reward</th>
              <th>Cost</th>
              <th>
                {/* <div className="selectquantback" style={{ top: `1px` }}><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                  <InputLabel>Cost</InputLabel>
                  <Select value={selectedCost} onChange={handleChangeCost}>
                    <MenuItem value="shop">Shop</MenuItem>
                    <MenuItem value="trader">Market</MenuItem>
                    <MenuItem value="nifty">Niftyswap</MenuItem>
                    <MenuItem value="opensea">OpenSea</MenuItem>
                  </Select></FormControl></div> */}
                <img src={imgexchng} alt={''} title="Marketplace" style={{ width: '25px', height: '25px' }} />
              </th>
              <th className="thcenter">Ratio <div>{imgbcoins}/{imgbsfl}</div></th>
              <th>Cost/tkt</th>
              <th>Since</th>
              <th>Completed</th>
              <th>Skipped</th>
            </tr>
            <tr>
              <td>TOTAL</td>
              <td></td>
              <td></td>
              <td className="tdcenter">{frmtNb(totSFL)}{imgbsfl} {totTKT}{imgbtkt} {frmtNb(totCoins)}{imgbcoins}</td>
              <td className="tdcenter">{frmtNb(totCost)}</td>
              <td className="tdcenter">{frmtNb(totCostp2p)}</td>
              <td
                className="tdcenter tooltipcell"
                onClick={(e) => handleTooltip("total", "deliveryratio", {
                  type: "total",
                  from: "TOTAL",
                  isCoinsReward: true,
                  rewardCoins: totCoinsR,
                  rewardSfl: (totCoinsR / coinsRatio),
                  cost: totCostR,
                  market: totCostp2pR,
                  ratio: (totCostR > 0 ? (totCoinsR / totCostR) : 0)
                }, e)}
              >
                {frmtNb(ratioCoins)}
              </td>
              <td></td>
              <td></td>
              <td className="tdcenter">{totCmp}</td>
              <td className="tdcenter">{totSkp}</td>
            </tr>
          </thead>
          <tbody>
            {inventoryItems}
          </tbody>
        </table>
      </>
    )
    settableDeliveries(tableContent);
    const chores = tableData.chores;
    const choreEntries = Object.entries(chores);
    let actTotReward = 0;
    let totReward = 0;
    let totCostChores = 0;
    let totMarketChores = 0;
    let txtTotReward = "";
    const choreItems = choreEntries.map((item, index) => {
      let totCostChore = 0;
      let totMarketChore = 0;
      let notInStock = false;
      //const costp2p = selectedCost === "shop" ? frmtNb(item[1].costs) : selectedCost === "trader" ? frmtNb(item[1].costt) : selectedCost === "nifty" ? frmtNb(item[1].costn) : selectedCost === "opensea" ? frmtNb(item[1].costo) : 0;
      const imgRew = <img src={item[1].rewardimg} alt="" title={item[1].rewarditem} style={{ width: '15px', height: '15px' }} />;
      const itemImg = <img src={item[1].itemimg} alt="" title={item[1].item} style={{ width: '20px', height: '20px' }} />;
      const totTime = TryChecked ? item[1].totaltimetry : item[1].totaltime;
      totReward += item[1].reward;
      actTotReward += item[1].completed && item[1].reward;
      const getItemImg = (name, qty) => {
        if (!name) return null;
        if (it[name]) {
          totCostChore += (it[name][key("cost")] / coinsRatio) * qty;
          totMarketChore += (it[name]?.costp2pt || 0) * qty;
          if(it[name]?.instock < tableData.totcomp[name]) {notInStock = true}
          return it?.[name]?.img ?? imgna
        }
        if (food[name]) {
          totCostChore += (food[name][key("cost")] / coinsRatio) * qty;
          totMarketChore += (food[name]?.costp2pt || 0) * qty;
          return food?.[name]?.img ?? imgna
        }
        if (fish[name]) {
          totCostChore += (fish[name][key("cost")] / coinsRatio) * qty;
          totMarketChore += (fish[name]?.costp2pt || 0) * qty;
          if(fish[name]?.instock < tableData.totcomp[name]) {notInStock = true}
          return fish?.[name]?.img ?? imgna
        }
        return imgna;
      };
      const choreTotCompSpan = (
        <span style={{ display: "inline-flex", gap: 6, flexWrap: "wrap" }}>
          {Object.entries(item[1].choreTotComp ?? {}).map(([name, qty]) => {
            const img = getItemImg(name, qty);
            return (<span key={name}
              style={{ display: "inline-flex", gap: 4, alignItems: "center", flexWrap: "nowrap", whiteSpace: "nowrap", }}>
              {img && (<img src={img} alt="" title={name} style={{ width: "15px", height: "15px" }} />)}
              {/* <span style={{ fontSize: "10px" }}>x{qty}</span> */}
            </span>);
          })}
        </span>
      );
      totCostChores += totCostChore;
      totMarketChores += totMarketChore;
      const backRed = 'rgba(63, 10, 10, 0.71)';
      const cellCompStyle = {};
      if (notInStock) {
        cellCompStyle.backgroundColor = backRed;
      }
      return (
        <tr key={index}>
          <td className="tdleft">{item[1].description}</td>
          <td className="tdcenter">{itemImg}</td>
          <td className="tdcenter">{PBar(item[1].progress, item[1].progressstart, item[1].requirement, item[1]?.harvestleft, 80)}</td>
          <td className="tdcenter">{item[1].completed ? item[1].completedAt === undefined ? ximgrdy : ximgyes : ximgno}</td>
          <td className="tdcenter">{item[1].reward}{imgRew}</td>
          <td className="tdcenter">{timeToDays(totTime)}</td>
          <td className="tdcenter tooltipcell" style={cellCompStyle} onClick={(e) => handleTooltip(item[1].item, "cookcost", item[1].requirement, e)}>{choreTotCompSpan}</td>
          <td className="tdcenter tooltipcell" onClick={(e) => handleTooltip(item[1].item, "cookcost", item[1].requirement, e)}>{totCostChore > 0 ? frmtNb(totCostChore) : ""}</td>
          <td className="tdcenter tooltipcell" onClick={(e) => handleTooltip(item[1].item, "cookcost", item[1].requirement, e)}>{totMarketChore > 0 ? frmtNb(totMarketChore) : ""}</td>
          <td className="date">{item[1].createdAt}</td>
        </tr>
      )
    });
    txtTotReward = <span>{actTotReward}/{totReward}</span>;
    const totCompImg = <img src={"./icon/ui/cropbucket.png"} alt="" title={"Total comp"} style={{ width: "25px", height: "25px" }} />;
    const choreContent = (
      <>
        <table>
          <thead>
            <tr>
              <th>Activity</th>
              <th> </th>
              <th> </th>
              <th> </th>
              <th>Reward</th>
              <th>Total time</th>
              <th>Components</th>
              <th>Cost</th>
              <th>{imgExchng}</th>
              <th>Since</th>
            </tr>
            <tr>
              <th>TOTAL</th>
              <th> </th>
              <th> </th>
              <th> </th>
              <td className="tdcenter">{txtTotReward}</td>
              <th></th>
              <td className="tdcenter tooltipcell" onClick={(e) => handleTooltip(tableData.totcomp, "totChoreComp", "Weekly Chores", e)}>{totCompImg}</td>
              <td className="tdcenter">{frmtNb(totCostChores)}</td>
              <td className="tdcenter">{frmtNb(totMarketChores)}</td>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {choreItems}
          </tbody>
        </table>
      </>
    )
    settableChores(choreContent);
    const bounties = tableData.bounties;
    const bountyEntries = Object.entries(bounties);
    let bntyTktTot = 0;
    let bntyTktTotDone = 0;
    const getBountyCategory = (bountyName, bountyItem) => {
      const itemName = bountyItem?.item || bountyName || "";
      const itemMeta = it[itemName] || {};
      const animal = String(itemMeta?.animal || "").toLowerCase();
      const lowName = String(itemName).toLowerCase();
      if (animal === "chicken" || lowName === "chicken" || lowName === "chickens") { return "Chickens"; }
      if (animal === "cow" || animal === "sheep" || lowName === "cow" || lowName === "cows" || lowName === "sheep") { return "Barn"; }
      return "Poppy";
    };
    const groupedBounties = bountyEntries.reduce((acc, entry) => {
      const category = getBountyCategory(entry[0], entry[1]);
      if (!acc[category]) { acc[category] = []; }
      acc[category].push(entry);
      return acc;
    }, {});
    const orderedCategories = ["Chickens", "Barn", "Poppy"].filter((catName) => groupedBounties[catName]?.length > 0);
    const renderBountyCard = (bountyName, bountyItem, bountyKey) => {
      const imgRew = <img src={bountyItem.rewardimg} alt="" title={bountyItem.rewarditem} style={{ width: '15px', height: '15px' }} />;
      const imgitem = bountyItem.itemimg !== imgna && <img src={bountyItem.itemimg} alt="" title={bountyItem.item} style={{ width: '20px', height: '20px' }} />;
      const bColor = bountyItem.completed ? 'rgb(0, 129, 39)' : (bountyItem.instock || 0) > 0 ? 'rgb(148, 118, 35)' : 'rgba(148, 52, 35, 1)';
      bntyTktTot += (bountyItem.rewardimg === imgtkt) ? Number(bountyItem[key("reward")] || 0) : 0;
      bntyTktTotDone += bountyItem.completed && (bountyItem.rewardimg === imgtkt) ? Number(bountyItem[key("reward")] || 0) : 0;
      const rewardStyle = {
        backgroundColor: bColor,
        color: 'white',
        padding: '5px',
        borderRadius: '5px',
        textAlign: 'center',
        fontSize: '12px',
        marginTop: '5px',
        height: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      };
      const lvlStyle = {
        height: '14px',
        backgroundColor: 'rgb(112, 112, 112)',
        padding: '2px 3px',
        borderRadius: '5px',
        fontSize: '14px',
        textAlign: 'center',
        marginBottom: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      };
      return (
        <div
          key={bountyKey}
          style={{
            display: 'inline-block',
            width: '55px',
            margin: '4px',
            textAlign: 'center',
            border: '1px solid #ccc',
            borderRadius: '10px',
            padding: '5px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          }}
          title={bountyName}
        >
          <div style={lvlStyle}>{bountyItem.lvl}</div>
          {imgitem}
          <div style={rewardStyle}>{bountyItem[key("reward")]}{imgRew}</div>
        </div>
      );
    };
    const bountyItemsByCategory = orderedCategories.map((categoryName) => {
      const categoryItems = groupedBounties[categoryName];
      let categoryDone = 0;
      const isPoppyCategory = categoryName === "Poppy";
      const rewardTotals = {};
      categoryItems.forEach(([bountyName, bountyItem]) => {
        const rewardKey = `${bountyItem.rewarditem || "Reward"}|${bountyItem.rewardimg || ""}`;
        if (!rewardTotals[rewardKey]) {
          rewardTotals[rewardKey] = {
            total: 0,
            done: 0,
            rewardimg: bountyItem.rewardimg,
            rewarditem: bountyItem.rewarditem || "Reward",
          };
        }
        const rewardValue = Number(bountyItem[key("reward")] || 0);
        rewardTotals[rewardKey].total += rewardValue;
        if (bountyItem.completed) {
          categoryDone += 1;
          rewardTotals[rewardKey].done += rewardValue;
        }
      });
      const categoryRewardTotals = Object.entries(rewardTotals).map(([rewardKey, rewardData]) => (
        <span key={rewardKey} style={{ marginRight: '10px' }}>
          {frmtNb(rewardData.done)}/{frmtNb(rewardData.total)}
          <img src={rewardData.rewardimg} alt="" title={rewardData.rewarditem} style={{ width: '14px', height: '14px', marginLeft: '3px' }} />
        </span>
      ));
      const showPoppyBonusHint = isPoppyCategory && categoryItems.length > 0 && categoryDone < categoryItems.length;
      return (
        <div key={categoryName} style={{ marginBottom: '8px' }}>
          <div style={{ marginBottom: '4px' }}>
            <b>{categoryName}</b> ({categoryDone}/{categoryItems.length}) - {categoryRewardTotals}{showPoppyBonusHint ? <span> (+50 when all done)</span> : null}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
            {categoryItems.map(([bountyName, bountyItem], index) => renderBountyCard(bountyName, bountyItem, `${categoryName}-${bountyName}-${index}`))}
          </div>
        </div>
      );
    });
    const bountyContent = (
      <>
        {/* <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Lvl</th>
              <th>Reward</th>
              <th>Sold</th>
            </tr>
          </thead>
          <tbody>
            {bountyItems}
          </tbody>
        </table> */}
        <span><b>TOTAL</b> : {bntyTktTotDone}/{bntyTktTot}{imgbtkt}</span>
        <div style={{ marginTop: '8px' }}>
          {bountyItemsByCategory}
        </div>
      </>
    )
    settableBounties(bountyContent);
  }
  useEffect(() => {
    setDeliveries();
  }, []);
  useEffect(() => {
    setDeliveries();
  }, [Delivery, selectedCost, tableData, TryChecked]);
  return (
    <div className="modal">
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '40px',
        padding: '5px',
        backgroundColor: '#222',
        display: 'flex',
        justifyContent: 'left',
        alignItems: 'center',
        zIndex: 1000,
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        gap: '10px'
      }}>
        <h2 style={{ margin: 0 }}>Deliveries Chores Bounties</h2>
        <div>
          <button onClick={closeModal} class="button"><img src="./icon/ui/cancel.png" alt="" className="resico" /></button>
        </div>
        <FormControlLabel
          control={
            <Switch
              name="TryChecked"
              checked={TryChecked}
              onChange={handleUIChange}
              color="primary"
              size="small"
              sx={{
                '& .MuiSwitch-track': {
                  backgroundColor: 'gray',
                },
                transform: 'translate(10%, 0%)',
              }}
            />
          }
          label={TryChecked ? 'Tryset' : 'Activeset'}
          sx={{
            '& .MuiFormControlLabel-label': {
              fontSize: '10px',
            },
          }}
        />
      </div>
      <div className="modal-content"
        style={{
          marginTop: '50px',
        }}>
        {tableDeliveries}
        <h2>Chores</h2>
        {tableChores}
        <h2>Bounties</h2>
        {tableBounties}
      </div>
      {tooltipData && (
        <Tooltip
          onClose={() => setTooltipData(null)}
          clickPosition={tooltipData}
          item={tooltipData.item}
          context={tooltipData.context}
          value={tooltipData.value}
          dataSet={dataSet}
        />
      )}
    </div>
  );
}

export default ModalDlvr;
