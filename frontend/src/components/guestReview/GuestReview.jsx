import React, { useState, useEffect } from 'react';
import { Loader2, Star, CheckCircle2, AlertCircle, RefreshCw, ChevronRight, ChevronLeft, Filter, Search, Award } from 'lucide-react';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function HotelReviewsAdminPage() {
  const [reviews, setReviews] = useState([]);
  const [averageOverall, setAverageOverall] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // حالات الفلتر، البحث، والـ Pagination
  const [searchName, setSearchName] = useState('');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // دالة لجلب التقييمات من الباك إند
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/hotel-reviews/getAll`, {
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
      <div className="max-w-6xl mx-auto">
        
        {/* Header & Overall Stats Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-800 pb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">تقييمات  الفندق</h1>
            <p className="text-sm text-gray-400 mt-1">عرض آراء الضيوف في النظافة، الخدمة، والتجربة العامة</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Average Badge */}
            <div className="bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-xl flex items-center gap-2">
              <Award className="text-amber-400" size={20} />
              <div>
                <span className="text-xs text-gray-400 block">متوسط تقييم الفندق</span>
                <span className="text-sm font-bold text-amber-400">{averageOverall} / 5</span>
              </div>
            </div>

            <button
              onClick={fetchReviews}
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 px-4 py-2.5 rounded-xl text-sm font-medium text-cyan-400 cursor-pointer transition-all"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              <span>تحديث</span>
            </button>
          </div>
        </div>

        {/* Filters Section */}
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
            <p className="text-gray-400 text-lg">لا توجد تقييمات مطابقة لنتائج البحث أو الفلتر</p>
          </div>
        ) : (
          <>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-gray-950 border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="py-4 px-6 font-semibold">رقم الغرفة</th>
                      <th className="py-4 px-6 font-semibold">اسم النزيل</th>
                      <th className="py-4 px-6 font-semibold">النظافة</th>
                      <th className="py-4 px-6 font-semibold">الخدمة</th>
                      <th className="py-4 px-6 font-semibold">التقييم العام</th>
                      <th className="py-4 px-6 font-semibold">التعليق</th>
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
                          {renderStars(rev.cleanlinessRating)}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          {renderStars(rev.serviceRating)}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          {renderStars(rev.overallRating)}
                        </td>
                        <td className="py-4 px-6 text-gray-300 max-w-xs">
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
    </div>
  );
}