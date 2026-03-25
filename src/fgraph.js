import React, { useState, useEffect } from 'react';
import Graph from './graph.js';
import DList from "./dlist.jsx";

function downsampleGraphResponse(rows, graphRange) {
  if (!Array.isArray(rows) || rows.length === 0) return [];

  const stepMsByRange = {
    "7d": 12 * 60 * 60 * 1000,
    "3m": 3 * 24 * 60 * 60 * 1000,
  };
  const stepMs = stepMsByRange[graphRange];
  if (!stepMs) return rows;

  const rowsById = new Map();
  for (const row of rows) {
    const idKey = String(row?.id ?? "");
    if (!rowsById.has(idKey)) rowsById.set(idKey, []);
    rowsById.get(idKey).push(row);
  }

  const sampled = [];
  for (const idRows of rowsById.values()) {
    const sorted = [...idRows].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let lastKeptTs = null;

    for (let i = 0; i < sorted.length; i += 1) {
      const row = sorted[i];
      const ts = new Date(row.date).getTime();
      if (!Number.isFinite(ts)) {
        sampled.push(row);
        continue;
      }
      const isLast = i === sorted.length - 1;
      if (lastKeptTs === null || (ts - lastKeptTs) >= stepMs || isLast) {
        sampled.push(row);
        lastKeptTs = ts;
      }
    }
  }

  return sampled;
}

function extractGraphMetaFromFarmState(farmState) {
  const sources = [
    farmState,
    farmState?.invData,
    farmState?.cookData,
    farmState?.fishData,
    farmState?.bountyData,
    farmState?.craftData,
    farmState?.flowerData,
    farmState?.expandPageData,
    farmState?.animalData,
    farmState?.petData,
    farmState?.mapData,
    farmState?.cropMachineData,
    farmState?.buyNodesData,
  ];
  const out = {};
  const upsert = (itemName, itemData) => {
    const id = Number(itemData?.id);
    if (!Number.isFinite(id)) return;
    out[id] = {
      id,
      name: itemName,
      color: itemData?.color || "#6b7280",
      cat: itemData?.cat || "",
      img: itemData?.img || "./icon/nft/na.png",
      active: Number(itemData?.supply || 0),
      inactive: Number(itemData?.inactive || 0),
      listed: Number(itemData?.listed || 0),
    };
  };
  sources.forEach((src) => {
    const tables = src?.itables;
    if (!tables || typeof tables !== "object") return;
    const it = tables?.it || {};
    const petit = tables?.petit || {};
    Object.keys(it).forEach((name) => upsert(name, it[name]));
    Object.keys(petit).forEach((name) => upsert(name, petit[name]));
  });
  return out;
}

function ModalGraph({ onClose, graphtype, frmid, dataSetFarm, API_URL, username }) {
  const GRAPH_CATEGORY_KEYS = ["all", "crops", "wood minerals", "fruits honey", "animals", "pets", "boost"];
  const [chartData, setChartData] = useState([]);
  const [sharedChartData, setSharedChartData] = useState([]);
  const [boostChartData, setBoostChartData] = useState([]);
  const [boostDataCache, setBoostDataCache] = useState({});
  const [Graphstartdate, setGraphstartdate] = useState('31d');
  const [selectedCategory, setSelectedCategory] = useState('crops');
  const [legendResetToken, setLegendResetToken] = useState(0);
  const [graphMetaById, setGraphMetaById] = useState({});
  const [graphLoadingCount, setGraphLoadingCount] = useState(0);
  const isGraphLoading = graphLoadingCount > 0;
  const visibleCategoryKeys = GRAPH_CATEGORY_KEYS.filter((category) => category !== "all");
  useEffect(() => {
    const localMeta = extractGraphMetaFromFarmState(dataSetFarm);
    if (!localMeta || Object.keys(localMeta).length < 1) return;
    setGraphMetaById((prev) => ({ ...localMeta, ...(prev || {}) }));
  }, [dataSetFarm]);
  const closeModal = () => {
    onClose();
  };
  const [vals, setVals] = useState("price");
  const handlePriceClick = () => {
    //graphtype = "Marketplace";
    //ReqGraph();
    setVals("price");
  };
  const handleSupplyClick = () => {
    //graphtype = "OpenSea";
    //ReqGraph();
    setVals("supply");
  };
  const handleTradesClick = () => {
    setVals("ntrade");
  };
  const handleChangeGraphdate = (event) => {
    const selectedValue = event.target.value;
    setGraphstartdate(selectedValue);
  };
  async function ReqGraph(fetchMode = "shared") {
    try {
      const boostCacheKey = `${String(graphtype || "")}|${String(Graphstartdate || "")}`;
      if (fetchMode === "boost" && Array.isArray(boostDataCache?.[boostCacheKey])) {
        setBoostChartData(boostDataCache[boostCacheKey]);
        return;
      }
      setGraphLoadingCount((prev) => prev + 1);

      let graphstart = "";
      var xformdate = "";
      let xinterval = "";
      if (Graphstartdate === "24h") {
        const currentDate = new Date();
        graphstart = new Date(currentDate);
        graphstart.setDate(currentDate.getDate() - 1);
        xformdate = "H";
      }
      if (Graphstartdate === "7d") {
        const currentDate = new Date();
        graphstart = new Date(currentDate);
        graphstart.setDate(currentDate.getDate() - 7);
        xformdate = "H";
        xinterval = "12h";
      }
      if (Graphstartdate === "31d") {
        const currentDate = new Date();
        graphstart = new Date(currentDate);
        graphstart.setDate(currentDate.getDate() - 31);
        xformdate = "D";
      }
      if (Graphstartdate === "3m") {
        const currentDate = new Date();
        graphstart = new Date(currentDate);
        graphstart.setDate(currentDate.getDate() - 93);
        xformdate = "D";
        xinterval = "3d";
      }
      let fetchtype = "";
      if (fetchMode === "boost") {
        fetchtype = API_URL + "/getHB";
      } else {
        if (graphtype === "Marketplace") { fetchtype = API_URL + "/getHT" }
        if (graphtype === "Nifty") { fetchtype = API_URL + "/getHN" }
        if (graphtype === "OpenSea") { fetchtype = API_URL + "/getHO" }
      }
      const response = await fetch(fetchtype, {
        method: 'GET',
        headers: {
          xformdate: xformdate,
          xinterval: xinterval,
          xgraphdate: graphstart.toISOString(),
          frmid: frmid,
          username: username,
          xsource: graphtype,
        }
      });
      if (response.ok) {
        const responseData = await response.json();
        const sampledRows = (fetchMode === "boost")
          ? (Array.isArray(responseData) ? responseData : [])
          : downsampleGraphResponse(responseData, Graphstartdate);
        if (fetchMode === "boost") {
          setBoostChartData(sampledRows);
          setBoostDataCache((prev) => ({ ...(prev || {}), [boostCacheKey]: sampledRows }));
        } else {
          setSharedChartData(sampledRows);
        }

        const localMeta = extractGraphMetaFromFarmState(dataSetFarm);
        const nextMeta = { ...localMeta, ...graphMetaById };
        const rowIds = [...new Set(sampledRows.map((row) => Number(row?.id)).filter((id) => Number.isFinite(id)))];
        const missingIds = rowIds.filter((id) => !nextMeta[id]);
        const idsToFetch = fetchMode === "boost" ? rowIds : missingIds;
        if (idsToFetch.length > 0) {
          const metaResp = await fetch(API_URL + "/getGraphMeta", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              frmid: frmid,
              username: username
            },
            body: JSON.stringify({ ids: idsToFetch })
          });
          if (metaResp.ok) {
            const payload = await metaResp.json();
            const fetched = (payload && typeof payload === "object" && payload.items && typeof payload.items === "object")
              ? payload.items
              : {};
            Object.keys(fetched).forEach((idKey) => {
              nextMeta[idKey] = fetched[idKey];
            });
          }
        }
        setGraphMetaById(nextMeta);
      } else {
        console.log(`Error : ${response.status}`);
      }
    } catch (error) {
      console.log(`Error : ${error}`);
    } finally {
      setGraphLoadingCount((prev) => Math.max(0, prev - 1));
    }
  }
  useEffect(() => {
    ReqGraph("shared");
  }, [Graphstartdate, graphtype]);

  useEffect(() => {
    if (selectedCategory !== "boost") return;
    ReqGraph("boost");
  }, [selectedCategory, Graphstartdate, graphtype]);

  useEffect(() => {
    setChartData(selectedCategory === "boost" ? boostChartData : sharedChartData);
  }, [selectedCategory, boostChartData, sharedChartData]);
  return (
    <div className="modalgraph">
      <div className="modalgraph-buttons">
        <div className="modalgraph-header-left">
          <button onClick={closeModal} class="button"><img src="./icon/ui/cancel.png" alt="" className="resico" /></button>
          <button type="button" onClick={handlePriceClick} className={`graph-mode-btn ${vals === "price" ? "is-active" : ""}`}>Prices</button>
          <button type="button" onClick={handleSupplyClick} className={`graph-mode-btn ${vals === "supply" ? "is-active" : ""}`}>Supply</button>
          <DList
            name="Graphstartdate"
            title="Graph period"
            options={[
              { value: "24h", label: "24h" },
              { value: "7d", label: "7 days" },
              { value: "31d", label: "1 month" },
              { value: "3m", label: "3 month" },
            ]}
            value={Graphstartdate}
            onChange={handleChangeGraphdate}
            height={22}
          />
          <button type="button" className="graph-mode-btn graph-mode-btn-reset" onClick={() => setLegendResetToken((prev) => prev + 1)}>Reset</button>
        </div>
        <div className="modalgraph-header-right">
          {visibleCategoryKeys.map((category) => (
            <button
              key={category}
              type="button"
              className={`graph-tab-btn ${selectedCategory === category ? "is-active" : ""}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        {/* <button onClick={handlePriceClick}>Prices</button>
        {(graphtype === "OpenSea") && <button onClick={handleSupplyClick}>Supply</button>}
        {(graphtype === "Trader" || graphtype === "OpenSea") && <button onClick={handleTradesClick}>Trades number</button>} */}
        {/* <div className="selectgraphdateback">
          <FormControl id="formselectgraphdate" className="selectgraphdate" size="small">
            <InputLabel></InputLabel>
            <Select value={Graphstartdate} onChange={handleChangeGraphdate}>
              <MenuItem value="24h">24h</MenuItem>
              <MenuItem value="7d">7d</MenuItem>
              <MenuItem value="31d">31d</MenuItem>
              <MenuItem value="3m">3m</MenuItem>
            </Select>
          </FormControl>
        </div> */}
      </div>
      <div className="modalgraph-content" style={{ width: '100%', flex: 1, minHeight: 0 }}>
        <Graph
          data={chartData}
          vals={vals}
          dataSetFarm={dataSetFarm}
          graphMeta={graphMetaById}
          selectedCategory={selectedCategory}
          legendResetToken={legendResetToken}
          isLoading={isGraphLoading}
        />
      </div>
    </div>
  );
}

export default ModalGraph;
