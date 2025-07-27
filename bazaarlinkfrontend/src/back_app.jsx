import React, { useState, useEffect } from 'react';

// API utilities
const API_BASE = 'https://bazaar-link-backend.vercel.app';

const api = {
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Registration API Error:', error);
      throw error;
    }
  },
  
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Login API Error:', error);
      throw error;
    }
  },

  // Vendor API functions
  vendor: {
    getProfile: async (token) => {
      try {
        const response = await fetch(`${API_BASE}/api/vendor/profile`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Get Vendor Profile Error:', error);
        throw error;
      }
    },

    getNearbyProducts: async (token) => {
      try {
        const response = await fetch(`${API_BASE}/api/vendor/products`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Get Nearby Products Error:', error);
        throw error;
      }
    },

    placeOrder: async (token, orderData) => {
      try {
        const response = await fetch(`${API_BASE}/api/vendor/order`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Place Order Error:', error);
        throw error;
      }
    },

    joinGroupOrder: async (token, orderData) => {
      try {
        const response = await fetch(`${API_BASE}/api/vendor/group-order`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Join Group Order Error:', error);
        throw error;
      }
    },

    getOrders: async (token) => {
      try {
        const response = await fetch(`${API_BASE}/api/vendor/orders`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Get Vendor Orders Error:', error);
        throw error;
      }
    },

    leaveReview: async (token, supplierId, reviewData) => {
      try {
        const response = await fetch(`${API_BASE}/api/vendor/review/${supplierId}`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(reviewData)
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Leave Review Error:', error);
        throw error;
      }
    }
  },

  // Supplier API functions
  supplier: {
    getProfile: async (token) => {
      try {
        const response = await fetch(`${API_BASE}/api/supplier/profile`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Get Supplier Profile Error:', error);
        throw error;
      }
    },

    addProduct: async (token, productData) => {
      try {
        const response = await fetch(`${API_BASE}/api/supplier/product`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(productData)
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Add Product Error:', error);
        throw error;
      }
    },

    updateProduct: async (token, productId, updateData) => {
      try {
        const response = await fetch(`${API_BASE}/api/supplier/product/${productId}`, {
          method: 'PATCH',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Update Product Error:', error);
        throw error;
      }
    },

    getOrders: async (token) => {
      try {
        const response = await fetch(`${API_BASE}/api/supplier/orders`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Get Supplier Orders Error:', error);
        throw error;
      }
    },

    fulfillOrder: async (token, orderId) => {
      try {
        const response = await fetch(`${API_BASE}/api/supplier/order/${orderId}`, {
          method: 'PATCH',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Fulfill Order Error:', error);
        throw error;
      }
    },

    restockProduct: async (token, productId, quantity) => {
      try {
        const response = await fetch(`${API_BASE}/api/supplier/product/${productId}/restock`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ quantity })
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Restock Product Error:', error);
        throw error;
      }
    },

    getLowStockProducts: async (token) => {
      try {
        const response = await fetch(`${API_BASE}/api/supplier/products/low-stock`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Get Low Stock Products Error:', error);
        throw error;
      }
    },

    getProductStockHistory: async (token, productId) => {
      try {
        const response = await fetch(`${API_BASE}/api/supplier/product/${productId}/stock-history`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Get Product Stock History Error:', error);
        throw error;
      }
    }
  },

  // Product API functions (public)
  products: {
    getAllProducts: async () => {
      try {
        const response = await fetch(`${API_BASE}/api/products`, {
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Get All Products Error:', error);
        throw error;
      }
    },

    getProductsBySupplierId: async (supplierId) => {
      try {
        const response = await fetch(`${API_BASE}/api/products/${supplierId}`, {
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Get Products by Supplier Error:', error);
        throw error;
      }
    }
  },

  // Orders API functions (public)
  orders: {
    getVendorOrders: async (vendorId) => {
      try {
        const response = await fetch(`${API_BASE}/api/orders/vendor/${vendorId}`, {
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Get Vendor Orders Error:', error);
        throw error;
      }
    },

    getSupplierOrders: async (supplierId) => {
      try {
        const response = await fetch(`${API_BASE}/api/orders/supplier/${supplierId}`, {
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Get Supplier Orders Error:', error);
        throw error;
      }
    },

    updateOrderStatus: async (orderId, status) => {
      try {
        const response = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Update Order Status Error:', error);
        throw error;
      }
    }
  }
};

// Connection Status Component
const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(`${API_BASE}/`);
        setIsConnected(response.ok);
      } catch (error) {
        setIsConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`fixed top-4 right-4 px-3 py-1 rounded-full text-xs font-medium z-50 ${
      isConnected 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-red-100 text-red-800 border border-red-200'
    }`}>
      {isConnected ? '🟢 API Connected' : '🔴 API Offline'}
    </div>
  );
};

// Reusable Components
const Input = ({ label, type = "text", value, onChange, placeholder, required = false, className = "" }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${className}`}
    />
  </div>
);

const Button = ({ children, onClick, variant = "primary", disabled = false, className = "", size = "normal" }) => {
  const baseClasses = "font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg";
  const sizes = {
    small: "px-3 py-1 text-sm",
    normal: "px-4 py-2",
    large: "px-6 py-3 text-lg"
  };
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-300",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300",
    outline: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500 disabled:bg-gray-100"
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-xl shadow-lg ${sizes[size]} w-full max-h-[90vh] overflow-y-auto`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const StarRating = ({ rating, onRatingChange, readonly = false }) => {
  const stars = [1, 2, 3, 4, 5];
  
  return (
    <div className="flex space-x-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRatingChange && onRatingChange(star)}
          className={`text-xl ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          disabled={readonly}
        >
          ★
        </button>
      ))}
    </div>
  );
};

// Role Selection Component
const RoleSelector = ({ selectedRole, onRoleChange }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Your Role</h3>
    <div className="grid grid-cols-2 gap-4">
      <div
        onClick={() => onRoleChange('vendor')}
        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
          selectedRole === 'vendor'
            ? 'border-blue-500 bg-blue-50 text-blue-700'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="text-center">
          <div className="text-2xl mb-2">🏪</div>
          <div className="font-medium">Vendor</div>
          <div className="text-xs text-gray-500">Buy products</div>
        </div>
      </div>
      <div
        onClick={() => onRoleChange('supplier')}
        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
          selectedRole === 'supplier'
            ? 'border-blue-500 bg-blue-50 text-blue-700'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="text-center">
          <div className="text-2xl mb-2">🏭</div>
          <div className="font-medium">Supplier</div>
          <div className="text-xs text-gray-500">Sell products</div>
        </div>
      </div>
    </div>
  </div>
);

// Landing Page
const LandingPage = ({ onNavigate }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
      <div className="text-4xl mb-4">🤝</div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Vendor Supplier Connect
      </h1>
      <p className="text-gray-600 mb-8">
        Connect vendors with suppliers for seamless business transactions
      </p>
      
      <div className="space-y-4">
        <Button onClick={() => onNavigate('login')} className="w-full">
          Sign In
        </Button>
        <Button 
          variant="secondary"
          onClick={() => onNavigate('register')}
          className="w-full"
        >
          Get Started
        </Button>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="space-y-2 text-sm text-gray-500">
          <p className="font-medium">Demo credentials:</p>
          <p>Phone: 1234567890</p>
          <p>Password: demo123</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs">
              📡 API: bazaar-link-backend.vercel.app<br />
              🌍 Live backend connected
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Login Page
const LoginPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({ phone: '', password: '', expectedRole: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleRoleNext = () => {
    if (!formData.expectedRole) {
      setError('Please select your account type');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!formData.phone || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const loginData = {
        phone: formData.phone,
        password: formData.password
      };
      
      const result = await api.login(loginData);
      
      if (result.token) {
        if (result.role !== formData.expectedRole) {
          setError(`This phone number is registered as a ${result.role}, not a ${formData.expectedRole}`);
          return;
        }
        
        console.log('Login successful:', result);
        
        if (result.role === 'vendor') {
          onNavigate('vendor-dashboard', result);
        } else if (result.role === 'supplier') {
          onNavigate('supplier-dashboard', result);
        }
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
          <p className="text-gray-600 mt-2">Welcome back to BazaarLink</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {step === 1 ? (
          <div className="space-y-4">
            <RoleSelector 
              selectedRole={formData.expectedRole}
              onRoleChange={(role) => setFormData({ ...formData, expectedRole: role })}
            />
            <Button onClick={handleRoleNext} className="w-full">
              Next
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter your phone number"
              required
            />
            
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              required
            />

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button 
              onClick={() => onNavigate('register')}
              className="text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Sign up
            </button>
          </p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Demo: Phone: 1234567890, Password: demo123<br />
            🌍 Connected to live API
          </p>
        </div>
      </div>
    </div>
  );
};

// Register Page
const RegisterPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    password: '',
    confirmPassword: '',
    role: '',
    kyc: { aadhaar: '', gstin: '' }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (!formData.role) {
      setError('Please select your role');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.location || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const { confirmPassword, ...submitData } = formData;
      const result = await api.register(submitData);
      
      if (result.token) {
        console.log('Registration successful:', result);
        
        if (result.role === 'vendor') {
          onNavigate('vendor-dashboard', result);
        } else {
          onNavigate('supplier-dashboard', result);
        }
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-2">Join BazaarLink today</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {step === 1 ? (
          <div className="space-y-4">
            <RoleSelector 
              selectedRole={formData.role}
              onRoleChange={(role) => setFormData({ ...formData, role })}
            />
            <Button onClick={handleNext} className="w-full">
              Next
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
              required
            />
            
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter your phone number"
              required
            />
            
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Enter your location"
              required
            />
            
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Create a password"
              required
            />
            
            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Confirm your password"
              required
            />

            {formData.role === 'supplier' && (
              <div className="space-y-4">
                <Input
                  label="Aadhaar Number (Optional)"
                  value={formData.kyc.aadhaar}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    kyc: { ...formData.kyc, aadhaar: e.target.value }
                  })}
                  placeholder="Enter Aadhaar number"
                />
                
                <Input
                  label="GSTIN (Optional)"
                  value={formData.kyc.gstin}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    kyc: { ...formData.kyc, gstin: e.target.value }
                  })}
                  placeholder="Enter GSTIN"
                />
              </div>
            )}

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button 
              onClick={() => onNavigate('login')}
              className="text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// VENDOR COMPONENTS

// Vendor Browse Products Component
const VendorBrowseProducts = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderType, setOrderType] = useState('individual');
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.vendor.getNearbyProducts(user.token);
      setProducts(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Load products error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product._id === product._id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.product._id === product._id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.product._id !== productId));
    } else {
      setCart(cart.map(item =>
        item.product._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    // Group cart items by supplier
    const ordersBySupplier = cart.reduce((acc, item) => {
      const supplierId = item.product.supplier._id;
      if (!acc[supplierId]) {
        acc[supplierId] = {
          supplier: supplierId,
          items: []
        };
      }
      acc[supplierId].items.push({
        product: item.product._id,
        quantity: item.quantity
      });
      return acc;
    }, {});

    try {
      setPlacingOrder(true);
      
      // Place orders for each supplier
      const orderPromises = Object.values(ordersBySupplier).map(orderData => {
        if (orderType === 'group') {
          return api.vendor.joinGroupOrder(user.token, orderData);
        } else {
          return api.vendor.placeOrder(user.token, orderData);
        }
      });

      await Promise.all(orderPromises);
      
      setCart([]);
      setShowOrderModal(false);
      setError('');
      alert(`${orderType === 'group' ? 'Group order' : 'Order'} placed successfully!`);
      
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  const groupedProducts = products.reduce((acc, product) => {
    const supplierName = product.supplier?.name || 'Unknown Supplier';
    if (!acc[supplierName]) {
      acc[supplierName] = [];
    }
    acc[supplierName].push(product);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Browse Products</h2>
        {cart.length > 0 && (
          <Button onClick={() => setShowOrderModal(true)}>
            Cart ({cart.length}) - ₹{getCartTotal().toFixed(2)}
          </Button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-8">
          {Object.keys(groupedProducts).length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No products available in your area</p>
            </div>
          ) : (
            Object.entries(groupedProducts).map(([supplierName, supplierProducts]) => (
              <div key={supplierName} className="bg-white rounded-lg shadow border">
                <div className="p-4 border-b bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900">{supplierName}</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {supplierProducts.map((product) => (
                      <div key={product._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        {product.imageUrl && (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                        )}
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.stock > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.stock > 0 ? `${product.stock} ${product.unit}` : 'Out of Stock'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          Unit: {product.unit}
                        </p>
                        <p className="text-lg font-semibold text-gray-900 mb-3">
                          ₹{product.price.toFixed(2)} per {product.unit}
                        </p>
                        <Button 
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                          size="small"
                          className="w-full"
                        >
                          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <Modal 
        isOpen={showOrderModal} 
        onClose={() => setShowOrderModal(false)}
        title="Place Order"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Order Type</h3>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="individual"
                  checked={orderType === 'individual'}
                  onChange={(e) => setOrderType(e.target.value)}
                  className="mr-2"
                />
                Individual Order
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="group"
                  checked={orderType === 'group'}
                  onChange={(e) => setOrderType(e.target.value)}
                  className="mr-2"
                />
                Group Order
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Cart Items</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.product._id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <div className="flex items-center space-x-3">
                    {item.product.imageUrl && (
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-600">
                        ₹{item.product.price} × {item.quantity} = ₹{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="small" 
                      variant="outline"
                      onClick={() => updateCartQuantity(item.product._id, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button 
                      size="small" 
                      variant="outline"
                      onClick={() => updateCartQuantity(item.product._id, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total: ₹{getCartTotal().toFixed(2)}</span>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setShowOrderModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handlePlaceOrder} 
                disabled={placingOrder}
                className="flex-1"
              >
                {placingOrder ? 'Placing Order...' : `Place ${orderType === 'group' ? 'Group ' : ''}Order`}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Vendor Order History Component
const VendorOrderHistory = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    loadOrdersWithProducts();
  }, []);

  const loadOrdersWithProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch orders and all products in parallel
      const [ordersData, allProducts] = await Promise.all([
        api.vendor.getOrders(user.token),
        api.products.getAllProducts()
      ]);

      const ordersArray = Array.isArray(ordersData) ? ordersData : [];
      const productsArray = Array.isArray(allProducts) ? allProducts : [];

      // Create product lookup map
      const productLookup = {};
      productsArray.forEach(product => {
        productLookup[product._id] = product;
      });

      // Enhance orders with product details
      const enhancedOrders = ordersArray.map(order => ({
        ...order,
        items: (order.items || []).map(item => {
          const fullProduct = productLookup[item.product._id] || productLookup[item.product] || {};
          return {
            ...item,
            product: {
              _id: item.product._id || item.product,
              name: fullProduct.name || item.product?.name || 'Unknown Product',
              price: item.product.price || fullProduct.price || 0,
              imageUrl: fullProduct.imageUrl || item.product?.imageUrl || ''
            }
          };
        })
      }));

      setOrders(enhancedOrders);
      setError('');
    } catch (err) {
      setError('Failed to load orders. Please try again.');
      console.error('Load orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveReview = (supplier) => {
    setSelectedSupplier(supplier);
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    try {
      setSubmittingReview(true);
      await api.vendor.leaveReview(user.token, selectedSupplier._id, reviewData);
      setShowReviewModal(false);
      setReviewData({ rating: 5, comment: '' });
      alert('Review submitted successfully!');
    } catch (err) {
      console.error('Review submission error:', err);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Order History</h2>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow border p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order #{order._id.slice(-6)}
                  </h3>
                  <p className="text-gray-600">
                    Supplier: {order.supplier?.name || 'Unknown Supplier'}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    Type: {order.type}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                <div className="space-y-2">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <div className="flex items-center space-x-3">
                          {item.product?.imageUrl && (
                            <img 
                              src={item.product.imageUrl} 
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <span className="text-sm font-medium">
                              {item.product?.name || 'Unknown Product'}
                            </span>
                            <p className="text-xs text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-medium">
                          ₹{((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No items found</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="text-sm text-gray-600">
                  <p>Ordered: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="font-semibold">Total: ₹{order.items?.reduce((total, item) => total + ((item.product?.price || 0) * item.quantity), 0).toFixed(2) || '0.00'}</p>
                </div>
                {order.status === 'delivered' && (
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => handleLeaveReview(order.supplier)}
                  >
                    Leave Review
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal 
        isOpen={showReviewModal} 
        onClose={() => setShowReviewModal(false)}
        title={`Review ${selectedSupplier?.name}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <StarRating 
              rating={reviewData.rating}
              onRatingChange={(rating) => setReviewData({ ...reviewData, rating })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
            <textarea
              value={reviewData.comment}
              onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              placeholder="Share your experience..."
            />
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setShowReviewModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={submitReview} disabled={submittingReview} className="flex-1">
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Vendor Analytics Component
const VendorAnalytics = ({ user }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch orders and all products in parallel
      const [ordersData, allProducts] = await Promise.all([
        api.vendor.getOrders(user.token),
        api.products.getAllProducts()
      ]);

      const ordersArray = Array.isArray(ordersData) ? ordersData : [];
      const productsArray = Array.isArray(allProducts) ? allProducts : [];

      // Create product lookup map
      const productLookup = {};
      productsArray.forEach(product => {
        productLookup[product._id] = product;
      });

      // Enhance orders with product details
      const enhancedOrders = ordersArray.map(order => ({
        ...order,
        items: (order.items || []).map(item => {
          const fullProduct = productLookup[item.product._id] || productLookup[item.product] || {};
          return {
            ...item,
            product: {
              _id: item.product._id || item.product,
              name: fullProduct.name || item.product?.name || 'Unknown Product',
              price: item.product.price || fullProduct.price || 0,
              imageUrl: fullProduct.imageUrl || item.product?.imageUrl || ''
            }
          };
        })
      }));

      setOrders(enhancedOrders);

      const totalSpent = enhancedOrders.reduce((total, order) => {
        const orderTotal = (order.items || []).reduce((sum, item) => 
          sum + ((item.product?.price || 0) * item.quantity), 0
        );
        return total + orderTotal;
      }, 0);

      setStats({
        totalOrders: enhancedOrders.length,
        pendingOrders: enhancedOrders.filter(order => order.status === 'pending').length,
        completedOrders: enhancedOrders.filter(order => order.status === 'delivered').length,
        totalSpent: totalSpent
      });
    } catch (err) {
      console.error('Load analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="text-sm font-medium text-gray-600">Total Orders</div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalOrders}</div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="text-sm font-medium text-gray-600">Pending Orders</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="text-sm font-medium text-gray-600">Completed Orders</div>
          <div className="text-2xl font-bold text-green-600">{stats.completedOrders}</div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="text-sm font-medium text-gray-600">Total Spent</div>
          <div className="text-2xl font-bold text-blue-600">₹{stats.totalSpent.toFixed(2)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div key={order._id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.supplier?.name || 'Unknown Supplier'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Types</h3>
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No orders data</p>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Individual Orders</span>
                <span className="font-semibold">
                  {orders.filter(o => o.type === 'individual').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Group Orders</span>
                <span className="font-semibold">
                  {orders.filter(o => o.type === 'group').length}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// SUPPLIER COMPONENTS

// Product Management Component
const ProductManagement = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    unit: '',
    price: '',
    stock: '',
    lowStockThreshold: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.products.getProductsBySupplierId(user._id);
      setProducts(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Load products error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.unit || !newProduct.price || !newProduct.stock) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        lowStockThreshold: newProduct.lowStockThreshold ? parseInt(newProduct.lowStockThreshold) : 5
      };

      await api.supplier.addProduct(user.token, productData);
      setShowAddModal(false);
      setNewProduct({ name: '', unit: '', price: '', stock: '', lowStockThreshold: '' });
      loadProducts();
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to add product');
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct.price || !editingProduct.stock) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const updateData = {
        price: parseFloat(editingProduct.price),
        stock: parseInt(editingProduct.stock),
        lowStockThreshold: editingProduct.lowStockThreshold ? parseInt(editingProduct.lowStockThreshold) : 5
      };

      await api.supplier.updateProduct(user.token, editingProduct._id, updateData);
      setShowEditModal(false);
      setEditingProduct(null);
      loadProducts();
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to update product');
    }
  };

  const handleRestockProduct = async (productId, quantity) => {
    try {
      await api.supplier.restockProduct(user.token, productId, quantity);
      loadProducts();
    } catch (err) {
      setError(err.message || 'Failed to restock product');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
        <Button onClick={() => setShowAddModal(true)}>
          Add Product
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>No products yet. Add your first product!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow border p-4">
              {product.imageUrl && (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.stock > product.lowStockThreshold 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock} {product.unit}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  Price: ₹{product.price} per {product.unit}
                </p>
                <p className="text-sm text-gray-600">
                  Low Stock Alert: {product.lowStockThreshold} {product.unit}
                </p>
              </div>

              <div className="flex space-x-2">
                <Button 
                  size="small" 
                  variant="outline"
                  onClick={() => {
                    setEditingProduct(product);
                    setShowEditModal(true);
                  }}
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button 
                  size="small"
                  onClick={() => {
                    const quantity = prompt('Enter quantity to restock:');
                    if (quantity && parseInt(quantity) > 0) {
                      handleRestockProduct(product._id, parseInt(quantity));
                    }
                  }}
                  className="flex-1"
                >
                  Restock
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      <Modal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        title="Add New Product"
      >
        <div className="space-y-4">
          <Input
            label="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            placeholder="Enter product name"
            required
          />
          
          <Input
            label="Unit"
            value={newProduct.unit}
            onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
            placeholder="e.g., kg, pieces, liters"
            required
          />
          
          <Input
            label="Price per Unit"
            type="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            placeholder="Enter price"
            required
          />
          
          <Input
            label="Initial Stock"
            type="number"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            placeholder="Enter initial stock quantity"
            required
          />
          
          <Input
            label="Low Stock Threshold (Optional)"
            type="number"
            value={newProduct.lowStockThreshold}
            onChange={(e) => setNewProduct({ ...newProduct, lowStockThreshold: e.target.value })}
            placeholder="Default: 5"
          />
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleAddProduct} className="flex-1">
              Add Product
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Product Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        title="Edit Product"
      >
        {editingProduct && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <p className="text-gray-900 font-medium">{editingProduct.name}</p>
            </div>
            
            <Input
              label="Price per Unit"
              type="number"
              value={editingProduct.price}
              onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
              required
            />
            
            <Input
              label="Stock Quantity"
              type="number"
              value={editingProduct.stock}
              onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
              required
            />
            
            <Input
              label="Low Stock Threshold"
              type="number"
              value={editingProduct.lowStockThreshold}
              onChange={(e) => setEditingProduct({ ...editingProduct, lowStockThreshold: e.target.value })}
            />
            
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setShowEditModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleEditProduct} className="flex-1">
                Update Product
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// Order Management Component
const OrderManagement = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingOrder, setProcessingOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch orders and all products in parallel
      const [ordersData, allProducts] = await Promise.all([
        api.supplier.getOrders(user.token),
        api.products.getAllProducts()
      ]);

      const ordersArray = Array.isArray(ordersData) ? ordersData : [];
      const productsArray = Array.isArray(allProducts) ? allProducts : [];

      // Create product lookup map
      const productLookup = {};
      productsArray.forEach(product => {
        productLookup[product._id] = product;
      });

      // Add price and name to orders since backend doesn't include full product info
      const enhancedOrders = ordersArray.map(order => ({
        ...order,
        items: (order.items || []).map(item => {
          const fullProduct = productLookup[item.product._id] || productLookup[item.product] || {};
          return {
            ...item,
            product: {
              _id: item.product._id || item.product,
              name: fullProduct.name || item.product?.name || 'Unknown Product',
              price: item.product.price || fullProduct.price || 0,
              imageUrl: fullProduct.imageUrl || item.product?.imageUrl || ''
            }
          };
        })
      }));

      setOrders(enhancedOrders);
      setError('');
    } catch (err) {
      setError('Failed to load orders. Please try again.');
      console.error('Load orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFulfillOrder = async (orderId) => {
    try {
      setProcessingOrder(orderId);
      await api.supplier.fulfillOrder(user.token, orderId);
      loadOrders();
    } catch (err) {
      setError(err.message || 'Failed to fulfill order');
    } finally {
      setProcessingOrder(null);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>No orders received yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow border p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order #{order._id.slice(-6)}
                  </h3>
                  <p className="text-gray-600">
                    Vendor: {order.vendor?.name || 'Unknown Vendor'}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    Type: {order.type}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                <div className="space-y-2">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <div className="flex items-center space-x-3">
                          {item.product?.imageUrl && (
                            <img 
                              src={item.product.imageUrl} 
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <span className="text-sm font-medium">
                              {item.product?.name || 'Unknown Product'}
                            </span>
                            <p className="text-xs text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-medium">
                          ₹{((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No items found</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="text-sm text-gray-600">
                  <p>Ordered: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="font-semibold">Total: ₹{order.items?.reduce((total, item) => total + ((item.product?.price || 0) * item.quantity), 0).toFixed(2) || '0.00'}</p>
                </div>
                {order.status === 'pending' && (
                  <Button
                    variant="success"
                    size="small"
                    onClick={() => handleFulfillOrder(order._id)}
                    disabled={processingOrder === order._id}
                  >
                    {processingOrder === order._id ? 'Processing...' : 'Mark as Delivered'}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Supplier Analytics Component
const SupplierAnalytics = ({ user }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
  topProducts: [],
  monthlyRevenue: [],
  lowStockItems: []
});

  useEffect(() => {
    loadAnalytics();
  }, []);

  const getTopSellingProducts = () => {
  const productSales = {};
  
  orders.forEach(order => {
    order.items?.forEach(item => {
      const productId = item.product._id || item.product;
      const productName = item.product.name || 'Unknown Product';
      
      if (!productSales[productId]) {
        productSales[productId] = {
          name: productName,
          totalQuantity: 0,
          totalRevenue: 0
        };
      }
      
      productSales[productId].totalQuantity += item.quantity;
      productSales[productId].totalRevenue += (item.product.price || 0) * item.quantity;
    });
  });
  
  return Object.values(productSales)
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 5);
};

  const getRevenueByMonth = () => {
  const monthlyData = {};
  const last6Months = Array.from({length: 6}, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date.toISOString().substring(0, 7); // YYYY-MM format
  }).reverse();
  
  // Initialize months
  last6Months.forEach(month => {
    monthlyData[month] = { revenue: 0, orders: 0 };
  });
  
  orders.forEach(order => {
    const orderMonth = order.createdAt?.substring(0, 7);
    if (monthlyData[orderMonth]) {
      const orderRevenue = order.items?.reduce((sum, item) => 
        sum + ((item.product.price || 0) * item.quantity), 0) || 0;
      
      monthlyData[orderMonth].revenue += orderRevenue;
      monthlyData[orderMonth].orders += 1;
    }
  });
  
  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    revenue: data.revenue,
    orders: data.orders
  }));
};

  const getLowStockProducts = () => {
  return products.filter(product => 
    product.stock <= (product.lowStockThreshold || 10)
  ).map(product => ({
    name: product.name,
    currentStock: product.stock,
    threshold: product.lowStockThreshold || 10,
    stockLevel: product.stock === 0 ? 'Out of Stock' : 'Low Stock'
  }));
};



  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [productsData, ordersData] = await Promise.all([
        api.products.getProductsBySupplierId(user._id),
        api.supplier.getOrders(user.token)
      ]);

      const productsArray = Array.isArray(productsData) ? productsData : [];
      const ordersArray = Array.isArray(ordersData) ? ordersData : [];

      setProducts(productsArray);
      setOrders(ordersArray);

      setStats({
        totalProducts: productsArray.length,
        totalOrders: ordersArray.length,
        pendingOrders: ordersArray.filter(order => order.status === 'pending').length,
        completedOrders: ordersArray.filter(order => order.status === 'delivered').length
      });
      // Update functions to use the local arrays directly
const getTopSellingProductsFromArray = (orders) => {
  const productSales = {};
  
  orders.forEach(order => {
    order.items?.forEach(item => {
      const productId = item.product._id || item.product;
      const productName = item.product.name || 'Unknown Product';
      
      if (!productSales[productId]) {
        productSales[productId] = {
          name: productName,
          totalQuantity: 0,
          totalRevenue: 0
        };
      }
      
      productSales[productId].totalQuantity += item.quantity;
      productSales[productId].totalRevenue += (item.product.price || 0) * item.quantity;
    });
  });
  
  return Object.values(productSales)
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 5);
};

const getRevenueByMonthFromArray = (orders) => {
  const monthlyData = {};
  const last6Months = Array.from({length: 6}, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date.toISOString().substring(0, 7);
  }).reverse();
  
  last6Months.forEach(month => {
    monthlyData[month] = { revenue: 0, orders: 0 };
  });
  
  orders.forEach(order => {
    const orderMonth = order.createdAt?.substring(0, 7);
    if (monthlyData[orderMonth]) {
      const orderRevenue = order.items?.reduce((sum, item) => 
        sum + ((item.product.price || 0) * item.quantity), 0) || 0;
      
      monthlyData[orderMonth].revenue += orderRevenue;
      monthlyData[orderMonth].orders += 1;
    }
  });
  
  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    revenue: data.revenue,
    orders: data.orders
  }));
};

const getLowStockProductsFromArray = (products) => {
  return products.filter(product => 
    product.stock <= (product.lowStockThreshold || 10)
  ).map(product => ({
    name: product.name,
    currentStock: product.stock,
    threshold: product.lowStockThreshold || 10,
    stockLevel: product.stock === 0 ? 'Out of Stock' : 'Low Stock'
  }));
};

setChartData({
  topProducts: getTopSellingProductsFromArray(ordersArray),
  monthlyRevenue: getRevenueByMonthFromArray(ordersArray),
  lowStockItems: getLowStockProductsFromArray(productsArray)
});
    } catch (err) {
      console.error('Load analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>

    {/* Enhanced Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="text-sm font-medium text-gray-600">Total Products</div>
        <div className="text-2xl font-bold text-gray-900">{stats.totalProducts}</div>
      </div>
      
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="text-sm font-medium text-gray-600">Total Orders</div>
        <div className="text-2xl font-bold text-blue-600">{stats.totalOrders}</div>
      </div>
      
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="text-sm font-medium text-gray-600">Low Stock Items</div>
        <div className="text-2xl font-bold text-red-600">
          {chartData.lowStockItems.length}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="text-sm font-medium text-gray-600">Total Revenue</div>
        <div className="text-2xl font-bold text-green-600">
          ₹{orders.reduce((total, order) => total + (order.items?.reduce((sum, item) => sum + ((item.product.price || 0) * item.quantity), 0) || 0), 0)}
        </div>
      </div>
    </div>

    {/* Product Stock & Recent Orders */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Stock Status</h3>
        {products.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No products yet</p>
        ) : (
          <div className="space-y-3">
            {products.slice(0, 5).map((product) => (
              <div key={product._id} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  {product.imageUrl && (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">₹{product.price} per {product.unit}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.stock > product.lowStockThreshold 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock} {product.unit}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No orders yet</p>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order._id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">
                    {order.vendor?.name || 'Unknown Vendor'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Charts Section */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
        <div className="space-y-3">
          {chartData.topProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-700">{product.name}</span>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{width: `${chartData.topProducts.length > 0 ? (product.totalQuantity / Math.max(...chartData.topProducts.map(p => p.totalQuantity))) * 100 : 0}%`}}
                  />
                </div>
                <span className="font-semibold">{product.totalQuantity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend (Last 6 Months)</h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {chartData.monthlyRevenue.map((month, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="bg-orange-500 rounded-t w-full min-h-[20px]" 
                style={{height: `${chartData.monthlyRevenue.length > 0 ? (month.revenue / Math.max(...chartData.monthlyRevenue.map(m => m.revenue || 1))) * 200 : 20}px`}}
              />
              <span className="text-xs text-gray-600 mt-2">{month.month.split('-')[1]}</span>
              <span className="text-xs font-semibold">₹{month.revenue}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
};

// Vendor Dashboard - Main Component
const VendorDashboard = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('browse');

  const tabs = [
    { id: 'browse', name: 'Browse Products', icon: '🛒' },
    { id: 'orders', name: 'My Orders', icon: '📋' },
    { id: 'analytics', name: 'Analytics', icon: '📊' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'browse':
        return <VendorBrowseProducts user={user} />;
      case 'orders':
        return <VendorOrderHistory user={user} />;
      case 'analytics':
        return <VendorAnalytics user={user} />;
      default:
        return <VendorBrowseProducts user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}!</p>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

// Supplier Dashboard - Main Component
const SupplierDashboard = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'products', name: 'Products', icon: '📦' },
    { id: 'orders', name: 'Orders', icon: '📋' },
    { id: 'analytics', name: 'Analytics', icon: '📈' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductManagement user={user} />;
      case 'orders':
        return <OrderManagement user={user} />;
      case 'analytics':
        return <SupplierAnalytics user={user} />;
      default:
        return <SupplierAnalytics user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Supplier Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}!</p>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);

  const handleNavigate = (page, user = null) => {
    setCurrentPage(page);
    if (user) {
      setCurrentUser(user);
    } else if (page === 'home') {
      setCurrentUser(null);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'register':
        return <RegisterPage onNavigate={handleNavigate} />;
      case 'vendor-dashboard':
        return <VendorDashboard user={currentUser} onNavigate={handleNavigate} />;
      case 'supplier-dashboard':
        return <SupplierDashboard user={currentUser} onNavigate={handleNavigate} />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="App">
      <ConnectionStatus />
      {renderPage()}
    </div>
  );
};

export default App;