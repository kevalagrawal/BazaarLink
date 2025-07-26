import mongoose from 'mongoose';

const kycSchema = new mongoose.Schema({
  aadhaar: { type: String },
  gstin: { type: String },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['vendor', 'supplier'], required: true },
  kyc: kycSchema,
}, { timestamps: true });

userSchema.virtual('averageRating', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'supplier',
  justOne: false,
  options: { select: 'rating' },
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

export default mongoose.model('User', userSchema); 