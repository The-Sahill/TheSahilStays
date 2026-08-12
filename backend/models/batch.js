const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    requests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        required: true
    }],
    totalRequests: {
        type: Number,
        required: true,
        default: 0
    },
    totalItems: {
        type: Number,
        required: true,
        default: 0
    },
    totalCost: {
        type: Number,
        required: true,
        default: 0
    },
    customNote:{
        type: String,
        default: 'لا يوجد ملاحظات'
    },
    status: {
        type: String,
        default: 'Dispatched' // حالة الدفعة (تم الإرسال للمغسلة)
    }
}, {
    timestamps: true // لتسجيل وقت تاريخ إنشاء الدفعة تلقائياً
});

module.exports = mongoose.model('Batch', batchSchema);