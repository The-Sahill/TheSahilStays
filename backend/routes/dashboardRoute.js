const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController'); // مسار الكنترولر

// مسار جلب الإحصائيات
router.get('/dashboard-stats', dashboardController.getDashboardStats);
router.get('/getChartData', dashboardController.getChartData);

module.exports = router;