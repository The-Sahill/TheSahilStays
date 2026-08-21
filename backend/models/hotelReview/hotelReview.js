const mongoose = require('mongoose');

const hotelReviewSchema = new mongoose.Schema({
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
  cleanlinessRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5 // تقييم النظافة من 1 إلى 5
  },
  serviceRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5 // تقييم جودة الخدمة من 1 إلى 5
  },
  overallRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5 // التقييم العام للفندق من 1 إلى 5
  },
  comment: {
    type: String,
    trim: true,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('HotelReview', hotelReviewSchema);