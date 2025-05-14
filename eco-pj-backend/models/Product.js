const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: 0,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  imageURLs: [{
    type: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);