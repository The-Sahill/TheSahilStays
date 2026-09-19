import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, AlertCircle, RefreshCw, Search, ChevronRight, ChevronLeft, Filter, Clock } from 'lucide-react';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

// دالة لتنسيق التاريخ والوقت بالشكل العربي المحسّن
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

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [popup, setPopup] = useState({ show: false, message: '', type: '' });
  
  // حالات الفلترة والبحث
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'in-progress', 'completed'

  // حالات الـ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // عدد الطلبات في الصفحة الواحدة

  // دالة لجلب الطلبات من الباك إند
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/getAllUsersRequests`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('فشل في جلب الطلبات');

      const result = await response.json();
      setRequests(result.data || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // دالة لتحديث حالة الطلب
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`${apiUrl}/updateRequestStatus/userRequest/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('فشل تحديث حالة الطلب');

      // تحديث الحالة محلياً في الـ State لتتحدث الواجهة فوراً
      setRequests(prevRequests =>
        prevRequests.map(req => (req._id === id ? { ...req, status: newStatus } : req))
      );

      setPopup({ show: true, message: 'تم تحديث حالة الطلب بنجاح', type: 'success' });
      setTimeout(() => setPopup({ show: false, message: '', type: '' }), 3000);

    } catch (err) {
      setPopup({ show: true, message: err.message, type: 'error' });
    }
  };

  // فلترة الطلبات بناءً على نص البحث (الاسم أو رقم الغرفة) والحالة
  const filteredRequests = requests.filter((req) => {
    const matchesSearch = 
      (req.guestName && req.guestName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (req.roomNumber && req.roomNumber.toString().includes(searchQuery));

    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // إعادة الصفحة إلى الأولى عند تغيير الفلتر أو البحث
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // حساب العناصر الخاصة بالصفحة الحالية (Pagination Logic)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 sm:p-6 md:p-10 relative overflow-hidden" dir="rtl">
      {/* خلفية جمالية (Glow Effects) */}
      <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-wide">لوحة التحكم - طلبات النزلاء</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">متابعة الطلبات وتحديث حالاتها أولاً بأول</p>
          </div>
          <button
            onClick={fetchRequests}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer text-cyan-400"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span>تحديث القائمة</span>
          </button>
        </div>

        {/* --- قسم البحث والفلترة (Search & Filters Bar) --- */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
          
          {/* حقل البحث (الاسم أو رقم الغرفة) */}
          <div className="relative w-full md:w-96">
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم النزيل أو رقم الغرفة..."
              className="w-full bg-gray-950 border border-gray-800 rounded-xl pr-10 pl-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* فلتر الحالة (Status Tabs / Select) */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <div className="flex items-center gap-1.5 text-gray-400 text-xs pl-2 shrink-0">
              <Filter size={16} />
              <span>الحالة:</span>
            </div>
            
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer shrink-0 ${
                statusFilter === 'all' 
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30' 
                  : 'bg-gray-950 border border-gray-800 text-gray-400 hover:bg-gray-850'
              }`}
            >
              الكل ({requests.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer shrink-0 ${
                statusFilter === 'pending' 
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' 
                  : 'bg-gray-950 border border-gray-800 text-gray-400 hover:bg-gray-850'
              }`}
            >
              معلق
            </button>
            <button
              onClick={() => setStatusFilter('in-progress')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer shrink-0 ${
                statusFilter === 'in-progress' 
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30' 
                  : 'bg-gray-950 border border-gray-800 text-gray-400 hover:bg-gray-850'
              }`}
            >
              قيد التنفيذ
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer shrink-0 ${
                statusFilter === 'completed' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' 
                  : 'bg-gray-950 border border-gray-800 text-gray-400 hover:bg-gray-850'
              }`}
            >
              مكتمل
            </button>
          </div>

        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-sm flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && requests.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-cyan-500" size={40} />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/50 border border-gray-800/60 rounded-2xl">
            <p className="text-gray-400 text-lg">لا توجد طلبات مطابقة للبحث أو الفلتر الحالي</p>
          </div>
        ) : (
          <>
            {/* --- عرض الشاشات الكبيرة (Desktop Table View) --- */}
            <div className="hidden md:block bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-gray-950 border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="py-4 px-6 font-semibold">رقم الغرفة</th>
                      <th className="py-4 px-6 font-semibold">اسم النزيل</th>
                      <th className="py-4 px-6 font-semibold">وقت الطلب</th>
                      <th className="py-4 px-6 font-semibold">الخدمات المطلوبة</th>
                      <th className="py-4 px-6 font-semibold">ملاحظات إضافية</th>
                      <th className="py-4 px-6 font-semibold">الحالة</th>
                      <th className="py-4 px-6 font-semibold text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-sm">
                    {currentRequests.map((req) => (
                      <tr key={req._id} className="hover:bg-gray-850 transition-colors">
                        
                        {/* Room Number */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-3 py-1 rounded-xl text-xs font-semibold">
                            غرفة {req.roomNumber}
                          </span>
                        </td>

                        {/* Guest Name */}
                        <td className="py-4 px-6 font-medium text-gray-100 whitespace-nowrap">
                          {req.guestName}
                        </td>

                        {/* Created At (Formatted Time) */}
                        <td className="py-4 px-6 whitespace-nowrap text-gray-300 text-xs">
                          <div className="flex items-center gap-1.5 bg-gray-950 border border-gray-800 px-2.5 py-1.5 rounded-xl w-fit">
                            <Clock size={14} className="text-cyan-400 shrink-0" />
                            <span>{formatDateTime(req.createdAt)}</span>
                          </div>
                        </td>

                        {/* Selected Requests */}
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {req.selectedRequests?.map((item, idx) => (
                              <span
                                key={idx}
                                className="bg-gray-950 border border-gray-800 text-gray-300 px-2 py-0.5 rounded-md text-xs"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Custom Note */}
                        <td className="py-4 px-6 text-gray-300 max-w-xs truncate">
                          {req.customNote ? req.customNote : <span className="text-gray-600">-</span>}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg inline-block ${
                            req.status === 'completed' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : req.status === 'in-progress'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}>
                            {req.status === 'completed' ? 'مكتمل' : req.status === 'in-progress' ? 'قيد التنفيذ' : 'معلق'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            {req.status !== 'pending' && (
                              <button
                                onClick={() => handleStatusUpdate(req._id, 'pending')}
                                className="bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                                title="إرجاع إلى معلق"
                              >
                                معلق
                              </button>
                            )}
                            {req.status !== 'in-progress' && (
                              <button
                                onClick={() => handleStatusUpdate(req._id, 'in-progress')}
                                className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                              >
                                قيد التنفيذ
                              </button>
                            )}
                            {req.status !== 'completed' && (
                              <button
                                onClick={() => handleStatusUpdate(req._id, 'completed')}
                                className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                              >
                                إتمام
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* --- عرض الهواتف المحمولة (Mobile Cards View) --- */}
            <div className="grid grid-cols-1 gap-4 md:hidden mb-6">
              {currentRequests.map((req) => (
                <div key={req._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-lg flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-3 py-1 rounded-xl text-xs font-semibold">
                      غرفة {req.roomNumber}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                      req.status === 'completed' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : req.status === 'in-progress'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                      {req.status === 'completed' ? 'مكتمل' : req.status === 'in-progress' ? 'قيد التنفيذ' : 'معلق'}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400">اسم النزيل:</span>
                    <p className="text-sm font-medium text-gray-100">{req.guestName}</p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-300 bg-gray-950 p-2 rounded-xl border border-gray-800">
                    <Clock size={14} className="text-cyan-400 shrink-0" />
                    <span>{formatDateTime(req.createdAt)}</span>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400 block mb-1">الخدمات المطلوبة:</span>
                    <div className="flex flex-wrap gap-1">
                      {req.selectedRequests?.map((item, idx) => (
                        <span key={idx} className="bg-gray-950 border border-gray-800 text-gray-300 px-2 py-0.5 rounded-md text-xs">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {req.customNote && (
                    <div>
                      <span className="text-xs text-gray-400">ملاحظات إضافية:</span>
                      <p className="text-xs text-gray-300 mt-0.5 bg-gray-950/50 p-2 rounded-lg border border-gray-800">{req.customNote}</p>
                    </div>
                  )}

                  <div className="border-t border-gray-800 pt-3 mt-1 flex items-center justify-between gap-1 flex-wrap">
                    <span className="text-xs text-gray-400">تغيير الحالة:</span>
                    <div className="flex items-center gap-1.5">
                      {req.status !== 'pending' && (
                        <button
                          onClick={() => handleStatusUpdate(req._id, 'pending')}
                          className="bg-rose-600/20 text-rose-300 border border-rose-500/30 px-2 py-1 rounded-lg text-xs font-medium"
                        >
                          معلق
                        </button>
                      )}
                      {req.status !== 'in-progress' && (
                        <button
                          onClick={() => handleStatusUpdate(req._id, 'in-progress')}
                          className="bg-amber-600/20 text-amber-300 border border-amber-500/30 px-2 py-1 rounded-lg text-xs font-medium"
                        >
                          تنفيذ
                        </button>
                      )}
                      {req.status !== 'completed' && (
                        <button
                          onClick={() => handleStatusUpdate(req._id, 'completed')}
                          className="bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 px-2 py-1 rounded-lg text-xs font-medium"
                        >
                          إتمام
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* --- نظام ترقيم الصفحات (Pagination Controls) --- */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-gray-900 border border-gray-800 px-4 py-3 rounded-2xl shadow-md">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 bg-gray-950 border border-gray-800 hover:bg-gray-850 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1.5 rounded-xl text-xs font-medium text-gray-300 cursor-pointer transition-all"
                >
                  <ChevronRight size={16} />
                  <span>السابق</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => handlePageChange(number)}
                      className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        currentPage === number
                          ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                          : 'bg-gray-950 border border-gray-800 text-gray-400 hover:bg-gray-850'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 bg-gray-950 border border-gray-800 hover:bg-gray-850 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1.5 rounded-xl text-xs font-medium text-gray-300 cursor-pointer transition-all"
                >
                  <span>التالي</span>
                  <ChevronLeft size={16} />
                </button>
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