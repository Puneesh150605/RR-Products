const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String },
  description: { type: String },
  specs: { type: Object },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, min: 0 },
  image: { type: String },
}, { timestamps: true });
module.exports = mongoose.model('Product', productSchema);
