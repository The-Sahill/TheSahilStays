import React, { useState, useEffect } from 'react';
import { Loader2, Star, CheckCircle2, AlertCircle, RefreshCw, ChevronRight, ChevronLeft, Filter, Search, Clock, Hotel } from 'lucide-react';

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

export default function GuestReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [popup, setPopup] = useState({ show: false, message: '', type: '' });

  // حالات الفلتر، البحث، والـ Pagination (6 عناصر بالصفحة)
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

  // تطبيق الفلاتر (البحث بالاسم + تصفية التقييم العام)
  const filteredReviews = reviews.filter((rev) => {
    const matchesName = rev.guestName?.toLowerCase().includes(searchName.toLowerCase());
    const matchesRating = selectedRatingFilter === 'all' || rev.overallRating === Number(selectedRatingFilter);
    return matchesName && matchesRating;
  });

  // حساب الـ Pagination لـ 6 عناصر في كل صفحة
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

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 relative p-4 sm:p-6 md:p-10" dir="rtl">
      {/* خلفية جمالية (Glow Effects) */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-wide">تقييمات النزلاء</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">متابعة آراء وتقييمات الضيوف ووقت إرسالها لتحسين جودة الخدمة</p>
          </div>
          <button
            onClick={fetchReviews}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-cyan-400 cursor-pointer transition-all"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span>تحديث القائمة</span>
          </button>
        </div>

        {/* Filters Section (Search & Filter) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث باسم النزيل..."
              value={searchName}
              onChange={handleSearchChange}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl pr-10 pl-4 py-3 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-cyan-500 transition-colors"
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

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs sm:text-sm flex items-center gap-3">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Content View */}
        {loading && reviews.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-cyan-500" size={40} />
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/50 border border-gray-800/60 rounded-2xl">
            <p className="text-gray-400 text-sm sm:text-base">لا توجد تقييمات تطابق نتائج البحث أو الفلتر الحالي</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View (Hidden on mobile) */}
            <div className="hidden lg:block bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden mb-6">
              <div className="">
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
                      <th className="py-4 px-4 font-semibold">الوقت والتاريخ</th>
                      <th className="py-4 px-4 font-semibold">التعليق</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-xs sm:text-sm">
                    {currentReviews.map((rev) => (
                      <tr key={rev._id || rev.id} className="hover:bg-gray-850 transition-colors">
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-2.5 py-1 rounded-xl text-xs font-semibold">
                            {rev.roomNumber}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-medium text-gray-100 whitespace-nowrap">
                          {rev.guestName}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">{renderStars(rev.receptionRating)}</td>
                        <td className="py-4 px-4 whitespace-nowrap">{renderStars(rev.cleanlinessRating)}</td>
                        <td className="py-4 px-4 whitespace-nowrap">{renderStars(rev.staffRating)}</td>
                        <td className="py-4 px-4 whitespace-nowrap">{renderStars(rev.locationRating)}</td>
                        <td className="py-4 px-4 whitespace-nowrap">{renderStars(rev.servicesRating)}</td>
                        <td className="py-4 px-4 whitespace-nowrap">{renderStars(rev.overallRating)}</td>
                        <td className="py-4 px-4 whitespace-nowrap text-gray-400 text-xs">
                          <div className="flex items-center gap-1.5">
                            <Clock size={13} className="text-cyan-400" />
                            <span>{formatDateTime(rev.createdAt)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-300 max-w-xs truncate">
                          {rev.comment ? rev.comment : <span className="text-gray-600">بدون تعليق</span>}
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
                <div key={rev._id || rev.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="font-bold text-sm text-gray-100 block">{rev.guestName}</span>
                      <span className="text-xs text-cyan-400 font-medium">غرفة رقم: {rev.roomNumber}</span>
                    </div>
                    <div className="bg-gray-950 border border-gray-800 px-2.5 py-1 rounded-xl flex items-center gap-1 text-xs">
                      <span className="text-gray-400">العام:</span>
                      {renderStars(rev.overallRating)}
                    </div>
                  </div>

                  {/* تفاصيل التقييمات الفرعية */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-gray-950/60 p-2.5 rounded-xl border border-gray-800/60 text-xs text-gray-300">
                    <div className="flex justify-between"><span>الاستقبال:</span> {renderStars(rev.receptionRating)}</div>
                    <div className="flex justify-between"><span>النظافة:</span> {renderStars(rev.cleanlinessRating)}</div>
                    <div className="flex justify-between"><span>العمل:</span> {renderStars(rev.staffRating)}</div>
                    <div className="flex justify-between"><span>الموقع:</span> {renderStars(rev.locationRating)}</div>
                    <div className="flex justify-between"><span>الخدمات:</span> {renderStars(rev.servicesRating)}</div>
                  </div>

                  {rev.comment && (
                    <p className="text-xs text-gray-300 bg-gray-950 p-2.5 rounded-xl border border-gray-800">
                      {rev.comment}
                    </p>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-2 border-t border-gray-800/80">
                    <Clock size={13} className="text-cyan-400" />
                    <span>{formatDateTime(rev.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls (6 عناصر بكل صفحة) */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-900 border border-gray-800 px-4 py-3 rounded-2xl">
                <span className="text-xs text-gray-400">
                  عرض الصفحة <span className="text-cyan-400 font-semibold">{currentPage}</span> من <span className="font-semibold">{totalPages}</span> (إجمالي التقييمات: {filteredReviews.length})
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