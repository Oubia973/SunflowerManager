import React from "react";
import { useAppCtx } from "../context/AppCtx";
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { frmtNb } from '../fct.js';

export default function PetsTable() {
  const {
    data: { dataSet, dataSetFarm },
    ui: {
      xListeColBounty,
      petView,
      selectedQuantFetch,
      customQuantFetch,
      TryChecked
    },
    actions: {
      handleUIChange,
      handleTooltip,
    },
    img: {
      imgSFL,
      imgExchng,
    }
  } = useAppCtx();
  const { Pets } = dataSetFarm;
  const { it, petit } = dataSetFarm.itables;
  const { shrine } = dataSetFarm.boostables;
  function key(name) {
    if (name === "active") { return TryChecked ? "tryit" : "isactive"; }
    return TryChecked ? name + "try" : name;
  }
  //const food = dataSetFarm?.food || {};
  const CATEGORY_IMG = {
    Dog: "./icon/pet/dog.webp",
    Cat: "./icon/pet/cat.webp",
    Owl: "./icon/pet/owl.webp",
    Horse: "./icon/pet/horse.webp",
    Bull: "./icon/pet/bull.webp",
    Hamster: "./icon/pet/hamster.webp",
    Penguin: "./icon/pet/penguin.webp",
    Ram: "./icon/pet/ram.webp",
    Dragon: "./icon/pet/dragon.webp",
    Phoenix: "./icon/pet/phoenix.webp",
    Griffin: "./icon/pet/griffin.webp",
    Ram: "./icon/pet/ram.webp",
    Warthog: "./icon/pet/warthog.webp",
    Wolf: "./icon/pet/wolf.webp",
    Bear: "./icon/pet/bear.webp",
  };
  const CATEGORY_ITEMS = {
    Dog: ["Acorn", "Chewed Bone", "Ribbon", "Fossil Shell"],
    Cat: ["Acorn", "Ribbon", "Heart Leaf", "Fossil Shell"],
    Owl: ["Acorn", "Heart Leaf", "Dewberry", "Fossil Shell"],
    Horse: ["Acorn", "Ruffroot", "Wild Grass", "Fossil Shell"],
    Bull: ["Acorn", "Wild Grass", "Frost Pebble", "Fossil Shell"],
    Hamster: ["Acorn", "Dewberry", "Chewed Bone", "Fossil Shell"],
    Penguin: ["Acorn", "Frost Pebble", "Ruffroot", "Fossil Shell"],
    Dragon: ["Acorn", "Frost Pebble", "Chewed Bone", "Moonfur", "Fossil Shell", "Ruffroot"],
    Phoenix: ["Acorn", "Heart Leaf", "Ruffroot", "Moonfur", "Fossil Shell", "Ribbon"],
    Griffin: ["Acorn", "Ruffroot", "Dewberry", "Moonfur", "Fossil Shell", "Wild Grass"],
    Ram: ["Acorn", "Ribbon", "Ruffroot", "Moonfur", "Fossil Shell", "Heart Leaf"],
    Warthog: ["Acorn", "Wild Grass", "Frost Pebble", "Moonfur", "Fossil Shell", "Ribbon"],
    Wolf: ["Acorn", "Chewed Bone", "Ribbon", "Moonfur", "Fossil Shell", "Dewberry"],
    Bear: ["Acorn", "Dewberry", "Heart Leaf", "Moonfur", "Fossil Shell", "Frost Pebble"],
  };
  const compToShrines = {};
  Object.entries(shrine).forEach(([shName, shInfo]) => {
    const compo = shInfo?.compo || {};
    Object.keys(compo).forEach(comp => {
      if (!compToShrines[comp]) compToShrines[comp] = [];
      compToShrines[comp].push(shName);
    });
  });
  if (petView === "pets") {
    //const petit = dataSetFarm?.petit || {};
    const categories = Object.keys(CATEGORY_ITEMS);
    const rows = categories.map(cat => {
      let foodCostTotal = 0;
      let foodCostMTotal = 0;
      const catImgPath = CATEGORY_IMG[cat] || "./icon/nft/na.png";
      const catImg = <img src={catImgPath} alt="" className="nftico" title={cat} />;
      const items = CATEGORY_ITEMS[cat] || [];
      let curNrg = 0;
      let petLvl = 0;
      let energySfl = 0;
      let totalNrg = 0;
      let energyMSfl = 0;
      const requests = [];
      let petFeeds = [];
      let supply = Pets[cat] ? Pets[cat].supply || 0 : 0;
      let aura = "";
      let bib = "";
      for (let petName in Pets) {
        if (Pets[petName].cat === cat && Pets[petName].minNrgSfl) {
          requests.push(...(Pets[petName].req || []));
          for (let reqp in Pets[petName].feeds) {
            const feed = Pets[petName].feeds[reqp];
            petFeeds.push(
              <React.Fragment key={reqp}>
                <span onClick={(e) => handleTooltip(feed.name, "cookcost", 1, e)}>
                  <img
                    src={feed.img}
                    alt=""
                    className="itico"
                    title={feed.name}
                  />
                  {/* {frmtNb(feed.costsfl)} */}
                </span>
              </React.Fragment>
            );
          }
          if (Pets[cat]) { supply = Pets[cat].supply || 0; }
          //petExp = Pets[petName].exp || 0;
          petLvl = Pets[petName].lvl || 0;
          aura = Pets[petName].aura || "";
          bib = Pets[petName]?.bib === "Collar" ? "+5xp" : Pets[petName]?.bib === "Gold Necklace" ? "+10xp" : "";
          foodCostTotal = Pets[petName][key("costsfl")] || 0;
          foodCostMTotal = Pets[petName].costp2p || 0;
          energySfl = Pets[petName][key("nrgsfl")] || 0;
          energyMSfl = Pets[petName].nrgsflp2p || 0;
          totalNrg = Pets[petName].totnrg || 0;
          curNrg = Pets[petName].curnrg || 0;
        }
      }
      const itemIcons = items.map(comp => {
        if (comp === "Fossil Shell") return null;
        const cimg = petit?.[comp]?.img || "./icon/nft/na.png";
        return (
          <span key={comp} title={comp} style={{ marginRight: 6 }}>
            <img src={cimg} alt="" className="itico" />
          </span>
        );
      });
      return (
        <tr key={cat}>
          <td className="tdcenter" id="iccolumn">{catImg}</td>
          <td className="tditem">{cat}</td>
          <td className="tdcenter">{itemIcons.length ? itemIcons : <i>N/A</i>}</td>
          <td className="tdcenter" style={{ padding: "0 10px" }}>{supply ? supply : ""}</td>
          <td className="tdcenter" style={{ padding: "0 10px" }}>{petLvl > 0 ? petLvl : ""}</td>
          <td className="tdcenter" style={{ padding: "0 10px" }}>{aura}</td>
          <td className="tdcenter" style={{ padding: "0 10px" }}>{bib}</td>
          <td className="tdcenter" style={{ padding: "0 10px" }}>{curNrg > 0 ? curNrg : ""}</td>
          {/* <td className="tdcenter" style={{ padding: "0 10px" }}>{petExp > 0 ? petExp : ""}</td> */}
          <td className="tdcenter tooltipcell" style={{ fontSize: "12px" }}>{petFeeds}</td>
          <td className="tdcenter" style={{ padding: "0 10px" }}>{totalNrg > 0 ? totalNrg : ""}</td>
          <td className="tdcenter tooltipcell" style={{ padding: "0 10px" }} onClick={(e) => handleTooltip(requests, "cookcost", 1, e)}>
            {petFeeds.length ? frmtNb(foodCostTotal / dataSet.options.coinsRatio) : ""}</td>
          <td className="tdcenter tooltipcell" style={{ padding: "0 10px" }} onClick={(e) => handleTooltip(requests, "cookcost", 1, e)}
          >{petFeeds.length ? frmtNb(foodCostMTotal) : ""}</td>
          <td className="tdcenter" style={{ padding: "0 10px" }}>{petFeeds.length > 0 ? (energySfl > 0 ? frmtNb(energySfl) : "ꝏ") : ""}</td>
          <td className="tdcenter" style={{ padding: "0 10px" }}>{(energyMSfl > 0 && foodCostMTotal > 0) ? frmtNb(energyMSfl) : ""}</td>
        </tr>
      );
    });
    return (
      <table className="table">
        <thead>
          <tr>
            <th className="thcenter"></th>
            <th className="thcenter">Category</th>
            <th className="thcenter">Fetch</th>
            <th className="thcenter">Supply</th>
            <th className="thcenter">Lvl</th>
            <th className="thcenter">Aura</th>
            <th className="thcenter">Bib</th>
            <th className="thcenter">Current <img src="./icon/ui/lightning.png" alt="" className="itico" title="Energy" /></th>
            {/* <th className="thcenter">Exp</th> */}
            <th className="thcenter">Requests</th>
            <th className="thcenter"><img src="./icon/ui/lightning.png" alt="" className="itico" title="Energy" /></th>
            <th className="thcenter">Cost</th>
            <th className="thcenter">{imgExchng}</th>
            <th className="thcenter"><img src="./icon/ui/lightning.png" alt="" className="itico" title="Energy" />/{imgSFL}</th>
            <th className="thcenter"><img src="./icon/ui/lightning.png" alt="" className="itico" title="Energy" />/{imgExchng}</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
  if (petView === "shrines") {
    const shNames = Object.keys(shrine);
    const rows = shNames.map(shName => {
      let compTotal = 0;
      let compMTotal = 0;
      const s = shrine[shName];
      const compo = s?.compo || {};
      const boost = s?.boost || "";
      const time = s?.time || "";
      const supply = s?.supply || 0;
      const compIcons = Object.entries(compo).map(([comp, qty]) => {
        let itemTable = {};
        if (it[comp]) {itemTable = it;}
        if (petit[comp]) {itemTable = petit;}
        let cimg = itemTable?.[comp]?.img || "./icon/nft/na.png";
        let coinRatioOrNot = (itemTable !== petit) ? dataSet.options.coinsRatio : 1;
        compTotal += qty * ((itemTable?.[comp]?.cost || 0) / coinRatioOrNot);
        compMTotal += qty * itemTable?.[comp]?.costp2pt || 0;
        return (
          <span key={comp} title={`${comp}×${qty}`} style={{ marginRight: 8 }}>
            <img src={cimg} alt="" className="itico" />×{qty}
          </span>
        );
      });
      const simg = s?.img || "./icon/nft/na.png";
      return (
        <tr key={shName}>
          <td className="tdcenter" id="iccolumn"><img src={simg} alt="" className="nftico" /></td>
          <td className="tditem">{shName}</td>
          <td className="tdcenter">{compIcons.length ? compIcons : <i>N/A</i>}</td>
          <td className="tditem">{time}</td>
          <td className="tdcenter tooltipcell" style={{ padding: "0 10px" }} onClick={(e) => handleTooltip(shName, "shrinecost", 1, e)}>{compTotal > 0 ? frmtNb(compTotal) : ""}</td>
          <td className="tdcenter tooltipcell" style={{ padding: "0 10px" }} onClick={(e) => handleTooltip(shName, "shrinecost", 1, e)}>{compMTotal > 0 ? frmtNb(compMTotal) : ""}</td>
          <td className="tdcenter">{supply}</td>
          <td className="tditem">{boost}</td>
        </tr>
      );
    });
    return (
      <table className="table">
        <thead>
          <tr>
            <th className="thcenter"></th>
            <th className="thcenter">Shrine</th>
            <th className="thcenter">Components</th>
            <th className="thcenter">Time</th>
            <th className="thcenter">Cost</th>
            <th className="thcenter">{imgExchng}</th>
            <th className="thcenter">Supply</th>
            <th className="thcenter">Boost</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
  if (petView === "components") {
    //const petit = dataSetFarm?.petit || {};
    //const shrine = dataSetFarm?.shrine || {};
    const compToCats = {};
    Object.entries(CATEGORY_ITEMS).forEach(([cat, items]) => {
      items.forEach(it => {
        if (!compToCats[it]) compToCats[it] = [];
        if (!compToCats[it].includes(cat)) compToCats[it].push(cat);
      });
    });
    const compToShrines = {};
    Object.entries(shrine).forEach(([shName, shInfo]) => {
      const compo = shInfo?.compo || {};
      Object.keys(compo).forEach(comp => {
        if (!compToShrines[comp]) compToShrines[comp] = [];
        compToShrines[comp].push(shName);
      });
    });
    const compNames = Object.keys(petit);
    const rows = compNames.map((c, index) => {
      if (c === "Fossil Shell") return null;
      const cinfo = petit[c] || {};
      const cimg = cinfo.img || "./icon/nft/na.png";
      const energy = cinfo.energy || 0;
      const cost = cinfo.cost !== cinfo.costp2pt ? frmtNb(cinfo.cost) : "";
      const cp2pt = cinfo.costp2pt || 0;
      const cstock = cinfo.instock || 0;
      const catArr = compToCats[c] || [];
      const shrineArr = compToShrines[c] || [];
      let totalComp = 0;
      let totalNrg = 0;
      const catIcons = catArr.map(cat => {
        for (let petName in Pets) {
          if (Pets[petName].cat === cat) {
            const ipetNrg = selectedQuantFetch === "pets" ? Pets[petName]?.totnrg : selectedQuantFetch === "petst" ? Pets[petName]?.curnrg : 0;
            let myield = (Pets[petName].lvl > 18 && c === "Acorn") ? 2 : 1;
            myield += (Pets[petName].lvl > 60 && Pets[petName].type === "nft" && c !== "Acorn") ? 1 : 0;
            totalComp += ((ipetNrg || 0) / cinfo.energy) * myield;
            totalNrg += ipetNrg || 0;
          }
        }
        if (c === "Moonfur") return "All";
        const img = CATEGORY_IMG[cat] || "./icon/nft/na.png";
        return (
          <span key={cat} title={cat} style={{ marginRight: 8, display: "inline-flex", alignItems: "center" }}>
            <img src={img} alt={cat} className="nodico" style={{ marginRight: 4 }} />
            {/* <span style={{ fontSize: 11 }}>{cat}</span> */}
          </span>
        );
      });
      const shrineBadges = shrineArr.map(s => (
        <span key={s} className="badge" title={s} style={{ marginRight: 6 }}><img src={shrine[s].img} alt={s} className="nodico" style={{ marginRight: 4 }} /></span>
      ));
      /* if (!customQuantFetch?.[index]) {
        const newcustomQuantFetch = { ...customQuantFetch };
        newcustomQuantFetch[index] = 1;
        setcustomQuantFetch(newcustomQuantFetch);
      } */
      //const customVal = customQuantFetch?.[index] ?? 1;

      const customVal = customQuantFetch?.[c] ?? 1;
      const iQuant =
        (selectedQuantFetch === "pets" || selectedQuantFetch === "petst")
          ? Math.floor(totalComp)
          : selectedQuantFetch === "stock"
            ? cstock
            : customVal;
      //const iQuant = (selectedQuantFetch === "pets" || selectedQuantFetch === "petst") ? Math.floor(totalComp) : selectedQuantFetch === "stock" ? cstock : customQuantFetch[index];
      const iNrg = (selectedQuantFetch === "pets" || selectedQuantFetch === "petst") ? totalNrg : energy * iQuant;
      const iCost = cost * iQuant;
      const iMarket = cp2pt * iQuant;
      return (
        <tr key={c}>
          <td id="iccolumn"><img src={cimg} alt="" className="nodico" /></td>
          <td className="tditem">{c}</td>
          {xListeColBounty[2][1] === 1 ? selectedQuantFetch === "custom" ?
            (<td className="tdcenter">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                style={{ width: "30px", textAlign: "center" }}
                name={`customQuantFetch.${c}`}
                value={customQuantFetch?.[c] ?? 1}
                onChange={handleUIChange}
              /></td>) :
            (<td className="tdcenter">{frmtNb(iQuant)}</td>) : ("")}
          <td className="tdcenter" style={{ padding: "0 10px" }}>{frmtNb(iNrg)}</td>
          <td className="tdcenter" style={{ padding: "0 10px" }} onClick={(e) => handleTooltip(c, "fetchcost", 0, e)}>{frmtNb(iCost)}</td>
          <td className="tdcenter" style={{ padding: "0 10px" }}>{frmtNb(iMarket)}</td>
          <td className="tdcenter">{c === "Moonfur" ? "All NFT" : c === "Acorn" ? "All" : (catIcons.length ? catIcons : <i>N/A</i>)}</td>
          <td className="tdcenter">{c === "Acorn" ? "All" : shrineBadges.length ? shrineBadges : <i>N/A</i>}</td>
        </tr>
      );
    });
    return (
      <table className="table">
        <thead>
          <tr>
            <th className="th-icon"></th>
            <th className="thcenter">Component</th>
            {xListeColBounty[2][1] === 1 ? <th className="thcenter">
              <div className="selectquantityback"><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                <InputLabel>Quantity</InputLabel>
                <Select name="selectedQuantFetch" value={selectedQuantFetch} onChange={handleUIChange} onClick={(e) => e.stopPropagation()}>
                  <MenuItem value="stock">Stock</MenuItem>
                  <MenuItem value="pets">Pets Daily</MenuItem>
                  <MenuItem value="petst">Pets Total</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </Select></FormControl></div></th> : null}
            <th className="thcenter"><img src="./icon/ui/lightning.png" alt="" className="itico" title="Energy" /></th>
            <th className="thcenter">Cost</th>
            <th className="thcenter">{imgExchng}</th>
            <th className="thcenter">Fetched by</th>
            <th className="thcenter">Used in Shrines</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}