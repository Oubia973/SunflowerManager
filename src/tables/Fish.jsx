import React from "react";
import { useAppCtx } from "../context/AppCtx";
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { PBar, formatdate } from '../fct.js';
import DList from "../dlist.jsx";

export default function FishTable() {
  const {
    data: {
      dataSet,
      dataSetFarm,
      farmData,
      priceData,
    },
    ui: {
      selectedCurr,
      selectedQuantFish,
      selectedQuantCrusta,
      xListeColFish,
      TryChecked,
      selectedSeason,
      fishView,
    },
    img: {
      imgSFL,
      imgExchng,
      imgna,
    },
    actions: {
      handleUIChange,
      handleTooltip,
    },
  } = useAppCtx();
  const fishingDetails = dataSetFarm?.Fish || {};
  const reelCasts = fishingDetails?.casts ?? 0;
  const reelCastMax = TryChecked ? fishingDetails?.fishcastmaxtry ?? 0 : fishingDetails?.fishcastmax ?? 0;
  if (farmData.inventory) {
    if (fishView === "fish") {
      const { fish } = dataSetFarm.itables;
      var totXPfsh = 0;
      var totCaught = 0;
      var totCost = 0;
      const inventoryEntries = Object.entries(farmData.inventory);
      var pinventoryEntries = "";
      if (farmData.previousInventory) { pinventoryEntries = Object.entries(farmData.previousInventory) }
      const fishNames = Object.keys(fish);
      const sortedInventoryItems = fishNames.map(item => {
        const quantity = inventoryEntries.find(([entryItem]) => entryItem === item)?.[1] || 0;
        return [item, quantity];
      });
      const earthwormbait = <i><img src={fish["Earthworm"].img} alt={''} className="itico" title="Earthworm" /></i>
      const grubbait = <i><img src={fish["Grub"].img} alt={''} className="itico" title="Grub" /></i>
      const redwigglerbait = <i><img src={fish["Red Wiggler"].img} alt={''} className="itico" title="Red Wiggler" /></i>
      const earthwormquant = fish["Earthworm"].quant;
      const grubquant = fish["Grub"].quant;
      const redwigglerquant = fish["Red Wiggler"].quant;
      const imgwinter = <img src="./icon/ui/winter.webp" alt={''} className="seasonico" title="Winter" />;
      const imgspring = <img src="./icon/ui/spring.webp" alt={''} className="seasonico" title="Spring" />;
      const imgsummer = <img src="./icon/ui/summer.webp" alt={''} className="seasonico" title="Summer" />;
      const imgautumn = <img src="./icon/ui/autumn.webp" alt={''} className="seasonico" title="Autumn" />;
      const imgfullmoon = <img src="./icon/ui/full_moon.png" alt={''} className="seasonico" title="Full Moon" />;
      const inventoryItems = sortedInventoryItems.map(([item, quantity], index) => {
        const cobj = fish[item];
        const ico = cobj ? cobj.img : '';
        const icat = cobj ? cobj.cat : '';
        const ibait = cobj ? cobj.bait : '';
        const ilocat = cobj ? cobj.locations : '';
        const xBaits = ibait.split("/");
        const icaught = cobj ? cobj.caught : '';
        const previousQuantity = parseFloat(pinventoryEntries.find(([pItem]) => pItem === item)?.[1] || 0);
        const pquant = previousQuantity;
        const itemQuantity = quantity;
        const difference = itemQuantity - pquant;
        const absDifference = Math.abs(difference);
        const isNegativeDifference = difference < 0;
        const maxh = cobj?.hoard || 100;
        const hoardPercentage = Math.floor((absDifference / maxh) * 100);
        const ichum = cobj ? cobj.chum : '';
        const ichumimgs = cobj ? cobj.chumimgs : '';
        const xChums = ichum.split("*");
        const xChumsImg = ichumimgs.split("*");
        const iperiodimgs = cobj ? cobj.weather : '';
        const xPeriodImg = iperiodimgs.split("*");
        let isOnSeason = false;
        for (let i = 0; i < xPeriodImg.length; i++) {
          if (xPeriodImg[i] === "Winter") {
            xPeriodImg[i] = imgwinter;
            if (selectedSeason === "winter") { isOnSeason = true; }
          } else if (xPeriodImg[i] === "Summer") {
            xPeriodImg[i] = imgsummer;
            if (selectedSeason === "summer") { isOnSeason = true; }
          } else if (xPeriodImg[i] === "Autumn") {
            xPeriodImg[i] = imgautumn;
            if (selectedSeason === "autumn") { isOnSeason = true; }
          } else if (xPeriodImg[i] === "Spring") {
            xPeriodImg[i] = imgspring;
            if (selectedSeason === "spring") { isOnSeason = true; }
          } else if (xPeriodImg[i] === "FullMoon") {
            xPeriodImg[i] = imgfullmoon;
          }
        }
        if (selectedSeason !== "all" && !isOnSeason) {
          return null;
        }
        const iperiod = xPeriodImg;
        var icost = cobj ? ((!TryChecked ? cobj.cost : cobj.costtry) / dataSet.options.coinsRatio) : '';
        const iQuant = quantity;
        const ixp = cobj ? selectedQuantFish === "unit" ? (!TryChecked ? cobj.xp : cobj.xptry) : parseFloat((!TryChecked ? cobj.xp : cobj.xptry) * iQuant).toFixed(1) : 0;
        totXPfsh += isNaN(ixp) ? 0 : Number(ixp);
        totCaught += icaught;
        const iprct = cobj ? parseFloat(cobj.prct).toFixed(1) : '';
        let convPricep = 0;
        if (selectedCurr === "SFL") {
          convPricep = icost;
        }
        if (selectedCurr === "MATIC") {
          convPricep = (icost * priceData[2]) / priceData[1];
        }
        if (selectedCurr === "USDC") {
          convPricep = icost * priceData[2];
        }
        icost = isNaN(convPricep) ? 0 : Number(convPricep);
        totCost += icost * iQuant;
        const xCost = selectedQuantFish === "unit" ? icost : icost * iQuant;
        const ixpsfl = isNaN(ixp / xCost) ? "" : ixp / xCost;
        xListeColFish[1][1] = 0;
        if (icat !== "Bait") {
          return (
            <tr key={index}>
              {xListeColFish[0][1] === 1 ? <td className="tdcenter">{icat}</td> : null}
              {xListeColFish[1][1] === 1 ? <td className="tdcenter">{ilocat}</td> : null}
              {xListeColFish[2][1] === 1 ? (<td>
                {PBar(quantity, previousQuantity, maxh, 0)}
                {/* {maxh > 0 && (
                <div className={`progress-bar ${isNegativeDifference ? 'negative' : ''}`}>
                  <div className="progress" style={{ width: `${hoardPercentage}%` }}>
                    <span className="progress-text">
                      {isNegativeDifference ? `-${parseFloat(absDifference).toFixed(0)}` : `${parseFloat(difference).toFixed(0)}/${parseFloat(maxh).toFixed(0)}`}
                    </span>
                  </div>
                </div>
              )} */}
              </td>) : ("")}
              <td id="iccolumn"><i><img src={ico} alt={''} className="itico" /></i></td>
              {xListeColFish[3][1] === 1 ? <td className="tditem">{item}</td> : null}
              {xListeColFish[4][1] === 1 ? <td className="tdcenter">
                {xBaits.map((value, index) => (
                  value !== "" ? (<span key={index}>
                    <i><img src={fish[value].img} alt={''} className="itico" title={value} /></i>
                  </span>) : ("")
                ))}</td> : null}
              {xListeColFish[5][1] === 1 ? <td className="tdcenter">{iQuant}</td> : null}
              {xListeColFish[6][1] === 1 ? <td className="tdcenter">{icaught}</td> : null}
              {xListeColFish[7][1] === 1 ? <td className="tdcenter">
                {xChums.map((value, index) => {
                  if (value !== "") { return (<span key={index}><i><img src={xChumsImg[index]} alt={''} className="itico" title={value} /></i></span>) }
                  return null;
                })}</td> : null}
              {xListeColFish[8][1] === 1 ? <td className="tdcenter">
                {iperiod.map((value, index) => {
                  if (value !== "") { return (<span key={index}><i>{iperiod[index]}</i></span>) }
                  return null;
                })}</td> : null}
              {xListeColFish[9][1] === 1 ? <td className="tdcenter">{iprct}</td> : null}
              {xListeColFish[10][1] === 1 ? <td className="tdcenter">{isNaN(ixp) ? "" : parseFloat(ixp).toFixed(1)}</td> : null}
              {xListeColFish[11][1] === 1 ? <td className="tdcenter">{parseFloat(xCost).toFixed(3)}</td> : null}
              {xListeColFish[12][1] === 1 ? <td className="tdcenter">{isNaN(parseFloat(ixpsfl).toFixed(1)) ? "" : parseFloat(ixpsfl).toFixed(1)}</td> : null}
            </tr>
          );
        }
      });
      const tableContent = (
        <>
          <table className="table">
            <thead>
              <tr>
                {xListeColFish[0][1] === 1 ? <th className="thcenter" >Category</th> : null}
                {xListeColFish[1][1] === 1 ? <th className="thcenter" >Location</th> : null}
                {xListeColFish[2][1] === 1 ? <th className="thcenter" >Hoard</th> : null}
                <th className="th-icon">   </th>
                {xListeColFish[3][1] === 1 ? <th className="thcenter" >Fish</th> : null}
                {xListeColFish[4][1] === 1 ? <th className="thcenter" >Bait</th> : null}
                {xListeColFish[5][1] === 1 ? <th className="thcenter" >Quantity</th> : null}
                {xListeColFish[6][1] === 1 ? <th className="thcenter" >Caught</th> : null}
                {xListeColFish[7][1] === 1 ? <th className="thcenter" >Chum</th> : null}
                {xListeColFish[8][1] === 1 ? <th className="thcenter" >
                  {/* <div className="selectseasonback"><FormControl variant="standard" id="formselectquant" className="selectseason" size="small">
                    <InputLabel style={{ fontSize: `12px` }}>Season</InputLabel>
                    <Select name={"selectedSeason"} value={selectedSeason} onChange={handleUIChange} onClick={(e) => e.stopPropagation()}>
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="spring"><img src="./icon/ui/spring.webp" alt={''} className="seasonico" title="Spring" style={{ width: '18px', height: '18px' }} /></MenuItem>
                      <MenuItem value="summer"><img src="./icon/ui/summer.webp" alt={''} className="seasonico" title="Summer" style={{ width: '18px', height: '18px' }} /></MenuItem>
                      <MenuItem value="autumn"><img src="./icon/ui/autumn.webp" alt={''} className="seasonico" title="Autumn" style={{ width: '18px', height: '18px' }} /></MenuItem>
                      <MenuItem value="winter"><img src="./icon/ui/winter.webp" alt={''} className="seasonico" title="Winter" style={{ width: '18px', height: '18px' }} /></MenuItem>
                    </Select></FormControl></div> */}
                  <DList
                    name="selectedSeason"
                    title="Season"
                    options={[
                      { value: "all", label: "All" },
                      { value: "spring", label: <img src="./icon/ui/spring.webp" alt={''} className="seasonico" title="Spring" style={{ width: '18px', height: '18px' }} /> },
                      { value: "summer", label: <img src="./icon/ui/summer.webp" alt={''} className="seasonico" title="Summer" style={{ width: '18px', height: '18px' }} /> },
                      { value: "autumn", label: <img src="./icon/ui/autumn.webp" alt={''} className="seasonico" title="Autumn" style={{ width: '18px', height: '18px' }} /> },
                      { value: "winter", label: <img src="./icon/ui/winter.webp" alt={''} className="seasonico" title="Winter" style={{ width: '18px', height: '18px' }} /> },
                    ]}
                    value={selectedSeason}
                    onChange={handleUIChange}
                    height={28}
                  />
                </th> : null}
                {xListeColFish[9][1] === 1 ? <th className="thcenter" > % </th> : null}
                {xListeColFish[10][1] === 1 ? <th className="thcenter" >
                  {/* <div className="selectquantback" style={{ top: `4px` }}><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                    <InputLabel>XP</InputLabel>
                    <Select name="selectedQuantFish" value={selectedQuantFish} onChange={handleUIChange}>
                      <MenuItem value="unit">/ Unit</MenuItem>
                      <MenuItem value="quant">x Quantity</MenuItem>
                    </Select></FormControl></div> */}
                  <DList
                    name="selectedQuantFish"
                    title="XP"
                    options={[
                      { value: "unit", label: "/ Unit" },
                      { value: "quant", label: "x Quantity" },
                    ]}
                    value={selectedQuantFish}
                    onChange={handleUIChange}
                    height={28}
                  />
                </th> : null}
                {xListeColFish[11][1] === 1 ? <th className="thcenter" >Cost</th> : null}
                {xListeColFish[12][1] === 1 ? <th className="thcenter" >XP/SFL</th> : null}
              </tr>
              <tr key="total">
                {xListeColFish[0][1] === 1 ? <td className="tdcenter">Total</td> : null}
                {xListeColFish[1][1] === 1 ? <td className="tdcenter"></td> : null}
                {xListeColFish[2][1] === 1 ? <td className="tdcenter"></td> : null}
                <td></td>
                {xListeColFish[3][1] === 1 ? <td className="tdcenter">Reel: {reelCasts}/{reelCastMax}</td> : null}
                {xListeColFish[4][1] === 1 ? <td className="tdcenter">{earthwormquant}{earthwormbait}{grubquant}{grubbait}{redwigglerquant}{redwigglerbait}</td> : null}
                {xListeColFish[5][1] === 1 ? <td className="tdcenter"></td> : null}
                {xListeColFish[6][1] === 1 ? <td className="tdcenter">{totCaught}</td> : null}
                {xListeColFish[7][1] === 1 ? <td className="tdcenter"></td> : null}
                {xListeColFish[8][1] === 1 ? <td className="tdcenter"></td> : null}
                {xListeColFish[9][1] === 1 ? <td className="tdcenter"></td> : null}
                {xListeColFish[10][1] === 1 ? <td className="tdcenter">{(selectedQuantFish !== "unit") ? parseFloat(totXPfsh).toFixed(1) : ""}</td> : null}
                {xListeColFish[11][1] === 1 ? <td className="tdcenter">{(selectedQuantFish !== "unit") ? parseFloat(totCost).toFixed(1) : ""}</td> : null}
                {xListeColFish[12][1] === 1 ? <td className="tdcenter"></td> : null}
              </tr>
            </thead>
            <tbody>
              {inventoryItems}
            </tbody>
          </table>
        </>
      );
      return (tableContent);
    }
    if (fishView === "crustacean") {
      const { it, bounty, petit, fish, crustacean, pfood } = dataSetFarm.itables;
      var totXPfsh = 0;
      var totCaught = 0;
      var totCost = 0;
      var totCostMarket = 0;
      var totCostChum = 0;
      const inventoryEntries = Object.entries(farmData.inventory);
      var pinventoryEntries = "";
      if (farmData.previousInventory) { pinventoryEntries = Object.entries(farmData.previousInventory) }
      const fishNames = Object.keys(crustacean);
      const sortedInventoryItems = fishNames.map(item => {
        const quantity = inventoryEntries.find(([entryItem]) => entryItem === item)?.[1] || 0;
        return [item, quantity];
      });
      const inventoryItems = sortedInventoryItems.map(([item, quantity], index) => {
        const cobj = crustacean[item];
        const ico = cobj ? cobj.img : '';
        const itool = cobj ? cobj.tool : '';
        const icaught = cobj ? cobj.caught : '';
        const ichum = cobj ? cobj.chum : '';
        const itime = cobj?.rdyat ? formatdate(cobj.rdyat) : '';
        const igrow = cobj ? cobj.grow : '';
        const previousQuantity = parseFloat(pinventoryEntries.find(([pItem]) => pItem === item)?.[1] || 0);
        const pquant = previousQuantity || 0;
        const itemQuantity = cobj ? cobj.instock : '';
        const difference = itemQuantity - pquant;
        const absDifference = Math.abs(difference);
        const isNegativeDifference = difference < 0;
        const maxh = cobj?.hoard || 100;
        const hoardPercentage = Math.floor((absDifference / maxh) * 100);
        var icost = cobj ? ((!TryChecked ? cobj.cost : cobj.costtry) / dataSet.options.coinsRatio) : '';
        var icostm = cobj ? (!TryChecked ? (cobj.costp2pt || 0) : (cobj.costp2pttry ?? cobj.costp2pt ?? 0)) : 0;
        const iQuant = selectedQuantCrusta === "unit" ? 1 : (itemQuantity || 0);
        totCaught += icaught;
        let convPricep = 0;
        if (selectedCurr === "SFL") {
          convPricep = icost;
        }
        if (selectedCurr === "MATIC") {
          convPricep = (icost * priceData[2]) / priceData[1];
        }
        if (selectedCurr === "USDC") {
          convPricep = icost * priceData[2];
        }
        icost = isNaN(convPricep) ? 0 : Number(convPricep);
        totCost += icost * iQuant;
        totCostMarket += icostm * iQuant;
        const xCost = icost * iQuant;
        const xCostM = icostm * iQuant;
        /* let xCostChum = 0;
        Object.entries(ichum).map(([critem, quant]) => {
          const citem = it[critem] || petit[critem] || pfood[critem];
          let chumCost = 0;
          if(citem) {chumCost = TryChecked ? citem.costtry : citem.cost}
          if (!critem) return null;
          xCostChum = quant * chumCost * (iQuant || 0);
        });
        totCostChum += xCostChum * (iQuant || 0); */
        return (
          <tr key={index}>
            {xListeColFish[0][1] === 1 ? <td className="tdcenter">{itool}</td> : null}
            {xListeColFish[1][1] === 1 ? (<td>{PBar(quantity, previousQuantity, maxh, 0)}</td>) : ("")}
            <td id="iccolumn"><i><img src={ico} alt={''} className="itico" /></i></td>
            {xListeColFish[2][1] === 1 ? <td className="tditem">{item}</td> : null}
            {xListeColFish[3][1] === 1 ? <td className="tdcenter">{itemQuantity || ''}</td> : null}
            {xListeColFish[4][1] === 1 ? <td className="tdcenter">{icaught || ''}</td> : null}
            {xListeColFish[6][1] === 1 ? <td className="tdcenter tooltipcell">
              {Object.entries(ichum).map(([critem, quant]) => {
                //const citem = crustacean[critem];
                if (!critem) return null;
                const itemImg = it[critem]?.img || petit[critem]?.img || bounty[critem]?.img || pfood[critem]?.img || imgna;
                if (critem !== "") {
                  return (<span>{quant * iQuant}
                    <i><img src={itemImg} alt={''} className="itico" title={critem} onClick={(e) => handleTooltip(critem, "costitem", quant * iQuant, e)} /></i></span>)
                }
                return null;
              })}</td> : null}
            {/* {xListeColFish[7][1] === 1 ? <td className="tdcenter tooltipcell" onClick={(e) => handleTooltip(item, "crustaceancost", iQuant, e)}>
              {xCost > 0 ? parseFloat(xCostChum).toFixed(3) : ''}</td> : null} */}
            {xListeColFish[7][1] === 1 ? <td className="tdcenter tooltipcell" onClick={(e) => handleTooltip(item, "crustaceancost", iQuant, e)}>
              {xCost > 0 ? parseFloat(xCost).toFixed(3) : ''}</td> : null}
            {xListeColFish[8][1] === 1 ? <td className="tdcenter">{xCostM > 0 ? parseFloat(xCostM).toFixed(3) : ''}</td> : null}
            {xListeColFish[8][1] === 1 ? <td className="tdcenter">{igrow}</td> : null}
            {xListeColFish[8][1] === 1 ? <td className="tdcenter">{itime}</td> : null}
          </tr>
        );
      });
      const tableContent = (
        <>
          <table className="table">
            <thead>
              <tr>
                {xListeColFish[0][1] === 1 ? <th className="thcenter" >Tool</th> : null}
                {xListeColFish[1][1] === 1 ? <th className="thcenter" >Hoard</th> : null}
                <th className="th-icon">   </th>
                {xListeColFish[2][1] === 1 ? <th className="thcenter" >Crustacean</th> : null}
                {xListeColFish[3][1] === 1 ? <th className="thcenter" >Stock</th> : null}
                {xListeColFish[4][1] === 1 ? <th className="thcenter" >Caught</th> : null}
                {xListeColFish[5][1] === 1 ? <th className="thcenter" >Chum</th> : null}
                {xListeColFish[8][1] === 1 ? <th className="thcenter" >
                  <DList
                    name="selectedQuantCrusta"
                    title="Cost"
                    options={[
                      { value: "unit", label: "/ Unit" },
                      { value: "quant", label: "x Quantity" },
                    ]}
                    value={selectedQuantCrusta}
                    onChange={handleUIChange}
                    height={28}
                  />
                </th> : null}
                {xListeColFish[8][1] === 1 ? <th className="thcenter" >{imgExchng}</th> : null}
                {xListeColFish[8][1] === 1 ? <th className="thcenter" >Grow</th> : null}
                {xListeColFish[8][1] === 1 ? <th className="thcenter" >Ready</th> : null}
              </tr>
              <tr key="total">
                {xListeColFish[0][1] === 1 ? <td className="tdcenter">Total</td> : null}
                {xListeColFish[1][1] === 1 ? <td className="tdcenter"></td> : null}
                <td></td>
                {xListeColFish[3][1] === 1 ? <td className="tditem"></td> : null}
                {xListeColFish[4][1] === 1 ? <td className="tdcenter"></td> : null}
                {xListeColFish[5][1] === 1 ? <td className="tdcenter">{totCaught}</td> : null}
                {xListeColFish[7][1] === 1 ? <td className="tdcenter"></td> : null}
                {xListeColFish[8][1] === 1 ? <td className="tdcenter">{(selectedQuantCrusta !== "unit") ? parseFloat(totCost).toFixed(1) : ""}</td> : null}
                {xListeColFish[8][1] === 1 ? <td className="tdcenter">{(selectedQuantCrusta !== "unit") ? parseFloat(totCostMarket).toFixed(1) : ""}</td> : null}
                {xListeColFish[8][1] === 1 ? <td className="tdcenter"></td> : null}
                {xListeColFish[8][1] === 1 ? <td className="tdcenter"></td> : null}
              </tr>
            </thead>
            <tbody>
              {inventoryItems}
            </tbody>
          </table>
        </>
      );
      return (tableContent);
    }
  }
}
