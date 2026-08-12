const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    number: {
        type: String,
    },
    floor: {
        type: String,
    },

    // قائمة المستلزمات
    towels: { // مناشف
        count: { type: Number, default: 1 },
        price: { type: Number, default: 0.40 }
    },
    bathTowels: { // بشاكير
        count: { type: Number, default: 1 },
        price: { type: Number, default: 0.35 }
    },
    blankets: { // حرامات
        count: { type: Number, default: 2 },
        price: { type: Number, default: 2 }
    },
    pillows: { // مخدات
        count: { type: Number, default: 2 },
        price: { type: Number, default: 0.25 }
    },
    floorMats: { // أغطية أرضيات
        count: { type: Number, default: 1 },
        price: { type: Number, default: 0.35 }
    },
    bedSheets: { // شراشف
        count: { type: Number, default: 1 },
        price: { type: Number, default: 0.35 }
    },
    robeCovers: { // كفر روب
        count: { type: Number, default: 1 },
        price: { type: Number, default: 1 }
    }
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;