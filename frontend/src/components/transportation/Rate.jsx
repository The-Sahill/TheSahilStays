import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Rate = () => {
  const { id } = useParams();

  // بيانات رحلة المطار الوهمية (تستبدل ببيانات الـ API الفعلي)
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  // حقول التقييم والتعليق
  const [rating, setRating] = useState();
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // محاكاة جلب بيانات رحلة التوصيل بناءً على المعرف في الرابط
    setTimeout(() => {
      setOrderData({
        id: id ,
        carModel: 'مرسيدس فيتو (VIP)',
        tripType: 'استقبال من مطار الملكة علياء',
        date: '2026-08-17',
        driverName: 'الكابتن أحمد'
      });
      setLoading(false);
    }, 500);
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const reviewData = {
      orderId: id,
      rating,
      comment
    };
    console.log('تم إرسال التقييم بنجاح:', reviewData);
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-stone-800 flex items-center justify-center">
        <p className="text-amber-800 font-medium animate-pulse">جاري تحميل تفاصيل رحلة المطار...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-stone-200 rounded-2xl p-6 shadow-xl shadow-stone-200/50">
        
        <h2 className="text-2xl font-bold text-center mb-6 text-amber-900">
          تقييم خدمة التوصيل
        </h2>

        {/* عرض بيانات رحلة المطار المستخرجة */}
        {orderData && (
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 mb-6 space-y-2.5 text-sm">
            <p className="flex justify-between">
              <span className="text-stone-500">رقم الرحلة:</span>
              <span className="font-semibold text-amber-900">{orderData.id}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-stone-500">نوع الخدمة:</span>
              <span className="font-medium text-stone-700">{orderData.tripType}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-stone-500">السيارة:</span>
              <span className="font-medium text-stone-700">{orderData.carModel}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-stone-500">السائق:</span>
              <span className="font-medium text-stone-700">{orderData.driverName}</span>
            </p>
          </div>
        )}

        {submitted ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-center space-y-2">
            <p className="font-bold text-lg">شكراً لك!</p>
            <p className="text-sm">تم إرسال تقييمك لرحلتك بنجاح، نتمنى لك دائمآ رحلة سعيدة.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* حقل اختيار التقييم (من 1 إلى 5) */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                كيف كانت تجربة رحلتك؟ (من 1 إلى 5)
              </label>
              <div className="flex justify-between gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className={`flex-1 py-2.5 rounded-xl font-bold transition-all duration-200 border ${
                      rating == star
                        ? 'bg-amber-900 border-amber-900 text-white shadow-md shadow-amber-900/10'
                        : 'bg-stone-50 border-stone-200 text-stone-400 hover:bg-stone-100'
                    }`}
                  >
                    ★ {star}
                  </button>
                ))}
              </div>
            </div>

            {/* حقل كتابة الرأي / التعليق */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                ملاحظات أو تعليق على الخدمة
              </label>
              <textarea
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="اكتب ملاحظاتك حول الالتزام بالموعد، نظافة السيارة، أو معاملة السائق..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800 transition-all resize-none"
                required
              ></textarea>
            </div>

            {/* زر الإرسال */}
            <button
              type="submit"
              className="w-full py-3 bg-amber-900 hover:bg-amber-950 text-white font-bold rounded-xl shadow-md transition-all duration-200 active:scale-[0.98]"
            >
              إرسال التقييم
            </button>

          </form>
        )}

      </div>
    </div>
  );
};

export default Rate;