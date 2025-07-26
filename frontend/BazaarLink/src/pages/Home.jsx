import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to BazaarLink
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              The ultimate B2B marketplace connecting vendors and suppliers
            </p>
            {!isAuthenticated() && (
              <div className="space-x-4">
                <Link to="/register">
                  <Button variant="primary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose BazaarLink?
            </h2>
            <p className="text-lg text-gray-600">
              Streamline your business operations with our comprehensive marketplace
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">For Vendors</h3>
              <p className="text-gray-600">
                Find reliable suppliers, place bulk orders, and manage your inventory efficiently
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">For Suppliers</h3>
              <p className="text-gray-600">
                Showcase your products, reach more vendors, and grow your business network
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">
                Trust our platform with secure transactions and verified business partners
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Section for Authenticated Users */}
      {isAuthenticated() && (
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome back, {user?.name}!
              </h2>
              <p className="text-lg text-gray-600">
                {user?.role === 'vendor' ? 'Manage your orders and find new suppliers' : 'Manage your products and fulfill orders'}
              </p>
            </div>

            <div className="flex justify-center">
              <Link to={user?.role === 'vendor' ? '/vendor/profile' : '/supplier/profile'}>
                <Button variant="primary" size="lg">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      {!isAuthenticated() && (
        <div className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of businesses already using BazaarLink
            </p>
            <div className="space-x-4">
              <Link to="/register">
                <Button variant="primary" size="lg">
                  Join as Vendor
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary" size="lg">
                  Join as Supplier
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;