import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/Button';
import Loader from '../../components/Loader';

const SupplierOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/supplier/orders');
      setOrders(response.data);
    } catch (error) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/supplier/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'pending': return 'confirmed';
      case 'confirmed': return 'shipped';
      case 'shipped': return 'delivered';
      default: return null;
    }
  };

  const getNextStatusText = (currentStatus) => {
    switch (currentStatus) {
      case 'pending': return 'Confirm Order';
      case 'confirmed': return 'Mark as Shipped';
      case 'shipped': return 'Mark as Delivered';
      default: return null;
    }
  };

  const filteredOrders = orders.filter(order => 
    !statusFilter || order.status === statusFilter
  );

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <p className="mt-2 text-gray-600">Manage and fulfill customer orders</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Filter */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="max-w-xs">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Status
          </label>
          <select
            className="input-field"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900">Total Orders</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {orders.filter(o => o.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900">Shipped</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {orders.filter(o => o.status === 'shipped').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900">Delivered</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {orders.filter(o => o.status === 'delivered').length}
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.map(order => (
          <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Order #{order._id.slice(-8)}
                </h3>
                <p className="text-sm text-gray-600">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Product</p>
                <p className="font-medium">{order.productId?.name || 'Product Name'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium">{order.vendorId?.businessName || 'Customer Name'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Quantity</p>
                <p className="font-medium">{order.quantity} units</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium">₹{order.totalAmount}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Customer Contact</p>
                <p className="font-medium">{order.vendorId?.contactNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Delivery Address</p>
                <p className="font-medium">{order.vendorId?.address || 'N/A'}</p>
              </div>
            </div>

            {order.notes && (
              <div className="mb-4">
                <p className="text-sm text-gray-500">Order Notes</p>
                <p className="text-sm text-gray-700">{order.notes}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {getNextStatus(order.status) && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleUpdateOrderStatus(order._id, getNextStatus(order.status))}
                >
                  {getNextStatusText(order.status)}
                </Button>
              )}
              
              {order.status === 'pending' && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleUpdateOrderStatus(order._id, 'cancelled')}
                >
                  Cancel Order
                </Button>
              )}

              <Link to={`/supplier/fulfill-order/${order._id}`}>
                <Button variant="secondary" size="sm">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {statusFilter ? `No ${statusFilter} orders found.` : 'No orders found.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default SupplierOrders; 