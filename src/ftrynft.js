import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Tooltip from "./tooltip.js";
import { frmtNb, ColorValue, Timer } from './fct.js';

let showNFT = true;
let showNFTW = false;
let showCraft = false;
let showBud = false;
let showSkill = false;

function ModalTNFT({ onClose, frmid, coinsRatio, API_URL, dataSet, onReset }) {
  const [tableNFT, settableNFT] = useState([]);
  const [tableContent, settableContent] = useState([]);
  const [nfttry, setnfttry] = useState(dataSet.nft);
  const [nftwtry, setnftwtry] = useState(dataSet.nftw);
  const [ittry, setittry] = useState(dataSet.it);
  const [foodtry, setfoodtry] = useState(dataSet.food);
  const [fishtry, setfishtry] = useState(dataSet.fish);
  const [bountytry, setbountytry] = useState(dataSet.bounty);
  const [buildtry, setbuildtry] = useState(dataSet.buildng);
  const [skilltry, setskilltry] = useState(dataSet.skill);
  const [skilllgctry, setskilllgctry] = useState(dataSet.skilllgc);
  const [budtry, setbudtry] = useState(dataSet.bud);
  const [Fishingtry, setFishingtry] = useState(dataSet.fishingDetails);
  const [TotalCostDisplay, setTotalCostDisplay] = useState("market");
  const [tooltipData, setTooltipData] = useState(null);
  const [tableFlexDirection, setTableFlexDirection] = useState('row');
  const [tableView, setTableView] = useState('both');

  const closeModal = () => {
    //onClose(ittry, foodtry, fishtry, bountytry, nfttry, nftwtry, buildtry, skilltry, budtry, Fishingtry, bTrynft, bTrynftw, bTrybuild, bTryskill, bTrybud, dataSet);
    onClose(dataSet);
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
  const Refresh = async () => {
    try {
      let bTrynft = {};
      let bTrynftw = {};
      let bTrybuild = {};
      let bTryskill = {};
      let bTryskilllgc = {};
      let bTrybud = {};
      let bBuyit = {};
      function filterTryit(xnft, xnftw, xskill, xskilllgc, xbuildng, xbud, xit) {
        Object.entries(xnft).forEach(([item]) => { bTrynft[item] = xnft[item].tryit; });
        Object.entries(xnftw).forEach(([item]) => { bTrynftw[item] = xnftw[item].tryit; });
        Object.entries(xskill).forEach(([item]) => { bTryskill[item] = xskill[item].tryit; });
        Object.entries(xskilllgc).forEach(([item]) => { bTryskilllgc[item] = xskilllgc[item].tryit; });
        Object.entries(xbuildng).forEach(([item]) => { bTrybuild[item] = xbuildng[item].tryit; });
        Object.entries(xbud).forEach(([item]) => { bTrybud[item] = xbud[item].tryit; });
        Object.entries(xit).forEach(([item]) => { bBuyit[item] = xit[item]?.buyit; });
      }
      filterTryit(nfttry, nftwtry, skilltry, skilllgctry, buildtry, budtry, ittry);
      /* const xOptions = {
        inputKeep: 0,
        inputFarmTime: dataSet.options.inputFarmTime,
        inputMaxBB: dataSet.options.inputMaxBB,
        inputAnimalLvl: dataSet.options.inputAnimalLvl,
        coinsRatio: dataSet.options.coinsRatio,
        usePriceFood: dataSet.options.usePriceFood,
      } */
      const headers = {
        frmid: frmid,
        xoptions: dataSet.options,
        xtrynft: bTrynft,
        xtrynftw: bTrynftw,
        xtrybuild: bTrybuild,
        xtryskill: bTryskill,
        xtryskilllgc: bTryskilllgc,
        xtrybud: bTrybud,
        xbuyit: bBuyit,
      };
      const response = await fetch(API_URL + "/settry", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(headers)
        //headers: headers
      });
      if (response.ok) {
        const responseData = await response.json();
        dataSet.it = responseData.it;
        dataSet.food = responseData.food;
        dataSet.fish = responseData.fish;
        dataSet.bounty = responseData.bounty;
        dataSet.nft = responseData.nft;
        dataSet.nftw = responseData.nftw;
        dataSet.buildng = responseData.buildng;
        dataSet.skill = responseData.skill;
        dataSet.skilllgc = responseData.skilllgc;
        dataSet.bud = responseData.bud;
        dataSet.fishingDetails = responseData.fishingDetails;
        setittry(responseData.it);
        setfoodtry(responseData.food);
        setfishtry(responseData.fish);
        setbountytry(responseData.bounty);
        setnfttry(responseData.nft);
        setnftwtry(responseData.nftw);
        setbuildtry(responseData.buildng);
        setskilltry(responseData.skill);
        setskilllgctry(responseData.skilllgc);
        setbudtry(responseData.bud);
        setFishingtry(responseData.fishingDetails);
        onReset(dataSet);
      } else {
        if (response.status === 429) {
          console.log('Too many requests, wait a few seconds');
        } else {
          console.log(`Error : ${response.status}`);
        }
      }
    } catch (error) {
      console.log(`Error : ${error}`);
    }
  };
  const Reset = () => {
    try {
      let nft = nfttry;
      for (const key in nft) {
        nft[key].tryit = nft[key].isactive;
        setnfttry(nft);
      }
      let nftw = nftwtry;
      for (const key in nftw) {
        nftw[key].tryit = nftw[key].isactive;
        setnftwtry(nftw);
      }
      let buildng = buildtry;
      for (const key in buildng) {
        buildng[key].tryit = buildng[key].isactive;
        setbuildtry(buildng);
      }
      let skill = skilltry;
      for (const key in skill) {
        skill[key].tryit = skill[key].isactive;
        setskilltry(skill);
      }
      let skilllgc = skilllgctry;
      for (const key in skilllgc) {
        skilllgc[key].tryit = skilllgc[key].isactive;
        setskilllgctry(skilllgc);
      }
      let bud = budtry;
      for (const key in bud) {
        bud[key].tryit = bud[key].isactive;
        setbudtry(bud);
      }
      setNFT(nfttry, nftwtry, buildtry, skilltry, skilllgctry, budtry);
    } catch (error) {
      console.log(`Error : ${error}`);
    }
  };
  const SetZero = () => {
    try {
      let nft = nfttry;
      for (const key in nft) {
        nft[key].tryit = 0;
        setnfttry(nft);
      }
      let nftw = nftwtry;
      for (const key in nftw) {
        nftw[key].tryit = 0;
        setnftwtry(nftw);
      }
      let buildng = buildtry;
      for (const key in buildng) {
        buildng[key].tryit = 0;
        setbuildtry(buildng);
      }
      let skill = skilltry;
      for (const key in skill) {
        skill[key].tryit = 0;
        setskilltry(skill);
      }
      let skilllgc = skilllgctry;
      for (const key in skilllgc) {
        skilllgc[key].tryit = 0;
        setskilllgctry(skilllgc);
      }
      let bud = budtry;
      for (const key in bud) {
        bud[key].tryit = 0;
        setbudtry(bud);
      }
      setNFT(nfttry, nftwtry, buildtry, skilltry, skilllgctry, budtry);
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
      setNFT(nfttry, nftwtry, buildtry, skilltry, skilllgctry, budtry);
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
      setNFT(nfttry, nftwtry, buildtry, skilltry, skilllgctry, budtry);
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
      setNFT(nfttry, nftwtry, buildtry, skilltry, skilllgctry, budtry);
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
      setNFT(nfttry, nftwtry, buildtry, skilltry, skilllgctry, budtry);
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
      setNFT(nfttry, nftwtry, buildtry, skilltry, skilllgctry, budtry);
    } catch (error) {
      console.log(`Error : ${error}`);
    }
  };
  //const [tryitStates, setTryitStates] = useState({});
  const handleTryitChange = (item) => {
    /* setTryitStates((prevState) => ({
      ...prevState,
      [item]: !prevState[item],
    })); */
    let nft = nfttry;
    if (nft.hasOwnProperty(item)) {
      nft[item].tryit = nft[item].tryit === 1 ? 0 : 1;
      setnfttry(nft);
    }
    let nftw = nftwtry;
    if (nftw.hasOwnProperty(item)) {
      nftw[item].tryit = nftw[item].tryit === 1 ? 0 : 1;
      setnftwtry(nftw);
    }
    let buildng = buildtry;
    if (buildng.hasOwnProperty(item)) {
      buildng[item].tryit = buildng[item].tryit === 1 ? 0 : 1;
      setbuildtry(buildng);
    }
    let skill = skilltry;
    if (skill.hasOwnProperty(item)) {
      skill[item].tryit = skill[item].tryit === 1 ? 0 : 1;
      setskilltry(skill);
    }
    let skilllgc = skilllgctry;
    if (skilllgc.hasOwnProperty(item)) {
      skilllgc[item].tryit = skilllgc[item].tryit === 1 ? 0 : 1;
      setskilllgctry(skilllgc);
    }
    let bud = budtry;
    if (bud.hasOwnProperty(item)) {
      bud[item].tryit = bud[item].tryit === 1 ? 0 : 1;
      setbudtry(bud);
    }
    setNFT(nfttry, nftwtry, buildtry, skilltry, skilllgctry, budtry);
  };
  const handleBuyitChange = (item) => {
    setittry(prevIt => {
      const newIt = { ...prevIt };
      if (newIt.hasOwnProperty(item)) {
        newIt[item] = { ...newIt[item], buyit: newIt[item]?.buyit === 1 ? 0 : 1 };
      }
      return newIt;
    });
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
        const ibuyit = cobj ? cobj.buyit : 0;
        //const idsfl = cobj ? cobj.dsfltry : 0;
        const tradeTax = (100 - dataSet.options.tradeTax) / 100;
        let idsfl = !isNaN(((costp2pt * tradeTax) - costptry) * (iharvestdmaxtry)) ? (((costp2pt * tradeTax) - costptry) * (iharvestdmaxtry)) : 0;
        if ((parseFloat(costp2pt).toFixed(3) === parseFloat(costptry).toFixed(3)) && idsfl < 0) { idsfl = 0; }
        //const iharvestdmax = cobj ? cobj.harvestdmax : 0;
        //const iharvestdmaxtry = cobj ? cobj.harvestdmaxtry : 0;
        const timechg = ((timmeto1(timetry) - timmeto1(time)) / timmeto1(time)) * 100;
        const costpchg = ((costptry - costp) / costp) * 100;
        const imyieldchg = ((imyieldtry - imyield) / imyield) * 100;
        const iharvestchg = ((iharvesttry - iharvest) / iharvest) * 100;
        const cellDSflStyle = {};
        cellDSflStyle.color = ColorValue(idsfl, 0, 10);
        return (
          <tr key={index}>
            <td style={{ display: 'none' }}>{ido}</td>
            <td id="iccolumn"><i><img src={ico} alt={''} className="itico" /></i></td>
            {/* <td className="tditem">{item}</td> */}
            <td className="tdcenter"
              onClick={(e) => handleTooltip(item, "trynft", "timechg", e, dataSet)}>{timetry}</td>
            <td className={parseFloat(timechg).toFixed(0) > 0 ? 'chgneg' : parseFloat(timechg).toFixed(0) < 0 ? 'chgpos' : 'chgeq'}
              onClick={(e) => handleTooltip(item, "trynft", "timechg", e, dataSet)}>{parseFloat(timechg).toFixed(0)}%</td>
            <td className="tdcenter"
              onClick={(e) => handleTooltip(item, "trynft", "costchg", e, dataSet)}>{frmtNb(costptry)}</td>
            <td className={parseFloat(costpchg).toFixed(0) > 0 ? 'chgneg' : parseFloat(costpchg).toFixed(0) < 0 ? 'chgpos' : 'chgeq'}
              onClick={(e) => handleTooltip(item, "trynft", "costchg", e, dataSet)}>{parseFloat(costpchg).toFixed(0)}%</td>
            <td className="tdcenter"
              onClick={(e) => handleTooltip(item, "trynft", "yieldchg", e, dataSet)}>{parseFloat(imyieldtry).toFixed(2)}</td>
            <td className={parseFloat(imyieldchg).toFixed(0) > 0 ? 'chgpos' : parseFloat(imyieldchg).toFixed(0) < 0 ? 'chgneg' : 'chgeq'}
              onClick={(e) => handleTooltip(item, "trynft", "yieldchg", e, dataSet)}>{parseFloat(imyieldchg).toFixed(0)}%</td>
            <td className="tdcenter"
              onClick={(e) => handleTooltip(item, "trynft", "yieldchg", e, dataSet)}>{parseFloat(iharvesttry).toFixed(2)}</td>
            <td className={parseFloat(iharvestchg).toFixed(0) > 0 ? 'chgpos' : parseFloat(iharvestchg).toFixed(0) < 0 ? 'chgneg' : 'chgeq'}
              onClick={(e) => handleTooltip(item, "trynft", "yieldchg", e, dataSet)}>{parseFloat(iharvestchg).toFixed(0)}%</td>
            <td className="tdcenter">
              <input type="checkbox" checked={ibuyit} onChange={() => handleBuyitChange(item)} />
            </td>
            <td className="tdcenter"
              onClick={(e) => handleTooltip(item, "dailysfl", "trynft", e, dataSet)} style={{ ...cellDSflStyle }}>{parseFloat(idsfl).toFixed(2)}</td>
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
              <th>Daily SFL</th>
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
  function setNFT(xnft, xnftw, xbuild, xskill, xskilllgc, xbud) {
    let totalCost = 0;
    let totalCostM = 0;
    let totalCostactiv = 0;
    let totalCostactivM = 0;
    const nftEntries = xnft && Object.entries(xnft);
    const nftwEntries = xnftw && Object.entries(xnftw);
    const buildEntries = xbuild && Object.entries(xbuild);
    const skillEntries = xskill && Object.entries(xskill);
    const skilllgcEntries = xskilllgc && Object.entries(xskilllgc);
    const budEntries = xbud && Object.entries(xbud);
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
              <input type="checkbox" checked={xnft[item].tryit} onChange={() => handleTryitChange(item)} />
            </td>
            <td className="tdcenter">
              <input type="checkbox" className={'checkbox-disabled'} checked={value.isactive} />
            </td>
            <td className="tdcenter">{value.price}</td>
            <td className="tdcenter">{value.pricem || 0}</td>
            <td className="tdcenter" onClick={(e) => handleTooltip(item, "trynftsupply", "nft", e, dataSet)}>{isupply}</td>
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
              <input type="checkbox" checked={xnftw[itemw].tryit} onChange={() => handleTryitChange(itemw)} />
            </td>
            <td className="tdcenter">
              <input type="checkbox" className={'checkbox-disabled'} checked={valuew.isactive} />
            </td>
            <td className="tdcenter">{valuew.price}</td>
            <td className="tdcenter">{valuew.pricem || 0}</td>
            <td className="tdcenter" onClick={(e) => handleTooltip(itemw, "trynftsupply", "nftw", e, dataSet)}>{isupplyw}</td>
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
              <input type="checkbox" checked={xbuild[itemb].tryit} onChange={() => handleTryitChange(itemb)} />
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
        if (!tierPoints[xskill[items].cat]) { tierPoints[xskill[items].cat] = {}; }
        if (!tierPoints[xskill[items].cat][xskill[items].tier]) { tierPoints[xskill[items].cat][xskill[items].tier] = 0; }
        if (values.tryit) {
          totalCost += Number(values.points);
          totalCostM += Number(values.pricem) || 0;
          tierPoints[xskill[items].cat][xskill[items].tier] += Number(values.points);
        }
        if (values.isactive) {
          totalCostactiv += Number(values.points);
          totalCostactivM += Number(values.pricem) || 0;
        }
        const cellStyle = {};
        cellStyle.backgroundColor = xskill[items].tier === 1 ? `rgba(0, 116, 25, 0.63)` : xskill[items].tier === 2 ? `rgba(0, 2, 116, 0.63)` : `rgba(114, 116, 0, 0.63)`;
        if (xskill[items].tier === 2 && (catPoints[xskill[items].cat][2] > tierPoints[xskill[items].cat][1] || 0)) {
          cellStyle.backgroundColor = `rgba(255, 94, 94, 0.63)`;
        }
        if (xskill[items].tier === 3 && (catPoints[xskill[items].cat][3] > ((tierPoints[xskill[items].cat][1] || 0) + (tierPoints[xskill[items].cat][2] || 0)))) {
          cellStyle.backgroundColor = `rgba(255, 94, 94, 0.63)`;
        }
        NFT.push(
          <tr key={items}>
            <td className="tditemright" style={cellStyle}>{items}</td>
            <td className="tdcenter" id="iccolumn"><i><img src={values.img} alt={''} className="nftico" /></i></td>
            <td className="tdcenter">
              <input type="checkbox" checked={xskill[items].tryit} onChange={() => handleTryitChange(items)} />
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
              <input type="checkbox" checked={xskilllgc[items].tryit} onChange={() => handleTryitChange(items)} />
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
              <input type="checkbox" checked={xbud[itembd].tryit} onChange={() => handleTryitChange(itembd)} />
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
    setNFT(nfttry, nftwtry, buildtry, skilltry, skilllgctry, budtry);
    setContent(ittry);
  }, [ittry, nfttry, nftwtry, buildtry, skilltry, skilllgctry, budtry, TotalCostDisplay]);

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
            <button onClick={(e) => handleTooltip("", "trynfthelp", "", e, dataSet)} class="button"><img src="./icon/nft/na.png" alt="" className="resico" /></button>
            <button onClick={Reset}>Reset</button>
            <button onClick={SetZero}>No NFT/Skill</button>
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
        />
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
