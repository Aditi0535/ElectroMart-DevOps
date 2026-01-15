import React from 'react';
import { Box, IconButton, TextField } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

const QuantitySelector = ({ quantity, setQuantity, maxQuantity = 10 }) => {
  const handleDecrement = () => {
    setQuantity(Math.max(1, quantity - 1));
  };

  const handleIncrement = () => {
    setQuantity(Math.min(maxQuantity, quantity + 1));
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else if (value > maxQuantity) {
      setQuantity(maxQuantity);
    } else {
      setQuantity(value);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton
        onClick={handleDecrement}
        disabled={quantity <= 1}
        size="small"
      >
        <RemoveIcon />
      </IconButton>
      <TextField
        value={quantity}
        onChange={handleChange}
        size="small"
        sx={{ width: '60px', mx: 1 }}
        inputProps={{
          style: { textAlign: 'center' },
          min: 1,
          max: maxQuantity,
          type: 'number'
        }}
      />
      <IconButton
        onClick={handleIncrement}
        disabled={quantity >= maxQuantity}
        size="small"
      >
        <AddIcon />
      </IconButton>
    </Box>
  );
};

export default QuantitySelector;