import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Badge,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useSelector } from 'react-redux';
import { selectCartItemCount } from '../../features/cart/cartSelectors';

const navLinks = [
  { title: 'Shop', path: '/shop' },
  { title: 'About Us', path: '/about' },
  { title: 'Contact Us', path: '/contact' },
];

const Navbar = () => {
  const cartItemCount = useSelector(selectCartItemCount);

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo/Home Link */}
        <Typography
          variant="h5"
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
          }}
        >
          Home Applience
        </Typography>

        {/* Nav Links */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          {navLinks.map((link) => (
            <Button
              key={link.title}
              component={RouterLink}
              to={link.path}
              color="inherit"
              sx={{ ml: 2 }}
            >
              {link.title}
            </Button>
          ))}
        </Box>

        {/* Cart Icon */}
        <IconButton
          component={RouterLink}
          to="/cart"
          color="inherit"
          aria-label="go to cart"
        >
          <Badge badgeContent={cartItemCount} color="primary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;