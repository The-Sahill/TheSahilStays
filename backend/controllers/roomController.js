


const Room = require('../models/room'); // استدعاء نموذج Mongoose الخاص بالـ Room



// 2. إنشاء غرفة جديدة
exports.createRoom = async (req, res) => {
    try { 
        const { number, floor } = req.body;
        
        // التحقق من عدم تكرار رقم الغرفة (اختياري ولكن يفضل استخدامه)
        const existingRoom = await Room.findOne({ number });
        if (existingRoom) {
            return res.status(400).json({ message: 'رقم الغرفة موجود مسبقاً' });
        }

        const newRoom = new Room(req.body);
        const savedRoom = await newRoom.save();

        res.status(201).json({
            message: 'تم إنشاء الغرفة بنجاح',
            room: savedRoom
        });
    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الغرفة', error: error.message });
    }
};




// 1. جلب جميع الغرف من قاعدة البيانات
exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find({});
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ 
            message: 'حدث خطأ أثناء جلب الغرف', 
            error: error.message 
        });
    }
};

// 2. تحديث تكوين ومخزون غرفة محددة بناءً على المعرف (ID)
exports.updateRoomConfig = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedRoom = await Room.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true } // لضمان إرجاع المستند المحدث وتطبيق قواعد التحقق للـ Schema
        );

        if (!updatedRoom) {
            return res.status(404).json({ message: 'الغرفة المطلوبة غير موجودة' });
        }

        res.status(200).json({ 
            message: 'تم تحديث تكوين الغرفة بنجاح', 
            updatedRoom 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'حدث خطأ أثناء تحديث الغرفة', 
            error: error.message 
        });
    }
};

exports.getroomDetails = async (req,res) => {
    try{
const roomId = req.params.id;

        const roomDetails = await Room.findById(roomId);

        if (!roomDetails) {
            return res.status(404).json({ message: 'الغرفة المطلوبة غير موجودة' });
        }

        res.status(200).json(roomDetails);
    }
    catch(error)
    {
        res.status(500).json({ 
            message: 'حدث خطأ أثناء جلب تفاصيل الغرفة', 
            error: error.message 
        });
    }
}