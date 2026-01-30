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
  const { it, food, fish } = dataSetFarm.itables;
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
      let patterntkn = /res\/(.*?)\ alt=/g;
      let correspondancetkn = patterntkn.exec(OrderItem.reward);
      let pattern = /(.*?)<img/g;
      let correspondance = pattern.exec(OrderItem[key("reward")]);
      const istkt = correspondancetkn && correspondancetkn[1] === imgtktname;
      const issfl = correspondancetkn && correspondancetkn[1] === "flowertoken.webp";
      const iscoins = correspondancetkn && correspondancetkn[1] === "coins.png";
      const isgems = correspondancetkn && correspondancetkn[1] === "gems.png";
      const quantreward = correspondance && Number(correspondance[1]);
      const imgComplete = OrderItem.completed ? ximgyes : (OrderItem.instock || 0) > 0 ? ximgheart : ximgno;
      //const coinrewardconvertsfl = iscoins && quantreward + imgbcoins + '(' + quantreward / 320 + imgbsfl + ')';
      //const textReward = iscoins ? coinrewardconvertsfl : issfl ? quantreward + imgbsfl : quantreward + imgbtkt;
      const txtcoinsconv = '(' + frmtNb(quantreward / coinsRatio);
      const txtendcoinsconv = ')';
      const textReward = iscoins ?
        (<>{quantreward}{imgbcoins}{txtcoinsconv}{imgbsfl}{txtendcoinsconv}</>) :
        issfl ?
          (<>{quantreward}{imgbsfl}</>) :
          (<>{quantreward}{imgbtkt}</>);
      const costp2p = selectedCost === "shop" ? frmtNb(OrderItem.costs) : selectedCost === "trader" ? frmtNb(OrderItem.costt) : selectedCost === "nifty" ? frmtNb(OrderItem.costn) : selectedCost === "opensea" ? frmtNb(OrderItem.costo) : 0;
      const addRatio = iscoins && (OrderItem[key("cost")] / coinsRatio) > 0;
      const ratioCoins = addRatio ? frmtNb(quantreward / (OrderItem[key("cost")] / coinsRatio)) : "";
      const convRewardSfl = iscoins ? quantreward / coinsRatio : issfl ? quantreward : 0;
      totCostR += addRatio ? (OrderItem[key("cost")] / coinsRatio) : 0;
      totCostp2pR += addRatio ? Number(costp2p) : 0;
      totCoinsR += addRatio ? quantreward : 0;
      if (OrderItem.completed) {
        totCost += (OrderItem[key("cost")] / coinsRatio);
        totCostp2p += Number(costp2p);
        if (istkt) { totTKT += quantreward }
        if (issfl) { totSFL += quantreward }
        if (iscoins) { totCoins += quantreward }
      }
      if (OrderItem.nbcompleted > 0) { totCmp += OrderItem.nbcompleted }
      if (OrderItem.nbskipped > 0) { totSkp += OrderItem.nbskipped }
      const costTkt = OrderItem[key("costtkt")] > 0 ? frmtNb(OrderItem[key("costtkt")] / coinsRatio) : "";
      const costProd = OrderItem[key("cost")] / coinsRatio;
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
          <td className="tdcenter" dangerouslySetInnerHTML={{ __html: OrderItem.items }}></td>
          <td className="tdcenter">{imgComplete}</td>
          {/* <td className="tdcenter" dangerouslySetInnerHTML={{ __html: OrderItem.reward }}>{coinrewardconvertsfl}</td> */}
          <td className="tdcenter" style={cellRewardStyle}>{textReward}</td>
          <td className="tdcenter" style={cellCostStyle}>{frmtNb(costProd)}</td>
          <td className="tdcenter" style={cellMarketStyle}>{costp2p}</td>
          <td className="tdcenter">{ratioCoins}</td>
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
              <td className="tdcenter">{frmtNb(ratioCoins)}</td>
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
    const bountyItems = bountyEntries.map((item, index) => {
      //const costp2p = selectedCost === "shop" ? frmtNb(item[1].costs) : selectedCost === "trader" ? frmtNb(item[1].costt) : selectedCost === "nifty" ? frmtNb(item[1].costn) : selectedCost === "opensea" ? frmtNb(item[1].costo) : 0;
      const imgRew = <img src={item[1].rewardimg} alt="" title={item[1].rewarditem} style={{ width: '15px', height: '15px' }} />;
      const imgitem = item[1].itemimg !== imgna && <img src={item[1].itemimg} alt="" title={item[1].item} style={{ width: '20px', height: '20px' }} />;
      const bColor = item[1].completed ? 'rgb(0, 129, 39)' : (item[1].instock || 0) > 0 ? 'rgb(148, 118, 35)' : 'rgba(148, 52, 35, 1)';
      /* return (
        <tr key={index}>
          <td className="tdcenter">{imgitem ? imgitem : item[1].item}</td>
          <td className="tdcenter">{item[1].lvl}</td>
          <td className="tdcenter">{item[1][key("reward")]}{imgRew}</td>
          <td className="tdcenter">{item[1].completed ? item[1].completedAt === 0 ? ximgrdy : ximgyes : ximgno}</td>
        </tr>
      ) */
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
          key={index}
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
        >
          <div style={lvlStyle}>{item[1].lvl}</div>
          {imgitem}
          <div style={rewardStyle}>{item[1][key("reward")]}{imgRew}</div>
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
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
          {bountyItems}
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
