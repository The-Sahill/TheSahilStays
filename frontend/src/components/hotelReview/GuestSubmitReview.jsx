import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, Star, CheckCircle2, AlertCircle, Send, Hotel } from 'lucide-react';

export default function GuestSubmitReview() {
  const { roomNumber } = useParams(); // استقبال رقم الغرفة من الرابط (Params)

  const [formData, setFormData] = useState({
    guestName: '',
    cleanlinessRating: 5,
    serviceRating: 5,
    overallRating: 5,
    comment: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: '', type: '' });

  // دالة إرسال التقييم للباك إند
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!formData.guestName) {
      setPopup({ show: true, message: 'الرجاء إدخال اسمك الكريم', type: 'error' });
      return;
    }
    if (!roomNumber) {
      setPopup({ show: true, message: 'رقم الغرفة غير موجود في الرابط', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      // إرسال رقم الغرفة في الـ URL params وباقي البيانات في الـ body
      const response = await fetch(`http://localhost:4000/hotel-reviews/add/${roomNumber}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('فشل إرسال التقييم، يرجى المحاولة لاحقاً');

      setPopup({ 
        show: true, 
        message: 'شكراً لك! تم إرسال تقييمك بنجاح ونسعد بخدمتك دائماً.', 
        type: 'success' 
      });
      
      // تفريغ الفورم بعد النجاح
      setFormData({
        guestName: '',
        cleanlinessRating: 5,
        serviceRating: 5,
        overallRating: 5,
        comment: ''
      });

    } catch (err) {
      setPopup({ show: true, message: err.message, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-6" dir="rtl">
      <div className="max-w-xl w-full">
        
        {/* Header Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex justify-center items-center bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 p-4 rounded-2xl mb-4">
            <Hotel size={32} />
          </div>
          <h1 className="text-2xl font-bold tracking-wide">قيم تجربتك معنا</h1>
          <p className="text-sm text-gray-400 mt-1">
            {roomNumber ? `رقم الغرفة: ${roomNumber}` : ''} - رأيك يهمنا للارتقاء بجودة الخدمات
          </p>
        </div>

        {/* Review Form Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl">
          <form onSubmit={handleSubmitReview} className="space-y-5">
            
            {/* Guest Name Only (Room Number comes from URL) */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">اسم النزيل الكريم</label>
              <input
                type="text"
                placeholder="مثال: أحمد محمد"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Ratings (Cleanliness, Service, Overall) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">نظافة الغرفة</label>
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
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">جودة الخدمة</label>
                <select
                  value={formData.serviceRating}
                  onChange={(e) => setFormData({ ...formData, serviceRating: Number(e.target.value) })}
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
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">التقييم العام</label>
                <select
                  value={formData.overallRating}
                  onChange={(e) => setFormData({ ...formData, overallRating: Number(e.target.value) })}
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

            {/* Comment Section */}
            <div className="pt-2">
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">ملاحظات أو تعليق إضافي (اختياري)</label>
              <textarea
                placeholder="شاركنا تفاصيل إقامتك أو أي مقترحات لتحسين الخدمة..."
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-500 h-28 resize-none transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3.5 rounded-xl transition-all cursor-pointer flex justify-center items-center gap-2 disabled:opacity-50 shadow-lg shadow-cyan-600/20"
            >
              {submitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Send size= {18} />
                  <span>إرسال التقييم</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>

      {/* Success / Error Popup Notification */}
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