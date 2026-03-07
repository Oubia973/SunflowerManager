import React from "react";
import { useAppCtx } from "../context/AppCtx";
import { frmtNb } from '../fct.js';
import DList from "../dlist.jsx";

export default function PetsTable() {
  const {
    data: { dataSet, dataSetFarm },
    ui: {
      xListeColPetPets,
      xListeColPetShrines,
      xListeColPetComponents,
      petView,
      selectedQuantFetch,
      customQuantFetch,
      petFetchSelection,
      petFetchSelectionInitDone,
      petRequestSelection,
      petRequestSelectionInitDone,
      TryChecked
    },
    actions: {
      handleUIChange,
      setUIField,
      handleTooltip,
    },
    img: {
      imgSFL,
      imgExchng,
      imgbuyit
    }
  } = useAppCtx();
  const petPageData = dataSetFarm?.petData || {};
  const Pets = petPageData?.Pets || dataSetFarm?.Pets || {};
  const petTables = { ...(dataSetFarm?.itables || {}), ...(petPageData?.itables || {}) };
  const petBoostables = { ...(dataSetFarm?.boostables || {}), ...(petPageData?.boostables || {}) };
  if (!Pets || !petTables?.it || !petTables?.petit || !petBoostables?.shrine) {
    return <div>Loading pets data...</div>;
  }
  const { it, petit } = petTables;
  const { shrine } = petBoostables;
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
    Cat: ["Acorn", "Ribbon", "Heart leaf", "Fossil Shell"],
    Owl: ["Acorn", "Heart leaf", "Dewberry", "Fossil Shell"],
    Horse: ["Acorn", "Ruffroot", "Wild Grass", "Fossil Shell"],
    Bull: ["Acorn", "Wild Grass", "Frost Pebble", "Fossil Shell"],
    Hamster: ["Acorn", "Dewberry", "Chewed Bone", "Fossil Shell"],
    Penguin: ["Acorn", "Frost Pebble", "Ruffroot", "Fossil Shell"],
    Dragon: ["Acorn", "Frost Pebble", "Chewed Bone", "Moonfur", "Fossil Shell", "Ruffroot"],
    Phoenix: ["Acorn", "Heart leaf", "Ruffroot", "Moonfur", "Fossil Shell", "Ribbon"],
    Griffin: ["Acorn", "Ruffroot", "Dewberry", "Moonfur", "Fossil Shell", "Wild Grass"],
    Ram: ["Acorn", "Ribbon", "Ruffroot", "Moonfur", "Fossil Shell", "Heart leaf"],
    Warthog: ["Acorn", "Wild Grass", "Frost Pebble", "Moonfur", "Fossil Shell", "Ribbon"],
    Wolf: ["Acorn", "Chewed Bone", "Ribbon", "Moonfur", "Fossil Shell", "Dewberry"],
    Bear: ["Acorn", "Dewberry", "Heart leaf", "Moonfur", "Fossil Shell", "Frost Pebble"],
  };
  const compToShrines = {};
  Object.entries(shrine).forEach(([shName, shInfo]) => {
    const compo = shInfo?.compo || {};
    Object.keys(compo).forEach(comp => {
      if (!compToShrines[comp]) compToShrines[comp] = [];
      compToShrines[comp].push(shName);
    });
  });
  const getOwnedPets = () => Object.entries(Pets || {})
    .filter(([, p]) => !!p?.cat && !!p?.[key("minNrgSfl")]);
  const getFetchItemsForCat = (cat) => {
    const items = CATEGORY_ITEMS[cat] || [];
    return items.filter((comp) => comp !== "Fossil Shell" && !!petit?.[comp]);
  };
  const getSelectedFetchListForPet = (petName, cat) => {
    const validItems = getFetchItemsForCat(cat);
    const raw = petFetchSelection?.[petName];
    if (Array.isArray(raw)) return raw.filter((x) => validItems.includes(x));
    if (typeof raw === "string" && validItems.includes(raw)) return [raw];
    return [];
  };
  const REQUEST_SLOTS = ["easy1", "medium1", "medium2", "hard1", "hard2"];
  const getFeedTier = (feed) => {
    if (typeof feed?.tier === "string" && (feed.tier === "easy" || feed.tier === "medium" || feed.tier === "hard")) return feed.tier;
    const e = Number(feed?.energy || 0);
    if (e >= 300) return "hard";
    if (e >= 100) return "medium";
    return "easy";
  };
  const getFeedSlot = (feed) => {
    if (typeof feed?.slot === "string" && REQUEST_SLOTS.includes(feed.slot)) return feed.slot;
    const tier = getFeedTier(feed);
    if (tier === "easy") return "easy1";
    if (tier === "medium") return "medium1";
    return "hard1";
  };
  const getSelectedRequestSlotMapForPet = (petName, petData) => {
    const feeds = Array.isArray(petData?.[key("feeds")]) ? petData[key("feeds")] : Array.isArray(Pets?.[petName]?.[key("feeds")]) ? Pets[petName][key("feeds")] : [];
    const slotMapDefault = { easy1: false, medium1: false, medium2: false, hard1: false, hard2: false };
    feeds.forEach((feed) => {
      const slot = getFeedSlot(feed);
      slotMapDefault[slot] = true;
    });
    const raw = petRequestSelection?.[petName];
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      const next = { ...slotMapDefault };
      REQUEST_SLOTS.forEach((slot) => {
        if (Object.prototype.hasOwnProperty.call(raw, slot)) {
          next[slot] = !!raw[slot];
        }
      });
      // Backward compatibility: old tier map {easy,medium,hard}
      if (Object.prototype.hasOwnProperty.call(raw, "easy")) next.easy1 = !!raw.easy;
      if (Object.prototype.hasOwnProperty.call(raw, "medium")) { next.medium1 = !!raw.medium; next.medium2 = !!raw.medium; }
      if (Object.prototype.hasOwnProperty.call(raw, "hard")) { next.hard1 = !!raw.hard; next.hard2 = !!raw.hard; }
      return next;
    }
    // Legacy compatibility: previous selection stored request names.
    if (Array.isArray(raw)) {
      const next = { easy1: false, medium1: false, medium2: false, hard1: false, hard2: false };
      feeds.forEach((feed) => {
        if (raw.includes(feed?.name)) {
          next[getFeedSlot(feed)] = true;
        }
      });
      return Object.values(next).some(Boolean) ? next : slotMapDefault;
    }
    if (typeof raw === "string") {
      const next = { easy1: false, medium1: false, medium2: false, hard1: false, hard2: false };
      feeds.forEach((feed) => {
        if (feed?.name === raw) {
          next[getFeedSlot(feed)] = true;
        }
      });
      return Object.values(next).some(Boolean) ? next : slotMapDefault;
    }
    return slotMapDefault;
  };
  const getSelectedRequestTotals = (petName, petData, coinsRatio) => {
    const selectedSlotMap = getSelectedRequestSlotMapForPet(petName, petData);
    const feeds = Array.isArray(petData?.[key("feeds")]) ? petData[key("feeds")] : [];
    let selectedCostCoins = 0;
    let selectedCostMarket = 0;
    let selectedEnergyTotal = 0;
    const selectedDetails = [];
    feeds.forEach((feed) => {
      const slot = getFeedSlot(feed);
      const tier = getFeedTier(feed);
      if (!selectedSlotMap?.[slot]) return;
      const feedName = feed?.name;
      const costCoins = Number(feed?.costsfl || 0);
      const market = Number(feed?.costp2p || 0);
      const energy = Number(feed?.energy || 0);
      selectedCostCoins += costCoins;
      selectedCostMarket += market;
      selectedEnergyTotal += energy;
      selectedDetails.push({
        name: feedName || "",
        slot,
        tier,
        img: feed?.img || "./icon/nft/na.png",
        energy,
        cost: costCoins / coinsRatio,
        market,
      });
    });
    return {
      selectedReq: selectedDetails.map((d) => d.name).filter(Boolean),
      selectedSlots: Object.keys(selectedSlotMap).filter((k) => selectedSlotMap[k]),
      selectedCostCoins,
      selectedCostSfl: selectedCostCoins / coinsRatio,
      selectedCostMarket,
      selectedEnergyTotal,
      selectedDetails,
    };
  };
  React.useEffect(() => {
    if (petFetchSelectionInitDone) return;
    if (!petit || Object.keys(petit).length === 0) return;

    const currentSelection = petFetchSelection || {};
    if (Object.keys(currentSelection).length > 0) {
      setUIField("petFetchSelectionInitDone", true);
      return;
    }

    const defaults = {};
    const ownedPets = getOwnedPets();
    ownedPets.forEach(([petName, petData]) => {
      const cat = petData?.cat;
      if (!cat) return;
      const fetchItems = getFetchItemsForCat(cat);
      if (fetchItems.length === 0) return;

      const current = new Set(Array.isArray(defaults[petName]) ? defaults[petName] : []);
      const isNft = petData?.type === "nft";
      const defaultCoreItem = isNft ? "Moonfur" : "Acorn";
      if (fetchItems.includes(defaultCoreItem)) current.add(defaultCoreItem);

      const maxCostItem = fetchItems.reduce((best, item) => {
        const bestCost = Number(petit?.[best]?.costp2pt || 0);
        const itemCost = Number(petit?.[item]?.costp2pt || 0);
        return itemCost > bestCost ? item : best;
      }, fetchItems[0]);
      if (maxCostItem) current.add(maxCostItem);

      defaults[petName] = Array.from(current);
    });

    setUIField("petFetchSelection", defaults);
    setUIField("petFetchSelectionInitDone", true);
  }, [petFetchSelectionInitDone, petFetchSelection, petit, Pets, setUIField]);
  React.useEffect(() => {
    if (petRequestSelectionInitDone) return;
    if (!Pets || Object.keys(Pets).length === 0) return;
    const currentSelection = petRequestSelection || {};
    if (Object.keys(currentSelection).length > 0) {
      setUIField("petRequestSelectionInitDone", true);
      return;
    }
    const defaults = {};
    const ownedPets = getOwnedPets();
    ownedPets.forEach(([petName, petData]) => {
      const feeds = Array.isArray(petData?.feeds) ? petData.feeds : [];
      if (feeds.length > 0) {
        const slotMap = { easy1: false, medium1: false, medium2: false, hard1: false, hard2: false };
        feeds.forEach((feed) => {
          const slot = getFeedSlot(feed);
          slotMap[slot] = true;
        });
        defaults[petName] = slotMap;
      }
    });
    setUIField("petRequestSelection", defaults);
    setUIField("petRequestSelectionInitDone", true);
  }, [petRequestSelectionInitDone, petRequestSelection, Pets, setUIField]);
  const isColVisible = (cols, idx) => cols?.[idx]?.[1] === 1;
  if (petView === "pets") {
    const petCols = xListeColPetPets || [];
    const categories = Object.keys(CATEGORY_ITEMS).flatMap((cat) => {
      const petsInCat = Object.entries(Pets || {}).filter(([, p]) => p?.cat === cat && p?.[key("minNrgSfl")]);
      if (petsInCat.length === 0) return [{ cat, petName: null }];
      return petsInCat.map(([petName]) => ({ cat, petName }));
    });
    const rows = categories.map(({ cat, petName: rowPetName }) => {
      let foodCostTotal = 0;
      let foodCostMTotal = 0;
      const catImgPath = CATEGORY_IMG[cat] || "./icon/nft/na.png";
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
      const fetchItems = getFetchItemsForCat(cat);
      const selectedFetchList = getSelectedFetchListForPet(rowPetName || cat, cat);
      const isOwnedCat = !!rowPetName;
      const iconGreyStyle = isOwnedCat ? {} : { opacity: 0.35 };
      const catImg = <img src={catImgPath} alt="" className="nftico" title={cat} style={iconGreyStyle} />;
      const rowPet = rowPetName ? Pets?.[rowPetName] : null;
      const selectedSlotMap = rowPetName ? getSelectedRequestSlotMapForPet(rowPetName, rowPet) : { easy1: true, medium1: true, medium2: true, hard1: true, hard2: true };
      if (rowPet && rowPet.cat === cat && rowPet[key("minNrgSfl")]) {
        const reqTotals = getSelectedRequestTotals(rowPetName, rowPet, dataSet.options.coinsRatio);
        requests.push(...(reqTotals.selectedReq || []));
        const feeds = Array.isArray(rowPet[key("feeds")]) ? rowPet[key("feeds")] : [];
        petFeeds = feeds.map((feed, reqp) => {
          const feedSlot = getFeedSlot(feed);
          const feedTier = getFeedTier(feed);
          const isChecked = !!selectedSlotMap?.[feedSlot];
          return (
            <button
              key={`${rowPetName}-${reqp}-${feed?.name || "req"}-${feedSlot}`}
              type="button"
              title={`${feed?.name || ""} [${feedSlot}]${isChecked ? " (selected)" : ""}`}
              onClick={() => {
                setUIField("petRequestSelection", (prev) => ({
                  ...(prev || {}),
                  [rowPetName]: {
                    ...selectedSlotMap,
                    [feedSlot]: !isChecked,
                  },
                }));
              }}
              style={{
                marginRight: 4,
                padding: 0,
                border: isChecked ? "1px solid #7ea76b" : "1px solid transparent",
                borderRadius: 3,
                background: "transparent",
                cursor: "pointer",
                lineHeight: 0,
              }}
            >
              <img
                src={feed?.img || "./icon/nft/na.png"}
                alt=""
                className="itico"
                title={`${feed?.name || ""} [${feedSlot}]`}
              />
            </button>
          );
        });
        if (Pets[cat]) { supply = Pets[cat].supply || 0; }
        petLvl = rowPet.lvl || 0;
        aura = rowPet.aura || "";
        bib = rowPet?.bib === "Collar" ? "+5xp" : rowPet?.bib === "Gold Necklace" ? "+10xp" : "";
        curNrg = rowPet.curnrg || 0;
        const isBaseEnergyInfinity = !Number.isFinite(rowPet[key("nrgsfl")]) && Number(rowPet[key("nrgsfl")]) > 0;
        foodCostTotal = reqTotals.selectedCostCoins;
        foodCostMTotal = reqTotals.selectedCostMarket;
        totalNrg = Number(reqTotals.selectedEnergyTotal || 0);
        energySfl = isBaseEnergyInfinity
          ? Infinity
          : (foodCostTotal > 0 ? ((totalNrg / foodCostTotal) * dataSet.options.coinsRatio) : 0);
        energyMSfl = isBaseEnergyInfinity
          ? Infinity
          : (foodCostMTotal > 0 ? (totalNrg / foodCostMTotal) : 0);
      } else {
        for (let petName in Pets) {
          if (Pets[petName].cat === cat && Pets[petName][key("minNrgSfl")]) {
            requests.push(...(Pets[petName].req || []));
            if (Pets[cat]) { supply = Pets[cat].supply || 0; }
            break;
          }
        }
      }
      const itemIcons = fetchItems.map(comp => {
        const cimg = petit?.[comp]?.img || "./icon/nft/na.png";
        const isChecked = selectedFetchList.includes(comp);
        if (!isOwnedCat) {
          return (
            <span key={comp} title={comp} style={{ marginRight: 4, display: "inline-flex", alignItems: "center" }}>
              <img src={cimg} alt="" className="itico" style={iconGreyStyle} />
            </span>
          );
        }
        return (
          <button
            key={comp}
            type="button"
            title={`${comp}${isChecked ? " (selected)" : ""}`}
            onClick={() => {
              setUIField("petFetchSelection", (prev) => ({
                ...(prev || {}),
                [rowPetName || cat]: isChecked
                  ? selectedFetchList.filter((x) => x !== comp)
                  : [...selectedFetchList, comp],
              }));
            }}
            style={{
              marginRight: 4,
              padding: 0,
              border: isChecked ? "1px solid #7ea76b" : "1px solid transparent",
              borderRadius: 3,
              background: "transparent",
              cursor: "pointer",
              lineHeight: 0,
            }}
          >
            <img src={cimg} alt="" className="itico" />
          </button>
        );
      });
      const hasRequestTooltip = petFeeds.length > 0 && requests.length > 0;
      return (
        <tr key={`${cat}-${rowPetName || "none"}`}>
          <td className="tdcenter" id="iccolumn">{catImg}</td>
          {isColVisible(petCols, 0) ? <td className="tditem">{(rowPetName && Pets[rowPetName]?.type === "nft") ? cat : (rowPetName || cat)}</td> : null}
          {isColVisible(petCols, 1) ? <td className="tdcenter">{itemIcons.length ? itemIcons : <i>N/A</i>}</td> : null}
          {isColVisible(petCols, 2) ? <td className="tdcenter" style={{ padding: "0 10px" }}>{supply ? supply : ""}</td> : null}
          {isColVisible(petCols, 3) ? <td className="tdcenter" style={{ padding: "0 10px" }}>{petLvl > 0 ? petLvl : ""}</td> : null}
          {isColVisible(petCols, 4) ? <td className="tdcenter" style={{ padding: "0 10px" }}>{aura}</td> : null}
          {isColVisible(petCols, 5) ? <td className="tdcenter" style={{ padding: "0 10px" }}>{bib}</td> : null}
          {isColVisible(petCols, 6) ? <td className="tdcenter" style={{ padding: "0 10px" }}>{curNrg > 0 ? curNrg : ""}</td> : null}
          {/* <td className="tdcenter" style={{ padding: "0 10px" }}>{petExp > 0 ? petExp : ""}</td> */}
          {isColVisible(petCols, 7) ? <td className="tdcenter" style={{ fontSize: "12px" }}>{petFeeds}</td> : null}
          {isColVisible(petCols, 8) ? <td className="tdcenter" style={{ padding: "0 10px" }}>{totalNrg > 0 ? totalNrg : ""}</td> : null}
          {isColVisible(petCols, 9) ? <td className="tdcenter tooltipcell" style={{ padding: "0 10px" }} onClick={hasRequestTooltip ? (e) => handleTooltip(requests, "cookcost", 1, e) : undefined}>
            {petFeeds.length ? frmtNb(foodCostTotal / dataSet.options.coinsRatio) : ""}</td> : null}
          {isColVisible(petCols, 10) ? <td className="tdcenter tooltipcell" style={{ padding: "0 10px" }} onClick={hasRequestTooltip ? (e) => handleTooltip(requests, "cookcost", 1, e) : undefined}
          >{petFeeds.length ? frmtNb(foodCostMTotal) : ""}</td> : null}
          {isColVisible(petCols, 11) ? <td className="tdcenter" style={{ padding: "0 10px" }}>{petFeeds.length > 0 ? (Number.isFinite(energySfl) ? (energySfl > 0 ? frmtNb(energySfl) : "") : "inf") : ""}</td> : null}
          {isColVisible(petCols, 12) ? <td className="tdcenter" style={{ padding: "0 10px" }}>{petFeeds.length > 0 ? (Number.isFinite(energyMSfl) ? ((energyMSfl > 0 && foodCostMTotal > 0) ? frmtNb(energyMSfl) : "") : "inf") : ""}</td> : null}
        </tr>
      );
    });
    return (
      <table className="table">
        <thead>
          <tr>
            <th className="thcenter"></th>
            {isColVisible(petCols, 0) ? <th className="thcenter">Pet</th> : null}
            {isColVisible(petCols, 1) ? <th className="thcenter">Fetch</th> : null}
            {isColVisible(petCols, 2) ? <th className="thcenter">Supply</th> : null}
            {isColVisible(petCols, 3) ? <th className="thcenter">Lvl</th> : null}
            {isColVisible(petCols, 4) ? <th className="thcenter">Aura</th> : null}
            {isColVisible(petCols, 5) ? <th className="thcenter">Bib</th> : null}
            {isColVisible(petCols, 6) ? <th className="thcenter">Current <img src="./icon/ui/lightning.png" alt="" className="itico" title="Energy" /></th> : null}
            {/* <th className="thcenter">Exp</th> */}
            {isColVisible(petCols, 7) ? <th className="thcenter">Requests</th> : null}
            {isColVisible(petCols, 8) ? <th className="thcenter"><img src="./icon/ui/lightning.png" alt="" className="itico" title="Energy" /></th> : null}
            {isColVisible(petCols, 9) ? <th className="thcenter">Cost</th> : null}
            {isColVisible(petCols, 10) ? <th className="thcenter">Prod {imgbuyit}</th> : null}
            {isColVisible(petCols, 11) ? <th className="thcenter"><img src="./icon/ui/lightning.png" alt="" className="itico" title="Energy" />/{imgSFL}</th> : null}
            {isColVisible(petCols, 12) ? <th className="thcenter"><img src="./icon/ui/lightning.png" alt="" className="itico" title="Energy" />/{imgbuyit}</th> : null}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
  if (petView === "shrines") {
    const shrineCols = xListeColPetShrines || [];
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
        if (it[comp]) { itemTable = it; }
        if (petit[comp]) { itemTable = petit; }
        let cimg = itemTable?.[comp]?.img || "./icon/nft/na.png";
        //let coinRatioOrNot = (itemTable !== petit) ? dataSet.options.coinsRatio : 1;
        compTotal += qty * ((itemTable?.[comp]?.[key("cost")] || 0) / dataSet.options.coinsRatio);
        compMTotal += qty * itemTable?.[comp]?.costp2pt || 0;
        return (
          <span key={comp} title={`${comp}x${qty}`} style={{ marginRight: 8 }}>
            <img src={cimg} alt="" className="itico" />x{qty}
          </span>
        );
      });
      const simg = s?.img || "./icon/nft/na.png";
      return (
        <tr key={shName}>
          <td className="tdcenter" id="iccolumn"><img src={simg} alt="" className="nftico" /></td>
          {isColVisible(shrineCols, 0) ? <td className="tditem">{shName}</td> : null}
          {isColVisible(shrineCols, 1) ? <td className="tdcenter">{compIcons.length ? compIcons : <i>N/A</i>}</td> : null}
          {isColVisible(shrineCols, 2) ? <td className="tditem">{time}</td> : null}
          {isColVisible(shrineCols, 3) ? <td className="tdcenter tooltipcell" style={{ padding: "0 10px" }} onClick={(e) => handleTooltip(shName, "shrinecost", 1, e)}>{compTotal > 0 ? frmtNb(compTotal) : ""}</td> : null}
          {isColVisible(shrineCols, 4) ? <td className="tdcenter tooltipcell" style={{ padding: "0 10px" }} onClick={(e) => handleTooltip(shName, "shrinecost", 1, e)}>{compMTotal > 0 ? frmtNb(compMTotal) : ""}</td> : null}
          {isColVisible(shrineCols, 5) ? <td className="tdcenter">{supply}</td> : null}
          {isColVisible(shrineCols, 6) ? <td className="tditem">{boost}</td> : null}
        </tr>
      );
    });
    return (
      <table className="table">
        <thead>
          <tr>
            <th className="thcenter"></th>
            {isColVisible(shrineCols, 0) ? <th className="thcenter">Shrine</th> : null}
            {isColVisible(shrineCols, 1) ? <th className="thcenter">Components</th> : null}
            {isColVisible(shrineCols, 2) ? <th className="thcenter">Time</th> : null}
            {isColVisible(shrineCols, 3) ? <th className="thcenter">Cost</th> : null}
            {isColVisible(shrineCols, 4) ? <th className="thcenter">{imgExchng}</th> : null}
            {isColVisible(shrineCols, 5) ? <th className="thcenter">Supply</th> : null}
            {isColVisible(shrineCols, 6) ? <th className="thcenter">Boost</th> : null}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
  if (petView === "components") {
    const compCols = xListeColPetComponents || [];
    //const petit = dataSetFarm?.petit || {};
    //const shrine = dataSetFarm?.shrine || {};
    const ownedCats = new Set(getOwnedPets().map(([, p]) => p?.cat).filter(Boolean));
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
      const itemMyield = Number(cinfo[key("myield")] ?? cinfo.myield ?? 1) || 1;
      const unitCost = Number(cinfo[key("cost")] || 0) / dataSet.options.coinsRatio;
      const cp2pt = cinfo.costp2pt || 0;
      const cstock = cinfo.instock || 0;
      const byPetYield = cinfo[key("bypet")] ?? cinfo.bypet ?? {};
      const catArr = compToCats[c] || [];
      const shrineArr = compToShrines[c] || [];
      const selectedPetYields = Object.entries(Pets || {})
        .filter(([petName, petData]) => {
          if (!petData?.cat || !catArr.includes(petData.cat)) return false;
          if (!petData?.[key("minNrgSfl")]) return false;
          const selectedList = getSelectedFetchListForPet(petName, petData.cat);
          return selectedList.includes(c);
        })
        .map(([petName]) => ({
          petName,
          y: Number(byPetYield?.[petName]?.y ?? 0),
          d: Array.isArray(byPetYield?.[petName]?.d) ? byPetYield[petName].d : [],
        }));
      const bestSelectedPetYield = selectedPetYields.reduce((best, cur) => {
        if (!best) return cur;
        if (cur.y > best.y) return cur;
        if (cur.y === best.y && cur.petName < best.petName) return cur;
        return best;
      }, null);
      const displayedYield = Number(bestSelectedPetYield?.y ?? itemMyield) || itemMyield;
      let totalComp = 0;
      let totalNrg = 0;
      const catIcons = catArr.map(cat => {
        let hasSelectedForComp = false;
        for (let petName in Pets) {
          if (Pets[petName].cat === cat && Pets[petName][key("minNrgSfl")]) {
            const selectedListForPet = getSelectedFetchListForPet(petName, cat);
            const isSelectedForComp = selectedListForPet.includes(c);
            if (isSelectedForComp) hasSelectedForComp = true;
            if (!isSelectedForComp) continue;
            const reqTotals = getSelectedRequestTotals(petName, Pets[petName], dataSet.options.coinsRatio);
            const dailySelectedNrg = Number(reqTotals.selectedEnergyTotal || 0);
            const curEnergy = Number(Pets[petName]?.curnrg || 0);
            const ipetNrg = selectedQuantFetch === "pets"
              ? dailySelectedNrg
              : selectedQuantFetch === "petst"
                ? curEnergy
                : 0;
            const myield = Number(byPetYield?.[petName]?.y ?? itemMyield) || itemMyield;
            totalComp += ((ipetNrg || 0) / cinfo.energy) * myield;
            totalNrg += ipetNrg || 0;
          }
        }
        if (c === "Moonfur") return "All";
        const isGreyed = !hasSelectedForComp;
        const img = CATEGORY_IMG[cat] || "./icon/nft/na.png";
        return (
          <span key={cat} title={cat} style={{ marginRight: 8, display: "inline-flex", alignItems: "center", opacity: isGreyed ? 0.35 : 1 }}>
            <img src={img} alt={cat} className="nodico" style={{ marginRight: 4 }} />
            {/* <span style={{ fontSize: 11 }}>{cat}</span> */}
          </span>
        );
      });
      const selectedCatIcons = catArr
        .filter((cat) => ownedCats.has(cat) && Object.entries(Pets || {}).some(([petName, petData]) => (
          petData?.cat === cat
          && petData?.[key("minNrgSfl")]
          && getSelectedFetchListForPet(petName, cat).includes(c)
        )))
        .map((cat) => {
          const img = CATEGORY_IMG[cat] || "./icon/nft/na.png";
          return (
            <span key={`selected-${cat}`} title={cat} style={{ marginRight: 8, display: "inline-flex", alignItems: "center" }}>
              <img src={img} alt={cat} className="nodico" style={{ marginRight: 4 }} />
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
        selectedQuantFetch === "pets"
          ? totalComp
          : selectedQuantFetch === "petst"
            ? Math.floor(totalComp)
          : selectedQuantFetch === "stock"
            ? cstock
            : customVal;
      //const iQuant = (selectedQuantFetch === "pets" || selectedQuantFetch === "petst") ? Math.floor(totalComp) : selectedQuantFetch === "stock" ? cstock : customQuantFetch[index];
      const iNrg = (selectedQuantFetch === "pets" || selectedQuantFetch === "petst") ? totalNrg : energy * iQuant;
      const producerPets = Object.entries(Pets || {})
        .filter(([, petData]) => !!petData?.[key("minNrgSfl")] && catArr.includes(petData?.cat))
        .map(([petName, petData]) => {
          const selectedListForPet = getSelectedFetchListForPet(petName, petData?.cat);
          const isSelectedForComp = selectedListForPet.includes(c);
          const contributesNow = isSelectedForComp;
          const reqTotals = getSelectedRequestTotals(petName, petData, dataSet.options.coinsRatio);
          const selectedDailyNrg = Number(reqTotals.selectedEnergyTotal || 0);
          const fullDailyNrg = Number(petData?.[key("totnrg")] || 0);
          const petEnergyNow = selectedQuantFetch === "pets"
            ? selectedDailyNrg
            : selectedQuantFetch === "petst"
              ? Number(petData?.curnrg || 0)
              : 0;
          const petEnergyBase = Number(selectedQuantFetch === "petst" ? fullDailyNrg : selectedDailyNrg);
          const itemYield = itemMyield;
          const petYield = Number(byPetYield?.[petName]?.y ?? itemYield) || itemYield;
          const petBonusYield = Math.max(0, petYield - itemYield);
          const petQtyNow = contributesNow && energy > 0 ? ((petEnergyNow / energy) * petYield) : 0;
          const reqEnergyTotal = Number(selectedDailyNrg || 0);
          const petReqCost = Number(reqTotals.selectedCostSfl || 0);
          const petReqMarket = Number(reqTotals.selectedCostMarket || 0);
          const reqDetails = reqTotals.selectedDetails;
          const qtyFromReqEnergy = (energy > 0) ? ((reqEnergyTotal / energy) * petYield) : 0;
          const unitProdCost = qtyFromReqEnergy > 0 ? (petReqCost / qtyFromReqEnergy) : 0;
          const unitProdMarket = qtyFromReqEnergy > 0 ? (petReqMarket / qtyFromReqEnergy) : 0;
          const energyDen = reqEnergyTotal > 0 ? reqEnergyTotal : 0;
          const petCostNow = (contributesNow && energyDen > 0) ? (petEnergyNow * (petReqCost / energyDen)) : 0;
          const petMarketNow = (contributesNow && energyDen > 0) ? (petEnergyNow * (petReqMarket / energyDen)) : 0;
          return {
            petName,
            cat: petData?.cat || "",
            isNft: petData?.type === "nft",
            img: petData?.img || CATEGORY_IMG[petData?.cat] || "./icon/nft/na.png",
            selected: isSelectedForComp,
            contributesNow,
            energyNow: Number(petEnergyNow || 0),
            qtyNow: Number(petQtyNow || 0),
            energyBase: Number(petEnergyBase || 0),
            yieldBase: Number(petYield || 1),
            yieldItem: Number(itemYield || 1),
            yieldPetBonus: Number(petBonusYield || 0),
            reqCost: Number(petReqCost || 0),
            reqMarket: Number(petReqMarket || 0),
            reqEnergyTotal: Number(reqEnergyTotal || 0),
            unitProdCost: Number(unitProdCost || 0),
            unitProdMarket: Number(unitProdMarket || 0),
            costNow: Number(petCostNow || 0),
            marketNow: Number(petMarketNow || 0),
            reqDetails,
          };
        });
      const dynamicCostTotal = producerPets.reduce((acc, p) => acc + Number(p?.costNow || 0), 0);
      const dynamicProdMarketTotal = producerPets.reduce((acc, p) => acc + Number(p?.marketNow || 0), 0);
      const selectedProducersForUnit = producerPets.filter((p) => !!p?.contributesNow);
      const cheapestFallbackProducer = producerPets
        .filter((p) => Number(p?.unitProdCost || 0) > 0)
        .sort((a, b) => Number(a?.unitProdCost || 0) - Number(b?.unitProdCost || 0))[0];
      const baseProducersForUnit = selectedProducersForUnit.length > 0
        ? selectedProducersForUnit
        : (cheapestFallbackProducer ? [cheapestFallbackProducer] : []);
      const selectedUnitProdCost = baseProducersForUnit.length > 0
        ? (baseProducersForUnit.reduce((acc, p) => acc + Number(p?.unitProdCost || 0), 0) / baseProducersForUnit.length)
        : 0;
      const selectedUnitProdMarket = baseProducersForUnit.length > 0
        ? (baseProducersForUnit.reduce((acc, p) => acc + Number(p?.unitProdMarket || 0), 0) / baseProducersForUnit.length)
        : 0;
      const dynamicUnitProdCost = totalComp > 0 ? (dynamicCostTotal / totalComp) : 0;
      const dynamicUnitProdMarket = totalComp > 0 ? (dynamicProdMarketTotal / totalComp) : 0;
      const unitProdCostForMode = (selectedQuantFetch === "pets" || selectedQuantFetch === "petst")
        ? (dynamicUnitProdCost > 0 ? dynamicUnitProdCost : (selectedUnitProdCost > 0 ? selectedUnitProdCost : unitCost))
        : (selectedUnitProdCost > 0 ? selectedUnitProdCost : unitCost);
      const unitProdMarketForMode = (selectedQuantFetch === "pets" || selectedQuantFetch === "petst")
        ? (dynamicUnitProdMarket > 0 ? dynamicUnitProdMarket : selectedUnitProdMarket)
        : selectedUnitProdMarket;
      const iCost = unitProdCostForMode * iQuant;
      const iProdMarket = unitProdMarketForMode * iQuant;
      // Marketplace column is the buy price of the fetched component itself.
      const iMarket = cp2pt * iQuant;
      const unitCostDisplay = iQuant > 0
        ? (iCost / iQuant)
        : (selectedUnitProdCost > 0 ? selectedUnitProdCost : unitCost);
      const unitProdMarketDisplay = iQuant > 0
        ? (iProdMarket / iQuant)
        : selectedUnitProdMarket;
      const fetchCostTooltip = {
        quantMode: selectedQuantFetch,
        quantity: Number(iQuant || 0),
        energyUnit: Number(energy || 0),
        energyTotal: Number(iNrg || 0),
        unitCost: Number(unitCostDisplay || 0),
        totalCost: Number(iCost || 0),
        unitProdMarket: Number(unitProdMarketDisplay || 0),
        totalProdMarket: Number(iProdMarket || 0),
        unitMarket: Number(cp2pt || 0),
        totalMarket: Number(iMarket || 0),
        producers: producerPets,
      };
      const yieldTooltip = {
        type: "petityield",
        totalYield: Number(displayedYield || 1),
        details: bestSelectedPetYield?.d?.length
          ? bestSelectedPetYield.d
          : (cinfo?.[key("myielddetail")] ?? cinfo?.myielddetail ?? []),
        petName: bestSelectedPetYield?.petName || null,
      };
      return (
        <tr key={c}>
          <td id="iccolumn"><img src={cimg} alt="" className="nodico" /></td>
          {isColVisible(compCols, 0) ? <td className="tditem">{c}</td> : null}
          {isColVisible(compCols, 1) ? selectedQuantFetch === "custom" ?
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
            (<td className="tdcenter">{selectedQuantFetch === "pets" ? Number(iQuant || 0).toFixed(2) : frmtNb(iQuant)}</td>) : ("")}
          {isColVisible(compCols, 2) ? <td className="tdcenter" style={{ padding: "0 10px" }}>{frmtNb(iNrg)}</td> : null}
          {isColVisible(compCols, 3) ? <td className="tdcenter tooltipcell" style={{ padding: "0 10px" }} onClick={(e) => handleTooltip(c, "trynft", yieldTooltip, e)}>{Number(displayedYield || 0).toFixed(2)}</td> : null}
          {isColVisible(compCols, 4) ? <td className="tdcenter tooltipcell" style={{ padding: "0 10px" }} onClick={(e) => handleTooltip(c, "fetchcost", fetchCostTooltip, e)}>{iCost > 0 ? frmtNb(iCost) : ""}</td> : null}
          {isColVisible(compCols, 5) ? <td className="tdcenter tooltipcell" style={{ padding: "0 10px" }} onClick={(e) => handleTooltip(c, "fetchcost", fetchCostTooltip, e)}>{iProdMarket > 0 ? frmtNb(iProdMarket) : ""}</td> : null}
          {isColVisible(compCols, 6) ? <td className="tdcenter tooltipcell" style={{ padding: "0 10px" }} onClick={(e) => handleTooltip(c, "fetchcost", fetchCostTooltip, e)}>{frmtNb(iMarket)}</td> : null}
          {isColVisible(compCols, 7) ? <td className="tdcenter">
            {c === "Moonfur"
              ? (selectedCatIcons.length ? selectedCatIcons : "All NFT")
              : c === "Acorn"
                ? (selectedCatIcons.length ? selectedCatIcons : "All")
                : (catIcons.length ? catIcons : <i>N/A</i>)}
          </td> : null}
          {isColVisible(compCols, 8) ? <td className="tdcenter">{c === "Acorn" ? "All" : shrineBadges.length ? shrineBadges : <i>N/A</i>}</td> : null}
        </tr>
      );
    });
    return (
      <table className="table">
        <thead>
          <tr>
            <th className="th-icon"></th>
            {isColVisible(compCols, 0) ? <th className="thcenter">Component</th> : null}
            {isColVisible(compCols, 1) ? <th className="thcenter">
              {/* <div className="selectquantityback"><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                <InputLabel>Quantity</InputLabel>
                <Select name="selectedQuantFetch" value={selectedQuantFetch} onChange={handleUIChange} onClick={(e) => e.stopPropagation()}>
                  <MenuItem value="stock">Stock</MenuItem>
                  <MenuItem value="pets">Pets Daily</MenuItem>
                  <MenuItem value="petst">Pets Total</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </Select></FormControl></div> */}
              <DList
                name="selectedQuantFetch"
                title="Quantity"
                options={[
                  { value: "stock", label: "Stock" },
                  { value: "pets", label: "Pets Daily" },
                  { value: "petst", label: "Pets Total" },
                  { value: "custom", label: "Custom" },
                ]}
                value={selectedQuantFetch}
                onChange={handleUIChange}
                height={28}
              />
            </th> : null}
            {isColVisible(compCols, 2) ? <th className="thcenter"><img src="./icon/ui/lightning.png" alt="" className="itico" title="Energy" /></th> : null}
            {isColVisible(compCols, 3) ? <th className="thcenter">Yield</th> : null}
            {isColVisible(compCols, 4) ? <th className="thcenter">Cost</th> : null}
            {isColVisible(compCols, 5) ? <th className="thcenter">Prod {imgbuyit}</th> : null}
            {isColVisible(compCols, 6) ? <th className="thcenter">{imgExchng}</th> : null}
            {isColVisible(compCols, 7) ? <th className="thcenter">Fetched by</th> : null}
            {isColVisible(compCols, 8) ? <th className="thcenter">Used in Shrines</th> : null}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

