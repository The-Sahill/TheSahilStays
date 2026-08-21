const mongoose = require('mongoose');

const guestRequestSchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  roomNumber: { type: String, required: true },
  selectedRequests: { type: [String], required: true },
  customNote: { type: String },
  status: { type: String, default: 'pending' }, // pending, in-progress, completed
}, { timestamps: true });

module.exports = mongoose.model('GuestRequest', guestRequestSchema);