const mongoose = require('mongoose');

const guestReviewSchema = new mongoose.Schema({
  guestName: {
    type: String,
    required: true,
    trim: true
  },
  roomNumber: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5 // التقييم من 1 إلى 5 نجوم
  },
  comment: {
    type: String,
    trim: true,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('GuestReview', guestReviewSchema);