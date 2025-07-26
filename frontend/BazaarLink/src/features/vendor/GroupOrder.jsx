import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../../components/Button';
import Loader from '../../components/Loader';

const VendorGroupOrder = () => {
  const [products, setProducts] = useState([]);
  const [groupOrders, setGroupOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    targetQuantity: '',
    maxPrice: '',
    description: '',
    expiryDate: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, groupOrdersRes] = await Promise.all([
        api.get('/products'),
        api.get('/vendor/group-orders')
      ]);
      setProducts(productsRes.data);
      setGroupOrders(groupOrdersRes.data);
    } catch (error) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/vendor/group-orders', formData);
      setSuccess('Group order created successfully!');
      setShowCreateForm(false);
      setFormData({
        productId: '',
        targetQuantity: '',
        maxPrice: '',
        description: '',
        expiryDate: ''
      });
      fetchData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create group order');
    }
  };

  const handleJoinGroupOrder = async (groupOrderId) => {
    try {
      await api.post(`/vendor/group-orders/${groupOrderId}/join`);
      setSuccess('Successfully joined group order!');
      fetchData();
    } catch (error) {
      setError('Failed to join group order');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'filled': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Group Orders</h1>
        <p className="mt-2 text-gray-600">Create or join group orders to get better prices</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md mb-6">
          {success}
        </div>
      )}

      {/* Create Group Order Button */}
      <div className="mb-8">
        <Button
          variant="primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'Create Group Order'}
        </Button>
      </div>

      {/* Create Group Order Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Group Order</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product
              </label>
              <select
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select a product</option>
                {products.map(product => (
                  <option key={product._id} value={product._id}>
                    {product.name} - ₹{product.price}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Quantity
                </label>
                <input
                  type="number"
                  name="targetQuantity"
                  value={formData.targetQuantity}
                  onChange={handleChange}
                  className="input-field"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Price per Unit
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  value={formData.maxPrice}
                  onChange={handleChange}
                  className="input-field"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="datetime-local"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                rows="3"
                placeholder="Add any additional requirements or notes..."
              />
            </div>

            <Button type="submit" variant="primary">
              Create Group Order
            </Button>
          </form>
        </div>
      )}

      {/* Active Group Orders */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Available Group Orders</h2>
        
        {groupOrders.map(groupOrder => (
          <div key={groupOrder._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {groupOrder.productId?.name || 'Product Name'}
                </h3>
                <p className="text-sm text-gray-600">
                  Created by {groupOrder.createdBy?.businessName || 'Unknown'}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(groupOrder.status)}`}>
                {groupOrder.status.charAt(0).toUpperCase() + groupOrder.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Target Quantity</p>
                <p className="font-medium">{groupOrder.targetQuantity} units</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Quantity</p>
                <p className="font-medium">{groupOrder.currentQuantity} units</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Max Price</p>
                <p className="font-medium">₹{groupOrder.maxPrice}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Participants</p>
                <p className="font-medium">{groupOrder.participants?.length || 0}</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{Math.round((groupOrder.currentQuantity / groupOrder.targetQuantity) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${Math.min((groupOrder.currentQuantity / groupOrder.targetQuantity) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {groupOrder.description && (
              <div className="mb-4">
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-sm text-gray-700">{groupOrder.description}</p>
              </div>
            )}

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Expires: {new Date(groupOrder.expiryDate).toLocaleDateString()}
              </p>
              
              {groupOrder.status === 'active' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleJoinGroupOrder(groupOrder._id)}
                >
                  Join Group Order
                </Button>
              )}
            </div>
          </div>
        ))}

        {groupOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No group orders available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorGroupOrder;