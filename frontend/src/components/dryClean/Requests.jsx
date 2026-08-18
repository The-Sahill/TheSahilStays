import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, X, Shirt, Loader2, ChevronRight, ChevronLeft, Calendar } from 'lucide-react';
const apiUrl = import.meta.env.VITE_BACKEND_URL;
import axios from 'axios';

const DryCleaningRequests = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [permission, setPermission] = useState(false);

  const [requestsData, setRequestsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // حالة النافذة المنبثقة (Modal) والطلب المحدد
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // حالات الـ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // عدد الطلبات في كل صفحة

  // 1. جلب الطلبات من الـ Backend عند تحميل الصفحة
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/requests`);
      const data = await response.json();
      
      const requestsList = Array.isArray(data) ? data : data.requests || [];
      
      // الترتيب الصحيح للأحدث أولاً بناءً على تاريخ الإنشاء (createdAt) أو الـ _id
      const sortedList = requestsList.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return String(b._id).localeCompare(String(a._id));
      });

      setRequestsData(sortedList);
    } catch (error) {
      console.error('خطأ في جلب بيانات الطلبات:', error);
    } finally {
      setLoading(false);
    }
  };

  // دالة لتحديث حالة الطلب (موافقة / رفض) وإرسالها للباك إند
  // دالة لتحديث حالة الطلب (موافقة / رفض) وإرسالها للباك إند
  const handleUpdateStatus = async (isApproved) => {
    if (!selectedRequest) return;
    
    try {
      setActionLoading(true);
      // استخدام _id أو رقم الطلب حسب المتوفر في قاعدة البيانات لديك
      const requestId = selectedRequest._id || selectedRequest.number;

      const response = await fetch(`${apiUrl}/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        // إرسال الحقل approved مباشرة كما يطلبه الباك إند
        body: JSON.stringify({ approved: isApproved }),
      });

      if (!response.ok) {
        throw new Error('فشل تحديث حالة الطلب');
      }

      const data = await response.json();

      // تحديث البيانات في الـ State محلياً لتنعكس النتيجة مباشرة في الجدول
      setRequestsData(prevData =>
        prevData.map(req => 
          (req._id === selectedRequest._id ? { ...req, approved: isApproved } : req)
        )
      );

      // تحديث الطلب المحدد وإغلاق النافذة المنبثقة
      setSelectedRequest(prev => ({ ...prev, approved: isApproved }));
      setIsModalOpen(log => false);
      
    } catch (error) {
      console.error('خطأ أثناء تحديث الحالة:', error);
      alert('حدث خطأ أثناء تحديث حالة الطلب، يرجى المحاولة مرة أخرى.');
    } finally {
      setActionLoading(false);
    }
  };

  // دالة لتنسيق التاريخ والوقت بشكل مقروء
  const formatDate = (dateString) => {
    if (!dateString) return 'غير متوفر';
    const date = new Date(dateString);
    return date.toLocaleString('ar-JO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // دالة لحساب مجموع القطع ديناميكياً من الأغراض المخزنة
  const calculateTotalItems = (item) => {
    const keys = ['towels', 'bathTowels', 'blankets', 'pillows', 'floorMats', 'bedSheets', 'robeCovers'];
    let sum = 0;
    keys.forEach(key => {
      if (item[key] && typeof item[key].count === 'number') {
        sum += item[key].count;
      }
    });
    return sum;
  };

  
  useEffect(() => {
    const getUser = async () => {
try{
const {data} = await axios.get(`${apiUrl}/batches/user`, { withCredentials: true });
if(data.name != "abd" && data.name != "yehia"){
 setPermission(false)
}else{
  setPermission(true)
}

}
catch(error){
console.log(error)
}

    }

    getUser()

  }, []);

  // تصفية الطلبات حسب البحث والحالة
  const filteredRequests = requestsData.filter((req) => {
    const employeeStr = req.employee ? String(req.employee) : '';
    const roomStr = req.number ? String(req.number) : '';
    const matchesSearch = employeeStr.toLowerCase().includes(searchQuery.toLowerCase()) || roomStr.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // حساب بيانات الـ Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);

  // إعادة الصفحة الأولى عند البحث أو تغيير الفلتر
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // فتح نافذة التفاصيل
  const handleOpenDetails = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center mx-auto justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }


  return (
    <div className="p-8 bg-slate-50 min-h-screen mt-16 md:mt-0 font-sans relative w-full" dir="rtl">
      
      {/* رأس الصفحة */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">طلبات الدراي كلين</h1>
        <p className="text-sm text-slate-500 mt-0.5">إدارة ومتابعة جميع طلبات المغسلة والنزلاء من قاعدة البيانات (الأحدث أولاً).</p>
      </div>

      {/* شريط البحث والفلترة */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="ابحث باسم الموظف أو رقم الغرفة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-sm"
          />
        </div>

        <div className="relative w-full sm:w-48">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
            <Filter size={16} />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-600 shadow-sm appearance-none cursor-pointer"
          >
            <option value="all">جميع الحالات</option>
            <option value="Pending Approval">قيد الانتظار</option>
            <option value="Approved">تم الموافقة</option>
            <option value="Rejected">تم الرفض</option>
          </select>
        </div>
      </div>

      {/* جدول الطلبات */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase bg-slate-50/50">
                <th className="py-4 px-6">رقم الغرفة</th>
                <th className="py-4 px-6">نوع الطلب</th>
                <th className="py-4 px-6">الموظف المسؤول</th>
                <th className="py-4 px-6">النزيل</th>
                <th className="py-4 px-6">القطع</th>
                <th className="py-4 px-6">الإجمالي</th>
                <th className="py-4 px-6">الحالة</th>
                <th className="py-4 px-6">تاريخ الطلب</th>
                <th className="py-4 px-6 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {currentRequests.map((req) => {
                const totalItems = calculateTotalItems(req);

                return (
                  <tr key={req._id || req.number} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">{req.number}</td>
                    <td className="py-4 px-6 text-slate-600 font-medium">{req.type || 'غسيل'}</td>
                    <td className="py-4 px-6 text-slate-800">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                        {req.employee || 'غير متوفر'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-800">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                        {req.customer || 'غير متوفر'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{totalItems} قطعة</td>
                    <td className="py-4 px-6 font-semibold text-slate-900">
  {Number(req.total || 0).toFixed(2)}
</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                        req.approved === "تم الموافقة" ? 'bg-emerald-50 text-emerald-600' :
                        req.approved === "تم الرفض" ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {req.approved === "تم الموافقة" ? 'موافق عليه' : req.approved === "تم الرفض" ? 'مرفوض' : 'قيد الانتظار'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs font-medium">
                      {formatDate(req.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-left">
                      <button
                        onClick={() => handleOpenDetails(req)}
                        className="p-2 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl transition-colors cursor-pointer"
                        title="عرض التفاصيل"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {currentRequests.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-slate-400">
                    لا توجد طلبات مسجلة في النظام حالياً.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* شريط الـ Pagination */}
        {filteredRequests.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/30">
            <span className="text-xs text-slate-500">
              عرض من <span className="font-semibold text-slate-700">{indexOfFirstItem + 1}</span> إلى <span className="font-semibold text-slate-700">{Math.min(indexOfLastItem, filteredRequests.length)}</span> من أصل <span className="font-semibold text-slate-700">{filteredRequests.length}</span> طلب
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="الصفحة السابقة"
              >
                <ChevronRight size={16} />
              </button>

              <span className="text-xs font-medium text-slate-700 px-2">
                صفحة {currentPage} من {totalPages || 1}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="الصفحة التالية"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* نافذة تفاصيل الطلب (Modal) */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* رأس النافذة */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shirt className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-lg text-slate-900">تفاصيل طلب غرفة ({selectedRequest.number})</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* محتوى التفاصيل */}
            <div className="p-6 space-y-4">
              
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="block text-xs text-slate-400 mb-1">رقم الغرفة</span>
                  <span className="font-bold text-slate-800">غرفة {selectedRequest.number}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-400 mb-1">الموظف المسؤول</span>
                  <span className="font-bold text-slate-800">{selectedRequest.employee || 'غير متوفر'}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-200/60 flex items-center gap-2">
                  <Calendar size={14} className="text-slate-400" />
                  <div>
                    <span className="block text-xs text-slate-400 mb-0.5">تاريخ ووقت الطلب</span>
                    <span className="font-bold text-slate-800 text-xs">{formatDate(selectedRequest.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100 max-h-40 overflow-y-auto">
                <span className="block text-xs font-semibold text-slate-500 mb-2">تفاصيل القطع المطلوبة:</span>
                
                {[
                  { key: 'towels', name: 'مناشف (Towels)' },
                  { key: 'bathTowels', name: 'بشاكير (Bath Towels)' },
                  { key: 'blankets', name: 'حرامات (Blankets)' },
                  { key: 'pillows', name: 'مخدات (Pillows)' },
                  { key: 'floorMats', name: 'أغطية أرضيات (Floor Mats)' },
                  { key: 'bedSheets', name: 'شراشف (Bed Sheets)' },
                  { key: 'robeCovers', name: 'كفر  (Robe Covers)' },
                ].map((item) => {
                  const itemData = selectedRequest[item.key];
                  if (!itemData || itemData.count <= 0) return null;
                  
                  return (
                    <div key={item.key} className="flex justify-between items-center py-1.5 border-b border-slate-200/60 text-xs">
                      <span className="text-slate-600">{item.name}</span>
                      <span className="font-bold text-slate-900">{itemData.count} قطعة (السعر: {itemData.price})</span>
                    </div>
                  );
                })}

                {selectedRequest.customNotes && (
                  <div className="pt-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">ملاحظات: </span>
                    {selectedRequest.customNotes}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center py-2 px-2 bg-slate-50 rounded-lg">
                <span className="text-sm font-semibold text-slate-600">التكلفة الإجمالية:</span>
                <span className="text-base font-bold text-emerald-600">
  {Number(selectedRequest.total || 0).toFixed(2)}
</span>
              </div>


              {permission && (
  <div className='flex gap-3 mt-4'>
    <button 
      onClick={() => handleUpdateStatus("تم الموافقة")}
      disabled={actionLoading}
      className='bg-green-500 hover:bg-green-600 transition-colors text-white px-5 py-2 rounded-xl w-full font-semibold text-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2'
    >
      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'موافقة (True)'}
    </button>
    <button 
      onClick={() => handleUpdateStatus("تم الرفض")}
      disabled={actionLoading}
      className='bg-red-500 hover:bg-red-600 transition-colors text-white px-5 py-2 rounded-xl w-full font-semibold text-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2'
    >
      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'رفض (False)'}
    </button>
  </div>
)}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default DryCleaningRequests;