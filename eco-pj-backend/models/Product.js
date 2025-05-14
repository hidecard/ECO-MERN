const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  description: { type: String },
  imageURLs: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);