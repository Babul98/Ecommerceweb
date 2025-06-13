// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['electronics', 'clothing', 'books', 'home', 'sports', 'beauty', 'toys']
  },
  brand: String,
  images: [String],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  sizes: [String],
  colors: [String],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  features: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [String]
}, {
  timestamps: true
});

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
