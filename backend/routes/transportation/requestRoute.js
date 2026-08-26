const express = require('express');
const router = express.Router();
const transportationController = require('../../controllers/transportation/request');

// مسارات النقل
router.get('/', transportationController.getRequests);          // جلب كل الطلبات
router.post('/createRequest', transportationController.createRequest);         // إضافة طلب جديد
router.get('/:id', transportationController.getRequestById);      // عرض طلب محدد
router.put('/:id/updateRequest', transportationController.updatePaymentStatus); // تحديث الدفع
router.put('/:id/addRate', transportationController.addRate); // تحديث الدفع
router.delete('/:id/deleteRequest', transportationController.deleteRequest); // تحديث الدفع

module.exports = router;