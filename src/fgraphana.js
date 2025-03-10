import React, { useState, useEffect, useRef } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function ModalGraph({ onClose, graphtype, frmid }) {
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
      if (Graphstartdate === "24h") {
        const currentDate = new Date();
        graphstart = new Date(currentDate);
        graphstart.setDate(currentDate.getDate() - 1);
        var xformdate = "H";
      }
      if (Graphstartdate === "7d") {
        const currentDate = new Date();
        graphstart = new Date(currentDate);
        graphstart.setDate(currentDate.getDate() - 7);
        var xformdate = "H";
      }
      if (Graphstartdate === "31d") {
        const currentDate = new Date();
        graphstart = new Date(currentDate);
        graphstart.setDate(currentDate.getDate() - 31);
        var xformdate = "D";
      }
      if (Graphstartdate === "3m") {
        const currentDate = new Date();
        graphstart = new Date(currentDate);
        graphstart.setDate(currentDate.getDate() - 93);
        var xformdate = "D";
      }
      let fetchtype = "";
      if (graphtype === "Trader") { fetchtype = "/getgrafT" }
      if (graphtype === "Nifty") { fetchtype = "/getgrafN" }
      if (graphtype === "OpenSea") { fetchtype = "/getgrafO" }
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
        <button onClick={closeModal}>Close</button>
        <button onClick={handlePriceClick}>Prices</button>
        {(graphtype === "OpenSea") && <button onClick={handleSupplyClick}>Supply</button>}
        {(graphtype === "Trader" || graphtype === "OpenSea") && <button onClick={handleTradesClick}>Trades number</button>}
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
      <div className="modalgraph-graph">
        {chartData}
        {/* <iframe src="http://https://sunflowerman.link/getgrafN?frmid=frmid,xformdate=xformdate,xgraphdate=xgraphdate" width="450" height="200" frameborder="0"></iframe> */}
      </div>
    </div>
  );
}


export default ModalGraph;
