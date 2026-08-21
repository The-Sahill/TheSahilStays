import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [popup, setPopup] = useState({ show: false, message: '', type: '' });

  // دالة لجلب الطلبات من الباك إند
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/getAllUsersRequests', {
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
      const response = await fetch(`http://localhost:4000/updateRequestStatus/userRequest/${id}`, {
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

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-10" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">لوحة التحكم - طلبات النزلاء</h1>
            <p className="text-sm text-gray-400 mt-1">متابعة الطلبات وتحديث حالاتها أولاً بأول</p>
          </div>
          <button
            onClick={fetchRequests}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer text-cyan-400"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span>تحديث القائمة</span>
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-sm flex items-center gap-3">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && requests.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-cyan-500" size={40} />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/50 border border-gray-800/60 rounded-2xl">
            <p className="text-gray-400 text-lg">لا توجد طلبات جديدة حالياً</p>
          </div>
        ) : (
          /* Table View */
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-gray-950 border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                    <th className="py-4 px-6 font-semibold">رقم الغرفة</th>
                    <th className="py-4 px-6 font-semibold">اسم النزيل</th>
                    <th className="py-4 px-6 font-semibold">الخدمات المطلوبة</th>
                    <th className="py-4 px-6 font-semibold">ملاحظات إضافية</th>
                    <th className="py-4 px-6 font-semibold">الحالة</th>
                    <th className="py-4 px-6 font-semibold text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-sm">
                  {requests.map((req) => (
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
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleStatusUpdate(req._id, 'in-progress')}
                            className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer"
                          >
                            قيد التنفيذ
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(req._id, 'completed')}
                            className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer"
                          >
                            إتمام
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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