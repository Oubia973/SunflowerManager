import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel } from '@mui/material';
import Tooltip from "./tooltip.js";
import CounterInput from "./counterinput.js";
import { frmtNb, ColorValue, Timer, filterTryit } from './fct.js';
import Help from './fhelp.js';

let showNFT = true;
let showNFTW = false;
let showCraft = false;
let showBud = false;
let showSkill = false;

let helpImage = "./image/helptrynft.jpg";

function ModalTNFT({ onClose, frmid, API_URL, dataSet, dataSetFarm, onReset, handleTryCheckedChange, TryChecked }) {
  const [dataSetLocal, setdataSetLocal] = useState(dataSetFarm);
  const [tableNFT, settableNFT] = useState([]);
  const [tableContent, settableContent] = useState([]);
  const [TotalCostDisplay, setTotalCostDisplay] = useState("market");
  const [tooltipData, setTooltipData] = useState(null);
  const [tableFlexDirection, setTableFlexDirection] = useState('row');
  const [tableView, setTableView] = useState('both');
  const [showHelp, setShowHelp] = useState(false);
  function key(name) {
    if (name === "active") { return TryChecked ? "tryit" : "isactive"; }
    return TryChecked ? name + "try" : name;
  }
  const closeModal = () => {
    onClose(dataSet, dataSetLocal);
  };
  const handleChangeTotalCostDisplay = (event) => {
    const selectedValue = event.target.value;
    setTotalCostDisplay(selectedValue);
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
  const handleButtonHelpClick = () => {
    setShowHelp(true);
  };
  const handleCloseHelp = () => {
    setShowHelp(false);
  };
  const Refresh = async () => {
    try {
      const tryItArrays = filterTryit(dataSetLocal, true);
      const headers = {
        frmid: frmid,
        options: dataSet.options,
        tryitarrays: tryItArrays
      };
      const response = await fetch(API_URL + "/settry", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(headers)
      });
      if (response.ok) {
        const responseData = await response.json();
        setdataSetLocal(responseData);
      } else {
        if (response.status === 429) {
          console.log('Too many requests, wait a few seconds');
        } else {
          console.log(`Error : ${response.status}`);
        }
      }
      onReset(dataSet, dataSetLocal);
    } catch (error) {
      console.log(`Error : ${error}`);
    }
  };
  const Reset = () => {
    try {
      const newDataSet = {
        ...dataSetLocal,
        nft: Object.fromEntries(
          Object.entries(dataSetLocal.nft).map(([key, value]) => [key, { ...value, tryit: value.isactive }])
        ),
        nftw: Object.fromEntries(
          Object.entries(dataSetLocal.nftw).map(([key, value]) => [key, { ...value, tryit: value.isactive }])
        ),
        buildng: Object.fromEntries(
          Object.entries(dataSetLocal.buildng).map(([key, value]) => [key, { ...value, tryit: value.isactive }])
        ),
        skill: Object.fromEntries(
          Object.entries(dataSetLocal.skill).map(([key, value]) => [key, { ...value, tryit: value.isactive }])
        ),
        skilllgc: Object.fromEntries(
          Object.entries(dataSetLocal.skilllgc).map(([key, value]) => [key, { ...value, tryit: value.isactive }])
        ),
        bud: Object.fromEntries(
          Object.entries(dataSetLocal.bud).map(([key, value]) => [key, { ...value, tryit: value.isactive }])
        ),
      };
      setdataSetLocal(newDataSet);
      onReset(dataSet, newDataSet);
    } catch (error) {
      console.log(`Error : ${error}`);
    }
  };
  const SetZero = () => {
    try {
      const newDataSet = {
        ...dataSetLocal,
        nft: Object.fromEntries(
          Object.entries(dataSetLocal.nft).map(([key, value]) => [key, { ...value, tryit: 0 }])
        ),
        nftw: Object.fromEntries(
          Object.entries(dataSetLocal.nftw).map(([key, value]) => [key, { ...value, tryit: 0 }])
        ),
        buildng: Object.fromEntries(
          Object.entries(dataSetLocal.buildng).map(([key, value]) => [key, { ...value, tryit: 0 }])
        ),
        skill: Object.fromEntries(
          Object.entries(dataSetLocal.skill).map(([key, value]) => [key, { ...value, tryit: 0 }])
        ),
        skilllgc: Object.fromEntries(
          Object.entries(dataSetLocal.skilllgc).map(([key, value]) => [key, { ...value, tryit: 0 }])
        ),
        bud: Object.fromEntries(
          Object.entries(dataSetLocal.bud).map(([key, value]) => [key, { ...value, tryit: 0 }])
        ),
      };
      setdataSetLocal(newDataSet);
      onReset(dataSet, newDataSet);
      //setNFT(dataSetLocal);
    } catch (error) {
      console.log(`Error : ${error}`);
    }
  };
  const setCollectibles = () => {
    try {
      showNFT = true;
      showNFTW = false;
      showCraft = false;
      showBud = false;
      showSkill = false;
      setNFT(dataSetLocal);
    } catch (error) {
      console.log(`Error : ${error}`);
    }
  };
  const setWearables = () => {
    try {
      showNFT = false;
      showNFTW = true;
      showCraft = false;
      showBud = false;
      showSkill = false;
      setNFT(dataSetLocal);
    } catch (error) {
      console.log(`Error : ${error}`);
    }
  };
  const setCraft = () => {
    try {
      showNFT = false;
      showNFTW = false;
      showCraft = true;
      showBud = false;
      showSkill = false;
      setNFT(dataSetLocal);
    } catch (error) {
      console.log(`Error : ${error}`);
    }
  };
  const setBuds = () => {
    try {
      showNFT = false;
      showNFTW = false;
      showCraft = false;
      showBud = true;
      showSkill = false;
      setNFT(dataSetLocal);
    } catch (error) {
      console.log(`Error : ${error}`);
    }
  };
  const setSkills = () => {
    try {
      showNFT = false;
      showNFTW = false;
      showCraft = false;
      showBud = false;
      showSkill = true;
      setNFT(dataSetLocal);
    } catch (error) {
      console.log(`Error : ${error}`);
    }
  };
  const handleTryitChange = (item, base, baseName) => {
    if (base.hasOwnProperty(item)) {
      const newbase = { ...base, [item]: { ...base[item], tryit: base[item].tryit === 1 ? 0 : 1 } };
      const newDataSetLocal = { ...dataSetLocal, [baseName]: newbase };
      setdataSetLocal(newDataSetLocal);
      onReset(dataSet, newDataSetLocal);
    }
  };
  const handleBuyitChange = (item) => {
    const { it } = dataSetLocal;
    const newbase = { ...it, [item]: { ...it[item], tryit: base[item].buyit === 1 ? 0 : 1 } };
    const newDataSetLocal = { ...dataSetLocal, ["it"]: newbase };
    setdataSetLocal(newDataSetLocal);
    onReset(dataSet, newDataSetLocal);
  };
  const handleSpottryChange = (item, value) => {
    const { it } = dataSetLocal;
    const newbase = { ...it, [item]: { ...it[item], spottry: value } };
    const newDataSetLocal = { ...dataSetLocal, ["it"]: newbase };
    setdataSetLocal(newDataSetLocal);
    onReset(dataSet, newDataSetLocal);
  };
  function setContent(xit) {
    if (xit) {
      const itEntries = Object.entries(xit);
      const inventoryItems = itEntries.map(([item], index) => {
        const cobj = xit[item];
        const ico = cobj ? cobj.img : '';
        const ido = cobj ? cobj.id : 0;
        const costp = cobj ? (cobj.cost / dataSet.options.coinsRatio) : 0;
        const costptry = cobj ? (cobj.costtry / dataSet.options.coinsRatio) : 0;
        const costp2pt = cobj ? cobj.costp2pt : 0;
        const time = cobj ? cobj.time : 0;
        const timetry = cobj ? cobj.timetry : 0;
        const imyield = cobj ? cobj.myield : 0;
        const imyieldtry = cobj ? cobj.myieldtry : 0;
        const iharvest = cobj ? cobj.harvest : 0;
        const iharvesttry = cobj ? cobj.harvesttry : 0;
        const iharvestdmaxtry = cobj ? cobj.harvestdmaxtry : 0;
        const idsfl = cobj ? cobj.dailysfl : 0;
        const idsfltry = cobj ? cobj.dailysfltry : 0;
        const ibuyit = cobj ? cobj.buyit : 0;
        //const idsfl = cobj ? cobj.dsfltry : 0;
        //const tradeTax = (100 - dataSet.options.tradeTax) / 100;
        //let idsfl = !isNaN(((costp2pt * tradeTax) - costptry) * (iharvestdmaxtry)) ? (((costp2pt * tradeTax) - costptry) * (iharvestdmaxtry)) : 0;
        //if ((parseFloat(costp2pt).toFixed(3) === parseFloat(costptry).toFixed(3)) && idsfl < 0) { idsfl = 0; }
        //const iharvestdmax = cobj ? cobj.harvestdmax : 0;
        //const iharvestdmaxtry = cobj ? cobj.harvestdmaxtry : 0;
        const timechg = ((timmeto1(timetry) - timmeto1(time)) / timmeto1(time)) * 100;
        const costpchg = ((costptry - costp) / costp) * 100;
        const imyieldchg = ((imyieldtry - imyield) / imyield) * 100;
        const iharvestchg = ((iharvesttry - iharvest) / iharvest) * 100;
        const idsflchg = ((idsfltry - idsfl) / Math.abs(idsfl)) * 100;
        const cellDSflStyle = {};
        cellDSflStyle.color = ColorValue(TryChecked ? idsfltry : idsfl, 0, 10);
        const xtime = TryChecked ? timetry : time;
        const xcost = TryChecked ? costptry : costp;
        const xmyield = TryChecked ? imyieldtry : imyield;
        const xharvest = TryChecked ? iharvesttry : iharvest;
        const xdsfl = TryChecked ? idsfltry : idsfl;
        return (
          <tr key={index}>
            <td style={{ display: 'none' }}>{ido}</td>
            <td id="iccolumn"><i><img src={ico} alt={''} className="itico" title={item} /></i></td>
            {/* <td className="tditem">{item}</td> */}
            <td className="tdcenter"
              onClick={(e) => handleTooltip(item, "trynft", "timechg", e)}>{xtime}</td>
            <td className={parseFloat(timechg).toFixed(0) > 0 ? 'chgneg' : parseFloat(timechg).toFixed(0) < 0 ? 'chgpos' : 'chgeq'}
              onClick={(e) => handleTooltip(item, "trynft", "timechg", e)}>{parseFloat(timechg).toFixed(0)}%</td>
            <td className="tdcenter"
              onClick={(e) => handleTooltip(item, "trynft", "costchg", e)}>{frmtNb(xcost)}</td>
            <td className={parseFloat(costpchg).toFixed(0) > 0 ? 'chgneg' : parseFloat(costpchg).toFixed(0) < 0 ? 'chgpos' : 'chgeq'}
              onClick={(e) => handleTooltip(item, "trynft", "costchg", e)}>{parseFloat(costpchg).toFixed(0)}%</td>
            <td className="tdcenter"
              onClick={(e) => handleTooltip(item, "trynft", "yieldchg", e)}>{parseFloat(xmyield).toFixed(2)}</td>
            <td className={parseFloat(imyieldchg).toFixed(0) > 0 ? 'chgpos' : parseFloat(imyieldchg).toFixed(0) < 0 ? 'chgneg' : 'chgeq'}
              onClick={(e) => handleTooltip(item, "trynft", "yieldchg", e)}>{parseFloat(imyieldchg).toFixed(0)}%</td>
            <td className="tdcenter"
              onClick={(e) => handleTooltip(item, "trynft", "yieldchg", e)}>{parseFloat(xharvest).toFixed(2)}</td>
            <td className={parseFloat(iharvestchg).toFixed(0) > 0 ? 'chgpos' : parseFloat(iharvestchg).toFixed(0) < 0 ? 'chgneg' : 'chgeq'}
              onClick={(e) => handleTooltip(item, "trynft", "yieldchg", e)}>{parseFloat(iharvestchg).toFixed(0)}%</td>
            <td className="tdcenter">
              <input type="checkbox" checked={ibuyit} onChange={() => handleBuyitChange(item)} />
            </td>
            <td className="tdcenter"
              onClick={(e) => handleTooltip(item, "dailysfl", (TryChecked ? "trynft" : ""), e)} style={{ ...cellDSflStyle }}>{parseFloat(xdsfl).toFixed(2)}</td>
            <td className={parseFloat(idsflchg).toFixed(0) > 0 ? 'chgpos' : parseFloat(idsflchg).toFixed(0) < 0 ? 'chgneg' : 'chgeq'}
              onClick={(e) => handleTooltip(item, "dailysfl", (TryChecked ? "trynft" : ""), e)}>{parseFloat(idsflchg).toFixed(0)}%</td>
            <td className="tdcenter">
              <CounterInput
                value={xit[item][key("spot")]}
                onChange={value => handleSpottryChange(item, value)}
                min={0}
                max={99}
                activate={TryChecked}
              />
            </td>
          </tr>
        );
      });
      const xtableContent = (
        <>
          <thead>
            <tr>
              <td style={{ display: 'none' }}>ID</td>
              <th className="th-icon">   </th>
              {/* <th>Item</th> */}
              <th>Time</th>
              <th>chg</th>
              <th>Cost</th>
              <th>chg</th>
              <th>Yield</th>
              <th>chg</th>
              <th>Harvest</th>
              <th>chg</th>
              <th>Buy</th>
              <th>Daily<div>SFL</div></th>
              <th>chg</th>
              <th>Nodes</th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems}
          </tbody>
        </>
      );
      settableContent(xtableContent);
      //tableContent = xtableContent;
    }
  }
  function setNFT(xdataSetFarm) {
    const { nft, nftw, build, skill, skilllgc, bud } = xdataSetFarm;
    let totalCost = 0;
    let totalCostM = 0;
    let totalCostactiv = 0;
    let totalCostactivM = 0;
    const nftEntries = nft && Object.entries(nft);
    const nftwEntries = nftw && Object.entries(nftw);
    const buildEntries = build && Object.entries(build);
    const skillEntries = skill && Object.entries(skill);
    const skilllgcEntries = skilllgc && Object.entries(skilllgc);
    const budEntries = bud && Object.entries(bud);
    const imgOS = <img src='./icon/ui/openseaico.png' alt={''} className="nftico" />;
    const imgexchng = <img src='./icon/ui/exchange.png' alt={''} className="nftico" />;

    var NFT = [];
    settableNFT("");
    if (nftEntries && showNFT) {
      for (const [item, value] of nftEntries) {
        if (value.tryit) {
          totalCost += Number(value.price);
          totalCostM += Number(value.pricem) || 0;
        }
        if (value.isactive) {
          totalCostactiv += Number(value.price);
          totalCostactivM += Number(value.pricem) || 0;
        }
        let isupply = 0;
        if (value.supply) { isupply = value.supply };
        NFT.push(
          <tr key={item}>
            <td className="tditemright">{item}</td>
            <td className="tdcenter" id="iccolumn"><i><img src={value.img} alt={''} className="nftico" /></i></td>
            <td className="tdcenter">
              <input type="checkbox" checked={nft[item].tryit} onChange={() => handleTryitChange(item, nft, "nft")} />
            </td>
            <td className="tdcenter">
              <input type="checkbox" className={'checkbox-disabled'} checked={value.isactive} />
            </td>
            <td className="tdcenter">{value.price}</td>
            <td className="tdcenter">{value.pricem || 0}</td>
            <td className="tdcenter" onClick={(e) => handleTooltip(item, "trynftsupply", "nft", e)}>{isupply}</td>
            <td className="tditemnft" style={{ color: `rgb(190, 190, 190)` }}>{value.boost}</td>
          </tr>
        );
      }
    }
    if (nftwEntries && showNFTW) {
      for (const [itemw, valuew] of nftwEntries) {
        if (valuew.tryit) {
          totalCost += Number(valuew.price);
          totalCostM += Number(valuew.pricem) || 0;
        }
        if (valuew.isactive) {
          totalCostactiv += Number(valuew.price);
          totalCostactivM += Number(valuew.pricem) || 0;
        }
        let isupplyw = 0;
        if (valuew.supply) { isupplyw = valuew.supply };
        NFT.push(
          <tr key={itemw}>
            <td className="tditemright">{itemw}</td>
            <td className="tdcenter" id="iccolumn"><i><img src={valuew.img} alt={''} className="nftico" /></i></td>
            <td className="tdcenter">
              <input type="checkbox" checked={nftw[itemw].tryit} onChange={() => handleTryitChange(itemw, nftw, "nftw")} />
            </td>
            <td className="tdcenter">
              <input type="checkbox" className={'checkbox-disabled'} checked={valuew.isactive} />
            </td>
            <td className="tdcenter">{valuew.price}</td>
            <td className="tdcenter">{valuew.pricem || 0}</td>
            <td className="tdcenter" onClick={(e) => handleTooltip(itemw, "trynftsupply", "nftw", e)}>{isupplyw}</td>
            <td className="tditemnft" style={{ color: `rgb(190, 190, 190)` }}>{valuew.boost}</td>
          </tr>
        );
      }
    }
    if (buildEntries && showCraft) {
      for (const [itemb, valueb] of buildEntries) {
        if (valueb.tryit) { totalCost += Number(valueb.price) };
        if (valueb.isactive) { totalCostactiv += Number(valueb.price) };
        let isupplyb = 0;
        if (valueb.supply) { isupplyb = valueb.supply };
        NFT.push(
          <tr key={itemb}>
            <td className="tditemright">{itemb}</td>
            <td className="tdcenter" id="iccolumn"><i><img src={valueb.img} alt={''} className="nftico" /></i></td>
            <td className="tdcenter">
              <input type="checkbox" checked={build[itemb].tryit} onChange={() => handleTryitChange(itemb, build, "build")} />
            </td>
            <td className="tdcenter">
              <input type="checkbox" className={'checkbox-disabled'} checked={valueb.isactive} />
            </td>
            <td className="tdcenter">{isupplyb}</td>
            <td className="tditemnft" style={{ color: `rgb(190, 190, 190)` }}>{valueb.boost}</td>
          </tr>
        );
      }
    }
    if (skillEntries && showSkill) {
      let tierPoints = {};
      const catPoints = {
        Crops: { 2: 3, 3: 7 },
        Fruits: { 2: 2, 3: 5 },
        Trees: { 2: 2, 3: 5 },
        Fishing: { 2: 2, 3: 5 },
        Animals: { 2: 3, 3: 7 },
        Greenhouse: { 2: 2, 3: 5 },
        Mining: { 2: 3, 3: 7 },
        Cooking: { 2: 2, 3: 5 },
        "Bees Flowers": { 2: 2, 3: 5 },
        Machinery: { 2: 2, 3: 5 },
        Compost: { 2: 3, 3: 7 }
      };
      for (const [items, values] of skillEntries) {
        if (!tierPoints[skill[items].cat]) { tierPoints[skill[items].cat] = {}; }
        if (!tierPoints[skill[items].cat][skill[items].tier]) { tierPoints[skill[items].cat][skill[items].tier] = 0; }
        if (values.tryit) {
          totalCost += Number(values.points);
          totalCostM += Number(values.pricem) || 0;
          tierPoints[skill[items].cat][skill[items].tier] += Number(values.points);
        }
        if (values.isactive) {
          totalCostactiv += Number(values.points);
          totalCostactivM += Number(values.pricem) || 0;
        }
        const cellStyle = {};
        cellStyle.backgroundColor = skill[items].tier === 1 ? `rgba(0, 116, 25, 0.63)` : skill[items].tier === 2 ? `rgba(0, 2, 116, 0.63)` : `rgba(114, 116, 0, 0.63)`;
        if (skill[items].tier === 2 && (catPoints[skill[items].cat][2] > tierPoints[skill[items].cat][1] || 0)) {
          cellStyle.backgroundColor = `rgba(255, 94, 94, 0.63)`;
        }
        if (skill[items].tier === 3 && (catPoints[skill[items].cat][3] > ((tierPoints[skill[items].cat][1] || 0) + (tierPoints[skill[items].cat][2] || 0)))) {
          cellStyle.backgroundColor = `rgba(255, 94, 94, 0.63)`;
        }
        NFT.push(
          <tr key={items}>
            <td className="tditemright" style={cellStyle}>{items}</td>
            <td className="tdcenter" id="iccolumn"><i><img src={values.img} alt={''} className="nftico" /></i></td>
            <td className="tdcenter">
              <input type="checkbox" checked={skill[items].tryit} onChange={() => handleTryitChange(items, skill, "skill")} />
            </td>
            <td className="tdcenter">
              <input type="checkbox" className={'checkbox-disabled'} checked={values.isactive} />
            </td>
            <td className="tditemnft" style={{ color: `rgb(190, 190, 190)` }}>{values.boost}</td>
          </tr>
        );
      }
    }
    if (skilllgcEntries && showSkill) {
      NFT.push(
        <tr>
          <td colSpan={5} style={{ textAlign: "center", fontWeight: "bold" }}>
            Badges (Legacy skills not obtainable anymore)
          </td>
        </tr>
      );
      for (const [items, values] of skilllgcEntries) {
        /* if (values.tryit) {
          totalCost += Number(values.points);
          totalCostM += Number(values.pricem) || 0;
        }
        if (values.isactive) {
          totalCostactiv += Number(values.points);
          totalCostactivM += Number(values.pricem) || 0;
        } */
        const cellStyle = {};
        //cellStyle.backgroundColor = xskill[items].tier === 1 ? `rgba(0, 116, 25, 0.63)` : xskill[items].tier === 2 ? `rgba(0, 2, 116, 0.63)` : `rgba(114, 116, 0, 0.63)`;
        NFT.push(
          <tr key={items}>
            <td className="tditemright" style={cellStyle}>{items}</td>
            <td className="tdcenter" id="iccolumn"><i><img src={values.img} alt={''} className="nftico" /></i></td>
            <td className="tdcenter">
              <input type="checkbox" checked={skilllgc[items].tryit} onChange={() => handleTryitChange(items, skilllgc, "skilllgc")} />
            </td>
            <td className="tdcenter">
              <input type="checkbox" className={'checkbox-disabled'} checked={values.isactive} />
            </td>
            <td className="tditemnft" style={{ color: `rgb(190, 190, 190)` }}>{values.boost}</td>
          </tr>
        );
      }
    }
    if (budEntries && showBud) {
      for (const [itembd, valuebd] of budEntries) {
        if (valuebd.tryit) { totalCost += Number(valuebd.price) };
        if (valuebd.isactive) { totalCostactiv += Number(valuebd.price) };
        NFT.push(
          <tr key={itembd}>
            <td className="tditemright" style={{ width: '40px' }}>{itembd}</td>
            <td className="tdcenter" id="iccolumn"><i><img src={valuebd.img} alt={''} className="nftico" /></i></td>
            <td className="tdcenter">
              <input type="checkbox" checked={bud[itembd].tryit} onChange={() => handleTryitChange(itembd, bud, "bud")} />
            </td>
            <td className="tdcenter">
              <input type="checkbox" className={'checkbox-disabled'} checked={valuebd.isactive} />
            </td>
            <td className="tditemnft" style={{ color: `rgb(190, 190, 190)` }}>{valuebd.boost}</td>
          </tr>
        );
      }
    }
    const showTotal = (showNFTW || showNFT);
    const totalCostToDisplay = (TotalCostDisplay === "opensea" || showSkill) ? totalCost : totalCostM;
    /* NFT.unshift(
      <tr key="total">
        <td colSpan="3">Total</td>
        <td className="tdcenter">{frmtNb(totalCost)}</td>
      </tr>
    ); */
    const xtableNFT = (
      <>
        <thead>
          <tr>
            <td style={{ display: 'none' }}>ID</td>
            <th> </th>
            <th>Item</th>
            <th className="tdcenter">Try</th>
            <th className="tdcenter">Active</th>
            {(showNFT || showNFTW) ? (<th className="tdcenter">{imgOS}</th>) : ("")}
            {(showNFT || showNFTW) ? (<th className="tdcenter">{imgexchng}</th>) : ("")}
            {(showNFT || showNFTW || showCraft) ? (<th className="tdcenter">Supply</th>) : ("")}
            <th style={{ width: `150px` }}>Boost</th>
          </tr>
          <tr key="total">
            <td align="right">Total {showTotal && <FormControl variant="standard" id="formselecttotalcosttry" height="10px" size="small">
              <Select value={TotalCostDisplay} onChange={handleChangeTotalCostDisplay}>
                <MenuItem value="opensea">{imgOS}</MenuItem>
                <MenuItem value="market">{imgexchng}</MenuItem>
              </Select>
            </FormControl>}</td>
            <td className="tdcenter"></td>
            <td className="tdcenter">{parseFloat(totalCostToDisplay).toFixed(0)}</td>
            <td className="tdcenter">{showSkill ? parseFloat(totalCostactiv).toFixed(0) : ""}</td>
            {(showNFT || showNFTW) ? (<td className="tdcenter">{parseFloat(totalCostactiv).toFixed(0)}</td>) : ("")}
            {(showNFT || showNFTW) ? (<td className="tdcenter">{parseFloat(totalCostactivM).toFixed(0)}</td>) : ("")}
            {(showNFT || showNFTW || showCraft) ? (<td></td>) : ("")}
            <td></td>
          </tr>
        </thead>
        <tbody>
          {NFT}
        </tbody>
      </>
    );
    settableNFT(xtableNFT);
    //tableNFT = xtableNFT;
  }
  useEffect(() => {
    Refresh();
  }, []);
  useEffect(() => {
    setNFT(dataSetLocal);
    setContent(dataSetLocal.it);
  }, [dataSetLocal, TotalCostDisplay, TryChecked]);

  const tableStyle = {
    flexDirection: tableFlexDirection,
    display: 'flex',
    flex: 1,
    minHeight: 0,
    overflow: 'visible'
  };

  return (
    <div style={{
      position: 'fixed',
      top: '0',
      width: '100%',
      backgroundColor: 'var(--background-color)',
      justifyContent: 'center',
      zIndex: '990',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        maxHeight: '100vh'
      }}>
        {/* <h2>Try NFT</h2> */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <button onClick={closeModal} class="button"><img src="./icon/ui/cancel.png" alt="" className="resico" /></button>
            <button onClick={Refresh} class="button"><img src="./icon/ui/refresh.png" alt="" className="resico" /></button>
            <button onClick={handleButtonHelpClick} title="Help" class="button"><img src="./icon/nft/na.png" alt="" className="itico" /></button>
            <button onClick={Reset}>Reset</button>
            <button onClick={SetZero}>No NFT/Skill</button>
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
                    transform: 'translate(15%, 15%)',
                  }}
                />
              }
              label={TryChecked ? 'Tryset' : 'Activeset'}
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: '10px',
                  transform: 'translate(-70%, -70%)',
                }
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 0, justifyContent: 'center', alignItems: 'center' }}>
            <button class="button"
              onClick={() => setTableFlexDirection(dir => dir === 'row' ? 'column' : 'row')}
            >
              {tableFlexDirection === 'row' ? <img src="./icon/ui/horizontal.png" alt="" className="resico" /> : <img src="./icon/ui/vertical.png" alt="" className="resico" />}
            </button>
            <button class="button"
              onClick={() => setTableView(view =>
                view === 'both' ? 'left' : view === 'left' ? 'right' : 'both'
              )}
            >
              {tableView === 'both' ? <img src="./icon/ui/crops.png" alt="" className="resico" /> : tableView === 'left' ? <img src="./icon/ui/lightning.png" alt="" className="resico" />
                : <img src="./icon/ui/cropslightning.png" alt="" className="resico" />}
            </button>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            flexWrap: 'wrap',
          }}>
            <button onClick={setCollectibles}>Collectibles</button>
            <button onClick={setWearables}>Wearables</button>
            <button onClick={setCraft}>Craft</button>
            <button onClick={setBuds}>Buds</button>
            <button onClick={setSkills}>Skills</button>
          </div>
        </div>
        <div style={tableStyle}>
          {(tableView === 'both' || tableView === 'left') && (
            <div style={{
              flex: 1,
              overflow: 'auto',
              minHeight: 0,
              display: tableView === 'right' ? 'none' : 'block'
            }}>
              <table>{tableContent}</table>
            </div>
          )}
          {(tableView === 'both' || tableView === 'right') && (
            <div style={{
              flex: 1,
              overflow: 'auto',
              minHeight: 0,
              display: tableView === 'left' ? 'none' : 'block'
            }}>
              <table>{tableNFT}</table>
            </div>
          )}
        </div>
      </div>
      {tooltipData && (
        <Tooltip
          onClose={() => setTooltipData(null)}
          clickPosition={tooltipData}
          item={tooltipData.item}
          context={tooltipData.context}
          value={tooltipData.value}
          dataSet={dataSet}
          dataSetFarm={dataSetLocal}
        />
      )}
      {showHelp && (
        <Help onClose={handleCloseHelp} image={helpImage} />
      )}
    </div>
  );
}
function timmeto1(inputTime) {
  const timeComponents = inputTime.split(':').map(Number);
  const [hours, minutes, seconds] = timeComponents;
  const decimalHours = hours + minutes / 60 + seconds / 3600;
  const normalizedTime = decimalHours / 24;
  return normalizedTime;
}

export default ModalTNFT;
