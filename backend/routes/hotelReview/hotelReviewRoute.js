const express = require('express');
const router = express.Router();
const hotelReviewController = require('../../controllers/hotelReview/hotelReviewController'); // عدل المسار حسب هيكلة مشروعك

router.post('/hotel-reviews/add', hotelReviewController.addHotelReview);

// مسار لجلب جميع تقييمات الفندق
router.get('/hotel-reviews/getAll', hotelReviewController.getAllHotelReviews);

module.exports = router;