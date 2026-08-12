const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController'); // تأكد من مسار ملف الـ Controller حسب هيكل مشروعك

// مسار جلب جميع الغرف (GET /api/rooms)
router.get('/rooms', roomController.getAllRooms);

// إنشاء غرفة جديدة
router.post('/rooms', roomController.createRoom);

// مسار تحديث مخزون وتكوين غرفة محددة (PUT /api/rooms/:id)
router.put('/rooms/:id', roomController.updateRoomConfig);

router.get('/rooms/:id', roomController.getroomDetails);

module.exports = router;