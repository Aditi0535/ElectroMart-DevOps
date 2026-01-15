import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';

const AboutUsPage = () => {
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          About ElectroShop
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Your One-Stop Shop for Home Appliances and Electronics
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ mt: 3 }}>
          Welcome to Home Applience ElectroShop, where technology meets convenience.
          Founded on the principle of bringing the latest and greatest in home
          appliances and electronics to your fingertips, we are dedicated to
          providing an unparalleled shopping experience.
        </Typography>
        <Typography variant="body1" paragraph>
          Our mission is simple: to offer a curated selection of high-quality
          products, from state-of-the-art 4K TVs and powerful laptops to
          innovative kitchen appliances and smart home devices. We believe that
          the right technology can transform a house into a home, making life
          easier, more enjoyable, and more connected.
        </Typography>
        <Typography variant="body1" paragraph>
          This application is a demonstration of a modern MERN-stack e-commerce
          platform, built with React, Node.js, Express, and MongoDB. It showcases
          a clean, responsive user interface (thanks to Material-UI), efficient
          client-side state management (with Redux Toolkit), and a robust,
          decoupled backend API focused on one thing: getting your order processed
          securely and efficiently.
        </Typography>
        <Typography variant="body1">
          Thank you for visiting. We hope you enjoy browsing our collection!
        </Typography>
      </Paper>
    </Container>
  );
};

export default AboutUsPage;