import React from 'react';

function ModalBumpkin({ onClose, tableData, bumpkinOC, img }) {
  const closeModal = () => {
    onClose();
  };
  const tableEntries = Object.entries(tableData);
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Bumpkin</h2>
        <button onClick={closeModal}>Close</button>
        <img src={`data:image/png;base64,${img}`} width="150px" height="150px"></img>
        <table>
          <thead>
            <tr>
              <th>{tableEntries[3][1]}</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {tableEntries[4][1].map((item, index) => (
              <tr key={index}>
                <td>{item.trait_type}</td>
                <td>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ModalBumpkin;
