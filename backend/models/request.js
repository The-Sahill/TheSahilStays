const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
number:{
    type: String,
},
type:{
    type: String,
},
quantity:{
type: Number,
},
total:{
    type: Number,
},

customer:{
    type: String,
        },
        
employee:{
    type:String
},

status:{
    type: Boolean,
    default: false
},

approved:{
    type: String,
    default: "قيد الانتظار"
},


    // قائمة المستلزمات
    towels: { // مناشف
        count: { type: Number},
        price: { type: Number}
    },
    bathTowels: { // بشاكير
        count: { type: Number},
        price: { type: Number, default: 7 }
    },
    blankets: { // حرامات
        count: { type: Number},
        price: { type: Number}
    },
    pillows: { // مخدات
        count: { type: Number},
        price: { type: Number }
    },
    floorMats: { // أغطية أرضيات
        count: { type: Number },
        price: { type: Number}
    },
    bedSheets: { // شراشف
        count: { type: Number},
        price: { type: Number }
    },
    robeCovers: { // كفر روب
        count: { type: Number},
        price: { type: Number}
    },

    customNotes:{
        type: String
    }

},{ timestamps: true })

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;