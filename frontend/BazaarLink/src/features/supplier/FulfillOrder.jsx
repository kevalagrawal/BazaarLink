import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/Button';
import Loader from '../../components/Loader';

const SupplierFulfillOrder = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    trackingNumber: '',
    courier: '',
    expectedDeliveryDate: '',
    notes: ''
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/supplier/orders/${id}`);
      setOrder(response.data);
      
      // Pre-fill form with existing data if available
      if (response.data.trackingNumber) setFormData(prev => ({ ...prev, trackingNumber: response.data.trackingNumber }));
      if (response.data.courier) setFormData(prev => ({ ...prev, courier: response.data.courier }));
      if (response.data.expectedDeliveryDate) {
        const date = new Date(response.data.expectedDeliveryDate);
        setFormData(prev => ({ ...prev, expectedDeliveryDate: date.toISOString().slice(0, 16) }));
      }
      if (response.data.notes) setFormData(prev => ({ ...prev, notes: response.data.notes }));
    } catch (error) {
      setError('Failed to load order details');
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

  const handleUpdateStatus = async (newStatus) => {
    setError('');
    setSuccess('');

    try {
      await api.patch(`/supplier/orders/${id}/status`, { 
        status: newStatus,
        ...formData
      });
      setSuccess(`Order status updated to ${newStatus}`);
      fetchOrder();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleSaveDetails = async () => {
    setError('');
    setSuccess('');

    try {
      await api.patch(`/supplier/orders/${id}/details`, formData);
      setSuccess('Order details updated successfully');
      fetchOrder();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update order details');
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

  if (loading) return <Loader />;
  if (!order) return <div className="text-center py-8">Order not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Order #{order._id.slice(-8)}
        </h1>
        <p className="mt-2 text-gray-600">Manage and fulfill this order</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Order Details</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Product</p>
              <p className="font-medium">{order.productId?.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Quantity</p>
                <p className="font-medium">{order.quantity} units</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Unit Price</p>
                <p className="font-medium">₹{order.unitPrice}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-green-600">₹{order.totalAmount}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Customer Information</h3>
              <div className="space-y-2">
                <p><span className="text-gray-500">Business:</span> {order.vendorId?.businessName}</p>
                <p><span className="text-gray-500">Contact:</span> {order.vendorId?.name}</p>
                <p><span className="text-gray-500">Phone:</span> {order.vendorId?.contactNumber}</p>
                <p><span className="text-gray-500">Email:</span> {order.vendorId?.email}</p>
                <p><span className="text-gray-500">Address:</span> {order.vendorId?.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fulfillment Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Fulfillment Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tracking Number
              </label>
              <input
                type="text"
                name="trackingNumber"
                value={formData.trackingNumber}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter tracking number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Courier Service
              </label>
              <select
                name="courier"
                value={formData.courier}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select courier service</option>
                <option value="bluedart">Blue Dart</option>
                <option value="dtdc">DTDC</option>
                <option value="fedex">FedEx</option>
                <option value="dhl">DHL</option>
                <option value="indiapost">India Post</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Delivery Date
              </label>
              <input
                type="datetime-local"
                name="expectedDeliveryDate"
                value={formData.expectedDeliveryDate}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="input-field"
                placeholder="Any additional notes for the customer..."
              />
            </div>

            <div className="space-y-3">
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleSaveDetails}
              >
                Save Details
              </Button>

              {getNextStatus(order.status) && (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => handleUpdateStatus(getNextStatus(order.status))}
                >
                  {getNextStatusText(order.status)}
                </Button>
              )}

              {order.status === 'pending' && (
                <Button
                  variant="danger"
                  className="w-full"
                  onClick={() => handleUpdateStatus('cancelled')}
                >
                  Cancel Order
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Timeline */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-xl font-semibold mb-6">Order Timeline</h2>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div>
              <p className="font-medium">Order Placed</p>
              <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>

          {order.status !== 'pending' && (
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">Order Confirmed</p>
                <p className="text-sm text-gray-600">{new Date(order.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          )}

          {['shipped', 'delivered'].includes(order.status) && (
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <div>
                <p className="font-medium">Order Shipped</p>
                <p className="text-sm text-gray-600">
                  {order.trackingNumber && `Tracking: ${order.trackingNumber}`}
                  {order.courier && ` via ${order.courier}`}
                </p>
              </div>
            </div>
          )}

          {order.status === 'delivered' && (
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <div>
                <p className="font-medium">Order Delivered</p>
                <p className="text-sm text-gray-600">Successfully delivered to customer</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Button
          variant="secondary"
          onClick={() => navigate('/supplier/orders')}
        >
          ← Back to Orders
        </Button>
      </div>
    </div>
  );
};

export default SupplierFulfillOrder;