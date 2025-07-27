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
      },
      leaveReview: async (supplierId, data) => {
        const response = await fetch(`${BASE_URL}/vendor/review/${supplierId}`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(data)
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
      updateProduct: async (productId, updateData) => {
        const response = await fetch(`${BASE_URL}/supplier/product/${productId}`, {
          method: 'PATCH',
          headers: getHeaders(),
          body: JSON.stringify(updateData)
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
      getProductStockHistory: async (productId) => {
        const response = await fetch(`${BASE_URL}/supplier/product/${productId}/stock-history`, { 
          headers: getHeaders() 
        });
        return response.json();
      },
      predictRestock: async () => {
        const response = await fetch(`${BASE_URL}/supplier/predict-restock`, { headers: getHeaders() });
        return response.json();
      }
      // Note: getReviews endpoint doesn't exist in backend yet
      // Backend only has POST /vendor/review/:supplierId for vendors to leave reviews
      // Need GET /supplier/reviews endpoint to fetch reviews for suppliers
    },

    // Products API functions (public)
    products: {
      getAllProducts: async () => {
        const response = await fetch(`${BASE_URL}/products`, {
          headers: { 'Content-Type': 'application/json' }
        });
        return response.json();
      },
      getProductsBySupplierId: async (supplierId) => {
        const response = await fetch(`${BASE_URL}/products/${supplierId}`, {
          headers: { 'Content-Type': 'application/json' }
        });
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
      return <AuthPage navigate={navigate} initialMode="login" />;
    }
    if (currentPage === 'register') {
      return <AuthPage navigate={navigate} initialMode="register" />;
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
                  onClick={() => navigate('register')}
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
                transition: 'transform 0.2s'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('register')}
              style={{
                padding: '12px 32px',
                background: 'transparent',
                color: '#ff6600',
                border: '2px solid #ff6600',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
            >
              Register Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Auth Page with WORKING login/register
const AuthPage = ({ navigate, initialMode = "login" }) => {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
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

// Vendor Dashboard with WORKING API calls (keeping the working version from paste.txt)
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
  
  // LOAD DATA ON TAB CHANGE AND INITIAL MOUNT
  useEffect(() => {
    loadData();
  }, [activeTab]);

  // Load orders immediately on component mount for dashboard
  useEffect(() => {
    loadOrdersForDashboard();
  }, []);

  const loadOrdersForDashboard = async () => {
    try {
      const result = await api.vendor.getOrders();
      console.log('Orders loaded for dashboard:', result);
      setOrders(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Error loading orders for dashboard:', error);
    }
  };
  
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
      const result = await api.vendor.leaveReview(supplierId, { rating, comment });
      if (result.rating) {
        alert('Review submitted successfully!');
      } else {
        alert(result.message || 'Failed to submit review. Please try again.');
      }
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
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          {item.imageUrl && (
                            <img 
                              src={item.imageUrl} 
                              alt={item.name}
                              style={{
                                width: '32px',
                                height: '32px',
                                objectFit: 'cover',
                                borderRadius: '4px'
                              }}
                            />
                          )}
                          <span>{item.name} x{item.quantity}</span>
                        </div>
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
                                  <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                  }}>
                                    {item.product?.imageUrl && (
                                      <img 
                                        src={item.product.imageUrl} 
                                        alt={item.product.name}
                                        style={{
                                          width: '40px',
                                          height: '40px',
                                          objectFit: 'cover',
                                          borderRadius: '6px'
                                        }}
                                      />
                                    )}
                                    <span style={{ color: '#d1d5db' }}>
                                      {item.product?.name} x{item.quantity}
                                    </span>
                                  </div>
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

// ============================================================================
// SUPPLIER COMPONENTS (Working versions from App.jsx)
// ============================================================================

// LoadingSpinner Component  
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '32px'
  }}>
    <div style={{
      width: '32px',
      height: '32px',
      border: '3px solid #374151',
      borderTop: '3px solid #22c55e',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
  </div>
);

// Modal Component
const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: { maxWidth: '400px' },
    md: { maxWidth: '500px' }, 
    lg: { maxWidth: '600px' },
    xl: { maxWidth: '800px' },
    "2xl": { maxWidth: '1000px' }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#1f1f1f',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        ...sizes[size],
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '1px solid #374151'
      }}>
        <div style={{ padding: '24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white'
            }}>
              {title}
            </h2>
            <button
              onClick={onClose}
              style={{
                color: '#9ca3af',
                fontSize: '24px',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
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

// Input Component
const Input = ({ label, type = "text", value, onChange, placeholder, required = false, className = "" }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={{
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#d1d5db',
      marginBottom: '4px'
    }}>
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      style={{
        width: '100%',
        padding: '12px 16px',
        backgroundColor: '#374151',
        border: '1px solid #6b7280',
        borderRadius: '8px',
        color: 'white',
        fontSize: '16px',
        outline: 'none',
        boxSizing: 'border-box',
        ...(className && { className })
      }}
    />
  </div>
);

// Button Component
const Button = ({ children, onClick, variant = "primary", disabled = false, className = "", size = "normal" }) => {
  const baseStyle = {
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    borderRadius: '8px',
    border: 'none',
    outline: 'none',
    transition: 'all 0.2s',
    opacity: disabled ? 0.5 : 1
  };

  const sizes = {
    small: { padding: '8px 16px', fontSize: '14px' },
    normal: { padding: '12px 24px', fontSize: '16px' },
    large: { padding: '16px 32px', fontSize: '18px' }
  };

  const variants = {
    primary: { backgroundColor: '#22c55e', color: 'white' },
    secondary: { backgroundColor: '#6b7280', color: 'white' },
    success: { backgroundColor: '#059669', color: 'white' },
    danger: { backgroundColor: '#dc2626', color: 'white' },
    outline: { backgroundColor: 'transparent', color: '#d1d5db', border: '1px solid #6b7280' }
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...baseStyle,
        ...sizes[size],
        ...variants[variant],
        ...(className && { className })
      }}
    >
      {children}
    </button>
  );
};

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
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showProductHistory, setShowProductHistory] = useState(false);
  const [selectedProductHistory, setSelectedProductHistory] = useState([]);
  const [selectedProductName, setSelectedProductName] = useState('');

  const api = useAPI();

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.unit || !newProduct.price || !newProduct.stock) {
      setError('Please fill in all required fields');
      return;
    }

    if (!selectedImage) {
      setError('Please select an image for the product');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('unit', newProduct.unit);
      formData.append('price', newProduct.price);
      formData.append('stock', newProduct.stock);
      formData.append('lowStockThreshold', newProduct.lowStockThreshold || '5');
      formData.append('image', selectedImage);

      await api.supplier.addProduct(formData);
      setShowAddModal(false);
      setNewProduct({ name: '', unit: '', price: '', stock: '', lowStockThreshold: '' });
      setSelectedImage(null);
      setImagePreview(null);
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

      await api.supplier.updateProduct(editingProduct._id, updateData);
      setShowEditModal(false);
      setEditingProduct(null);
      loadProducts();
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to update product');
    }
  };

  const loadProductHistory = async (productId, productName) => {
    try {
      const history = await api.supplier.getProductStockHistory(productId);
      setSelectedProductHistory(history);
      setSelectedProductName(productName);
      setShowProductHistory(true);
    } catch (err) {
      console.error('Load product history error:', err);
    }
  };

  const handleRestockProduct = async (productId, quantity) => {
    try {
      await api.supplier.restockProduct(productId, quantity);
      loadProducts();
    } catch (err) {
      setError(err.message || 'Failed to restock product');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: 'white'
        }}>
          Product Management
        </h2>
        <Button onClick={() => setShowAddModal(true)}>
          Add Product
        </Button>
      </div>

      {error && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          color: '#fca5a5',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : products.length === 0 ? (
        <div style={{
          textAlign: 'center',
          color: '#6b7280',
          padding: '64px 24px',
          backgroundColor: '#1f1f1f',
          borderRadius: '16px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
          <p>No products yet. Add your first product!</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {products.map((product) => (
            <div key={product._id} style={{
              backgroundColor: '#1f1f1f',
              borderRadius: '16px',
              border: '1px solid #374151',
              padding: '24px'
            }}>
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
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px'
              }}>
                <h3 style={{
                  fontWeight: '600',
                  color: 'white',
                  fontSize: '18px'
                }}>
                  {product.name}
                </h3>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: product.stock > product.lowStockThreshold 
                    ? 'rgba(34, 197, 94, 0.2)' 
                    : 'rgba(239, 68, 68, 0.2)',
                  color: product.stock > product.lowStockThreshold 
                    ? '#22c55e' 
                    : '#ef4444'
                }}>
                  {product.stock} {product.unit}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <p style={{
                  fontSize: '14px',
                  color: '#9ca3af'
                }}>
                  Price: ₹{product.price} per {product.unit}
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#9ca3af'
                }}>
                  Low Stock Alert: {product.lowStockThreshold} {product.unit}
                </p>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button 
                    size="small" 
                    variant="outline"
                    onClick={() => {
                      setEditingProduct(product);
                      setShowEditModal(true);
                    }}
                    style={{ flex: 1 }}
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
                    style={{ flex: 1 }}
                  >
                    Restock
                  </Button>
                </div>
                <Button
                  size="small"
                  variant="outline"
                  onClick={() => loadProductHistory(product._id, product.name)}
                  style={{
                    width: '100%',
                    color: '#3b82f6',
                    borderColor: '#3b82f6'
                  }}
                >
                  📋 View History
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      <Modal 
        isOpen={showAddModal} 
        onClose={() => {
          setShowAddModal(false);
          setSelectedImage(null);
          setImagePreview(null);
        }}
        title="Add New Product"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Image Upload */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#d1d5db',
              marginBottom: '8px'
            }}>
              Product Image *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
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
            {imagePreview && (
              <div style={{ marginTop: '12px', textAlign: 'center' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview"
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #374151'
                  }}
                />
              </div>
            )}
          </div>

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
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="outline" onClick={() => {
              setShowAddModal(false);
              setSelectedImage(null);
              setImagePreview(null);
            }} style={{ flex: 1 }}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct} style={{ flex: 1 }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#d1d5db',
                marginBottom: '4px'
              }}>
                Product Name
              </label>
              <p style={{ color: 'white', fontWeight: '500' }}>{editingProduct.name}</p>
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
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="outline" onClick={() => setShowEditModal(false)} style={{ flex: 1 }}>
                Cancel
              </Button>
              <Button onClick={handleEditProduct} style={{ flex: 1 }}>
                Update Product
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Product History Modal */}
      <Modal
        isOpen={showProductHistory}
        onClose={() => setShowProductHistory(false)}
        title={`Stock History - ${selectedProductName}`}
        size="xl"
      >
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {selectedProductHistory.length === 0 ? (
              <p style={{
                color: '#6b7280',
                textAlign: 'center',
                padding: '32px'
              }}>
                No stock history available
              </p>
            ) : (
              selectedProductHistory.map((entry, index) => (
                <div key={index} style={{
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#374151'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <p style={{
                        fontWeight: '500',
                        color: entry.action === 'ordered' ? '#ef4444' :
                               entry.action === 'restocked' ? '#22c55e' :
                               '#3b82f6'
                      }}>
                        {entry.action.charAt(0).toUpperCase() + entry.action.slice(1)}
                      </p>
                      <p style={{
                        fontSize: '14px',
                        color: '#9ca3af'
                      }}>
                        Quantity: {entry.action === 'ordered' ? '-' : '+'}{entry.quantity}
                      </p>
                      <p style={{
                        fontSize: '14px',
                        color: '#9ca3af'
                      }}>
                        Stock: {entry.previousStock} → {entry.newStock}
                      </p>
                    </div>
                    <div style={{
                      textAlign: 'right',
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      <p>{new Date(entry.timestamp).toLocaleDateString()}</p>
                      <p>{new Date(entry.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
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
  const [orderSubTab, setOrderSubTab] = useState('pending'); // Add sub-tabs with pending default

  const api = useAPI();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch orders and all products in parallel
      const [ordersData, allProducts] = await Promise.all([
        api.supplier.getOrders(),
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
      await api.supplier.fulfillOrder(orderId);
      loadOrders();
    } catch (err) {
      setError(err.message || 'Failed to fulfill order');
    } finally {
      setProcessingOrder(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{
        fontSize: '32px',
        fontWeight: 'bold',
        color: 'white'
      }}>
        Order Management
      </h2>

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

      {error && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          color: '#fca5a5',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        (() => {
          const filteredOrders = orders.filter(order => {
            if (orderSubTab === 'pending') {
              return order.status === 'pending' || order.status === 'confirmed';
            } else {
              return order.status === 'delivered';
            }
          });

          return filteredOrders.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: '#6b7280',
              padding: '64px 24px',
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
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {filteredOrders.map((order) => (
                <div key={order._id} style={{
                  backgroundColor: '#1f1f1f',
                  borderRadius: '16px',
                  border: '1px solid #374151',
                  padding: '24px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: '8px'
                      }}>
                        Order #{order._id.slice(-6)}
                      </h3>
                      <p style={{
                        color: '#9ca3af',
                        marginBottom: '4px'
                      }}>
                        Vendor: {order.vendor?.name || 'Unknown Vendor'}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        backgroundColor: order.status === 'pending' ? 'rgba(251, 191, 36, 0.2)' :
                                        order.status === 'delivered' ? 'rgba(34, 197, 94, 0.2)' :
                                        'rgba(59, 130, 246, 0.2)',
                        color: order.status === 'pending' ? '#fbbf24' :
                               order.status === 'delivered' ? '#22c55e' :
                               '#3b82f6'
                      }}>
                        {order.status}
                      </span>
                      <p style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        marginTop: '4px'
                      }}>
                        Type: {order.type}
                      </p>
                    </div>
                  </div>

                  <div style={{
                    borderTop: '1px solid #374151',
                    paddingTop: '16px'
                  }}>
                    <h4 style={{
                      fontWeight: '500',
                      color: 'white',
                      marginBottom: '8px'
                    }}>
                      Items:
                    </h4>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, index) => (
                          <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: '#374151',
                            padding: '12px',
                            borderRadius: '8px'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px'
                            }}>
                              {item.product?.imageUrl && (
                                <img 
                                  src={item.product.imageUrl} 
                                  alt={item.product.name}
                                  style={{
                                    width: '48px',
                                    height: '48px',
                                    objectFit: 'cover',
                                    borderRadius: '6px'
                                  }}
                                />
                              )}
                              <div>
                                <span style={{
                                  fontSize: '14px',
                                  fontWeight: '500',
                                  color: 'white'
                                }}>
                                  {item.product?.name || 'Unknown Product'}
                                </span>
                                <p style={{
                                  fontSize: '12px',
                                  color: '#9ca3af'
                                }}>
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <span style={{
                              fontSize: '14px',
                              fontWeight: '500',
                              color: '#22c55e'
                            }}>
                              ₹{((item.product?.price || 0) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p style={{
                          fontSize: '14px',
                          color: '#6b7280'
                        }}>
                          No items found
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid #374151'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      color: '#9ca3af'
                    }}>
                      <p>Ordered: {new Date(order.createdAt).toLocaleDateString()}</p>
                      <p style={{
                        fontWeight: '600',
                        color: 'white'
                      }}>
                        Total: ₹{order.items?.reduce((total, item) => total + ((item.product?.price || 0) * item.quantity), 0).toFixed(2) || '0.00'}
                      </p>
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
          );
        })()
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
  const [showStockHistory, setShowStockHistory] = useState(false);
  const [stockHistoryData, setStockHistoryData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [reviews, setReviews] = useState([]);

  const api = useAPI();

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

  const loadCombinedStockHistory = async () => {
    try {
      setLoadingHistory(true);
      const historyPromises = products.map(product => 
        api.supplier.getProductStockHistory(product._id)
          .then(history => ({
            productName: product.name,
            productId: product._id,
            history: history
          }))
          .catch(() => ({ productName: product.name, productId: product._id, history: [] }))
      );
      
      const allHistories = await Promise.all(historyPromises);
      const combinedHistory = [];
      
      allHistories.forEach(item => {
        item.history.forEach(entry => {
          combinedHistory.push({
            ...entry,
            productName: item.productName,
            productId: item.productId
          });
        });
      });
      
      // Sort by timestamp (newest first)
      combinedHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setStockHistoryData(combinedHistory);
    } catch (err) {
      console.error('Load stock history error:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [productsData, ordersData, predictionsData] = await Promise.all([
        api.products.getProductsBySupplierId(user._id),
        api.supplier.getOrders(),
        api.supplier.predictRestock().catch(() => null)
      ]);

      const productsArray = Array.isArray(productsData) ? productsData : [];
      const ordersArray = Array.isArray(ordersData) ? ordersData : [];

      setProducts(productsArray);
      setOrders(ordersArray);
      setPredictions(predictionsData);

      // Mock reviews data - Backend doesn't have GET /supplier/reviews endpoint yet
      // Only has POST /vendor/review/:supplierId for vendors to leave reviews
      // TODO: Backend needs GET /supplier/reviews endpoint to fetch reviews for a supplier
      const mockReviews = [
        { 
          vendor: { name: 'ABC Store' }, 
          rating: 5, 
          comment: 'Excellent quality products and fast delivery!', 
          createdAt: new Date().toISOString() 
        },
        { 
          vendor: { name: 'XYZ Market' }, 
          rating: 4, 
          comment: 'Good products, reliable supplier.', 
          createdAt: new Date(Date.now() - 86400000).toISOString() 
        },
        { 
          vendor: { name: 'DEF Shop' }, 
          rating: 5, 
          comment: 'Always satisfied with the quality and service.', 
          createdAt: new Date(Date.now() - 172800000).toISOString() 
        }
      ];
      setReviews(mockReviews);

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{
        fontSize: '32px',
        fontWeight: 'bold',
        color: 'white'
      }}>
        Analytics Dashboard
      </h2>

      {/* Enhanced Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px'
      }}>
        <div style={{
          backgroundColor: '#1f1f1f',
          border: '1px solid #374151',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#9ca3af'
          }}>
            Total Products
          </div>
          <div style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: 'white'
          }}>
            {stats.totalProducts}
          </div>
        </div>
        
        <div style={{
          backgroundColor: '#1f1f1f',
          border: '1px solid #374151',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#9ca3af'
          }}>
            Total Orders
          </div>
          <div style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#3b82f6'
          }}>
            {stats.totalOrders}
          </div>
        </div>
        
        <div style={{
          backgroundColor: '#1f1f1f',
          border: '1px solid #374151',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#9ca3af'
          }}>
            Low Stock Items
          </div>
          <div style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#ef4444'
          }}>
            {chartData.lowStockItems.length}
          </div>
        </div>
        
        <div style={{
          backgroundColor: '#1f1f1f',
          border: '1px solid #374151',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#9ca3af'
          }}>
            Total Revenue
          </div>
          <div style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#22c55e'
          }}>
            ₹{orders.reduce((total, order) => total + (order.items?.reduce((sum, item) => sum + ((item.product.price || 0) * item.quantity), 0) || 0), 0)}
          </div>
        </div>
      </div>

      {/* Product Stock & Recent Orders */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px'
      }}>
        <div style={{
          backgroundColor: '#1f1f1f',
          border: '1px solid #374151',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '16px'
          }}>
            Product Stock Status
          </h3>
          {products.length === 0 ? (
            <p style={{
              color: '#6b7280',
              textAlign: 'center',
              padding: '32px'
            }}>
              No products yet
            </p>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {products.slice(0, 5).map((product) => (
                <div key={product._id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {product.imageUrl && (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        style={{
                          width: '32px',
                          height: '32px',
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                      />
                    )}
                    <div>
                      <p style={{
                        fontWeight: '500',
                        color: 'white'
                      }}>
                        {product.name}
                      </p>
                      <p style={{
                        fontSize: '14px',
                        color: '#9ca3af'
                      }}>
                        ₹{product.price} per {product.unit}
                      </p>
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: product.stock > product.lowStockThreshold 
                      ? 'rgba(34, 197, 94, 0.2)' 
                      : 'rgba(239, 68, 68, 0.2)',
                    color: product.stock > product.lowStockThreshold 
                      ? '#22c55e' 
                      : '#ef4444'
                  }}>
                    {product.stock} {product.unit}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{
          backgroundColor: '#1f1f1f',
          border: '1px solid #374151',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '16px'
          }}>
            Recent Orders
          </h3>
          {orders.length === 0 ? (
            <p style={{
              color: '#6b7280',
              textAlign: 'center',
              padding: '32px'
            }}>
              No orders yet
            </p>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {orders.slice(0, 5).map((order) => (
                <div key={order._id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{
                      fontWeight: '500',
                      color: 'white'
                    }}>
                      {order.vendor?.name || 'Unknown Vendor'}
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: '#9ca3af'
                    }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: order.status === 'pending' ? 'rgba(251, 191, 36, 0.2)' :
                                    order.status === 'delivered' ? 'rgba(34, 197, 94, 0.2)' :
                                    'rgba(59, 130, 246, 0.2)',
                    color: order.status === 'pending' ? '#fbbf24' :
                           order.status === 'delivered' ? '#22c55e' :
                           '#3b82f6'
                  }}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px'
      }}>
        <div style={{
          backgroundColor: '#1f1f1f',
          border: '1px solid #374151',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <h3 style={{
            color: '#22c55e',
            marginBottom: '16px',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            🏆 Top Selling Products
          </h3>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {chartData.topProducts.map((product, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ color: '#d1d5db' }}>{product.name}</span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '96px',
                    height: '8px',
                    backgroundColor: '#374151',
                    borderRadius: '4px'
                  }}>
                    <div style={{
                      width: `${chartData.topProducts.length > 0 ? (product.totalQuantity / Math.max(...chartData.topProducts.map(p => p.totalQuantity))) * 100 : 0}%`,
                      height: '8px',
                      backgroundColor: '#3b82f6',
                      borderRadius: '4px'
                    }} />
                  </div>
                  <span style={{
                    fontWeight: '600',
                    color: 'white'
                  }}>
                    {product.totalQuantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          backgroundColor: '#1f1f1f',
          border: '1px solid #374151',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <h3 style={{
            color: '#3b82f6',
            marginBottom: '16px',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            📈 Revenue Trend (Last 6 Months)
          </h3>
          
          <div style={{
            height: '256px',
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'space-between',
            gap: '8px',
            padding: '20px 0'
          }}>
            {chartData.monthlyRevenue.map((month, index) => (
              <div key={index} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1
              }}>
                <div style={{
                  width: '30px',
                  height: `${chartData.monthlyRevenue.length > 0 ? (month.revenue / Math.max(...chartData.monthlyRevenue.map(m => m.revenue || 1))) * 200 : 20}px`,
                  backgroundColor: '#ff8500',
                  borderRadius: '4px 4px 0 0',
                  marginBottom: '8px'
                }} />
                <span style={{
                  fontSize: '12px',
                  color: '#9ca3af'
                }}>
                  {month.month.split('-')[1]}
                </span>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'white'
                }}>
                  ₹{month.revenue}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stock History Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => {
            setShowStockHistory(true);
            loadCombinedStockHistory();
          }}
          style={{
            padding: '16px 32px',
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '16px'
          }}
        >
          📊 View Stock History
        </button>
      </div>

      {/* AI Predictions Section */}
      {predictions && (
        <div style={{
          backgroundColor: '#1f1f1f',
          border: '1px solid #374151',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <h3 style={{
            color: '#8b5cf6',
            marginBottom: '16px',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            🔮 AI Restock Predictions - Your Products
          </h3>
          
          {(() => {
            // Filter predictions to only show products that belong to this supplier
            const supplierProductNames = products.map(p => p.name.toLowerCase());
            const filteredSuggestions = predictions.suggestions ? 
              predictions.suggestions.filter(suggestion => 
                supplierProductNames.includes(suggestion.name.toLowerCase())
              ) : [];
            
            return filteredSuggestions.length > 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {filteredSuggestions.map((suggestion, index) => (
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
                      <h4 style={{
                        color: 'white',
                        fontWeight: '600'
                      }}>
                        {suggestion.name}
                      </h4>
                      <span style={{
                        backgroundColor: '#8b5cf6',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600'
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
                        <p style={{
                          color: '#9ca3af',
                          fontSize: '14px',
                          marginBottom: '4px'
                        }}>
                          Current Stock: <span style={{
                            color: '#ef4444',
                            fontWeight: '600'
                          }}>
                            {suggestion.currentStock}
                          </span>
                        </p>
                        <p style={{
                          color: '#9ca3af',
                          fontSize: '14px'
                        }}>
                          Recent Orders: <span style={{
                            color: '#f59e0b',
                            fontWeight: '600'
                          }}>
                            {suggestion.orderedQuantity}
                          </span>
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{
                          color: '#22c55e',
                          fontWeight: '600',
                          fontSize: '16px'
                        }}>
                          Restock: {suggestion.suggestedRestock} units
                        </p>
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
                <p style={{ marginBottom: '8px' }}>
                  No restock predictions needed for your products right now.
                </p>
                <p style={{ fontSize: '14px' }}>
                  AI analyzes orders for your {products.length} products to suggest optimal restock levels
                </p>
              </div>
            );
          })()}
        </div>
      )}

      {/* Vendor Reviews Section */}
      <div style={{
        backgroundColor: '#1f1f1f',
        border: '1px solid #374151',
        borderRadius: '16px',
        padding: '24px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h3 style={{
            color: '#f59e0b',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            ⭐ Vendor Reviews
          </h3>
          <div style={{
            backgroundColor: 'rgba(251, 191, 36, 0.2)',
            color: '#f59e0b',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            DEMO DATA
          </div>
        </div>
        
        {reviews.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
            <p>No reviews yet</p>
            <p style={{ fontSize: '14px' }}>Reviews from vendors will appear here</p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Average Rating */}
            <div style={{
              backgroundColor: '#374151',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#f59e0b',
                marginBottom: '8px'
              }}>
                {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '8px'
              }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    style={{
                      fontSize: '20px',
                      color: star <= Math.round(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) ? '#f59e0b' : '#374151'
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p style={{
                color: '#9ca3af',
                fontSize: '14px'
              }}>
                Based on {reviews.length} reviews
              </p>
            </div>

            {/* Individual Reviews */}
            {reviews.map((review, index) => (
              <div key={index} style={{
                backgroundColor: '#374151',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px'
                }}>
                  <div>
                    <h4 style={{
                      color: 'white',
                      fontWeight: '600',
                      marginBottom: '4px'
                    }}>
                      {review.vendor.name}
                    </h4>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            style={{
                              fontSize: '16px',
                              color: star <= review.rating ? '#f59e0b' : '#374151'
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span style={{
                        color: '#9ca3af',
                        fontSize: '12px'
                      }}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                {review.comment && (
                  <p style={{
                    color: '#d1d5db',
                    fontSize: '14px',
                    fontStyle: 'italic'
                  }}>
                    "{review.comment}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stock History Modal */}
      <Modal
        isOpen={showStockHistory}
        onClose={() => setShowStockHistory(false)}
        title="Combined Stock History"
        size="2xl"
      >
        {loadingHistory ? (
          <div style={{
            textAlign: 'center',
            padding: '64px'
          }}>
            Loading stock history...
          </div>
        ) : (
          <div style={{
            maxHeight: '60vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {stockHistoryData.map((entry, index) => (
                <div key={index} style={{
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#374151'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                  }}>
                    <div>
                      <h4 style={{
                        fontWeight: '600',
                        color: 'white'
                      }}>
                        {entry.productName}
                      </h4>
                      <p style={{
                        fontSize: '14px',
                        color: '#9ca3af'
                      }}>
                        Action: <span style={{
                          fontWeight: '500',
                          color: entry.action === 'ordered' ? '#ef4444' :
                                 entry.action === 'restocked' ? '#22c55e' :
                                 '#3b82f6'
                        }}>
                          {entry.action}
                        </span>
                      </p>
                      <p style={{
                        fontSize: '14px',
                        color: '#9ca3af'
                      }}>
                        Quantity: {entry.action === 'ordered' ? '-' : '+'}{entry.quantity}
                      </p>
                      <p style={{
                        fontSize: '14px',
                        color: '#9ca3af'
                      }}>
                        Stock: {entry.previousStock} → {entry.newStock}
                      </p>
                    </div>
                    <div style={{
                      textAlign: 'right'
                    }}>
                      <p style={{
                        fontSize: '12px',
                        color: '#6b7280'
                      }}>
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </p>
                      <p style={{
                        fontSize: '12px',
                        color: '#6b7280'
                      }}>
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// Supplier Dashboard with WORKING components from App.jsx
const SupplierDashboard = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState('products');

  const { user } = useAuth();

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
    <div style={{
      backgroundColor: '#111827',
      minHeight: '100vh',
      color: 'white'
    }}>
      <Header navigate={navigate} />
      
      <div style={{
        display: 'flex',
        paddingTop: '80px'
      }}>
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
          <h2 style={{
            color: '#22c55e',
            marginBottom: '24px',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            Supplier Portal
          </h2>
          
          {tabs.map((tab) => (
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
              <span style={{ marginRight: '8px' }}>{tab.icon}</span>
              {tab.name}
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
          {renderContent()}
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
    
    // Add spin animation for loading spinner
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }, []);
  
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
};

export default App;