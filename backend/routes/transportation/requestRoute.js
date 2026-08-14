const express = require('express');
const router = express.Router();
const transportationController = require('../../controllers/transportation/request');

// مسارات النقل
router.get('/', transportationController.getRequests);          // جلب كل الطلبات
router.post('/', transportationController.createRequest);         // إضافة طلب جديد
router.get('/:id', transportationController.getRequestById);      // عرض طلب محدد
router.patch('/:id/pay', transportationController.updatePaymentStatus); // تحديث الدفع

module.exports = router;