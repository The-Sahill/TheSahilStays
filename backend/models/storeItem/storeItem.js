const mongoose = require('mongoose');

const storeItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 0
  },
  category: {
    type: String,
    default: 'عام'
  }
}, { timestamps: true });

module.exports = mongoose.model('StoreItem', storeItemSchema);