import React, { useState, useEffect } from 'react';
import Graph from './graph.js';
import DList from "./dlist.jsx";

function ModalGraph({ onClose, graphtype, frmid, dataSetFarm, API_URL, username }) {
  const GRAPH_CATEGORY_KEYS = ["all", "crops", "wood minerals", "fruits honey", "animals", "pets"];
  const [chartData, setChartData] = useState([]);
  const [Graphstartdate, setGraphstartdate] = useState('31d');
  const [selectedCategory, setSelectedCategory] = useState('crops');
  const [legendResetToken, setLegendResetToken] = useState(0);
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
  async function ReqGraph() {
    try {
      let graphstart = "";
      var xformdate = "";
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
      }
      let fetchtype = "";
      if (graphtype === "Marketplace") { fetchtype = API_URL + "/getHT" }
      if (graphtype === "Nifty") { fetchtype = API_URL + "/getHN" }
      if (graphtype === "OpenSea") { fetchtype = API_URL + "/getHO" }
      const response = await fetch(fetchtype, {
        method: 'GET',
        headers: {
          xformdate: xformdate,
          xgraphdate: graphstart.toISOString(),
          frmid: frmid,
          username: username
        }
      });
      if (response.ok) {
        const responseData = await response.json();
        setChartData(responseData);
      } else {
        console.log(`Error : ${response.status}`);
      }
    } catch (error) {
      console.log(`Error : ${error}`);
    }
  }
  useEffect(() => {
    ReqGraph();
  }, [Graphstartdate]);
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
          {GRAPH_CATEGORY_KEYS.map((category) => (
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
          selectedCategory={selectedCategory}
          legendResetToken={legendResetToken}
        />
      </div>
    </div>
  );
}

export default ModalGraph;
