import React, { useState, useEffect } from 'react';
import { Search, Truck, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
const apiUrl = import.meta.env.VITE_BACKEND_URL;

const DryCleaningDispatch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dispatchList, setDispatchList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dispatching, setDispatching] = useState(false);

  // حالات الـ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/requests`);
      const data = await response.json();
      
      const allRequests = Array.isArray(data) ? data : data.requests || [];
      
      const pendingDispatch = allRequests.filter(item => 
        item.approved === 'تم الموافقة' && item.status !== true
      );
      
      const sortedList = pendingDispatch.reverse();
      setDispatchList(sortedList);
    } catch (error) {
      console.error('خطأ في جلب بيانات الطلبات:', error);
    } finally {
      setLoading(false);
    }
  };

  // أسماء الحقول ومسمياتها بالعربي
  const itemLabels = {
    towels: 'مناشف',
    bathTowels: 'بشاكير',
    blankets: 'بطانيات',
    pillows: 'وسائد',
    floorMats: 'دعاسات',
    bedSheets: 'مفارش تخت',
    robeCovers: 'أغطية روب'
  };

  // دالة لحساب إجمالي عدد القطع لطلب واحد
  const calculateTotalItems = (item) => {
    let sum = 0;
    Object.keys(itemLabels).forEach(key => {
      if (item[key] && typeof item[key].count === 'number') {
        sum += item[key].count;
      }
    });
    return sum;
  };

  const filteredList = dispatchList.filter((item) => {
    const roomStr = item.number ? String(item.number) : '';
    const employeeStr = item.employee ? String(item.employee) : '';
    return (
      roomStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employeeStr.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // حساب مجموع كل صنف على مستوى كل الطلبات (مثلاً إجمالي البشاكير لكل الغرف مع بعض)
  const totalItemsByCategory = Object.keys(itemLabels).reduce((acc, key) => {
    acc[key] = filteredList.reduce((sum, item) => {
      const count = (item[key] && typeof item[key].count === 'number') ? item[key].count : 0;
      return sum + count;
    }, 0);
    return acc;
  }, {});

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalRequests = filteredList.length;
  const totalItems = filteredList.reduce((sum, item) => sum + calculateTotalItems(item), 0);
  const totalCost = filteredList.reduce((sum, item) => sum + (item.total || 0), 0);

  const handleDispatchBatch = async () => {
    if (filteredList.length === 0) {
      alert('لا توجد طلبات موافق عليها للإرسال حالياً!');
      return;
    }

    try {
      setDispatching(true);
      const requestIds = filteredList.map(r => r._id);

      const response = await fetch(`${apiUrl}/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestIds })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'فشل إرسال الدفعة');
      }

      alert('تم إرسال الدفعة بنجاح إلى المغسلة!');
      fetchRequests(); 
      setCurrentPage(1);
    } catch (error) {
      console.error('خطأ أثناء إرسال الدفعة:', error);
      alert('حدث خطأ أثناء إرسال الدفعة.');
    } finally {
      setDispatching(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center mx-auto justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen mt-16 md:mt-0 font-sans" dir="rtl">
      
      {/* رأس الصفحة وزر الإرسال */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">إرسال الدراي كلين</h1>
          <p className="text-sm text-slate-500 mt-0.5">الطلبات التي تم الموافقة عليها في انتظار إرسالها إلى المغسلة (الأحدث أولاً).</p>
        </div>
        
        <button
          onClick={handleDispatchBatch}
          disabled={dispatching || filteredList.length === 0}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Truck size={18} />
          <span>{dispatching ? ' جاري ارسال الدراي كلين...' : 'تسليم للدراي كلين (Dispatch Batch)'}</span>
        </button>
      </div>

      {/* شريط البحث */}
      <div className="mb-6">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="ابحث برقم الغرفة أو اسم الموظف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-sm"
          />
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* جدول الطلبات */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase bg-slate-50/50">
                  <th className="py-4 px-6">رقم الغرفة</th>
                  <th className="py-4 px-6">نوع الطلب</th>
                  <th className="py-4 px-6">الموظف المسؤول</th>
                  <th className="py-4 px-6">إجمالي القطع</th>
                  <th className="py-4 px-6">التكلفة الكلية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {currentRequests.map((item) => {
                  const itemsCount = calculateTotalItems(item);
                  return (
                    <tr key={item._id || item.number} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">{item.number}</td>
                      <td className="py-4 px-6 text-slate-600 font-medium">
                        {item.type == "Full" ? "خروج" : "طلب"}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                          {item.employee || 'غير متوفر'}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-800">{itemsCount} قطعة</td>
                      <td className="py-4 px-6 font-bold text-blue-600">{Number(item.total || 0).toFixed(2)}</td>
                    </tr>
                  );
                })}

                {currentRequests.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-slate-400">
                      لا توجد طلبات تمت الموافقة عليها في انتظار الإرسال حالياً.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredList.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/30">
              <span className="text-xs text-slate-500">
                عرض من <span className="font-semibold text-slate-700">{indexOfFirstItem + 1}</span> إلى <span className="font-semibold text-slate-700">{Math.min(indexOfLastItem, filteredList.length)}</span> من أصل <span className="font-semibold text-slate-700">{filteredList.length}</span> طلب
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
                >
                  <ChevronLeft size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ملخص الطابور (إجمالي كل صنف لكل الغرف) */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
            ملخص الطابور (إجمالي الأصناف)
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">عدد الطلبات</span>
              <span className="font-bold text-slate-900">{totalRequests}</span>
            </div>

            {/* عرض مجموع كل صنف بشكل منفصل */}
            {Object.keys(itemLabels).map((key) => {
              const categoryTotal = totalItemsByCategory[key] || 0;
              return (
                <div key={key} className="flex items-center justify-between text-sm pt-2 border-t border-slate-50">
                  <span className="text-slate-600">{itemLabels[key]}</span>
                  <span className="font-semibold text-slate-900">{categoryTotal}</span>
                </div>
              );
            })}

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-sm font-semibold text-slate-700">إجمالي القطع</span>
              <span className="font-bold text-slate-900 text-base">{totalItems}</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-sm font-semibold text-slate-700">التكلفة الإجمالية</span>
              <span className="font-bold text-blue-600 text-lg">
                {Number(totalCost || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DryCleaningDispatch;