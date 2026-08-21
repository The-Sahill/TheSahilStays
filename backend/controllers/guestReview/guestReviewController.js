const GuestReview = require('../../models/guestReview/guestReview'); // عدل مسار الموديل حسب هيكلة مشروعك

// إضافة تقييم جديد من النزيل
exports.addReview = async (req, res) => {
  try {
    const { guestName, roomNumber, rating, comment } = req.body;

    if (!guestName || !roomNumber || !rating) {
      return res.status(400).json({ error: 'اسم النزيل، رقم الغرفة، وعدد النجوم مطلوبة' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'التقييم يجب أن يكون بين 1 و 5 نجوم' });
    }

    const newReview = await GuestReview.create({
      guestName,
      roomNumber,
      rating,
      comment: comment || ''
    });

    res.status(201).json({ 
      success: true, 
      message: 'تم إضافة تقييمك بنجاح، شكراً لك!', 
      data: newReview 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في الخادم الداخلي' });
  }
};

// جلب جميع التقييمات (للإدارة أو للعرض العام)
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await GuestReview.find().sort({ createdAt: -1 });
    res.status(200).json({ 
      success: true, 
      count: reviews.length, 
      data: reviews 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في الخادم الداخلي' });
  }
};