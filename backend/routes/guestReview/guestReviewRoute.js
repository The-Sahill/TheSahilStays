const express = require('express');
const router = express.Router();
const reviewController = require('../../controllers/guestReview/guestReviewController'); // عدل المسار حسب هيكلة مشروعك

// مسار لإضافة تقييم جديد
router.post('/reviews/add', reviewController.addReview);

// مسار لجلب جميع التقييمات
router.get('/reviews/getAll', reviewController.getAllReviews);

module.exports = router;