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
  receptionRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5 // تقييم الاستقبال من 1 إلى 5
  },
  cleanlinessRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5 // تقييم النظافة من 1 إلى 5
  },
  staffRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5 // تقييم طاقم العمل من 1 إلى 5
  },
  locationRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5 // تقييم الموقع من 1 إلى 5
  },
  servicesRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5 // تقييم الخدمات من 1 إلى 5
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