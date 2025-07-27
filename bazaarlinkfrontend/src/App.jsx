import React, { createContext, useContext, useState, useEffect } from 'react';

// ============================================================================
// CONTEXT & HOOKS
// ============================================================================

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('bazaar_token');
    const userData = localStorage.getItem('bazaar_user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('bazaar_token');
        localStorage.removeItem('bazaar_user');
      }
    }
    setLoading(false);
  }, []);
  
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('bazaar_token', userData.token);
    localStorage.setItem('bazaar_user', JSON.stringify(userData));
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('bazaar_token');
    localStorage.removeItem('bazaar_user');
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// API Hook with complete implementation
const useAPI = () => {
  const BASE_URL = 'https://bazaar-link-backend.vercel.app/api';
  
  const getHeaders = () => {
    const token = localStorage.getItem('bazaar_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  };
  
  return {
    // Auth endpoints
    login: async (phone, password) => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });
      return response.json();
    },
    
    register: async (data) => {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    
    // Vendor endpoints
    vendor: {
      getProfile: async () => {
        const response = await fetch(`${BASE_URL}/vendor/profile`, { headers: getHeaders() });
        return response.json();
      },
      getProducts: async () => {
        const response = await fetch(`${BASE_URL}/vendor/products`, { headers: getHeaders() });
        return response.json();
      },
      getSuppliers: async () => {
        const response = await fetch(`${BASE_URL}/vendor/suppliers`, { headers: getHeaders() });
        return response.json();
      },
      getOrders: async () => {
        const response = await fetch(`${BASE_URL}/vendor/orders`, { headers: getHeaders() });
        return response.json();
      },
      placeOrder: async (orderData) => {
        const response = await fetch(`${BASE_URL}/vendor/order`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(orderData)
        });
        return response.json();
      },
      placeGroupOrder: async (orderData) => {
        const response = await fetch(`${BASE_URL}/vendor/group-order`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(orderData)
        });
        return response.json();
      }
    },
    
    // Supplier endpoints
    supplier: {
      getProfile: async () => {
        const response = await fetch(`${BASE_URL}/supplier/profile`, { headers: getHeaders() });
        return response.json();
      },
      getOrders: async () => {
        const response = await fetch(`${BASE_URL}/supplier/orders`, { headers: getHeaders() });
        return response.json();
      },
      fulfillOrder: async (orderId) => {
        const response = await fetch(`${BASE_URL}/supplier/order/${orderId}`, {
          method: 'PATCH',
          headers: getHeaders()
        });
        return response.json();
      },
      addProduct: async (formData) => {
        const token = localStorage.getItem('bazaar_token');
        const response = await fetch(`${BASE_URL}/supplier/product`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });
        return response.json();
      },
      getLowStock: async () => {
        const response = await fetch(`${BASE_URL}/supplier/products/low-stock`, { headers: getHeaders() });
        return response.json();
      },
      restockProduct: async (productId, quantity) => {
        const response = await fetch(`${BASE_URL}/supplier/product/${productId}/restock`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ quantity })
        });
        return response.json();
      },
      predictRestock: async () => {
        const response = await fetch(`${BASE_URL}/supplier/predict-restock`, { headers: getHeaders() });
        return response.json();
      }
    }
  };
};

// ============================================================================
// ROUTER COMPONENT
// ============================================================================

const Router = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const { user, loading } = useAuth();
  
  const navigate = (page) => {
    setCurrentPage(page);
  };
  
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#000',
        color: '#ff6600',
        fontSize: '20px'
      }}>
        Loading...
      </div>
    );
  }
  
  // Route logic
  if (!user) {
  if (currentPage === 'auth') {
    return <AuthPage navigate={navigate} />;
  }
  if (currentPage === 'register') {
    return <RegisterPage navigate={navigate} />;
  }
  return <LandingPage navigate={navigate} />;
}

  
  // User is logged in
  if (user.role === 'vendor') {
    return <VendorDashboard navigate={navigate} />;
  } else if (user.role === 'supplier') {
    return <SupplierDashboard navigate={navigate} />;
  }
  
  return <LandingPage navigate={navigate} />;
};

// ============================================================================
// COMPONENTS
// ============================================================================

// Header Component
const Header = ({ navigate, showAuthButtons = true }) => {
  const { user, logout } = useAuth();
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 102, 0, 0.3)',
      padding: '16px 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          fontSize: '28px',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #ff6600, #ff8c42)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          cursor: 'pointer'
        }}>
          BazaarLink
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <>
              <span style={{ color: 'white', fontSize: '16px' }}>
                Welcome, {user.name} ({user.role})
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate('landing');
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            showAuthButtons && (
              <>
                <button
                  onClick={() => navigate('auth')}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#ff6600',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '16px'
                  }}
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('auth')}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'transparent',
                    color: '#ff6600',
                    border: '2px solid #ff6600',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '16px'
                  }}
                >
                  Register
                </button>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

// Landing Page - Shows when NO user is logged in
const LandingPage = ({ navigate }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      color: 'white'
    }}>
      <Header navigate={navigate} />
      
      <div style={{
        paddingTop: '100px',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 24px'
      }}>
        <div>
          <h1 style={{
            fontSize: 'clamp(48px, 8vw, 120px)',
            fontWeight: 'bold',
            marginBottom: '32px',
            background: 'linear-gradient(45deg, #ff6600, #ff8c42, #dc2626)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            BazaarLink
          </h1>
          
          <p style={{
            fontSize: 'clamp(18px, 3vw, 24px)',
            color: '#e5e7eb',
            marginBottom: '48px',
            maxWidth: '800px',
            lineHeight: 1.6
          }}>
            Revolutionizing B2B marketplace with smart inventory management, group ordering, and real-time analytics
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '48px',
            maxWidth: '900px'
          }}>
            <div style={{
              backgroundColor: '#1f1f1f',
              border: '1px solid #374151',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff6600', marginBottom: '16px' }}>Smart Inventory</h3>
              <p style={{ color: '#9ca3af' }}>AI-powered stock predictions and automated reorder points</p>
            </div>
            
            <div style={{
              backgroundColor: '#1f1f1f',
              border: '1px solid #374151',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤝</div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff6600', marginBottom: '16px' }}>Group Orders</h3>
              <p style={{ color: '#9ca3af' }}>Collaborative purchasing power with bulk discounts</p>
            </div>
            
            <div style={{
              backgroundColor: '#1f1f1f',
              border: '1px solid #374151',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff6600', marginBottom: '16px' }}>Real-time Analytics</h3>
              <p style={{ color: '#9ca3af' }}>Live dashboards with actionable business insights</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
            <button
              onClick={() => navigate('auth')}
              style={{
                padding: '16px 48px',
                background: 'linear-gradient(45deg, #ff6600, #dc2626)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                ':hover': { transform: 'scale(1.05)' }
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Auth Page with WORKING login/register
const AuthPage = ({ navigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form data
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState('vendor');
  const [aadhaar, setAadhaar] = useState('');
  const [gstin, setGstin] = useState('');
  
  const { login } = useAuth();
  const api = useAPI();
  
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        // LOGIN
        const result = await api.login(phone, password);
        if (result.token) {
          login(result);
          // Will automatically redirect via Router
        } else {
          setError(result.message || 'Login failed');
        }
      } else {
        // REGISTER
        const registerData = {
          name,
          phone,
          location,
          password,
          role,
          kyc: { aadhaar, gstin }
        };
        
        const result = await api.register(registerData);
        if (result.token) {
          login(result);
          // Will automatically redirect via Router
        } else {
          setError(result.message || 'Registration failed');
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
      color: 'white'
    }}>
      <Header navigate={navigate} showAuthButtons={false} />
      
      <div style={{
        paddingTop: '100px',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px'
      }}>
        <div style={{
          backgroundColor: '#1f1f1f',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '400px',
          width: '100%',
          border: '1px solid rgba(255, 102, 0, 0.2)'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '32px',
            color: '#ff6600'
          }}>
            {isLogin ? 'Welcome Back' : 'Join BazaarLink'}
          </h2>
          
          {error && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid #ef4444',
              color: '#ef4444',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {!isLogin && (
              <>
                <div>
                  <label style={{ display: 'block', color: '#9ca3af', marginBottom: '8px' }}>Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: '#374151',
                      border: '1px solid #6b7280',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', color: '#9ca3af', marginBottom: '8px' }}>Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: '#374151',
                      border: '1px solid #6b7280',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', color: '#9ca3af', marginBottom: '8px' }}>Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: '#374151',
                      border: '1px solid #6b7280',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="vendor">Vendor</option>
                    <option value="supplier">Supplier</option>
                  </select>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#9ca3af', marginBottom: '8px' }}>Aadhaar</label>
                    <input
                      type="text"
                      value={aadhaar}
                      onChange={(e) => setAadhaar(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: '#374151',
                        border: '1px solid #6b7280',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '16px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', color: '#9ca3af', marginBottom: '8px' }}>GSTIN</label>
                    <input
                      type="text"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: '#374151',
                        border: '1px solid #6b7280',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '16px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              </>
            )}
            
            <div>
              <label style={{ display: 'block', color: '#9ca3af', marginBottom: '8px' }}>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#374151',
                  border: '1px solid #6b7280',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', color: '#9ca3af', marginBottom: '8px' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#374151',
                  border: '1px solid #6b7280',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#ff6600',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
            </button>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ff6600',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '16px'
              }}
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Vendor Dashboard with WORKING API calls
const VendorDashboard = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderSubTab, setOrderSubTab] = useState('pending'); // For My Orders sub-tabs
  
  const { user } = useAuth();
  const api = useAPI();
  
  // LOAD DATA ON TAB CHANGE - THIS IS THE API CALLING YOU WERE ASKING ABOUT
  useEffect(() => {
    loadData();
  }, [activeTab]);
  
  const loadData = async () => {
    setLoading(true);
    try {
      console.log('Loading data for tab:', activeTab); // Debug log
      
      if (activeTab === 'products') {
        const result = await api.vendor.getProducts();
        console.log('Products loaded:', result); // Debug log
        setProducts(Array.isArray(result) ? result : []);
      } else if (activeTab === 'suppliers') {
        const result = await api.vendor.getSuppliers();
        console.log('Suppliers loaded:', result); // Debug log
        setSuppliers(Array.isArray(result) ? result : []);
      } else if (activeTab === 'orders') {
        const result = await api.vendor.getOrders();
        console.log('Orders loaded:', result); // Debug log
        setOrders(Array.isArray(result) ? result : []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item => 
          item._id === product._id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };
  
  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(prev => prev.filter(item => item._id !== productId));
    } else {
      setCart(prev => prev.map(item => 
        item._id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };
  
  const submitReview = async (supplierId, rating, comment) => {
    try {
      await api.vendor.leaveReview(supplierId, { rating, comment });
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };
  
  const placeOrder = async () => {
    if (cart.length === 0) return;
    
    setLoading(true);
    try {
      // Group items by supplier
      const ordersBySupplier = cart.reduce((acc, item) => {
        const supplierId = item.supplier._id;
        if (!acc[supplierId]) {
          acc[supplierId] = {
            supplier: supplierId,
            items: []
          };
        }
        acc[supplierId].items.push({
          product: item._id,
          quantity: item.quantity
        });
        return acc;
      }, {});
      
      // Determine if individual or group order based on number of suppliers
      const supplierCount = Object.keys(ordersBySupplier).length;
      const isGroupOrder = supplierCount > 1;
      
      // Place orders
      for (const orderData of Object.values(ordersBySupplier)) {
        if (isGroupOrder) {
          await api.vendor.placeGroupOrder(orderData);
        } else {
          await api.vendor.placeOrder(orderData);
        }
      }
      
      setCart([]);
      setActiveTab('orders');
      await loadData(); // Reload orders
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.supplier?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate analytics from orders
  const calculateAnalytics = () => {
    const analytics = {
      totalSpending: 0,
      mostOrderedItems: {},
      totalItems: 0,
      supplierStats: {}
    };
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const itemTotal = (item.product?.price || 0) * item.quantity;
        analytics.totalSpending += itemTotal;
        analytics.totalItems += item.quantity;
        
        // Track most ordered items
        const productName = item.product?.name || 'Unknown';
        if (!analytics.mostOrderedItems[productName]) {
          analytics.mostOrderedItems[productName] = 0;
        }
        analytics.mostOrderedItems[productName] += item.quantity;
        
        // Track supplier stats
        const supplierName = order.supplier?.name || 'Unknown';
        if (!analytics.supplierStats[supplierName]) {
          analytics.supplierStats[supplierName] = 0;
        }
        analytics.supplierStats[supplierName] += itemTotal;
      });
    });
    
    // Sort items by quantity
    const sortedItems = Object.entries(analytics.mostOrderedItems)
      .sort(([,a], [,b]) => b - a);
    
    analytics.topItem = sortedItems[0] || ['No orders yet', 0];
    analytics.leastItem = sortedItems[sortedItems.length - 1] || ['No orders yet', 0];
    
    return analytics;
  };
  
  const analytics = calculateAnalytics();
  
  return (
    <div style={{ backgroundColor: '#111827', minHeight: '100vh', color: 'white' }}>
      <Header navigate={navigate} />
      
      <div style={{ display: 'flex', paddingTop: '80px' }}>
        {/* Sidebar */}
        <div style={{
          width: '280px',
          height: 'calc(100vh - 80px)',
          backgroundColor: '#1f1f1f',
          borderRight: '1px solid #374151',
          padding: '24px',
          position: 'fixed',
          overflowY: 'auto'
        }}>
          <h2 style={{ color: '#ff6600', marginBottom: '24px', fontSize: '20px', fontWeight: 'bold' }}>
            Vendor Portal
          </h2>
          
          {[
            { id: 'dashboard', label: '📊 Dashboard' },
            { id: 'products', label: '🛍️ Browse Products' },
            { id: 'suppliers', label: '🏢 Suppliers' },
            { id: 'orders', label: '📦 My Orders' }
          ].map(tab => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 16px',
                margin: '4px 0',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: activeTab === tab.id ? '#ff6600' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#9ca3af',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </div>
          ))}
        </div>
        
        {/* Main Content */}
        <div style={{
          marginLeft: '280px',
          padding: '32px',
          width: 'calc(100% - 280px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px'
        }}>
          
          {activeTab === 'dashboard' && (
            <>
              <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>
                Welcome back, {user.name}!
              </h1>
              
              {/* Analytics Cards */}
              <div style={{ display: 'flex', gap: '24px', width: '100%' }}>
                <div style={{
                  flex: 1,
                  backgroundColor: '#1f1f1f',
                  border: '1px solid #374151',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '16px' }}>💰</div>
                  <h3 style={{ color: '#22c55e', marginBottom: '8px' }}>Total Spending</h3>
                  <p style={{ fontSize: '24px', fontWeight: 'bold' }}>₹{analytics.totalSpending.toFixed(2)}</p>
                </div>
                
                <div style={{
                  flex: 1,
                  backgroundColor: '#1f1f1f',
                  border: '1px solid #374151',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '16px' }}>📦</div>
                  <h3 style={{ color: '#3b82f6', marginBottom: '8px' }}>Total Items Ordered</h3>
                  <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{analytics.totalItems}</p>
                </div>
                
                <div style={{
                  flex: 1,
                  backgroundColor: '#1f1f1f',
                  border: '1px solid #374151',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '16px' }}>📋</div>
                  <h3 style={{ color: '#ff6600', marginBottom: '8px' }}>Total Orders</h3>
                  <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{orders.length}</p>
                </div>
              </div>
              
              {/* Order Analytics */}
              <div style={{ display: 'flex', gap: '24px', width: '100%' }}>
                <div style={{
                  flex: 1,
                  backgroundColor: '#1f1f1f',
                  border: '1px solid #374151',
                  borderRadius: '16px',
                  padding: '24px'
                }}>
                  <h3 style={{ color: '#22c55e', marginBottom: '16px' }}>🏆 Most Ordered Item</h3>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>{analytics.topItem[0]}</p>
                  <p style={{ color: '#6b7280' }}>Quantity: {analytics.topItem[1]}</p>
                </div>
                
                <div style={{
                  flex: 1,
                  backgroundColor: '#1f1f1f',
                  border: '1px solid #374151',
                  borderRadius: '16px',
                  padding: '24px'
                }}>
                  <h3 style={{ color: '#ef4444', marginBottom: '16px' }}>📉 Least Ordered Item</h3>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>{analytics.leastItem[0]}</p>
                  <p style={{ color: '#6b7280' }}>Quantity: {analytics.leastItem[1]}</p>
                </div>
              </div>
              
              {/* Cart Section - Only show if cart has items */}
              {cart.length > 0 && (
                <div style={{
                  backgroundColor: '#1f1f1f',
                  border: '1px solid #374151',
                  borderRadius: '16px',
                  padding: '24px'
                }}>
                  <h3 style={{ color: '#ff6600', marginBottom: '16px' }}>🛒 Current Cart ({cart.length} items)</h3>
                  
                  <div style={{ marginBottom: '24px' }}>
                    {cart.map(item => (
                      <div key={item._id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 0',
                        borderBottom: '1px solid #374151'
                      }}>
                        <span>{item.name} x{item.quantity}</span>
                        <span style={{ color: '#22c55e', fontWeight: 'bold' }}>
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={placeOrder}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '12px 24px',
                      backgroundColor: '#ff6600',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '16px',
                      opacity: loading ? 0.7 : 1
                    }}
                  >
                    {loading ? 'Placing Order...' : `Place Order (${Object.keys(cart.reduce((acc, item) => ({ ...acc, [item.supplier._id]: true }), {})).length > 1 ? 'Group' : 'Individual'})`}
                  </button>
                </div>
              )}
            </>
          )}
          
          {activeTab === 'products' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Browse Products</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <input
                    type="text"
                    placeholder="🔍 Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '300px',
                      padding: '12px 16px',
                      backgroundColor: '#374151',
                      border: '2px solid #ff6600',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                  />
                  {cart.length > 0 && (
                    <div style={{
                      backgroundColor: '#ff6600',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      🛒 {cart.length} items
                    </div>
                  )}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '32px' }}>
                {/* Products Grid */}
                <div style={{ flex: 2 }}>
                  {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#ff6600' }}>
                      Loading products...
                    </div>
                  ) : (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                      gap: '24px'
                    }}>
                      {filteredProducts.map(product => {
                        const cartItem = cart.find(item => item._id === product._id);
                        const inCart = !!cartItem;
                        const cartQuantity = cartItem?.quantity || 0;
                        
                        return (
                          <div key={product._id} style={{
                            backgroundColor: '#1f1f1f',
                            border: inCart ? '2px solid #ff6600' : '1px solid #374151',
                            borderRadius: '16px',
                            padding: '24px',
                            position: 'relative'
                          }}>
                            {/* Quantity Badge */}
                            {inCart && (
                              <div style={{
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                                backgroundColor: '#ff6600',
                                color: 'white',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 'bold'
                              }}>
                                {cartQuantity}
                              </div>
                            )}
                            
                            {product.imageUrl && (
                              <img 
                                src={product.imageUrl} 
                                alt={product.name}
                                style={{
                                  width: '100%',
                                  height: '192px',
                                  objectFit: 'cover',
                                  borderRadius: '8px',
                                  marginBottom: '16px'
                                }}
                              />
                            )}
                            
                            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
                              {product.name}
                            </h3>
                            <p style={{ color: '#6b7280', marginBottom: '8px' }}>
                              by {product.supplier?.name}
                            </p>
                            
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '16px'
                            }}>
                              <span style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '20px' }}>
                                ₹{product.price}/{product.unit}
                              </span>
                              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                                Stock: {product.stock}
                              </span>
                            </div>
                            
                            {inCart && (
                              <div style={{
                                backgroundColor: 'rgba(255, 102, 0, 0.1)',
                                border: '1px solid #ff6600',
                                borderRadius: '8px',
                                padding: '12px',
                                marginBottom: '12px'
                              }}>
                                <div style={{
                                  color: '#ff6600',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  textAlign: 'center',
                                  marginBottom: '12px'
                                }}>
                                  ✓ Added to Cart
                                </div>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '12px'
                                }}>
                                  <button
                                    onClick={() => updateCartQuantity(product._id, cartQuantity - 1)}
                                    style={{
                                      width: '32px',
                                      height: '32px',
                                      borderRadius: '50%',
                                      backgroundColor: '#374151',
                                      color: 'white',
                                      border: 'none',
                                      cursor: 'pointer',
                                      fontSize: '18px',
                                      fontWeight: 'bold',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                  >
                                    -
                                  </button>
                                  <span style={{
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    color: '#ff6600',
                                    minWidth: '20px',
                                    textAlign: 'center'
                                  }}>
                                    {cartQuantity}
                                  </span>
                                  <button
                                    onClick={() => updateCartQuantity(product._id, cartQuantity + 1)}
                                    disabled={cartQuantity >= product.stock}
                                    style={{
                                      width: '32px',
                                      height: '32px',
                                      borderRadius: '50%',
                                      backgroundColor: cartQuantity >= product.stock ? '#6b7280' : '#ff6600',
                                      color: 'white',
                                      border: 'none',
                                      cursor: cartQuantity >= product.stock ? 'not-allowed' : 'pointer',
                                      fontSize: '18px',
                                      fontWeight: 'bold',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            )}
                            
                            <button
                              onClick={() => addToCart(product)}
                              disabled={product.stock === 0}
                              style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: product.stock === 0 ? '#6b7280' : (inCart ? '#059669' : '#ff6600'),
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                                fontWeight: '600'
                              }}
                            >
                              {product.stock === 0 ? 'Out of Stock' : (inCart ? 'Add More' : 'Add to Cart')}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                {/* Cart Section */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <div style={{
                    backgroundColor: '#1f1f1f',
                    border: '1px solid #374151',
                    borderRadius: '16px',
                    padding: '24px',
                    position: 'sticky',
                    top: '32px'
                  }}>
                    <h3 style={{ color: '#ff6600', marginBottom: '16px', fontSize: '20px', fontWeight: 'bold' }}>
                      🛒 Shopping Cart ({cart.length})
                    </h3>
                    
                    {cart.length === 0 ? (
                      <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: '#6b7280'
                      }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
                        <p>Your cart is empty</p>
                        <p style={{ fontSize: '14px' }}>Add products to get started</p>
                      </div>
                    ) : (
                      <>
                        <div style={{ marginBottom: '24px', maxHeight: '400px', overflowY: 'auto' }}>
                          {cart.map(item => (
                            <div key={item._id} style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '12px 0',
                              borderBottom: '1px solid #374151'
                            }}>
                              <div>
                                <div style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>
                                  {item.name}
                                </div>
                                <div style={{ color: '#6b7280', fontSize: '12px' }}>
                                  {item.supplier?.name} • Qty: {item.quantity}
                                </div>
                              </div>
                              <span style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '14px' }}>
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                        
                        <div style={{
                          borderTop: '2px solid #374151',
                          paddingTop: '16px',
                          marginBottom: '20px'
                        }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '18px',
                            fontWeight: 'bold'
                          }}>
                            <span style={{ color: 'white' }}>Total:</span>
                            <span style={{ color: '#22c55e' }}>
                              ₹{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        
                        <button
                          onClick={placeOrder}
                          disabled={loading}
                          style={{
                            width: '100%',
                            padding: '16px',
                            backgroundColor: '#ff6600',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '16px',
                            opacity: loading ? 0.7 : 1
                          }}
                        >
                          {loading ? 'Placing Order...' : 
                           `Place ${Object.keys(cart.reduce((acc, item) => ({ ...acc, [item.supplier._id]: true }), {})).length > 1 ? 'Group' : 'Individual'} Order`}
                        </button>
                        
                        <button
                          onClick={() => setCart([])}
                          style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: 'transparent',
                            color: '#ef4444',
                            border: '1px solid #ef4444',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '14px',
                            marginTop: '8px'
                          }}
                        >
                          Clear Cart
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'suppliers' && (
            <>
              <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Suppliers</h1>
              
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#ff6600' }}>
                  Loading suppliers...
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '24px'
                }}>
                  {suppliers.map(supplier => (
                    <div key={supplier._id} style={{
                      backgroundColor: '#1f1f1f',
                      border: '1px solid #374151',
                      borderRadius: '16px',
                      padding: '24px'
                    }}>
                      <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
                        {supplier.name}
                      </h3>
                      <p style={{ color: '#6b7280', marginBottom: '4px' }}>
                        📍 {supplier.location}
                      </p>
                      <p style={{ color: '#6b7280' }}>
                        📞 {supplier.phone}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          
          {activeTab === 'orders' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>My Orders</h1>
              </div>
              
              {/* Sub-tabs for Orders */}
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                marginBottom: '32px',
                borderBottom: '1px solid #374151',
                paddingBottom: '16px'
              }}>
                <button
                  onClick={() => setOrderSubTab('pending')}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: orderSubTab === 'pending' ? '#ff6600' : 'transparent',
                    color: orderSubTab === 'pending' ? 'white' : '#9ca3af',
                    border: orderSubTab === 'pending' ? 'none' : '1px solid #374151',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '16px',
                    transition: 'all 0.2s'
                  }}
                >
                  Pending Orders
                </button>
                <button
                  onClick={() => setOrderSubTab('delivered')}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: orderSubTab === 'delivered' ? '#ff6600' : 'transparent',
                    color: orderSubTab === 'delivered' ? 'white' : '#9ca3af',
                    border: orderSubTab === 'delivered' ? 'none' : '1px solid #374151',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '16px',
                    transition: 'all 0.2s'
                  }}
                >
                  Delivered Orders
                </button>
              </div>
              
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#ff6600' }}>
                  Loading orders...
                </div>
              ) : (
                (() => {
                  const filteredOrders = orders.filter(order => {
                    if (orderSubTab === 'pending') {
                      return order.status === 'pending' || order.status === 'confirmed';
                    } else {
                      return order.status === 'delivered';
                    }
                  });
                  
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      {filteredOrders.length === 0 ? (
                        <div style={{
                          textAlign: 'center',
                          padding: '60px 20px',
                          color: '#6b7280',
                          backgroundColor: '#1f1f1f',
                          borderRadius: '16px'
                        }}>
                          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                          <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>
                            No {orderSubTab} orders found
                          </h3>
                          <p>
                            {orderSubTab === 'pending' 
                              ? 'Place your first order to see it here!' 
                              : 'No delivered orders yet.'}
                          </p>
                        </div>
                      ) : (
                        filteredOrders.map(order => (
                          <div key={order._id} style={{
                            backgroundColor: '#1f1f1f',
                            border: '1px solid #374151',
                            borderRadius: '16px',
                            padding: '24px'
                          }}>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              marginBottom: '16px'
                            }}>
                              <div>
                                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
                                  Order #{order._id.slice(-6)}
                                </h3>
                                <p style={{ color: '#6b7280', marginBottom: '4px' }}>
                                  Supplier: {order.supplier?.name}
                                </p>
                                <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                                  {new Date(order.createdAt).toLocaleDateString()} • {order.type} order
                                </p>
                              </div>
                              
                              <span style={{
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                backgroundColor: order.status === 'delivered' ? 'rgba(34, 197, 94, 0.2)' :
                                                order.status === 'confirmed' ? 'rgba(59, 130, 246, 0.2)' :
                                                'rgba(251, 191, 36, 0.2)',
                                color: order.status === 'delivered' ? '#22c55e' :
                                       order.status === 'confirmed' ? '#3b82f6' :
                                       '#fbbf24'
                              }}>
                                {order.status}
                              </span>
                            </div>
                            
                            <div>
                              {order.items.map((item, index) => (
                                <div key={index} style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  padding: '8px 0',
                                  borderBottom: index < order.items.length - 1 ? '1px solid #374151' : 'none'
                                }}>
                                  <span style={{ color: '#d1d5db' }}>
                                    {item.product?.name} x{item.quantity}
                                  </span>
                                  <span style={{ color: '#22c55e', fontWeight: '500' }}>
                                    ₹{(item.product?.price * item.quantity || 0).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                              
                              <div style={{
                                marginTop: '16px',
                                paddingTop: '16px',
                                borderTop: '1px solid #374151',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}>
                                <span style={{ color: 'white', fontWeight: 'bold' }}>Order Total:</span>
                                <span style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '18px' }}>
                                  ₹{order.items.reduce((sum, item) => sum + (item.product?.price * item.quantity || 0), 0).toFixed(2)}
                                </span>
                              </div>
                              
                              {/* Review Button for Delivered Orders */}
                              {order.status === 'delivered' && (
                                <div style={{ marginTop: '16px' }}>
                                  <button
                                    onClick={() => {
                                      const rating = prompt('Rate this supplier (1-5 stars):');
                                      if (rating && rating >= 1 && rating <= 5) {
                                        const comment = prompt('Add a comment (optional):') || '';
                                        submitReview(order.supplier._id, parseInt(rating), comment);
                                      }
                                    }}
                                    style={{
                                      padding: '10px 20px',
                                      backgroundColor: '#3b82f6',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '8px',
                                      cursor: 'pointer',
                                      fontSize: '14px',
                                      fontWeight: '600'
                                    }}
                                  >
                                    ⭐ Leave Review
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  );
                })()
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Supplier Dashboard with WORKING API calls
const SupplierDashboard = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  
  const { user } = useAuth();
  const api = useAPI();
  
  // LOAD DATA ON TAB CHANGE - API CALLS
  useEffect(() => {
    loadData();
  }, [activeTab]);
  
  const loadData = async () => {
    setLoading(true);
    try {
      console.log('Loading supplier data for tab:', activeTab);
      
      if (activeTab === 'dashboard') {
        const [ordersResult, reviewsResult] = await Promise.all([
          api.supplier.getOrders(),
          // Mock reviews data - you can implement actual review endpoint
          Promise.resolve([
            { vendor: { name: 'John Store' }, rating: 5, comment: 'Great products and fast delivery!', createdAt: new Date().toISOString() },
            { vendor: { name: 'ABC Market' }, rating: 4, comment: 'Good quality items.', createdAt: new Date().toISOString() }
          ])
        ]);
        setOrders(Array.isArray(ordersResult) ? ordersResult : []);
        setReviews(Array.isArray(reviewsResult) ? reviewsResult : []);
      } else if (activeTab === 'orders') {
        const result = await api.supplier.getOrders();
        console.log('Supplier orders loaded:', result);
        setOrders(Array.isArray(result) ? result : []);
      } else if (activeTab === 'inventory') {
        const [lowStockResult, allProductsResult] = await Promise.all([
          api.supplier.getLowStock(),
          // Mock all products - you can implement actual endpoint
          Promise.resolve([
            { _id: '1', name: 'Rice', stock: 50, price: 40, unit: 'kg', lowStockThreshold: 10 },
            { _id: '2', name: 'Wheat', stock: 5, price: 35, unit: 'kg', lowStockThreshold: 15 },
            { _id: '3', name: 'Sugar', stock: 25, price: 45, unit: 'kg', lowStockThreshold: 10 }
          ])
        ]);
        setLowStockProducts(Array.isArray(lowStockResult) ? lowStockResult : []);
        setAllProducts(Array.isArray(allProductsResult) ? allProductsResult : []);
      } else if (activeTab === 'analytics') {
        const result = await api.supplier.predictRestock();
        console.log('Predictions loaded:', result);
        setPredictions(result);
      }
    } catch (error) {
      console.error('Error loading supplier data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fulfillOrder = async (orderId) => {
    try {
      await api.supplier.fulfillOrder(orderId);
      await loadData(); // Reload orders
    } catch (error) {
      console.error('Error fulfilling order:', error);
    }
  };
  
  return (
    <div style={{ backgroundColor: '#111827', minHeight: '100vh', color: 'white' }}>
      <Header navigate={navigate} />
      
      <div style={{ display: 'flex', paddingTop: '80px' }}>
        {/* Sidebar */}
        <div style={{
          width: '280px',
          height: 'calc(100vh - 80px)',
          backgroundColor: '#1f1f1f',
          borderRight: '1px solid #374151',
          padding: '24px',
          position: 'fixed',
          overflowY: 'auto'
        }}>
          <h2 style={{ color: '#22c55e', marginBottom: '24px', fontSize: '20px', fontWeight: 'bold' }}>
            Supplier Portal
          </h2>
          
          {[
            { id: 'dashboard', label: '📊 Dashboard' },
            { id: 'orders', label: '🛒 Orders' },
            { id: 'inventory', label: '📦 Inventory' },
            { id: 'analytics', label: '📈 Analytics' }
          ].map(tab => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 16px',
                margin: '4px 0',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: activeTab === tab.id ? '#22c55e' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#9ca3af',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </div>
          ))}
        </div>
        
        {/* Main Content */}
        <div style={{
          marginLeft: '280px',
          padding: '32px',
          width: 'calc(100% - 280px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px'
        }}>
          
          {activeTab === 'dashboard' && (
            <>
              <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>
                Supplier Dashboard
              </h1>
              
              <div style={{ display: 'flex', gap: '24px', width: '100%' }}>
                <div style={{
                  flex: 1,
                  backgroundColor: '#1f1f1f',
                  border: '1px solid #374151',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '16px' }}>🛒</div>
                  <h3 style={{ color: '#ff6600', marginBottom: '8px' }}>Pending Orders</h3>
                  <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {orders.filter(o => o.status === 'pending').length}
                  </p>
                </div>
                
                <div style={{
                  flex: 1,
                  backgroundColor: '#1f1f1f',
                  border: '1px solid #374151',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '16px' }}>📦</div>
                  <h3 style={{ color: '#22c55e', marginBottom: '8px' }}>Total Orders</h3>
                  <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{orders.length}</p>
                </div>
                
                <div style={{
                  flex: 1,
                  backgroundColor: '#1f1f1f',
                  border: '1px solid #374151',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '16px' }}>💰</div>
                  <h3 style={{ color: '#3b82f6', marginBottom: '8px' }}>Revenue</h3>
                  <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    ₹{orders.reduce((sum, order) => 
                      sum + order.items.reduce((itemSum, item) => 
                        itemSum + (item.product?.price * item.quantity || 0), 0), 0
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'orders' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Incoming Orders</h1>
              </div>
              
              {/* Sub-tabs for Orders */}
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                marginBottom: '32px',
                borderBottom: '1px solid #374151',
                paddingBottom: '16px'
              }}>
                <button
                  onClick={() => setOrderSubTab('pending')}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: orderSubTab === 'pending' ? '#22c55e' : 'transparent',
                    color: orderSubTab === 'pending' ? 'white' : '#9ca3af',
                    border: orderSubTab === 'pending' ? 'none' : '1px solid #374151',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '16px',
                    transition: 'all 0.2s'
                  }}
                >
                  Pending Orders
                </button>
                <button
                  onClick={() => setOrderSubTab('delivered')}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: orderSubTab === 'delivered' ? '#22c55e' : 'transparent',
                    color: orderSubTab === 'delivered' ? 'white' : '#9ca3af',
                    border: orderSubTab === 'delivered' ? 'none' : '1px solid #374151',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '16px',
                    transition: 'all 0.2s'
                  }}
                >
                  Delivered Orders
                </button>
              </div>
              
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#22c55e' }}>
                  Loading orders...
                </div>
              ) : (
                (() => {
                  const filteredOrders = orders.filter(order => {
                    if (orderSubTab === 'pending') {
                      return order.status === 'pending' || order.status === 'confirmed';
                    } else {
                      return order.status === 'delivered';
                    }
                  });
                  
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      {filteredOrders.length === 0 ? (
                        <div style={{
                          textAlign: 'center',
                          padding: '60px 20px',
                          color: '#6b7280',
                          backgroundColor: '#1f1f1f',
                          borderRadius: '16px'
                        }}>
                          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                          <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>
                            No {orderSubTab} orders found
                          </h3>
                          <p>
                            {orderSubTab === 'pending' 
                              ? 'No pending orders at the moment.' 
                              : 'No delivered orders yet.'}
                          </p>
                        </div>
                      ) : (
                        filteredOrders.map(order => (
                          <div key={order._id} style={{
                            backgroundColor: '#1f1f1f',
                            border: '1px solid #374151',
                            borderRadius: '16px',
                            padding: '24px'
                          }}>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              marginBottom: '16px'
                            }}>
                              <div>
                                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
                                  Order #{order._id.slice(-6)}
                                </h3>
                                <p style={{ color: '#6b7280', marginBottom: '4px' }}>
                                  From: {order.vendor?.name} ({order.vendor?.phone})
                                </p>
                                <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              
                              <div style={{ textAlign: 'right' }}>
                                <span style={{
                                  padding: '4px 12px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  textTransform: 'uppercase',
                                  backgroundColor: order.status === 'delivered' ? 'rgba(34, 197, 94, 0.2)' :
                                                  order.status === 'confirmed' ? 'rgba(59, 130, 246, 0.2)' :
                                                  'rgba(251, 191, 36, 0.2)',
                                  color: order.status === 'delivered' ? '#22c55e' :
                                         order.status === 'confirmed' ? '#3b82f6' :
                                         '#fbbf24'
                                }}>
                                  {order.status}
                                </span>
                                
                                {order.status === 'pending' && (
                                  <button
                                    onClick={() => fulfillOrder(order._id)}
                                    style={{
                                      display: 'block',
                                      marginTop: '8px',
                                      padding: '8px 16px',
                                      backgroundColor: '#22c55e',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '6px',
                                      cursor: 'pointer',
                                      fontSize: '14px',
                                      fontWeight: '600'
                                    }}
                                  >
                                    Mark as Delivered
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              {order.items.map((item, index) => (
                                <div key={index} style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  padding: '8px 0',
                                  borderBottom: index < order.items.length - 1 ? '1px solid #374151' : 'none'
                                }}>
                                  <span style={{ color: '#d1d5db' }}>
                                    {item.product?.name || 'Unknown Product'} x{item.quantity}
                                  </span>
                                  <span style={{ color: '#22c55e', fontWeight: '500' }}>
                                    ₹{(item.product?.price * item.quantity || 0).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  );
                })()
              )}
            </>
          )}
          
          {activeTab === 'inventory' && (
            <>
              <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Inventory Management</h1>
              
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#22c55e' }}>
                  Loading inventory...
                </div>
              ) : lowStockProducts.length > 0 ? (
                <div>
                  <h2 style={{ color: '#ff6600', marginBottom: '16px' }}>⚠️ Low Stock Products</h2>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px'
                  }}>
                    {lowStockProducts.map(product => (
                      <div key={product._id} style={{
                        backgroundColor: '#1f1f1f',
                        border: '1px solid #374151',
                        borderRadius: '16px',
                        padding: '24px'
                      }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                          {product.name}
                        </h3>
                        <p style={{ color: '#6b7280', marginBottom: '8px' }}>
                          Current Stock: <span style={{ color: '#ff6600', fontWeight: 'bold' }}>{product.stock}</span>
                        </p>
                        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                          Threshold: {product.lowStockThreshold}
                        </p>
                        <button
                          onClick={() => {
                            const quantity = prompt('Enter restock quantity:');
                            if (quantity) {
                              api.supplier.restockProduct(product._id, parseInt(quantity))
                                .then(() => loadData())
                                .catch(console.error);
                            }
                          }}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#22c55e',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}
                        >
                          Restock
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                  No low stock products found.
                </div>
              )}
            </>
          )}
          
          {activeTab === 'analytics' && (
            <>
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '32px' }}>Analytics & Insights</h1>
              
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#22c55e' }}>
                  Loading analytics...
                </div>
              ) : (
                <>
                  {/* Key Metrics Row */}
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
                    <div style={{
                      flex: 1,
                      backgroundColor: '#1f1f1f',
                      border: '1px solid #374151',
                      borderRadius: '16px',
                      padding: '20px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>📋</div>
                      <h3 style={{ color: '#3b82f6', marginBottom: '8px', fontSize: '16px' }}>Total Orders</h3>
                      <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>{orders.length}</p>
                    </div>
                    
                    <div style={{
                      flex: 1,
                      backgroundColor: '#1f1f1f',
                      border: '1px solid #374151',
                      borderRadius: '16px',
                      padding: '20px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
                      <h3 style={{ color: '#f59e0b', marginBottom: '8px', fontSize: '16px' }}>Pending Orders</h3>
                      <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                        {orders.filter(o => o.status === 'pending').length}
                      </p>
                    </div>
                    
                    <div style={{
                      flex: 1,
                      backgroundColor: '#1f1f1f',
                      border: '1px solid #374151',
                      borderRadius: '16px',
                      padding: '20px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>💰</div>
                      <h3 style={{ color: '#22c55e', marginBottom: '8px', fontSize: '16px' }}>Total Revenue</h3>
                      <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                        ₹{orders.reduce((sum, order) => 
                          sum + order.items.reduce((itemSum, item) => 
                            itemSum + (item.product?.price * item.quantity || 0), 0), 0
                        ).toFixed(2)}
                      </p>
                    </div>
                    
                    <div style={{
                      flex: 1,
                      backgroundColor: '#1f1f1f',
                      border: '1px solid #374151',
                      borderRadius: '16px',
                      padding: '20px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚠️</div>
                      <h3 style={{ color: '#ef4444', marginBottom: '8px', fontSize: '16px' }}>Low Stock Items</h3>
                      <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>{lowStockProducts.length}</p>
                    </div>
                  </div>
                  
                  {/* Charts Row */}
                  <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
                    {/* Top Selling Products */}
                    <div style={{
                      flex: 1,
                      backgroundColor: '#1f1f1f',
                      border: '1px solid #374151',
                      borderRadius: '16px',
                      padding: '24px'
                    }}>
                      <h3 style={{ color: '#22c55e', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
                        🏆 Top Selling Products
                      </h3>
                      
                      {(() => {
                        const productSales = {};
                        orders.forEach(order => {
                          order.items.forEach(item => {
                            const name = item.product?.name || 'Unknown';
                            productSales[name] = (productSales[name] || 0) + item.quantity;
                          });
                        });
                        
                        const sortedProducts = Object.entries(productSales)
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 5);
                        
                        return sortedProducts.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {sortedProducts.map(([name, quantity], index) => (
                              <div key={name} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px',
                                backgroundColor: '#374151',
                                borderRadius: '8px'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <span style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: index === 0 ? '#fbbf24' : index === 1 ? '#9ca3af' : index === 2 ? '#f59e0b' : '#6b7280',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    color: 'white'
                                  }}>
                                    {index + 1}
                                  </span>
                                  <span style={{ color: 'white', fontWeight: '500' }}>{name}</span>
                                </div>
                                <span style={{ color: '#22c55e', fontWeight: 'bold' }}>{quantity} sold</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>
                            No sales data available
                          </p>
                        );
                      })()}
                    </div>
                    
                    {/* Sales Over Time (Mock Chart) */}
                    <div style={{
                      flex: 1,
                      backgroundColor: '#1f1f1f',
                      border: '1px solid #374151',
                      borderRadius: '16px',
                      padding: '24px'
                    }}>
                      <h3 style={{ color: '#3b82f6', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
                        📈 Sales Over Time (Last 6 Months)
                      </h3>
                      
                      <div style={{
                        height: '200px',
                        display: 'flex',
                        alignItems: 'end',
                        justifyContent: 'space-around',
                        gap: '8px',
                        padding: '20px 0'
                      }}>
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => {
                          const height = Math.random() * 120 + 40; // Random height for demo
                          return (
                            <div key={month} style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              flex: 1
                            }}>
                              <div style={{
                                width: '30px',
                                height: `${height}px`,
                                backgroundColor: '#3b82f6',
                                borderRadius: '4px 4px 0 0',
                                marginBottom: '8px',
                                position: 'relative'
                              }}>
                                <span style={{
                                  position: 'absolute',
                                  top: '-20px',
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  fontSize: '12px',
                                  color: '#9ca3af',
                                  fontWeight: 'bold'
                                }}>
                                  ₹{Math.floor(height * 100)}
                                </span>
                              </div>
                              <span style={{ fontSize: '12px', color: '#9ca3af' }}>{month}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Status Distribution */}
                  <div style={{
                    backgroundColor: '#1f1f1f',
                    border: '1px solid #374151',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '32px'
                  }}>
                    <h3 style={{ color: '#f59e0b', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
                      📊 Order Status Distribution
                    </h3>
                    
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      {(() => {
                        const statusCounts = {
                          pending: orders.filter(o => o.status === 'pending').length,
                          confirmed: orders.filter(o => o.status === 'confirmed').length,
                          delivered: orders.filter(o => o.status === 'delivered').length
                        };
                        
                        const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);
                        
                        return (
                          <>
                            <div style={{ flex: 2 }}>
                              {Object.entries(statusCounts).map(([status, count]) => {
                                const percentage = total > 0 ? (count / total) * 100 : 0;
                                const color = status === 'delivered' ? '#22c55e' : 
                                             status === 'confirmed' ? '#3b82f6' : '#f59e0b';
                                
                                return (
                                  <div key={status} style={{ marginBottom: '12px' }}>
                                    <div style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      marginBottom: '4px'
                                    }}>
                                      <span style={{ color: 'white', textTransform: 'capitalize' }}>
                                        {status}
                                      </span>
                                      <span style={{ color: '#9ca3af' }}>
                                        {count} ({percentage.toFixed(1)}%)
                                      </span>
                                    </div>
                                    <div style={{
                                      width: '100%',
                                      height: '8px',
                                      backgroundColor: '#374151',
                                      borderRadius: '4px',
                                      overflow: 'hidden'
                                    }}>
                                      <div style={{
                                        width: `${percentage}%`,
                                        height: '100%',
                                        backgroundColor: color,
                                        borderRadius: '4px'
                                      }} />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            
                            <div style={{
                              flex: 1,
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}>
                              <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                background: `conic-gradient(
                                  #22c55e 0deg ${(statusCounts.delivered / total) * 360 || 0}deg,
                                  #3b82f6 ${(statusCounts.delivered / total) * 360 || 0}deg ${((statusCounts.delivered + statusCounts.confirmed) / total) * 360 || 0}deg,
                                  #f59e0b ${((statusCounts.delivered + statusCounts.confirmed) / total) * 360 || 0}deg 360deg
                                )`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                              }}>
                                <div style={{
                                  width: '80px',
                                  height: '80px',
                                  borderRadius: '50%',
                                  backgroundColor: '#1f1f1f',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexDirection: 'column'
                                }}>
                                  <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
                                    {total}
                                  </span>
                                  <span style={{ color: '#9ca3af', fontSize: '12px' }}>
                                    Total
                                  </span>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  
                  {/* AI Predictions Section */}
                  {predictions && (
                    <div style={{
                      backgroundColor: '#1f1f1f',
                      border: '1px solid #374151',
                      borderRadius: '16px',
                      padding: '24px'
                    }}>
                      <h3 style={{ color: '#8b5cf6', marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
                        🔮 AI Restock Predictions
                      </h3>
                      
                      {predictions.suggestions ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {predictions.suggestions.map((suggestion, index) => (
                            <div key={index} style={{
                              padding: '16px',
                              backgroundColor: '#374151',
                              borderRadius: '8px',
                              border: '1px solid #8b5cf6'
                            }}>
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '8px'
                              }}>
                                <h4 style={{ color: 'white', fontWeight: 'bold' }}>
                                  {suggestion.name}
                                </h4>
                                <span style={{
                                  backgroundColor: '#8b5cf6',
                                  color: 'white',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  fontWeight: 'bold'
                                }}>
                                  URGENT
                                </span>
                              </div>
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}>
                                <div>
                                  <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '4px' }}>
                                    Current Stock: <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
                                      {suggestion.currentStock}
                                    </span>
                                  </p>
                                  <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                                    Recent Orders: <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>
                                      {suggestion.orderedQuantity}
                                    </span>
                                  </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <p style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '16px' }}>
                                    Restock: {suggestion.suggestedRestock} units
                                  </p>
                                  <button
                                    onClick={() => {
                                      const confirm = window.confirm(`Restock ${suggestion.name} with ${suggestion.suggestedRestock} units?`);
                                      if (confirm) {
                                        alert('Restock order placed! (Mock action)');
                                      }
                                    }}
                                    style={{
                                      padding: '6px 12px',
                                      backgroundColor: '#22c55e',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '6px',
                                      cursor: 'pointer',
                                      fontSize: '12px',
                                      fontWeight: '600',
                                      marginTop: '4px'
                                    }}
                                  >
                                    🚀 Auto-Restock
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{
                          textAlign: 'center',
                          padding: '40px',
                          color: '#6b7280'
                        }}>
                          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
                          <p style={{ marginBottom: '8px' }}>{predictions.message}</p>
                          <p style={{ fontSize: '14px' }}>AI will analyze your data to provide smart restock suggestions</p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APP
// ============================================================================

const App = () => {
  // Apply global styles
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif';
    document.body.style.backgroundColor = '#000000';
    document.body.style.color = '#ffffff';
  }, []);
  
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
};

export default App;