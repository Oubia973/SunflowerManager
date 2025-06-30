import React, { useState, useEffect, useRef } from 'react';
import { FormControl, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';

const DropdownCheckbox = ({ options, onChange, listIcon }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    setSelectedOptions(options.map((item, i) => item[1] === 1 ? i : null).filter(i => i !== null));
  }, [options]);

  const handleMenuOpen = (element) => {
    setTimeout(() => {
      const menuList = element.querySelector('.MuiMenu-list');
      if (menuList) {
        menuList.scrollTop = 0;
      }
    }, 50);
  };

  const handleCheckboxChange = (index) => (event) => {
    event.stopPropagation();
    setSelectedOptions((prev) => {
      let updated;
      if (prev.includes(index)) {
        updated = prev.filter(i => i !== index);
      } else {
        updated = [...prev, index];
      }
      if (onChange) {
        const updatedXListeCol = options.map((item, i) => [item[0], updated.includes(i) ? 1 : 0]);
        onChange(updatedXListeCol);
      }
      return updated;
    });
  };

  const handleSelectChange = (event) => {
    setSelectedOptions(event.target.value);
    if (onChange) {
      const updatedXListeCol = options.map((item, i) => [item[0], event.target.value.includes(i) ? 1 : 0]);
      onChange(updatedXListeCol);
    }
  };

  return (
    <FormControl className="selectopt" size="small" sx={{ minWidth: 36 }}>
      <Select
        multiple
        value={selectedOptions}
        onChange={handleSelectChange}
        renderValue={() => (
          <img src={listIcon} alt="Options" width={20} height={20} style={{ display: 'block' }} />
        )}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 400,
              backgroundColor: 'grey',
              minWidth: 120,
            },
          },
          onEntering: handleMenuOpen,
        }}
        sx={{
          minHeight: 32,
          padding: 0,
          '& .MuiSelect-select': { padding: '4px 8px' }
        }}
      >
        {options.map((item, index) => (
          <MenuItem key={item[0]} value={index} dense sx={{ minHeight: 28, fontSize: 13 }}>
            <Checkbox
              checked={selectedOptions.includes(index)}
              onChange={handleCheckboxChange(index)}
              size="small"
              sx={{ padding: 0.5 }}
              onClick={e => e.stopPropagation()}
            />
            <ListItemText primary={item[0]} sx={{ fontSize: 13, marginLeft: 0.5 }} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DropdownCheckbox;
