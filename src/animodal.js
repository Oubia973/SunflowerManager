import React, { useEffect, useState } from 'react';

const Cadre = ({ onClose, tableData, Platform, frmid }) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => {
    onClose();
  };
  const handleClickOutside = (event) => {
    const modal = document.querySelector('.modalanim-content');
    if (modal && !modal.contains(event.target)) {
      closeModal();
    }
  };
  useEffect(() => {
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);
  const ColorTable = [];
  let modStyle = {};
  if (Platform === "Trades") {
    modStyle.width = "280px";
  }
  if (Platform === "OS") {
    modStyle.width = "680px";
  }
  const tableContent = tableData.map((row, index) => {
    const farmid = Platform === "Trades" ? row.farmid : frmtNb(row.cryptoprice);
    const amount = Platform === "Trades" ? frmtNb(row.amount) : row.cryptoname;
    const sfl = Platform === "Trades" ? frmtNb(row.sfl) : frmtNb(row.qntt);
    const unit = Platform === "Trades" ? frmtNb(row.unit) : row.makerof;
    const realprice = Platform === "OS" && frmtNb(row.realprice);
    let farmidStyle = {};
    let unitStyle = {};
    if (Platform === "Trades") {
      attribColor(farmid);
      farmidStyle.color = ColorTable[farmid];
      if (farmid === Number(frmid)) { farmidStyle.backgroundColor = "rgba(255, 239, 149, 0.438)"; }
    }
    if (Platform === "OS") {
      attribColor(unit);
      unitStyle.color = ColorTable[unit];
      if (unit === frmid) { unitStyle.backgroundColor = "rgba(255, 239, 149, 0.438)"; }
    }
    return (
      <tr key={index}>
        <td style={farmidStyle}>{farmid}</td>
        <td>{amount}</td>
        <td>{sfl}</td>
        {Platform === "OS" && <td>{realprice}</td>}
        <td style={unitStyle}>{unit}</td>
      </tr>
    );
  });
  const tableHeader = Platform === "Trades" ? (
    <tr>
      <th>FarmID</th>
      <th>Amount</th>
      <th>Price</th>
      <th>Unit</th>
    </tr>
  ) : (
    <tr>
      <th>Price</th>
      <th>Currency</th>
      <th>Amount</th>
      <th>Price $</th>
      <th>Seller</th>
    </tr>
  );
  return (
    <div className={`modalanim ${isOpen ? 'open' : ''}`} onClick={handleClickOutside} style={modStyle}>
      <div className="modalanim-content">
        <table>
          <thead>
            {tableHeader}
          </thead>
          <tbody>
            {tableContent}
          </tbody>
        </table>
      </div>
    </div>
  );
  function attribColor(id) {
    const couleur = randColor();
    if (!ColorTable[id]) {
      ColorTable[id] = couleur;
    }
  }
};
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
function randColor() {
  //const couleur = '#' + Math.floor(Math.random() * 16777215).toString(16);
  //const couleur = '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
  const r = Math.floor(Math.random() * 155) + 100;
  const g = Math.floor(Math.random() * 155) + 100;
  const b = Math.floor(Math.random() * 155) + 100;
  const couleur = `rgb(${r}, ${g}, ${b})`;
  return couleur;
}

export default Cadre;
