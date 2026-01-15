import React from 'react';
import { Snackbar, Alert } from '@mui/material';

// This component shows a simple "Added to Cart" notification
const MessageDialog = ({ open, handleClose, message, title }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default MessageDialog;