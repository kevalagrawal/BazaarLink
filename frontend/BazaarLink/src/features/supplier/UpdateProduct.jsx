import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/Button';
import Loader from '../../components/Loader';

const SupplierUpdateProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    minimumOrderQuantity: '',
    specifications: ''
  });
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();

  const categories = [
    'Electronics',
    'Clothing',
    'Food & Beverages',
    'Home & Garden',
    'Industrial',
    'Office Supplies',
    'Raw Materials',
    'Other'
  ];

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/supplier/products/${id}`);
      const product = response.data;
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
        minimumOrderQuantity: product.minimumOrderQuantity.toString(),
        specifications: product.specifications || ''
      });
    } catch (error) {
      setError('Failed to load product details');
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
    setUpdateLoading(true);

    try {
      await api.put(`/supplier/products/${id}`, {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        minimumOrderQuantity: parseInt(formData.minimumOrderQuantity)
      });
      
      navigate('/supplier/profile', { 
        state: { message: 'Product updated successfully!' }
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update product');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/supplier/products/${id}`);
      navigate('/supplier/profile', { 
        state: { message: 'Product deleted successfully!' }
      });
    } catch (error) {
      setError('Failed to delete product');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Update Product</h1>
        <p className="mt-2 text-gray-600">Update your product information</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="input-field"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows="4"
              className="input-field"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your product in detail"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                className="input-field"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price per Unit (₹) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                step="0.01"
                className="input-field"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                Available Stock *
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                required
                min="0"
                className="input-field"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Number of units available"
              />
            </div>

            <div>
              <label htmlFor="minimumOrderQuantity" className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Order Quantity *
              </label>
              <input
                type="number"
                id="minimumOrderQuantity"
                name="minimumOrderQuantity"
                required
                min="1"
                className="input-field"
                value={formData.minimumOrderQuantity}
                onChange={handleChange}
                placeholder="Minimum units per order"
              />
            </div>
          </div>

          <div>
            <label htmlFor="specifications" className="block text-sm font-medium text-gray-700 mb-2">
              Specifications (Optional)
            </label>
            <textarea
              id="specifications"
              name="specifications"
              rows="3"
              className="input-field"
              value={formData.specifications}
              onChange={handleChange}
              placeholder="Technical specifications, dimensions, materials, etc."
            />
          </div>

          <div className="border-t pt-6">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button
                type="submit"
                variant="primary"
                loading={updateLoading}
                className="flex-1"
              >
                Update Product
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/supplier/profile')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={handleDelete}
                className="flex-1"
              >
                Delete Product
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierUpdateProduct;