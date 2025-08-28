import React, { useState, useEffect } from 'react';
import Graph from './graph.js';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function ModalGraph({ onClose, graphtype, frmid, it, API_URL }) {
  const [chartData, setChartData] = useState([]);
  const [Graphstartdate, setGraphstartdate] = useState('31d');
  const closeModal = () => {
    onClose();
  };
  const [vals, setVals] = useState("price");
  const handlePriceClick = () => {
    setVals("price");
  };
  const handleSupplyClick = () => {
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
          frmid: frmid
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
        <h2>{graphtype}</h2>
        <button onClick={closeModal} class="button"><img src="./icon/ui/cancel.png" alt="" className="resico" /></button>
        {/* <button onClick={handlePriceClick}>Prices</button>
        {(graphtype === "OpenSea") && <button onClick={handleSupplyClick}>Supply</button>}
        {(graphtype === "Trader" || graphtype === "OpenSea") && <button onClick={handleTradesClick}>Trades number</button>} */}
        <div className="selectgraphdateback">
          <FormControl id="formselectgraphdate" className="selectgraphdate" size="small">
            <InputLabel></InputLabel>
            <Select value={Graphstartdate} onChange={handleChangeGraphdate}>
              <MenuItem value="24h">24h</MenuItem>
              <MenuItem value="7d">7d</MenuItem>
              <MenuItem value="31d">31d</MenuItem>
              <MenuItem value="3m">3m</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <div className="modalgraph-content" style={{ width: '100%', height: '100%' }}>
        <Graph data={chartData} vals={vals} it={it} />
      </div>
    </div>
  );
}

export default ModalGraph;
