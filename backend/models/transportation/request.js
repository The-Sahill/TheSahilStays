const mongoose = require('mongoose');

const transportationRequestSchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  mobileNumber: { type: String },
  transferType: { type: String, required: true },
  airport: { type: String, required: true },
  travelDate: { type: Date, required: true },
  transferTime: { type: String, required: true },
  flightNumber: { type: String },
  passengers: { type: Number, default: 1 },
  bags: { type: Number, default: 0 },
  baggageSize: { type: String },
  method:{type: String, required: true},
  baggageNotes: { type: String },
  vehicle: { type: String, required: true },
  guestPrice: { type: Number, default: 0 },
  partnerCost: { type: Number, default: 0 },
  profit: { type: Number, default: 0 },
  paymentStatus: { type: String, default: 'غير مدفوع' },
  status: { type: String, default: 'بانتظار الموافقة' },
  rating: { type: Number },
  review: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('TransportationRequest', transportationRequestSchema);