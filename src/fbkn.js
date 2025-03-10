import React, { useEffect, useState } from 'react';

function ModalBumpkin({ onClose, tableData, wardrobe, bumpkinOnC, bumpkinOffC, img, nftw, frmid }) {
  const [inputValue, setInputValue] = useState('');
  const [LookupID, setLookupID] = useState('');
  const [LVL, setLVL] = useState(bumpkinOnC.Bknlvl);
  const [LookupLVL, setLookupLVL] = useState(0);
  const [LookupState, setLookupState] = useState('');
  const [tableLookup, settableLookupContent] = useState([]);
  const [bknLookup, setbknLookup] = useState([]);
  const [bknImageLookup, setbknImageLookup] = useState(null);
  const closeModal = () => {
    onClose();
  };
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  var imgLookup = "";
  var ibknLookup = "";
  var IDLookup = 0;
  const Lookup = async () => {
    try {
      setLookupID(Number(inputValue));
      IDLookup = Number(inputValue);
      const response = await fetch("/getbumpkin", {
        method: 'GET',
        headers: {
          bknid: IDLookup,
          frmid: frmid
        }
      });
      if (response.ok) {
        const data = await response.json();
        ibknLookup = data.responseBkn;
        setbknLookup(data.responseBkn)
        const imageData = data.responseImage;
        setbknImageLookup(`data:image/png;base64,${imageData}`);
        imgLookup = `data:image/png;base64,${imageData}`;
        //setBumpkinDataOC(data.responseBkn);
        setLookupState("");
        setLookupLVL(data.Bknlvl);
      } if (response.status === 429) {
        setLookupState('Too many requests, wait a few seconds');
      } else {
        //setLookupState(`Error : ${response.status}`);
        localStorage.clear();
        console.log("Error, cleared local data");
      }
    } catch (error) {
      console.log(`Error : ${error}`);
    }
  };
  function setContentLookup() {
    if (bknLookup.bumpkins) {
      var bknLItems = "";
      var totPriceL = 0;
      const bknLEntries = Object.entries(bknLookup.bumpkins);
      bknLItems = bknLEntries.map((item, index) => {
        const inventoryEntries = Object.entries(item[1].equipped);
        const inventoryItems = inventoryEntries.map((item, index) => {
          const imgOffC = nftw[item[1]] ? <img src={nftw[item[1]].img} alt="" className="nftico" /> : "";
          const iprice = nftw[item[1]] ? Number(nftw[item[1]].price) : 0;
          const iboost = nftw[item[1]] ? nftw[item[1]].boost : "";
          totPriceL += iprice;
          return (
            <tr key={item[1]}>
              <td className="tditemright">{item[1]}</td>
              <td className="tdcenter">{imgOffC}</td>
              <td className="tdcenter">{frmtNb(iprice)}</td>
              <td className="tditemboost" style={{ color: `rgb(190, 190, 190)` }}>{iboost}</td>
            </tr>
          );
        });
        return (
          <div className="table">
            <h2>Bumpkin {LookupID}</h2>
            <img src={bknImageLookup} width="100px" height="100px"></img>
            <span>LVL {LookupLVL}</span>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Boost</th>
                </tr>
                <tr>
                  <th>TOTAL</th>
                  <th></th>
                  <th>{frmtNb(totPriceL)}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {inventoryItems}
              </tbody>
            </table>
          </div>
        );
      });
      settableLookupContent(bknLItems);
    }
  }
  var totPrice = 0;
  var totPriceWD = 0;
  if (bumpkinOffC.bumpkins) {
    const bknEntries = Object.entries(bumpkinOffC.bumpkins);
    var bknItems = bknEntries.map((item, index) => {
      const inventoryEntries = Object.entries(item[1].equipped);
      const inventoryItems = inventoryEntries.map((item, index) => {
        const imgOffC = nftw[item[1]] ? <img src={nftw[item[1]].img} alt="" className="nftico" /> : "";
        const iprice = nftw[item[1]] ? Number(nftw[item[1]].price) : 0;
        const iboost = nftw[item[1]] ? nftw[item[1]].boost : "";
        totPrice += iprice;
        return (
          <tr key={item[1]}>
            <td className="tditemright">{item[1]}</td>
            <td className="tdcenter">{imgOffC}</td>
            <td className="tdcenter">{frmtNb(iprice)}</td>
            <td className="tditemboost" style={{ color: `rgb(190, 190, 190)` }}>{iboost}</td>
          </tr>
        );
      });
      return (
        <div className="table">
          <h2>Bumpkin {item[0]}</h2>
          <img src={img} width="100px" height="100px"></img>
          <span>LVL {LVL}</span>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Item</th>
                <th>Price</th>
                <th>Boost</th>
              </tr>
              <tr>
                <th>TOTAL</th>
                <th></th>
                <th>{frmtNb(totPrice)}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems}
            </tbody>
          </table>
        </div>
      );
    });
  }
  const wardrobeEntries = Object.entries(wardrobe);
  const wardrobeItems = wardrobeEntries.map((item, index) => {
    const imgOffC = nftw[item[1].item] ? <img src={nftw[item[1].item].img} alt="" className="nftico" /> : "";
    const iprice = nftw[item[1].item] ? Number(nftw[item[1].item].price) : 0;
    const iboost = nftw[item[1].item] ? nftw[item[1].item].boost : "";
    totPriceWD += iprice;
    return (
      <tr key={item[1].item}>
        <td className="tditemright">{item[1].item}</td>
        <td className="tdcenter">{imgOffC}</td>
        <td className="tdcenter">{iprice}</td>
        <td className="tditemboost" style={{ color: `rgb(190, 190, 190)` }}>{iboost}</td>
      </tr>
    );
  });
  useEffect(() => {
    if (bknLookup.bumpkins) {
      setContentLookup();
    }
  }, [bknLookup]);
  return (
    <div className="modal">
      <div className="table-container">
        <button onClick={closeModal}>Close</button>
        {bknItems}
      </div>
      <div className="table-container">
        <input type="text" value={inputValue} onChange={handleInputChange} style={{ width: '50px' }} maxLength={6} />
        <button onClick={Lookup}>Find Bumpkin</button>
        <div>{LookupState}</div>
        {tableLookup}
      </div>
      <div className="table-container">
        <h2>Wardrobe</h2>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Item</th>
              <th>Price</th>
              <th>Boost</th>
            </tr>
            <tr>
              <th>TOTAL</th>
              <th></th>
              <th>{frmtNb(totPriceWD)}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {wardrobeItems}
          </tbody>
        </table>
      </div>
    </div>
  );
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
    if (chiffreSupZero === null) { return nombreNumerique.toFixed(2) }
    if (Math.abs(Math.floor(nombre)) > 0) {
      if (Math.abs(Math.floor(nombre)) < 5) {
        return nombreNumerique.toFixed(3);
      } else {
        return nombreNumerique.toFixed(2);
      }
    } else {
      return nombreStr.slice(0, chiffreSupZero + 3);
    }
  } else {
    return nombreStr;
  }
}

export default ModalBumpkin;
