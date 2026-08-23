import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BellRing, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const predefinedRequests = [
  "مناشف / بشاكير",
  "فاين حمام",
  "فاين عادي",
  "شاور جل",
  "شامبو",
  "سليبر",
  "شرشف",
  "كفر لحاف",
  "مخدات",
  "وايفاي",
  "تأخير وقت الخروج",
  "خروج قبل الموعد المحدد",
  "طلب من تطبيق طلبات",
  "مشاكل ببطاقة الغرفة",
  "تنظيف الغرفة",
  "عطل داخل الغرفة",
  "أخرى"
];

export default function GuestRequestPage() {
  const { id } = useParams(); // استقبال الـ id الخاص بالغرفة من الرابط

  const [formData, setFormData] = useState({
    guestName: '',
    roomNumber: id || '',
    selectedRequests: [],
    customNote: ''
  });
  
  const [loading, setLoading] = useState(false);
  
  // نظام النافذة المنبثقة (Popup Modal) للرسائل
  const [popup, setPopup] = useState({ show: false, message: '', type: '' });

  // تحديث رقم الغرفة تلقائياً في حال تغير الـ id بالرابط
  useEffect(() => {
    if (id) {
      setFormData(prev => ({ ...prev, roomNumber: id }));
    }
  }, [id]);

  const handleCheckboxChange = (item) => {
    setFormData(prev => {
      const exists = prev.selectedRequests.includes(item);
      if (exists) {
        return { ...prev, selectedRequests: prev.selectedRequests.filter(i => i !== item) };
      } else {
        return { ...prev, selectedRequests: [...prev.selectedRequests, item] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.guestName || !formData.roomNumber) {
      setPopup({ 
        show: true, 
        message: 'الرجاء إدخال اسم النزيل والتأكد من رقم الغرفة', 
        type: 'error' 
      });
      return;
    }
    if (formData.selectedRequests.length === 0) {
      setPopup({ 
        show: true, 
        message: 'الرجاء اختيار طلب واحد على الأقل', 
        type: 'error' 
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/create/userRequest/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('فشل إرسال الطلب، حاول مرة أخرى');

      setPopup({ 
        show: true, 
        message: 'تم إرسال طلبك بنجاح! فريق الخدمة في طريقه إليك.', 
        type: 'success' 
      });

      setFormData({ guestName: '', roomNumber: id || '', selectedRequests: [], customNote: '' });
      
      // إغلاق النافذة التلقائي بعد 4 ثوانٍ للنجاح
      setTimeout(() => {
        setPopup({ show: false, message: '', type: '' });
      },  );

    } catch (err) {
      setPopup({ 
        show: true, 
        message: err.message, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 py-10 px-4 flex justify-center items-center relative" dir='rtl'>
      
      <div className="max-w-2xl w-full bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-md">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl">
              <BellRing size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wide">طلب خدمات النزلاء</h1>
              <p className="text-sm text-gray-400">اختر الخدمات المطلوبة وسنقوم بتلبيتها في أسرع وقت</p>
            </div>
          </div>
          {/* عرض رقم الغرفة المستخرج من الرابط */}
          {id && (
            <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-3 py-1.5 rounded-xl text-sm font-semibold">
              غرفة: {id}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Guest Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">اسم النزيل</label>
            <input
              type="text"
              value={formData.guestName}
              onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
              placeholder="أدخل اسمك الكامل"
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Requests Checkboxes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">الطلبات والخدمات</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
              {predefinedRequests.map((item, idx) => {
                const isChecked = formData.selectedRequests.includes(item);
                return (
                  <label
                    key={idx}
                    onClick={() => handleCheckboxChange(item)}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300'
                        : 'bg-gray-950 border-gray-800 text-gray-300 hover:border-gray-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="rounded border-gray-700 text-cyan-500 focus:ring-cyan-500 bg-gray-900 w-4 h-4"
                    />
                    <span className="text-sm font-medium">{item}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Notes / Custom Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              ملاحظات إضافية (العدد، تفاصيل خدمة "أخرى"، إلخ)
            </label>
            <textarea
              rows="3"
              value={formData.customNote}
              onChange={(e) => setFormData({ ...formData, customNote: e.target.value })}
              placeholder="اكتب تفاصيل إضافية هنا..."
              className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-gray-200 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-600/20 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>جاري الإرسال...</span>
              </>
            ) : (
              <span>إرسال الطلب</span>
            )}
          </button>
        </form>

      </div>

      {/* نافذة منبثقة (Popup Modal) في منتصف الشاشة للرسائل والتنبيهات */}
      {popup.show && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-6 text-center transform animate-in fade-in zoom-in duration-200">
            <div className="flex justify-center mb-4">
              {popup.type === 'success' ? (
                <div className="p-3 bg-emerald-500/10 rounded-full">
                  <CheckCircle2 size={40} className="text-emerald-400" />
                </div>
              ) : (
                <div className="p-3 bg-rose-500/10 rounded-full">
                  <AlertCircle size={40} className="text-rose-400" />
                </div>
              )}
            </div>
            
            <h3 className="text-xl font-bold mb-2 text-gray-100">
              {popup.type === 'success' ? 'تمت العملية بنجاح' : 'تنبيه هام'}
            </h3>
            
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              {popup.message}
            </p>

            <button
              onClick={() => setPopup({ show: false, message: '', type: '' })}
              className={`w-full py-3 rounded-xl font-semibold transition-all cursor-pointer ${
                popup.type === 'success'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-rose-600 hover:bg-rose-500 text-white'
              }`}
            >
              حسناً
            </button>
          </div>
        </div>
      )}
    </div>
  );
}