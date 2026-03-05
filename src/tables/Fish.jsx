import React, { useEffect, useRef, useState } from "react";
import { useAppCtx } from "../context/AppCtx";
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { PBar, formatdate, frmtNb, buildSeriesMeta } from '../fct.js';
import DList from "../dlist.jsx";

export default function FishTable() {
  const stickyBarRef = useRef(null);
  const fishHeaderRowRef = useRef(null);
  const [fishHeaderStickyTop, setFishHeaderStickyTop] = useState(0);
  const [fishHeaderRowHeight, setFishHeaderRowHeight] = useState(0);
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
      xListeColCrusta,
      TryChecked,
      selectedSeason,
      fishView,
    },
    img: {
      imgSFL,
      imgExchng,
      imgna,
      imgbuyit,
    },
    actions: {
      handleUIChange,
      handleOptionChange,
      handleTooltip,
    },
  } = useAppCtx();
  const fishTables = dataSetFarm?.fishData?.itables || dataSetFarm?.itables || {};
  const { tool = {}, it = {} } = fishTables;
  function key(name) {
    if (name === "isactive") return TryChecked ? "tryit" : "isactive";
    return TryChecked ? name + "try" : name;
  }
  const fishingDetails = dataSetFarm?.Fish || {};
  const countChumCost = !!dataSet?.options?.chumFishCost;
  const reelCasts = fishingDetails?.casts ?? 0;
  const reelCastMax = TryChecked ? fishingDetails?.fishcastmaxtry ?? 0 : fishingDetails?.fishcastmax ?? 0;
  const costCast = TryChecked ? fishingDetails?.fishcastcosttry ?? 0 : fishingDetails?.fishcastcost ?? 0;
  const coinsRatio = Number(dataSet?.options?.coinsRatio || 1);
  const rod = tool?.["Rod"] || {};
  const woodMarket = Number(it?.["Wood"]?.costp2pt || 0);
  const stoneMarket = Number(it?.["Stone"]?.costp2pt || 0);
  const costCastM = ((Number(rod?.[key("sfl")] || 0) / coinsRatio)
    + (Number(rod?.Wood || 0) * woodMarket)
    + (Number(rod?.Stone || 0) * stoneMarket));
  const reelCost = (costCast * reelCasts) / coinsRatio;
  const reelCostM = (costCastM * reelCasts);
  const reelCostMax = (costCast * reelCastMax) / coinsRatio;
  const reelCostMaxM = (costCastM * reelCastMax);
  useEffect(() => {
    if (fishView !== "fish") return;
    const updateFishHeaderTop = () => {
      setFishHeaderStickyTop(stickyBarRef.current?.offsetHeight || 0);
      setFishHeaderRowHeight(fishHeaderRowRef.current?.offsetHeight || 0);
    };
    const raf = requestAnimationFrame(updateFishHeaderTop);
    window.addEventListener("resize", updateFishHeaderTop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateFishHeaderTop);
    };
  }, [fishView, selectedSeason, selectedQuantFish, xListeColFish, reelCasts, reelCastMax]);
  if (fishTables?.fish && fishTables?.crustacean && fishTables?.it && fishTables?.bounty && fishTables?.petit && fishTables?.pfood) {
    if (fishView === "fish") {
      const { fish } = fishTables;
      var totXPfsh = 0;
      var totCaught = 0;
      var totCost = 0;
      var totCostM = 0;
      const inventoryMap = farmData?.inventory || {};
      const fishNames = Object.keys(fish);
      const sortedInventoryItems = fishNames.map(item => {
        const quantity = Number(fish[item]?.instock ?? inventoryMap[item] ?? 0);
        return [item, quantity];
      });
      const isFishInSelectedSeason = (fishItem) => {
        if (selectedSeason === "all") return true;
        const seasons = String(fishItem?.weather || "").split("*").map((part) => String(part).toLowerCase());
        return seasons.includes(selectedSeason);
      };
      const visibleFishItems = sortedInventoryItems.filter(([itemName]) => {
        const fishItem = fish[itemName];
        return fishItem && fishItem.cat !== "Bait" && isFishInSelectedSeason(fishItem);
      });
      const fishCategorySeriesMeta = buildSeriesMeta(
        visibleFishItems,
        ([itemName]) => fish[itemName]?.cat || ""
      );
      let visibleFishIndex = -1;
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
        // const previousQuantity = Number(cobj?.prevstock || 0);
        // const pquant = previousQuantity;
        const itemQuantity = Number(quantity || 0);
        // const difference = itemQuantity - pquant;
        // const absDifference = Math.abs(difference);
        // const isNegativeDifference = difference < 0;
        // const maxh = cobj?.hoard || 100;
        // const hoardPercentage = Math.floor((absDifference / maxh) * 100);
        const ichum = cobj ? cobj.chum : '';
        const ichumimgs = cobj ? cobj.chumimgs : '';
        const xChums = ichum.split("*");
        const xChumsImg = ichumimgs.split("*");
        const iperiodimgs = cobj ? cobj.weather : '';
        const xPeriodImg = iperiodimgs.split("*");
        const isOnSeason = isFishInSelectedSeason(cobj);
        for (let i = 0; i < xPeriodImg.length; i++) {
          if (xPeriodImg[i] === "Winter") {
            xPeriodImg[i] = imgwinter;
          } else if (xPeriodImg[i] === "Summer") {
            xPeriodImg[i] = imgsummer;
          } else if (xPeriodImg[i] === "Autumn") {
            xPeriodImg[i] = imgautumn;
          } else if (xPeriodImg[i] === "Spring") {
            xPeriodImg[i] = imgspring;
          } else if (xPeriodImg[i] === "FullMoon") {
            xPeriodImg[i] = imgfullmoon;
          }
        }
        if (selectedSeason !== "all" && !isOnSeason) {
          return null;
        }
        const iperiod = xPeriodImg;
        const fishMyield = Number(TryChecked ? (cobj.myieldtry ?? cobj.myield ?? 1) : (cobj.myield ?? 1)) || 1;
        const chumCostCoinsKey = Number(cobj?.[key("cheaperchumCost")] ?? cobj?.cheaperchumCost ?? 0);
        const chumCostMarketKey = Number(cobj?.[key("cheaperchumCostp2pt")] ?? cobj?.cheaperchumCostp2pt ?? 0);
        const chumUnitCostRaw = chumCostCoinsKey / dataSet.options.coinsRatio;
        const chumUnitCostRawM = chumCostMarketKey;
        let icost = cobj ? (Number(!TryChecked ? cobj.cost : cobj.costtry) / dataSet.options.coinsRatio) : 0;
        let icostM = cobj ? Number(!TryChecked ? (cobj.costp2pt ?? 0) : (cobj.costp2pttry ?? cobj.costp2pt ?? 0)) : 0;
        if (countChumCost && fishMyield > 0) {
          icost += (chumUnitCostRaw / fishMyield);
          icostM += (chumUnitCostRawM / fishMyield);
        }
        icost = Number.isFinite(icost) ? Math.max(0, icost) : 0;
        const fishUnitCostRaw = icost;
        const fishUnitMarketRaw = icostM;
        const iQuant = itemQuantity;
        const ixp = cobj ? selectedQuantFish === "unit" ? (!TryChecked ? (cobj.xp || 0) : (cobj.xptry || 0)) : parseFloat((!TryChecked ? (cobj.xp || 0) : (cobj.xptry || 0)) * iQuant).toFixed(1) : 0;
        const mapRare = cobj?.mapDropFish ? fish[cobj.mapDropFish] : null;
        const mapTooltip = cobj?.mapDropFish
          ? `Drop fragment for ${cobj.mapDropFish} (${cobj.mapDropChance || "?"}%)`
          : "";
        totXPfsh += isNaN(ixp) ? 0 : Number(ixp);
        totCaught += icaught;
        const iprct = cobj ? parseFloat(cobj.prct).toFixed(1) : '';
        let convPricep = 0;
        let convPricepM = 0;
        if (selectedCurr === "SFL") {
          convPricep = icost;
          convPricepM = icostM;
        }
        if (selectedCurr === "MATIC") {
          convPricep = (icost * priceData[2]) / priceData[1];
          convPricepM = (icostM * priceData[2]) / priceData[1];
        }
        if (selectedCurr === "USDC") {
          convPricep = icost * priceData[2];
          convPricepM = icostM * priceData[2];
        }
        icost = isNaN(convPricep) ? 0 : Number(convPricep);
        icostM = isNaN(convPricepM) ? 0 : Number(convPricepM);
        totCost += icost * iQuant;
        totCostM += icostM * iQuant;
        const xCost = selectedQuantFish === "unit" ? icost : icost * iQuant;
        const xCostM = selectedQuantFish === "unit" ? icostM : icostM * iQuant;
        const tooltipQty = selectedQuantFish === "unit" ? 1 : iQuant;
        const fishCostTooltip = {
          fishName: item,
          qty: tooltipQty,
          fishUnitCost: fishUnitCostRaw,
          fishUnitMarket: fishUnitMarketRaw,
          fishMyield: fishMyield,
          includeChum: countChumCost,
          chumName: (cobj?.[key("cheaperchum")] ?? cobj?.cheaperchum ?? ""),
          chumUnitCost: chumUnitCostRaw,
          chumUnitMarket: chumUnitCostRawM,
        };
        const ixpsfl = isNaN(ixp / xCost) ? "" : ixp / xCost;
        xListeColFish[1][1] = 0;
        if (icat !== "Bait") {
          visibleFishIndex += 1;
          const categorySeries = fishCategorySeriesMeta[visibleFishIndex] || { isStart: true, isEnd: true };
          const isCategoryStart = categorySeries.isStart;
          const isCategoryEnd = categorySeries.isEnd;
          return (
            <tr key={index}>
              {xListeColFish[0][1] === 1 ? <td className="tdcenter fish-category-cell">
                {isCategoryStart ? <span className="fish-category-name">{icat}</span> : null}
                {!isCategoryEnd ? <span className={`fish-category-connector${isCategoryStart ? " is-start" : ""}`} aria-hidden="true"></span> : null}
                {isCategoryEnd && !isCategoryStart ? <span className="fish-category-endcap" aria-hidden="true"></span> : null}
              </td> : null}
              {xListeColFish[1][1] === 1 ? <td className="tdcenter">{ilocat}</td> : null}
              {/* {xListeColFish[2][1] === 1 ? (<td>
                {PBar(itemQuantity, previousQuantity, maxh, 0)}
              </td>) : ("")} */}
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
                {mapRare?.img ? (
                  <span title={mapTooltip} style={{ display: "inline-flex", alignItems: "center", gap: "4px", opacity: 0.9 }}>
                    <img src={mapRare.img} alt="" className="itico" />
                    <span style={{ fontSize: "10px" }}>{cobj?.mapDropChance}%</span>
                  </span>
                ) : null}
              </td> : null}
              {xListeColFish[8][1] === 1 ? <td className="tdcenter">
                {xChums.map((value, index) => {
                  if (value !== "") { return (<span key={index}><i><img src={xChumsImg[index]} alt={''} className="itico" title={value} /></i></span>) }
                  return null;
                })}</td> : null}
              {xListeColFish[9][1] === 1 ? <td className="tdcenter">
                {iperiod.map((value, index) => {
                  if (value !== "") { return (<span key={index}><i>{iperiod[index]}</i></span>) }
                  return null;
                })}</td> : null}
              {xListeColFish[10][1] === 1 ? <td className="tdcenter">{iprct}</td> : null}
              {xListeColFish[11][1] === 1 ? <td className="tdcenter">{isNaN(ixp) ? "" : parseFloat(ixp).toFixed(1)}</td> : null}
              {xListeColFish[12][1] === 1 ? <td className="tdcenter tooltipcell" onClick={(e) => handleTooltip(item, "fishcost", fishCostTooltip, e)}>{parseFloat(xCost).toFixed(3)}</td> : null}
              {xListeColFish[13][1] === 1 ? <td className="tdcenter tooltipcell" onClick={(e) => handleTooltip(item, "fishcost", fishCostTooltip, e)}>{parseFloat(xCostM).toFixed(3)}</td> : null}
              {xListeColFish[14][1] === 1 ? <td className="tdcenter">{isNaN(parseFloat(ixpsfl).toFixed(1)) ? "" : parseFloat(ixpsfl).toFixed(1)}</td> : null}
            </tr>
          );
        }
      });
      const fishStatusBadge = (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            margin: "0",
            padding: "4px 8px",
            border: "1px solid rgb(90, 90, 90)",
            borderRadius: "6px",
            background: "rgba(0, 0, 0, 0.28)",
            width: "fit-content",
            maxWidth: "100%",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "12px", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: "2px" }}>Reel: {reelCasts}/{reelCastMax}</span>
          <span
            className="tooltipcell"
            onClick={(e) => handleTooltip("Rod", "crustaceancost", reelCasts, e)}
            style={{ fontSize: "12px", whiteSpace: "nowrap", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "2px" }}
          >
            Cost: {frmtNb(reelCost)}/{frmtNb(reelCostMax)}{imgSFL}
          </span>
          <span
            className="tooltipcell"
            onClick={(e) => handleTooltip("Rod", "crustaceancost", reelCastMax, e)}
            style={{ fontSize: "12px", whiteSpace: "nowrap", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "2px" }}
          >
            {frmtNb(reelCostM)}/{frmtNb(reelCostMaxM)}{imgbuyit}
          </span>
          <span style={{ fontSize: "12px", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: "2px" }}>
            {earthwormquant}{earthwormbait} {grubquant}{grubbait} {redwigglerquant}{redwigglerbait}
          </span>
        </div>
      );
      const stickyFishBadgeBar = (
        <div
          ref={stickyBarRef}
          style={{
            position: "sticky",
            top: "0px",
            left: "0px",
            zIndex: 7,
            display: "flex",
            gap: "8px",
            alignItems: "center",
            flexWrap: "wrap",
            padding: "2px 0 4px 0",
            background: "rgb(18, 8, 2)",
          }}
        >
          {fishStatusBadge}
        </div>
      );
      const tableContent = (
        <>
          {stickyFishBadgeBar}
          <table
            className="table fish-table"
            style={{
              "--fish-head-top": `${fishHeaderStickyTop}px`,
              "--fish-head-row-h": `${fishHeaderRowHeight}px`,
            }}
          >
            <thead>
              <tr ref={fishHeaderRowRef}>
                {xListeColFish[0][1] === 1 ? <th className="thcenter" >Category</th> : null}
                {xListeColFish[1][1] === 1 ? <th className="thcenter" >Location</th> : null}
                {/* {xListeColFish[2][1] === 1 ? <th className="thcenter" >Hoard</th> : null} */}
                <th className="th-icon">   </th>
                {xListeColFish[3][1] === 1 ? <th className="thcenter" >Fish</th> : null}
                {xListeColFish[4][1] === 1 ? <th className="thcenter" >Bait</th> : null}
                {xListeColFish[5][1] === 1 ? <th className="thcenter" >Quantity</th> : null}
                {xListeColFish[6][1] === 1 ? <th className="thcenter" >Caught</th> : null}
                {xListeColFish[7][1] === 1 ? <th className="thcenter" >Map</th> : null}
                {xListeColFish[8][1] === 1 ? <th className="thcenter" >Chum</th> : null}
                {xListeColFish[9][1] === 1 ? <th className="thcenter" >
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
                {xListeColFish[10][1] === 1 ? <th className="thcenter" > % </th> : null}
                {xListeColFish[11][1] === 1 ? <th className="thcenter" >
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
                {xListeColFish[12][1] === 1 ? <th className="thcenter" >Cost</th> : null}
                {xListeColFish[13][1] === 1 ? <th className="thcenter" >Prod {imgbuyit}</th> : null}
                {xListeColFish[14][1] === 1 ? <th className="thcenter" >XP/SFL</th> : null}
              </tr>
              <tr key="total">
                {xListeColFish[0][1] === 1 ? <td className="tdcenter">Total</td> : null}
                {xListeColFish[1][1] === 1 ? <td className="tdcenter"></td> : null}
                {/* {xListeColFish[2][1] === 1 ? <td className="tdcenter"></td> : null} */}
                <td></td>
                {xListeColFish[3][1] === 1 ? <td className="tdcenter"></td> : null}
                {xListeColFish[4][1] === 1 ? <td className="tdcenter"></td> : null}
                {xListeColFish[5][1] === 1 ? <td className="tdcenter"></td> : null}
                {xListeColFish[6][1] === 1 ? <td className="tdcenter">{totCaught}</td> : null}
                {xListeColFish[7][1] === 1 ? <td className="tdcenter"></td> : null}
                {xListeColFish[8][1] === 1 ? <td className="tdcenter">
                  <label style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px" }}>
                    <input
                      type="checkbox"
                      checked={countChumCost}
                      name="chumFishCost"
                      onChange={handleOptionChange}
                    />
                    count
                  </label>
                </td> : null}
                {xListeColFish[9][1] === 1 ? <td className="tdcenter"></td> : null}
                {xListeColFish[10][1] === 1 ? <td className="tdcenter"></td> : null}
                {xListeColFish[11][1] === 1 ? <td className="tdcenter">{(selectedQuantFish !== "unit") ? parseFloat(totXPfsh).toFixed(1) : ""}</td> : null}
                {xListeColFish[12][1] === 1 ? <td className="tdcenter">{(selectedQuantFish !== "unit") ? parseFloat(totCost).toFixed(1) : ""}</td> : null}
                {xListeColFish[13][1] === 1 ? <td className="tdcenter">{(selectedQuantFish !== "unit") ? parseFloat(totCostM).toFixed(1) : ""}</td> : null}
                {xListeColFish[14][1] === 1 ? <td className="tdcenter"></td> : null}
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
      const { it, bounty, petit, fish, crustacean, pfood } = fishTables;
      var totXPfsh = 0;
      var totCaught = 0;
      var totCost = 0;
      var totCostMarket = 0;
      var totCostChum = 0;
      const inventoryMap = farmData?.inventory || {};
      const fishNames = Object.keys(crustacean);
      const sortedInventoryItems = fishNames.map(item => {
        const quantity = Number(crustacean[item]?.instock ?? inventoryMap[item] ?? 0);
        return [item, quantity];
      });
      const crustaToolSeriesMeta = buildSeriesMeta(
        sortedInventoryItems,
        ([itemName]) => crustacean[itemName]?.tool || ""
      );
      const inventoryItems = sortedInventoryItems.map(([item, quantity], index) => {
        const cobj = crustacean[item];
        const ico = cobj ? cobj.img : '';
        const itool = cobj ? cobj.tool : '';
        const toolSeries = crustaToolSeriesMeta[index] || { isStart: true, isEnd: true };
        const isToolStart = toolSeries.isStart;
        const isToolEnd = toolSeries.isEnd;
        const icaught = cobj ? cobj.caught : '';
        const ichum = cobj ? cobj.chum : '';
        const itime = cobj?.rdyat ? formatdate(cobj.rdyat) : '';
        const igrow = cobj ? cobj.grow : '';
        // const previousQuantity = Number(cobj?.prevstock || 0);
        // const pquant = previousQuantity || 0;
        const itemQuantity = Number(cobj?.instock ?? quantity ?? 0);
        // const difference = itemQuantity - pquant;
        // const absDifference = Math.abs(difference);
        // const isNegativeDifference = difference < 0;
        // const maxh = cobj?.hoard || 100;
        // const hoardPercentage = Math.floor((absDifference / maxh) * 100);
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
            {xListeColCrusta[0][1] === 1 ? <td className="tdcenter crusta-tool-cell">
              {isToolStart ? <span className="crusta-tool-name">{itool}</span> : null}
              {!isToolEnd ? <span className={`crusta-tool-connector${isToolStart ? " is-start" : ""}`} aria-hidden="true"></span> : null}
              {isToolEnd && !isToolStart ? <span className="crusta-tool-endcap" aria-hidden="true"></span> : null}
            </td> : null}
            {/* {xListeColCrusta[1][1] === 1 ? (<td>{PBar(itemQuantity, previousQuantity, maxh, 0)}</td>) : ("")} */}
            <td id="iccolumn"><i><img src={ico} alt={''} className="itico" /></i></td>
            {xListeColCrusta[2][1] === 1 ? <td className="tditem">{item}</td> : null}
            {xListeColCrusta[3][1] === 1 ? <td className="tdcenter">{itemQuantity || ''}</td> : null}
            {xListeColCrusta[4][1] === 1 ? <td className="tdcenter">{icaught || ''}</td> : null}
            {xListeColCrusta[5][1] === 1 ? <td className="tdcenter tooltipcell">
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
            {/* {xListeColCrusta[6][1] === 1 ? <td className="tdcenter tooltipcell" onClick={(e) => handleTooltip(item, "crustaceancost", iQuant, e)}>
              {xCost > 0 ? parseFloat(xCostChum).toFixed(3) : ''}</td> : null} */}
            {xListeColCrusta[6][1] === 1 ? <td className="tdcenter tooltipcell" onClick={(e) => handleTooltip(item, "crustaceancost", iQuant, e)}>
              {xCost > 0 ? parseFloat(xCost).toFixed(3) : ''}</td> : null}
            {xListeColCrusta[7][1] === 1 ? <td className="tdcenter">{xCostM > 0 ? parseFloat(xCostM).toFixed(3) : ''}</td> : null}
            {xListeColCrusta[8][1] === 1 ? <td className="tdcenter">{igrow}</td> : null}
            {xListeColCrusta[9][1] === 1 ? <td className="tdcenter">{itime}</td> : null}
          </tr>
        );
      });
      const tableContent = (
        <>
          <table className="table crustacean-table">
            <thead>
              <tr>
                {xListeColCrusta[0][1] === 1 ? <th className="thcenter" >Tool</th> : null}
                {/* {xListeColCrusta[1][1] === 1 ? <th className="thcenter" >Hoard</th> : null} */}
                <th className="th-icon">   </th>
                {xListeColCrusta[2][1] === 1 ? <th className="thcenter" >Crustacean</th> : null}
                {xListeColCrusta[3][1] === 1 ? <th className="thcenter" >Stock</th> : null}
                {xListeColCrusta[4][1] === 1 ? <th className="thcenter" >Caught</th> : null}
                {xListeColCrusta[5][1] === 1 ? <th className="thcenter" >Chum</th> : null}
                {xListeColCrusta[6][1] === 1 ? <th className="thcenter" >
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
                {xListeColCrusta[7][1] === 1 ? <th className="thcenter" >Prod {imgbuyit}</th> : null}
                {xListeColCrusta[8][1] === 1 ? <th className="thcenter" >Grow</th> : null}
                {xListeColCrusta[9][1] === 1 ? <th className="thcenter" >Ready</th> : null}
              </tr>
              <tr key="total">
                {xListeColCrusta[0][1] === 1 ? <td className="tdcenter">Total</td> : null}
                {/* {xListeColCrusta[1][1] === 1 ? <td className="tdcenter"></td> : null} */}
                <td></td>
                {xListeColCrusta[2][1] === 1 ? <td className="tditem"></td> : null}
                {xListeColCrusta[3][1] === 1 ? <td className="tdcenter"></td> : null}
                {xListeColCrusta[4][1] === 1 ? <td className="tdcenter">{totCaught}</td> : null}
                {xListeColCrusta[5][1] === 1 ? <td className="tdcenter"></td> : null}
                {xListeColCrusta[6][1] === 1 ? <td className="tdcenter">{(selectedQuantCrusta !== "unit") ? parseFloat(totCost).toFixed(1) : ""}</td> : null}
                {xListeColCrusta[7][1] === 1 ? <td className="tdcenter">{(selectedQuantCrusta !== "unit") ? parseFloat(totCostMarket).toFixed(1) : ""}</td> : null}
                {xListeColCrusta[8][1] === 1 ? <td className="tdcenter"></td> : null}
                {xListeColCrusta[9][1] === 1 ? <td className="tdcenter"></td> : null}
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



