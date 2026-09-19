import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, Star, CheckCircle2, AlertCircle, Send, Hotel } from 'lucide-react';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function GuestSubmitReview() {
  const { roomNumber: paramRoomNumber } = useParams();
  const [ratingStep, setRatingStep] = useState(null);
  
  const [formData, setFormData] = useState({
    guestName: '',
    roomNumber: paramRoomNumber || '',
    receptionRating: 5,
    cleanlinessRating: 5,
    staffRating: 5,
    locationRating: 5,
    servicesRating: 5,
    overallRating: 5,
    comment: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: '', type: '' });

  // رابط جوجل ماب المخصص للتقييم
  const googleMapUrl = "https://www.google.com/search?hl=en-JO&gl=jo&q=The+Sahill+Stays,+Omar+Shatieh+St.+20,+Amman&ludocid=11769573086745984219&lsig=AB86z5VA2uzfIBq9uOykh-PDwPlS&utm_source=chatgpt.com#lrd=0x151ca12f559f6d35:0xa355ec5d517dfcdb,3";

  const handleStarClick = (star) => {
    setRatingStep(star);
    
    // إذا اختار 4 أو 5 نجوم، يتم تحويله فوراً لجوجل ماب
    if (star >= 4) {
      window.location.href = googleMapUrl;
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!formData.guestName) {
      setPopup({ show: true, message: 'الرجاء إدخال اسمك الكريم', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${apiUrl}/hotel-reviews/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...formData, overallRating: ratingStep })
      });

      if (!response.ok) throw new Error('فشل إرسال التقييم، يرجى المحاولة لاحقاً');

      setPopup({ 
        show: true, 
        message: 'شكراً لملاحظاتك! نأسف لأن إقامتك لم تكن بالمستوى المطلوب، وسنقوم بمعالجة الأمر فوراً.', 
        type: 'success' 
      });
      
      setFormData({
        guestName: '',
        roomNumber: '',
        receptionRating: 5,
        cleanlinessRating: 5,
        staffRating: 5,
        locationRating: 5,
        servicesRating: 5,
        overallRating: 5,
        comment: ''
      });
      setRatingStep(null);

    } catch (err) {
      setPopup({ show: true, message: err.message, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-6" dir="rtl">
      <div className="max-w-2xl w-full">
        
        <div className="text-center mb-8">
          <div className="inline-flex justify-center items-center bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 p-4 rounded-2xl mb-4">
            <Hotel size={32} />
          </div>
          <h1 className="text-2xl font-bold tracking-wide">قيم تجربتك معنا</h1>
          <p className="text-xs text-gray-400 mt-2">نسعد دائماً بخدمتكم ونسعى لتطوير تجربتكم نحو الأفضل</p>
        </div>

        {ratingStep === null || ratingStep >= 4 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center shadow-2xl">
            <h2 className="text-lg font-semibold mb-2 text-gray-200">كيف تقيم تجربتك الإجمالية معنا اليوم؟</h2>
            <p className="text-xs text-gray-400 mb-8">اختر من نجمة واحدة (سيء) إلى 5 نجوم (ممتاز)</p>
            
            {/* تصميم النجوم الواضح مع ترقيم وتوجيه دقيق */}
            <div className="flex justify-center items-center gap-3 md:gap-4 mb-4" dir="ltr">
              {[
                { stars: 1, label: '1 نجمة' },
                { stars: 2, label: '2 نجوم' },
                { stars: 3, label: '3 نجوم' },
                { stars: 4, label: '4 نجوم' },
                { stars: 5, label: '5 نجوم 🌟' },
              ].map((item) => (
                <button
                  key={item.stars}
                  type="button"
                  onClick={() => handleStarClick(item.stars)}
                  className="flex flex-col items-center group focus:outline-none cursor-pointer p-2 bg-gray-950/50 border border-gray-800 hover:border-cyan-500 rounded-xl transition-all hover:scale-105 w-14 md:w-16 py-3"
                >
                  <Star size={26} className="text-amber-400 fill-current mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-gray-200">{item.stars}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-between text-[11px] text-gray-500 px-2 max-w-md mx-auto">
              <span>ممتاز →</span>
              <span>← ضعيف</span>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="mb-6 bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl text-amber-300 text-xs leading-relaxed">
              نعتذر بشدة إذا واجهتك أي مشكلة أثناء إقامتك. يرجى تزويدنا بتفاصيل التقييم لنتمكن من تحسين الخدمة فوراً.
              <button 
                onClick={() => setRatingStep(null)} 
                className="block mt-2 underline font-bold cursor-pointer text-amber-200"
              >
                تعديل عدد النجوم (اخترت {ratingStep} نجوم)
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-5">
              <div className='flex w-full gap-4'>
                <div className='w-full'>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">اسم النزيل الكريم</label>
                  <input
                    type="text"
                    placeholder="مثال: أحمد محمد"
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className='w-full'>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">رقم الغرفة</label>
                  <input
                    type="text"
                    placeholder="مثال: 206"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">الاستقبال</label>
                  <select
                    value={formData.receptionRating}
                    onChange={(e) => setFormData({ ...formData, receptionRating: Number(e.target.value) })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-3 text-xs text-gray-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                    <option value="4">⭐⭐⭐⭐ (4/5)</option>
                    <option value="3">⭐⭐⭐ (3/5)</option>
                    <option value="2">⭐⭐ (2/5)</option>
                    <option value="1">⭐ (1/5)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">النظافة</label>
                  <select
                    value={formData.cleanlinessRating}
                    onChange={(e) => setFormData({ ...formData, cleanlinessRating: Number(e.target.value) })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-3 text-xs text-gray-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                    <option value="4">⭐⭐⭐⭐ (4/5)</option>
                    <option value="3">⭐⭐⭐ (3/5)</option>
                    <option value="2">⭐⭐ (2/5)</option>
                    <option value="1">⭐ (1/5)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">طاقم العمل</label>
                  <select
                    value={formData.staffRating}
                    onChange={(e) => setFormData({ ...formData, staffRating: Number(e.target.value) })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-3 text-xs text-gray-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                    <option value="4">⭐⭐⭐⭐ (4/5)</option>
                    <option value="3">⭐⭐⭐ (3/5)</option>
                    <option value="2">⭐⭐ (2/5)</option>
                    <option value="1">⭐ (1/5)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">الموقع</label>
                  <select
                    value={formData.locationRating}
                    onChange={(e) => setFormData({ ...formData, locationRating: Number(e.target.value) })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-3 text-xs text-gray-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                    <option value="4">⭐⭐⭐⭐ (4/5)</option>
                    <option value="3">⭐⭐⭐ (3/5)</option>
                    <option value="2">⭐⭐ (2/5)</option>
                    <option value="1">⭐ (1/5)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">الخدمات</label>
                  <select
                    value={formData.servicesRating}
                    onChange={(e) => setFormData({ ...formData, servicesRating: Number(e.target.value) })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-3 text-xs text-gray-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                    <option value="4">⭐⭐⭐⭐ (4/5)</option>
                    <option value="3">⭐⭐⭐ (3/5)</option>
                    <option value="2">⭐⭐ (2/5)</option>
                    <option value="1">⭐ (1/5)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">ما الذي لم يعجبك أو كيف يمكننا التحسين؟</label>
                <textarea
                  placeholder="شاركنا تفاصيل المشكلة لنتمكن من حلها..."
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-500 h-28 resize-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3.5 rounded-xl transition-all cursor-pointer flex justify-center items-center gap-2 disabled:opacity-50 shadow-lg shadow-cyan-600/20"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Send size={18} />
                    <span>إرسال الملاحظات للإدارة</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

      </div>

      {popup.show && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="max-w-sm w-full bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-6 text-center animate-in fade-in zoom-in duration-200">
            <div className="flex justify-center mb-3">
              {popup.type === 'error' ? (
                <AlertCircle size={40} className="text-rose-400" />
              ) : (
                <CheckCircle2 size={40} className="text-emerald-400" />
              )}
            </div>
            <p className="text-gray-200 text-sm mb-6 leading-relaxed">{popup.message}</p>
            <button
              onClick={() => setPopup({ show: false, message: '', type: '' })}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all"
            >
              حسناً
            </button>
          </div>
        </div>
      )}
    </div>
  );
}