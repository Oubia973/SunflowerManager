import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem, Checkbox, ListItemText, Icon } from '@mui/material';

const DropdownCheckbox = ({ options, onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    setSelectedOptions(options.map((item) => item[1] === 1));
  }, [options]);

  const handleCheckboxChange = (index) => () => {
    setSelectedOptions((prevSelectedOptions) => {
      const updatedOptions = [...prevSelectedOptions];
      updatedOptions[index] = !updatedOptions[index];
      if (onChange) {
        const updatedXListeCol = options.map((item, i) => [item[0], updatedOptions[i] ? 1 : 0]);
        onChange(updatedXListeCol);
      }
      return updatedOptions;
    });
  };

  const handleSelectChange = (event) => {
    setSelectedOptions(event.target.value);
    if (onChange) {
      const updatedXListeCol = options.map((item, index) => [item[0], event.target.value[index] ? 1 : 0]);
      onChange(updatedXListeCol);
    }
  };

  return (
    <FormControl className="selectopt" size="small">
      <Select
        multiple
        value={selectedOptions}
        onChange={handleSelectChange}
        renderValue={() => <Icon><img src="./options.png" alt="Options" width="100%" /></Icon>}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 400,
              backgroundColor: 'grey',
            },
          },
        }}
      >
        {options.map((item, index) => (
          <MenuItem key={item[0]} value={index} classe="selectopt">
            <Checkbox
              checked={selectedOptions[index]}
              onChange={handleCheckboxChange(index)}
            />
            <ListItemText primary={item[0]} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DropdownCheckbox;
