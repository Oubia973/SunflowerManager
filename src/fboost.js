import React from 'react';

function ModalBoost({ onClose, tableData }) {
  const closeModal = () => {
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Boost</h2>
        <button onClick={closeModal}>Close</button>
        <table>
          <thead>
            <tr>
              <th> </th>
              <th>Item</th>
              <th>Price</th>
              <th>Boost</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td id="iccolumn"><i><img src={row.img} alt={''} className="nftico" /></i></td>
                <td>{row.item}</td>
                <td>{row.price}</td>
                <td style={{ color: `rgb(190, 190, 190)` }}>{row.boost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ModalBoost;
