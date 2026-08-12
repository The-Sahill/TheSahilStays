const express = require('express');
const router = express.Router();
const { createBatchAndDispatch, getBatches ,getCurrentUser,updateBatchStatus} = require('../controllers/batchController');

// مسار إرسال الدفعة وتحديث الطلبات
router.post('/dispatch', createBatchAndDispatch);

// مسار جلب الدفعات السابقة
router.get('/batches', getBatches);

router.get('/batches/user', getCurrentUser);

router.patch('/batches/:id/status', updateBatchStatus);

module.exports = router;