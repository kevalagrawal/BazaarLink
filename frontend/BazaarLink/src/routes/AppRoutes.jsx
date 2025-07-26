import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';

// Public Pages
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';

// Auth Pages
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';

// Vendor Pages
import VendorProfile from '../features/vendor/Profile';
import VendorProducts from '../features/vendor/Products';
import VendorOrders from '../features/vendor/Orders';
import VendorGroupOrder from '../features/vendor/GroupOrder';
import VendorReview from '../features/vendor/Review';

// Supplier Pages
import SupplierProfile from '../features/supplier/Profile';
import SupplierAddProduct from '../features/supplier/AddProduct';
import SupplierUpdateProduct from '../features/supplier/UpdateProduct';
import SupplierOrders from '../features/supplier/Orders';
import SupplierFulfillOrder from '../features/supplier/FulfillOrder';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      
      {/* Auth Routes */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />

      {/* Vendor Routes */}
      <Route 
        path="/vendor/profile" 
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <VendorProfile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/vendor/products" 
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <VendorProducts />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/vendor/orders" 
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <VendorOrders />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/vendor/group-order" 
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <VendorGroupOrder />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/vendor/review" 
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <VendorReview />
          </ProtectedRoute>
        } 
      />

      {/* Supplier Routes */}
      <Route 
        path="/supplier/profile" 
        element={
          <ProtectedRoute allowedRoles={['supplier']}>
            <SupplierProfile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/supplier/add-product" 
        element={
          <ProtectedRoute allowedRoles={['supplier']}>
            <SupplierAddProduct />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/supplier/update-product/:id" 
        element={
          <ProtectedRoute allowedRoles={['supplier']}>
            <SupplierUpdateProduct />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/supplier/orders" 
        element={
          <ProtectedRoute allowedRoles={['supplier']}>
            <SupplierOrders />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/supplier/fulfill-order/:id" 
        element={
          <ProtectedRoute allowedRoles={['supplier']}>
            <SupplierFulfillOrder />
          </ProtectedRoute>
        } 
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;