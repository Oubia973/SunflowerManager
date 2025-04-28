import React from 'react';
import { Switch, FormControlLabel } from '@mui/material';

const ToggleSwitch = ({ TryChecked, handleTryCheckedChange }) => {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={TryChecked}
          onChange={handleTryCheckedChange}
          color="primary"
        />
      }
      label={TryChecked ? 'Active' : 'Try'}
    />
  );
};

export default ToggleSwitch;