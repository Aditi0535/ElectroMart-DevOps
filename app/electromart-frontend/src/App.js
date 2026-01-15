// src/App.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout
import MainLayout from './layouts/MainLayout'; // Assuming this exists

// Pages
import HomePage from './pages/HomePage';
import ShopNowPage from './pages/ShopNowPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopNowPage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="about" element={<AboutUsPage />} />
        <Route path="contact" element={<ContactUsPage />} />
        
        {/* Checkout Flow Routes */}
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-confirmation/:id" element={<OrderConfirmationPage />} />

        {/* Catch all for 404/Not Found (optional) */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Route>
    </Routes>
  );
};

// **THIS IS THE CRITICAL LINE THAT SOLVES THE ERROR**
export default App;