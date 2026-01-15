// src/components/Footer/Footer.jsx

import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
// FIX: Import Link from react-router-dom and alias it as RouterLink
import { Link as RouterLink } from 'react-router-dom'; 

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: 'auto', // Pushes footer to the bottom
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1" align="center" gutterBottom>
          Home Applience ElectroShop
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
        >
          © {new Date().getFullYear()} ElectroShop. All rights reserved.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{mt: 1}}>
          <Link component={RouterLink} to="/about" color="inherit" sx={{mx: 1}}>
            About Us
          </Link>
          |
          <Link component={RouterLink} to="/contact" color="inherit" sx={{mx: 1}}>
            Contact
          </Link>
          |
          <Link component={RouterLink} to="/shop" color="inherit" sx={{mx: 1}}>
            Shop
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;