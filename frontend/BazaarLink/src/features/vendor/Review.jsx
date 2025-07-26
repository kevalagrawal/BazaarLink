import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../../components/Button';
import Loader from '../../components/Loader';

const VendorReview = () => {
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, reviewsRes] = await Promise.all([
        api.get('/vendor/orders?status=delivered'),
        api.get('/vendor/reviews')
      ]);
      setOrders(ordersRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/vendor/reviews', {
        orderId: selectedOrder._id,
        supplierId: selectedOrder.supplierId._id,
        productId: selectedOrder.productId._id,
        ...reviewData
      });
      setSuccess('Review submitted successfully!');
      setSelectedOrder(null);
      setReviewData({ rating: 5, comment: '' });
      fetchData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            className={`text-2xl ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            onClick={interactive ? () => onChange(star) : undefined}
            disabled={!interactive}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const ordersWithoutReviews = orders.filter(order => 
    !reviews.some(review => review.orderId === order._id)
  );

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        <p className="mt-2 text-gray-600">Leave reviews for your completed orders</p>
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
        {/* Orders to Review */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Orders to Review</h2>
          <div className="space-y-4">
            {ordersWithoutReviews.map(order => (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-4">
                <div className="mb-3">
                  <h3 className="font-semibold">{order.productId?.name}</h3>
                  <p className="text-sm text-gray-600">
                    Supplier: {order.supplierId?.businessName}
                  </p>
                  <p className="text-sm text-gray-600">
                    Delivered: {new Date(order.deliveredAt || order.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm">
                      Quantity: {order.quantity} units
                    </p>
                    <p className="text-sm">
                      Total: ₹{order.totalAmount}
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                  >
                    Write Review
                  </Button>
                </div>
              </div>
            ))}

            {ordersWithoutReviews.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No orders available to review.</p>
              </div>
            )}
          </div>
        </div>

        {/* My Reviews */}
        <div>
          <h2 className="text-xl font-semibold mb-4">My Reviews</h2>
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review._id} className="bg-white rounded-lg shadow-md p-4">
                <div className="mb-3">
                  <h3 className="font-semibold">{review.productId?.name}</h3>
                  <p className="text-sm text-gray-600">
                    Supplier: {review.supplierId?.businessName}
                  </p>
                  <p className="text-sm text-gray-600">
                    Reviewed: {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="mb-2">
                  {renderStars(review.rating)}
                </div>
                
                {review.comment && (
                  <p className="text-sm text-gray-700">{review.comment}</p>
                )}
              </div>
            ))}

            {reviews.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">You haven't written any reviews yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Write Review</h3>
            
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <p className="font-medium">{selectedOrder.productId?.name}</p>
              <p className="text-sm text-gray-600">
                Supplier: {selectedOrder.supplierId?.businessName}
              </p>
              <p className="text-sm text-gray-600">
                Order Total: ₹{selectedOrder.totalAmount}
              </p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                {renderStars(
                  reviewData.rating, 
                  true, 
                  (rating) => setReviewData({ ...reviewData, rating })
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment (Optional)
                </label>
                <textarea
                  className="input-field"
                  rows="4"
                  placeholder="Share your experience with this product and supplier..."
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                />
              </div>

              <div className="flex space-x-3">
                <Button type="submit" variant="primary">
                  Submit Review
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setSelectedOrder(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorReview;