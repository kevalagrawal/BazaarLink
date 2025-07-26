import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../../components/Button';
import Loader from '../../components/Loader';

const VendorProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async (productId) => {
    setOrderLoading(true);
    try {
      await api.post('/vendor/orders', {
        productId,
        quantity: orderQuantity,
        supplierId: selectedProduct.supplierId
      });
      alert('Order placed successfully!');
      setSelectedProduct(null);
    } catch (error) {
      alert('Failed to place order');
    } finally {
      setOrderLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(product => product.category))];

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Products</h1>
        <p className="mt-2 text-gray-600">Find and order products from suppliers</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Products
            </label>
            <input
              type="text"
              placeholder="Search by product name..."
              className="input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category
            </label>
            <select
              className="input-field"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-600 mb-3">{product.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Category:</span>
                  <span className="text-sm font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Price:</span>
                  <span className="text-sm font-medium">₹{product.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Stock:</span>
                  <span className="text-sm font-medium">{product.stock} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Min Order:</span>
                  <span className="text-sm font-medium">{product.minimumOrderQuantity} units</span>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full"
                onClick={() => setSelectedProduct(product)}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Place Order'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      )}

      {/* Order Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Place Order</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Product: {selectedProduct.name}</p>
              <p className="text-sm text-gray-600 mb-2">Price: ₹{selectedProduct.price}</p>
              <p className="text-sm text-gray-600 mb-4">Available Stock: {selectedProduct.stock}</p>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min={selectedProduct.minimumOrderQuantity}
                max={selectedProduct.stock}
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(parseInt(e.target.value))}
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum order quantity: {selectedProduct.minimumOrderQuantity}
              </p>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded">
              <p className="text-sm font-medium">Order Total: ₹{selectedProduct.price * orderQuantity}</p>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="primary"
                loading={orderLoading}
                onClick={() => handleOrder(selectedProduct._id)}
                disabled={orderQuantity < selectedProduct.minimumOrderQuantity}
              >
                Confirm Order
              </Button>
              <Button
                variant="secondary"
                onClick={() => setSelectedProduct(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProducts;