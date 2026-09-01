import React, { useState, useEffect } from 'react';
import { Loader2, Star, CheckCircle2, AlertCircle, RefreshCw, MessageSquarePlus, ChevronRight, ChevronLeft, Filter, Search, Award } from 'lucide-react';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function GuestReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [popup, setPopup] = useState({ show: false, message: '', type: '' });

  // نموذج إضافة تقييم جديد مع الأقسام الستة
  const [formData, setFormData] = useState({
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
  const [submitting, setSubmitting] = useState(false);

  // حالات الفلتر، البحث، والـ Pagination
  const [searchName, setSearchName] = useState('');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // دالة لجلب التقييمات من الباك إند
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/hotel-reviews/getAll`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('فشل في جلب التقييمات');

      const result = await response.json();
      setReviews(result.data || []);
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

  // دالة لإضافة تقييم جديد
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!formData.guestName || !formData.roomNumber) {
      setPopup({ show: true, message: 'الرجاء إدخال اسم النزيل ورقم الغرفة على الأقل', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${apiUrl}/hotel-reviews/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('فشل إرسال التقييم');

      setPopup({ show: true, message: 'تم إرسال تقييمك بنجاح، شكراً لك!', type: 'success' });
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
      fetchReviews(); 
      setTimeout(() => setPopup({ show: false, message: '', type: '' }), 3000);

    } catch (err) {
      setPopup({ show: true, message: err.message, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // تطبيق الفلاتر (البحث بالاسم + تصفية التقييم العام)
  const filteredReviews = reviews.filter((rev) => {
    const matchesName = rev.guestName.toLowerCase().includes(searchName.toLowerCase());
    const matchesRating = selectedRatingFilter === 'all' || rev.overallRating === Number(selectedRatingFilter);
    return matchesName && matchesRating;
  });

  // حساب الـ Pagination
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
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 relative p-6 md:p-10" dir="rtl">
      {/* خلفية جمالية (Glow Effects) */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">تقييمات النزلاء</h1>
            <p className="text-sm text-gray-400 mt-1">متابعة آراء وتقييمات الضيوف لتحسين جودة الخدمة</p>
          </div>
          <button
            onClick={fetchReviews}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 px-4 py-2.5 rounded-xl text-sm font-medium text-cyan-400 cursor-pointer transition-all"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span>تحديث</span>
          </button>
        </div>

       

        {/* Filters Section (Search by Name & Rating Filter) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث باسم النزيل..."
              value={searchName}
              onChange={handleSearchChange}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl pr-10 pl-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Filter size={18} className="text-cyan-400" />
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

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-sm flex items-center gap-3">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Table View */}
        {loading && reviews.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-cyan-500" size={40} />
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/50 border border-gray-800/60 rounded-2xl">
            <p className="text-gray-400 text-lg">لا توجد تقييمات تطابق نتائج البحث أو الفلتر الحالي</p>
          </div>
        ) : (
          <>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-gray-950 border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="py-4 px-4 font-semibold">الغرفة</th>
                      <th className="py-4 px-4 font-semibold">اسم النزيل</th>
                      <th className="py-4 px-4 font-semibold">الاستقبال</th>
                      <th className="py-4 px-4 font-semibold">النظافة</th>
                      <th className="py-4 px-4 font-semibold">طاقم العمل</th>
                      <th className="py-4 px-4 font-semibold">الموقع</th>
                      <th className="py-4 px-4 font-semibold">الخدمات</th>
                      <th className="py-4 px-4 font-semibold">العام</th>
                      <th className="py-4 px-4 font-semibold">التعليق</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-sm">
                    {currentReviews.map((rev) => (
                      <tr key={rev._id} className="hover:bg-gray-850 transition-colors">
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-3 py-1 rounded-xl text-xs font-semibold">
                            {rev.roomNumber}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-medium text-gray-100 whitespace-nowrap">
                          {rev.guestName}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          {renderStars(rev.receptionRating)}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          {renderStars(rev.cleanlinessRating)}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          {renderStars(rev.staffRating)}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          {renderStars(rev.locationRating)}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          {renderStars(rev.servicesRating)}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          {renderStars(rev.overallRating)}
                        </td>
                        <td className="py-4 px-4 text-gray-300 max-w-xs">
                          {rev.comment ? rev.comment : <span className="text-gray-600">بدون تعليق</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6 px-2">
                <span className="text-xs text-gray-400">
                  عرض الصفحة {currentPage} من {totalPages} (إجمالي النتائج: {filteredReviews.length})
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 bg-gray-900 hover:bg-gray-800 border border-gray-800 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                  >
                    <ChevronRight size={14} />
                    <span>السابق</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 bg-gray-900 hover:bg-gray-800 border border-gray-800 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
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

      {/* Popup Notification */}
      {popup.show && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="max-w-sm w-full bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-6 text-center">
            <div className="flex justify-center mb-3">
              <CheckCircle2 size={36} className="text-emerald-400" />
            </div>
            <p className="text-gray-200 text-sm mb-4">{popup.message}</p>
            <button
              onClick={() => setPopup({ show: false, message: '', type: '' })}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-2 rounded-xl text-sm font-semibold cursor-pointer"
            >
              حسناً
            </button>
          </div>
        </div>
      )}
    </div>
  );
}