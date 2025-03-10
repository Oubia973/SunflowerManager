import React, { useEffect, useState } from 'react';

function ModalTNFT({ onClose, it, food, fish, bounty, buildng, bTrynft, bnft, bTrynftw, bnftw, bTrybuild, bbuild, bTryskill, bskill, bTrybud, bbud, fishingDetails, spot, frmid, nft, nftw, fruitPlanted, coinsRatio, API_URL }) {
  const [tableNFT, settableNFT] = useState([]);
  const [tableContent, settableContent] = useState([]);
  const [nfttry, setnfttry] = useState(nft);
  const [nftwtry, setnftwtry] = useState(nftw);
  const [ittry, setittry] = useState(it);
  const [foodtry, setfoodtry] = useState(food);
  const [fishtry, setfishtry] = useState(fish);
  const [bountytry, setbountytry] = useState(bounty);
  const [buildtry, setbuildtry] = useState(buildng);
  const [skilltry, setskilltry] = useState([]);
  const [budtry, setbudtry] = useState([]);
  const [Fishingtry, setFishingtry] = useState(fishingDetails);
  const closeModal = () => {
    onClose(ittry, foodtry, fishtry, bountytry, nfttry, nftwtry, buildtry, skilltry, budtry, Fishingtry, bTrynft, bTrynftw, bTrybuild, bTryskill, bTrybud);
  };
  const Refresh = async () => {
    try {
      //supCoinsRatio (it, coinsRatio);
      const bTrynftArray = Object.entries(bTrynft).map(([key, value]) => ({ name: key, value }));
      const bTrynftwArray = Object.entries(bTrynftw).map(([key, value]) => ({ name: key, value }));
      const bTrybuildArray = Object.entries(bTrybuild).map(([key, value]) => ({ name: key, value }));
      const bTryskillArray = Object.entries(bTryskill).map(([key, value]) => ({ name: key, value }));
      const bTrybudArray = Object.entries(bTrybud).map(([key, value]) => ({ name: key, value }));
      /* const bnftArray = Object.entries(bnft).map(([key, value]) => ({ name: key, value }));
      const bnftwArray = Object.entries(bnftw).map(([key, value]) => ({ name: key, value }));
      const bbuildArray = Object.entries(bbuild).map(([key, value]) => ({ name: key, value }));
      const bskillArray = Object.entries(bskill).map(([key, value]) => ({ name: key, value }));
      const bbudArray = Object.entries(bbud).map(([key, value]) => ({ name: key, value }));
      const fruitPlantedArray = Object.entries(fruitPlanted).map(([key, value]) => ({ name: key, value }));
      const FishingArray = Object.entries(fishingDetails).map(([key, value]) => ({ name: key, value })); */
      const requestBody = JSON.stringify({
        frmid: frmid,
        coinsRatio: coinsRatio,
        inputKeep: 0,
        bTrynft: bTrynftArray,
        bTrynftw: bTrynftwArray,
        bTrybuild: bTrybuildArray,
        bTryskill: bTryskillArray,
        bTrybud: bTrybudArray,
        //bnft: bnftArray,
        //bnftw: bnftwArray,
        //bbuild: bbuildArray,
        //bskill: bskillArray,
        //bbud: bbudArray,
        //spot,
        //it: it,
        //food: food,
        //fish: fish,
        //bounty: "", //bounty,
        //buildng: buildng,
        //fruitplanted: fruitPlantedArray,
        //fishingDetails: FishingArray,
      });
      const response = await fetch(API_URL + "/settry", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody
      });
      if (response.ok) {
        const responseData = await response.json();
        setittry(responseData.it);
        setfoodtry(responseData.food);
        setfishtry(responseData.fish);
        setbountytry(responseData.bounty);
        //setnfttry(responseData.nft);
        //setnftwtry(responseData.nftw);
        setbuildtry(responseData.buildng);
        setskilltry(responseData.skill);
        setbudtry(responseData.bud);
        setFishingtry(responseData.fishingDetails);
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
        bTrynft[key] = nft[key].tryit;
        setnfttry(nft);
      }
      let nftw = nftwtry;
      for (const key in nftw) {
        nftw[key].tryit = nftw[key].isactive;
        bTrynftw[key] = nftw[key].tryit;
        setnftwtry(nftw);
      }
      let buildng = buildtry;
      for (const key in buildng) {
        buildng[key].tryit = buildng[key].isactive;
        bTrybuild[key] = buildng[key].tryit;
        setbuildtry(buildng);
      }
      let skill = skilltry;
      for (const key in skill) {
        skill[key].tryit = skill[key].isactive;
        bTryskill[key] = skill[key].tryit;
        setskilltry(skill);
      }
      let bud = budtry;
      for (const key in bud) {
        bud[key].tryit = bud[key].isactive;
        bTrybud[key] = bud[key].tryit;
        setbudtry(bud);
      }
      setNFT(nfttry, nftwtry, buildtry, skilltry, budtry);
    } catch (error) {
      console.log(`Error : ${error}`);
    }
  };
  const SetZero = () => {
    try {
      let nft = nfttry;
      for (const key in nft) {
        nft[key].tryit = 0;
        bTrynft[key] = 0;
        setnfttry(nft);
      }
      let nftw = nftwtry;
      for (const key in nftw) {
        nftw[key].tryit = 0;
        bTrynftw[key] = 0;
        setnftwtry(nftw);
      }
      let buildng = buildtry;
      for (const key in buildng) {
        buildng[key].tryit = 0;
        bTrybuild[key] = 0;
        setbuildtry(buildng);
      }
      let skill = skilltry;
      for (const key in skill) {
        skill[key].tryit = 0;
        bTryskill[key] = 0;
        setskilltry(skill);
      }
      let bud = budtry;
      for (const key in bud) {
        bud[key].tryit = 0;
        bTrybud[key] = 0;
        setbudtry(bud);
      }
      setNFT(nfttry, nftwtry, buildtry, skilltry, budtry);
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
      bTrynft[item] = nft[item].tryit;
      setnfttry(nft);
    }
    let nftw = nftwtry;
    if (nftw.hasOwnProperty(item)) {
      nftw[item].tryit = nftw[item].tryit === 1 ? 0 : 1;
      bTrynftw[item] = nftw[item].tryit;
      setnftwtry(nftw);
    }
    let buildng = buildtry;
    if (buildng.hasOwnProperty(item)) {
      buildng[item].tryit = buildng[item].tryit === 1 ? 0 : 1;
      bTrybuild[item] = buildng[item].tryit;
      setbuildtry(buildng);
    }
    let skill = skilltry;
    if (skill.hasOwnProperty(item)) {
      skill[item].tryit = skill[item].tryit === 1 ? 0 : 1;
      bTryskill[item] = skill[item].tryit;
      setskilltry(skill);
    }
    let bud = budtry;
    if (bud.hasOwnProperty(item)) {
      bud[item].tryit = bud[item].tryit === 1 ? 0 : 1;
      bTrybud[item] = bud[item].tryit;
      setbudtry(bud);
    }
    setNFT(nfttry, nftwtry, buildtry, skilltry, budtry);
  };
  function setContent(xit) {
    if (xit) {
      const itEntries = Object.entries(xit);
      const inventoryItems = itEntries.map(([item], index) => {
        const cobj = xit[item];
        const ico = cobj ? cobj.img : '';
        const ido = cobj ? cobj.id : 0;
        const costp = cobj ? (cobj.cost / coinsRatio) : 0;
        const costptry = cobj ? (cobj.costtry / coinsRatio) : 0;
        const time = cobj ? cobj.time : 0;
        const timetry = cobj ? cobj.timetry : 0;
        const imyield = cobj ? cobj.myield : 0;
        const imyieldtry = cobj ? cobj.myieldtry : 0;
        const iharvest = cobj ? cobj.harvest : 0;
        const iharvesttry = cobj ? cobj.harvesttry : 0;
        const timechg = ((timmeto1(timetry) - timmeto1(time)) / timmeto1(time)) * 100;
        const costpchg = ((costptry - costp) / costp) * 100;
        const imyieldchg = ((imyieldtry - imyield) / imyield) * 100;
        const iharvestchg = ((iharvesttry - iharvest) / iharvest) * 100;
        return (
          <tr key={index}>
            <td style={{ display: 'none' }}>{ido}</td>
            <td id="iccolumn"><i><img src={ico} alt={''} className="itico" /></i></td>
            {/* <td className="tditem">{item}</td> */}
            <td className="tdcenter">{timetry}</td>
            <td className={parseFloat(timechg).toFixed(0) > 0 ? 'chgneg' : parseFloat(timechg).toFixed(0) < 0 ? 'chgpos' : 'chgeq'}>{parseFloat(timechg).toFixed(0)}%</td>
            <td className="tdcenter">{frmtNb(costptry)}</td>
            <td className={parseFloat(costpchg).toFixed(0) > 0 ? 'chgneg' : parseFloat(costpchg).toFixed(0) < 0 ? 'chgpos' : 'chgeq'}>{parseFloat(costpchg).toFixed(0)}%</td>
            <td className="tdcenter">{parseFloat(imyieldtry).toFixed(2)}</td>
            <td className={parseFloat(imyieldchg).toFixed(0) > 0 ? 'chgpos' : parseFloat(imyieldchg).toFixed(0) < 0 ? 'chgneg' : 'chgeq'}>{parseFloat(imyieldchg).toFixed(0)}%</td>
            <td className="tdcenter">{parseFloat(iharvesttry).toFixed(2)}</td>
            <td className={parseFloat(iharvestchg).toFixed(0) > 0 ? 'chgpos' : parseFloat(iharvestchg).toFixed(0) < 0 ? 'chgneg' : 'chgeq'}>{parseFloat(iharvestchg).toFixed(0)}%</td>
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
              <th>Time chg</th>
              <th>Cost</th>
              <th>Cost chg</th>
              <th>Yield</th>
              <th>Yield chg</th>
              <th>Harvest</th>
              <th>Harvest chg</th>
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
  function setNFT(xnft, xnftw, xbuild, xskill, xbud) {
    let totalCost = 0;
    let totalCostM = 0;
    let totalCostactiv = 0;
    let totalCostactivM = 0;
    const nftEntries = xnft && Object.entries(xnft);
    const nftwEntries = xnftw && Object.entries(xnftw);
    const buildEntries = xbuild && Object.entries(xbuild);
    const skillEntries = xskill && Object.entries(xskill);
    const budEntries = xbud && Object.entries(xbud);
    var NFT = [];
    if (nftEntries) {
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
            <td className="tdcenter"><input type="checkbox" checked={xnft[item].tryit} onChange={() => handleTryitChange(item)} /></td>
            <td className="tdcenter" style={{ color: 'gray' }}><input type="checkbox" checked={value.isactive} /></td>
            <td className="tdcenter">{value.price}</td>
            <td className="tdcenter">{value.pricem || 0}</td>
            <td className="tdcenter">{isupply}</td>
            <td className="tditemnft" style={{ color: `rgb(190, 190, 190)` }}>{value.boost}</td>
          </tr>
        );
      }
    }
    if (nftwEntries) {
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
            <td className="tdcenter"><input type="checkbox" checked={xnftw[itemw].tryit} onChange={() => handleTryitChange(itemw)} /></td>
            <td className="tdcenter" style={{ color: 'gray' }}><input type="checkbox" checked={valuew.isactive} /></td>
            <td className="tdcenter">{valuew.price}</td>
            <td className="tdcenter">{valuew.pricem || 0}</td>
            <td className="tdcenter">{isupplyw}</td>
            <td className="tditemnft" style={{ color: `rgb(190, 190, 190)` }}>{valuew.boost}</td>
          </tr>
        );
      }
    }
    if (buildEntries) {
      for (const [itemb, valueb] of buildEntries) {
        if (valueb.tryit) { totalCost += Number(valueb.price) };
        if (valueb.isactive) { totalCostactiv += Number(valueb.price) };
        let isupplyb = 0;
        if (valueb.supply) { isupplyb = valueb.supply };
        NFT.push(
          <tr key={itemb}>
            <td className="tditemright">{itemb}</td>
            <td className="tdcenter" id="iccolumn"><i><img src={valueb.img} alt={''} className="nftico" /></i></td>
            <td className="tdcenter"><input type="checkbox" checked={xbuild[itemb].tryit} onChange={() => handleTryitChange(itemb)} /></td>
            <td className="tdcenter" style={{ color: 'gray' }}><input type="checkbox" checked={valueb.isactive} /></td>
            <td className="tdcenter">{valueb.price}</td>
            <td className="tdcenter"></td>
            <td className="tdcenter">{isupplyb}</td>
            <td className="tditemnft" style={{ color: `rgb(190, 190, 190)` }}>{valueb.boost}</td>
          </tr>
        );
      }
    }
    if (skillEntries) {
      for (const [items, values] of skillEntries) {
        NFT.push(
          <tr key={items}>
            <td className="tditemright">{items}</td>
            <td className="tdcenter" id="iccolumn"><i><img src={values.img} alt={''} className="nftico" /></i></td>
            <td className="tdcenter"><input type="checkbox" checked={xskill[items].tryit} onChange={() => handleTryitChange(items)} /></td>
            <td className="tdcenter" style={{ color: 'gray' }}><input type="checkbox" checked={values.isactive} /></td>
            <td className="tdcenter">{values.price}</td>
            <td className="tdcenter"></td>
            <td className="tdcenter"></td>
            <td className="tditemnft" style={{ color: `rgb(190, 190, 190)` }}>{values.boost}</td>
          </tr>
        );
      }
    }
    if (budEntries) {
      for (const [itembd, valuebd] of budEntries) {
        if (valuebd.tryit) { totalCost += Number(valuebd.price) };
        if (valuebd.isactive) { totalCostactiv += Number(valuebd.price) };
        NFT.push(
          <tr key={itembd}>
            <td className="tditemright" style={{ width: '40px' }}>{itembd}</td>
            <td className="tdcenter" id="iccolumn"><i><img src={valuebd.img} alt={''} className="nftico" /></i></td>
            <td className="tdcenter"><input type="checkbox" checked={xbud[itembd].tryit} onChange={() => handleTryitChange(itembd)} /></td>
            <td className="tdcenter" style={{ color: 'gray' }}><input type="checkbox" checked={valuebd.isactive} /></td>
            <td className="tdcenter">{valuebd.price}</td>
            <td className="tdcenter"></td>
            <td className="tdcenter"></td>
            <td className="tditemnft" style={{ color: `rgb(190, 190, 190)` }}>{valuebd.boost}</td>
          </tr>
        );
      }
    }
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
            <th className="tdcenter">Price</th>
            <th className="tdcenter">Market</th>
            <th className="tdcenter">Supply</th>
            <th style={{ width: `150px` }}>Boost</th>
          </tr>
          <tr key="total">
            <td>Total</td>
            <td></td>
            <td className="tdcenter">{parseFloat(totalCost).toFixed(0)}</td>
            <td className="tdcenter">{parseFloat(totalCostactiv).toFixed(0)}</td>
            <td className="tdcenter"></td>
            <td className="tdcenter">{parseFloat(totalCostactivM).toFixed(0)}</td>
            <td></td>
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
    setNFT(nfttry, nftwtry, buildtry, skilltry, budtry);
    setContent(ittry);
  }, [ittry, nfttry, nftwtry, buildtry, skilltry, budtry]);

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Try NFT</h2>
        <button onClick={closeModal}>Close</button>
        <button onClick={Refresh}>Refresh</button>
        <button onClick={Reset}>Reset</button>
        <button onClick={SetZero}>No NFT/Skill</button>
        <div className="content-wrapper">
          <div className="left-content">
            <table>{tableContent}</table>
          </div>
          <div className="right-content">
            <table>{tableNFT}</table>
          </div>
        </div>
      </div>
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
    if (chiffreSupZero === null || Math.abs(Math.floor(nombre)) > 0) {
      return nombreNumerique.toFixed(2);
    } else {
      return nombreStr.slice(0, chiffreSupZero + 3);
    }
  } else {
    return nombreStr;
  }
}
function supCoinsRatio(xit, coinsRatio) {
  Object.keys(xit).forEach((item) => {
    xit[item].cost *= coinsRatio;
    xit[item].costtry *= coinsRatio;
    xit[item].shop *= coinsRatio;
  });
}

export default ModalTNFT;
