const HotelReview = require('../../models/hotelReview/hotelReview'); // عدل المسار حسب هيكلة مشروعك

// إضافة تقييم جديد للفندق من قِبل النزيل (رقم الغرفة يأتي من الـ Params)
exports.addHotelReview = async (req, res) => {
  try {
    const { roomNumber } = req.params; // جلب رقم الغرفة من الـ Params
    const { guestName, cleanlinessRating, serviceRating, overallRating, comment } = req.body;

    if (!guestName || !roomNumber || !cleanlinessRating || !serviceRating || !overallRating) {
      return res.status(400).json({ error: 'جميع حقول التقييمات الأساسية (النظافة، الخدمة، التقييم العام، الاسم) مطلوبة' });
    }

    // التحقق من أن القيم بين 1 و 5
    const ratings = [cleanlinessRating, serviceRating, overallRating];
    if (ratings.some(r => r < 1 || r > 5)) {
      return res.status(400).json({ error: 'جميع التقييمات يجب أن تكون بين 1 و 5 نجوم' });
    }

    const newReview = await HotelReview.create({
      guestName,
      roomNumber, // استخدام رقم الغرفة القادم من الـ Params
      cleanlinessRating,
      serviceRating,
      overallRating,
      comment: comment || ''
    });

    res.status(201).json({ 
      success: true, 
      message: 'تم إرسال تقييمك للفندق بنجاح، نشكر لك ثقتك!', 
      data: newReview 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في الخادم الداخلي' });
  }
};

// جلب جميع تقييمات الفندق (للإدارة أو العرض)
exports.getAllHotelReviews = async (req, res) => {
  try {
    const reviews = await HotelReview.find().sort({ createdAt: -1 });
    
    const totalReviews = reviews.length;
    let averageOverall = 0;
    if (totalReviews > 0) {
      const sum = reviews.reduce((acc, curr) => acc + curr.overallRating, 0);
      averageOverall = (sum / totalReviews).toFixed(1);
    }

    res.status(200).json({ 
      success: true, 
      count: totalReviews, 
      averageOverall: Number(averageOverall),
      data: reviews 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في الخادم الداخلي' });
  }
};