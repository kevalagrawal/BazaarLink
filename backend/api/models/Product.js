import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isAvailable: { type: Boolean, default: true },
  lowStockThreshold: { type: Number, default: 10 },
  imageUrl: {
    type: String,
    default: ""
  },
  stockHistory: [{
    action: { type: String, enum: ['ordered', 'restocked', 'adjusted'] },
    quantity: { type: Number, required: true },
    previousStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }
  }]
}, { timestamps: true });

// Method to reduce stock when order is placed
productSchema.methods.reduceStock = async function(quantity, orderId = null) {
  if (this.stock < quantity) {
    throw new Error(`Insufficient stock. Available: ${this.stock}, Requested: ${quantity}`);
  }
  
  const previousStock = this.stock;
  this.stock -= quantity;
  
  if (this.stock === 0) {
    this.isAvailable = false;
  }
  
  // Add to stock history
  this.stockHistory.push({
    action: 'ordered',
    quantity: quantity,
    previousStock: previousStock,
    newStock: this.stock,
    orderId: orderId
  });
  
  return await this.save();
};

// Method to add stock (restock)
productSchema.methods.addStock = async function(quantity) {
  const previousStock = this.stock;
  this.stock += quantity;
  
  if (this.stock > 0) {
    this.isAvailable = true;
  }
  
  // Add to stock history
  this.stockHistory.push({
    action: 'restocked',
    quantity: quantity,
    previousStock: previousStock,
    newStock: this.stock
  });
  
  return await this.save();
};

// Method to check if stock is low
productSchema.methods.isLowStock = function() {
  return this.stock <= this.lowStockThreshold;
};

export default mongoose.model('Product', productSchema); 