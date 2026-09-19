import React, { useState, useEffect } from 'react';
import { Loader2, Star, CheckCircle2, AlertCircle, RefreshCw, ChevronRight, ChevronLeft, Filter, Search, Send, Clock, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

// دالة لتنسيق الوقت والتاريخ بالشكل العربي
const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
};

export default function HotelReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [averageOverall, setAverageOverall] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // حقول نموذج إضافة تقييم جديد
  const [formData, setFormData] = useState({
    guestName: '',
    roomNumber: '',
    rating: 5,
    comment: ''
  });

  // حالات الفلتر، البحث، والـ Pagination (5 عناصر بالصفحة)
  const [searchName, setSearchName] = useState('');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // دالة لجلب التقييمات من الباك إند
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/reviews/getAll`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('فشل في جلب تقييمات الفندق');

      const result = await response.json();
      setReviews(result.data || []);
      setAverageOverall(result.averageOverall || 0);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // التعامل مع إدخالات النموذج
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // إرسال الطلب لإضافة تقييم جديد
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setFormSuccess('');

    try {
      const response = await fetch(`${apiUrl}/reviews/add`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'فشل في إرسال التقييم');
      }

      setFormSuccess(result.message || 'تم إضافة تقييمك بنجاح!');
      toast.success(result.message || 'تم إضافة تقييمك بنجاح!');
      
      setFormData({
        guestName: '',
        roomNumber: '',
        rating: 5,
        comment: ''
      });

      fetchReviews();
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // تطبيق الفلاتر (البحث بالاسم + تصفية التقييم العام)
  const filteredReviews = reviews.filter((rev) => {
    const matchesName = rev.guestName?.toLowerCase().includes(searchName.toLowerCase());
    const matchesRating = selectedRatingFilter === 'all' || rev.rating === Number(selectedRatingFilter);
    return matchesName && matchesRating;
  });

  // حساب الـ Pagination لـ 5 عناصر في كل صفحة
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);

  const handleSearchChange = (e) => {
    setSearchName(e.target.value);
    setCurrentPage(1);
  };

  const handleRatingFilterChange = (e) => {
    setSelectedRatingFilter(e.target.value);
    setCurrentPage(1);
  };

  // رسم النجوم بصرياً
  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={13}
            className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-700'}
          />
        ))}
      </div>
    );
  };

  // دالة الحذف مع التأكيد الصحيح
  const deleteReview = async (id) => {
    const confirmDelete = window.confirm("هل أنت متأكد من رغبتك في حذف هذا التقييم؟");
    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(`${apiUrl}/deleteReview/${id}`, { withCredentials: true });

      if (data.error === false || data.success) {
        setReviews((prev) => prev.filter((rev) => rev._id !== id));
        toast.success(data.message || "تم حذف التقييم بنجاح");
      } else {
        toast.error(data.message || "حدث خطأ أثناء حذف التقييم");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف التقييم");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 relative p-4 sm:p-6 md:p-10" dir="rtl">
      {/* خلفية جمالية (Glow Effects) */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800 pb-4 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-wide">تقييمات الفندق</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">عرض وإدارة آراء وتقييمات الضيوف ووقت إرسالها</p>
          </div>
          
          <button
            onClick={fetchReviews}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-cyan-400 cursor-pointer transition-all"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span>تحديث القائمة</span>
          </button>
        </div>

        {/* --- نموذج إضافة تقييم جديد (Add Review Form) --- */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6 shadow-xl">
          <h2 className="text-base sm:text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
            <Star className="fill-cyan-400" size={18} />
            إضافة تقييم نزيل جديد
          </h2>

          {formSuccess && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs sm:text-sm flex items-center gap-2">
              <CheckCircle2 size={18} />
              <span>{formSuccess}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmitReview} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">اسم النزيل</label>
              <input
                type="text"
                name="guestName"
                required
                placeholder="أدخل اسم النزيل..."
                value={formData.guestName}
                onChange={handleInputChange}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">رقم الغرفة</label>
              <input
                type="text"
                name="roomNumber"
                required
                placeholder="مثال: 302"
                value={formData.roomNumber}
                onChange={handleInputChange}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">التقييم العام (1-5)</label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="5">5 نجوم - ممتاز</option>
                <option value="4">4 نجوم - جيد جداً</option>
                <option value="3">3 نجوم - متوسط</option>
                <option value="2">نجمتان - سيء</option>
                <option value="1">نجمة واحدة - سيء جداً</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">التعليق (اختياري)</label>
              <input
                type="text"
                name="comment"
                placeholder="اكتب تعليق النزيل..."
                value={formData.comment}
                onChange={handleInputChange}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="md:col-span-2 flex justify-end mt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-medium cursor-pointer transition-all disabled:opacity-50"
              >
                {submitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                <span>إرسال التقييم</span>
              </button>
            </div>
          </form>
        </div>

        {/* --- Filters Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث باسم النزيل..."
              value={searchName}
              onChange={handleSearchChange}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl pr-10 pl-4 py-3 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between bg-gray-900 border border-gray-800 px-4 py-2.5 rounded-xl">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
              <Filter size={16} className="text-cyan-400" />
              <span>فلترة بالتقييم العام:</span>
            </div>
            <select
              value={selectedRatingFilter}
              onChange={handleRatingFilterChange}
              className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="all">جميع التقييمات</option>
              <option value="5">5 نجوم</option>
              <option value="4">4 نجوم</option>
              <option value="3">3 نجوم</option>
              <option value="2">نجمتان</option>
              <option value="1">نجمة واحدة</option>
            </select>
          </div>
        </div>

        {/* --- Content View --- */}
        {loading && reviews.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-cyan-500" size={40} />
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/50 border border-gray-800/60 rounded-2xl">
            <p className="text-gray-400 text-sm sm:text-base">لا توجد تقييمات مطابقة لنتائج البحث أو الفلتر</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View (Hidden on mobile) */}
            <div className="hidden lg:block bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-gray-950 border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="py-4 px-6 font-semibold">رقم الغرفة</th>
                      <th className="py-4 px-6 font-semibold">اسم النزيل</th>
                      <th className="py-4 px-6 font-semibold">التقييم</th>
                      <th className="py-4 px-6 font-semibold">وقت التقييم</th>
                      <th className="py-4 px-6 font-semibold">التعليق</th>
                      <th className="py-4 px-6 font-semibold text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-sm">
                    {currentReviews.map((rev) => (
                      <tr key={rev._id} className="hover:bg-gray-850 transition-colors">
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-3 py-1 rounded-xl text-xs font-semibold">
                            غرفة {rev.roomNumber}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-medium text-gray-100 whitespace-nowrap">
                          {rev.guestName}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          {renderStars(rev.rating)}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-gray-400 text-xs">
                          <div className="flex items-center gap-1.5">
                            <Clock size={13} className="text-cyan-400" />
                            <span>{formatDateTime(rev.createdAt)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-300 max-w-xs truncate">
                          {rev.comment ? rev.comment : <span className="text-gray-600">بدون تعليق</span>}
                        </td>
                        <td className="py-4 px-6 text-center whitespace-nowrap">
                          <button 
                            onClick={() => deleteReview(rev._id)} 
                            className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 py-1.5 px-4 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Trash2 size={13} />
                            <span>حذف</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile & Tablet Card View (Responsive Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4 mb-6">
              {currentReviews.map((rev) => (
                <div key={rev._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="font-bold text-sm text-gray-100 block">{rev.guestName}</span>
                      <span className="text-xs text-cyan-400 font-medium">غرفة رقم: {rev.roomNumber}</span>
                    </div>
                    <div className="bg-gray-950 border border-gray-800 px-2.5 py-1 rounded-xl flex items-center gap-1 text-xs">
                      {renderStars(rev.rating)}
                    </div>
                  </div>

                  {rev.comment && (
                    <p className="text-xs text-gray-300 bg-gray-950 p-2.5 rounded-xl border border-gray-800">
                      {rev.comment}
                    </p>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-gray-800/80">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock size={13} className="text-cyan-400" />
                      <span>{formatDateTime(rev.createdAt)}</span>
                    </div>
                    <button 
                      onClick={() => deleteReview(rev._id)} 
                      className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 py-1 px-3 rounded-xl text-xs font-medium inline-flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Trash2 size={12} />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls (5 عناصر بكل صفحة) */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-900 border border-gray-800 px-4 py-3 rounded-2xl">
                <span className="text-xs text-gray-400">
                  عرض الصفحة <span className="text-cyan-400 font-semibold">{currentPage}</span> من <span className="font-semibold">{totalPages}</span> (إجمالي النتائج: {filteredReviews.length})
                </span>
                <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-start">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center gap-1 bg-gray-950 hover:bg-gray-850 border border-gray-800 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                  >
                    <ChevronRight size={14} />
                    <span>السابق</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center gap-1 bg-gray-950 hover:bg-gray-850 border border-gray-800 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                  >
                    <span>التالي</span>
                    <ChevronLeft size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}