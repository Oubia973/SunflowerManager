import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel } from '@mui/material';
import Tooltip from "./tooltip.js";
const imgno = './icon/ui/cancel.png';
const imgyes = './icon/ui/confirm.png';
const imgrdy = './icon/ui/expression_alerted.png';
const imgheart = './icon/ui/expression_love.png';
const imgsfl = './icon/res/flowertoken.webp';
const imgcoins = './icon/res/coins.png';
const imggems = './icon/res/gem.webp';
const imgna = './icon/nft/na.png';
//const imgtkt = './icon/res/' + imgtktname;

function ModalDlvr({ onClose, tableData, imgtkt, coinsRatio, handleTryCheckedChange, TryChecked }) {
  const closeModal = () => {
    onClose();
  };
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
  const handleTooltip = async (item, context, value, event) => {
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
  }
  function setDeliveries() {
    const inventoryEntries = Object.entries(tableData.orders);
    let totCost = 0;
    let totCostp2p = 0;
    let totCmp = 0;
    let totSkp = 0;
    let totSFL = 0;
    let totTKT = 0;
    let totCoins = 0;
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
      if (OrderItem.completed) {
        totCost += (OrderItem[key("cost")] / coinsRatio);
        totCostp2p += Number(costp2p);
        if (istkt) { totTKT += quantreward }
        if (issfl) { totSFL += quantreward }
        if (iscoins) { totCoins += quantreward }
      }
      if (OrderItem.nbcompleted > 0) { totCmp += OrderItem.nbcompleted }
      if (OrderItem.nbskipped > 0) { totSkp += OrderItem.nbskipped }
      return (
        <tr key={index}>
          <td id="iccolumn" className="tdcenter"><img src={xfrom} alt="" title={ofrom} style={{ width: '25px', height: '25px' }} /></td>
          <td className="tdcenter" dangerouslySetInnerHTML={{ __html: OrderItem.items }}></td>
          <td className="tdcenter">{imgComplete}</td>
          {/* <td className="tdcenter" dangerouslySetInnerHTML={{ __html: OrderItem.reward }}>{coinrewardconvertsfl}</td> */}
          <td className="tdcenter">{textReward}</td>
          <td className="tdcenter">{frmtNb(OrderItem[key("cost")] / coinsRatio)}</td>
          <td className="tdcenter">{costp2p}</td>
          <td className="tdcenter">{frmtNb(OrderItem[key("costtkt")] / coinsRatio)}</td>
          <td className="tdcenter">{OrderItem.readyAt}</td>
          <td className="tdcenter">{OrderItem.nbcompleted}</td>
          <td className="tdcenter">{OrderItem.nbskipped}</td>
        </tr>
      )
      //))
    });
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
                <div className="selectquantback" style={{ top: `1px` }}><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                  <InputLabel>Cost</InputLabel>
                  <Select value={selectedCost} onChange={handleChangeCost}>
                    <MenuItem value="shop">Shop</MenuItem>
                    <MenuItem value="trader">Market</MenuItem>
                    <MenuItem value="nifty">Niftyswap</MenuItem>
                    <MenuItem value="opensea">OpenSea</MenuItem>
                  </Select></FormControl></div></th>
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
    const choreItems = choreEntries.map((item, index) => {
      //const costp2p = selectedCost === "shop" ? frmtNb(item[1].costs) : selectedCost === "trader" ? frmtNb(item[1].costt) : selectedCost === "nifty" ? frmtNb(item[1].costn) : selectedCost === "opensea" ? frmtNb(item[1].costo) : 0;
      const imgRew = <img src={item[1].rewardimg} alt="" title={item[1].rewarditem} style={{ width: '15px', height: '15px' }} />;
      const itemImg = <img src={item[1].itemimg} alt="" title={item[1].item} style={{ width: '20px', height: '20px' }} />;
      return (
        <tr key={index}>
          <td className="tdleft">{item[1].description}</td>
          <td className="tdcenter">{itemImg}</td>
          <td className="tdcenter">{PBar(item[1].progress, item[1].progressstart, item[1].requirement)}</td>
          <td className="tdcenter">{item[1].completed ? item[1].completedAt === undefined ? ximgrdy : ximgyes : ximgno}</td>
          <td className="tdcenter">{item[1].reward}{imgRew}</td>
          <td className="tdcenter">{item[1].createdAt}</td>
        </tr>
      )
    });
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
              <th>Since</th>
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
              checked={TryChecked}
              onChange={handleTryCheckedChange}
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
function frmtNb(nombre) {
  const nombreNumerique = parseFloat(nombre);
  var nombreStr = nombreNumerique.toString();
  const positionE = nombreStr.indexOf("e");
  if (positionE !== -1) {
    const nombreNumeriqueCorr = Number(nombreStr).toFixed(20);
    nombreStr = nombreNumeriqueCorr.toString();
  }
  if (isNaN(nombreNumerique)) {
    return "0";
  }
  const positionVirgule = nombreStr.indexOf(".");
  if (positionVirgule !== -1) {
    let chiffreSupZero = null;
    for (let i = positionVirgule + 1; i < nombreStr.length; i++) {
      if (nombreStr[i] !== '0') {
        chiffreSupZero = i;
        break;
      }
    }
    if (chiffreSupZero === null) { return nombreNumerique.toFixed(2) }
    if (Math.abs(Math.floor(nombre)) > 0) {
      if (Math.abs(Math.floor(nombre)) < 5) {
        return nombreNumerique.toFixed(3);
      } else {
        return nombreNumerique.toFixed(2);
      }
    } else {
      return nombreStr.slice(0, chiffreSupZero + 3);
    }
  } else {
    return nombreStr;
  }
}
function PBar(val, pval, max) {
  const maxh = max;
  const previousQuantity = pval;
  const Quantity = val;
  const difference = Quantity - previousQuantity;
  const absDifference = Math.abs(difference);
  const isNegativeDifference = difference < 0;
  const hoardPercentage = Math.floor((absDifference / maxh) * 100);
  return (
    hoardPercentage > 0 && (
      <div className={`progress-barb ${isNegativeDifference ? 'negative' : ''}`}>
        <div className="progress" style={{ width: `${hoardPercentage}%` }}>
          <span className="progress-text">
            {isNegativeDifference ? frmtNb(absDifference) : `${frmtNb(difference)}/${frmtNb(maxh)}`}
          </span>
        </div>
      </div>
    )
  );
}

export default ModalDlvr;
