import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, X, Truck, Package, Loader2, ChevronRight, ChevronLeft, CheckCircle2, XCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const DeliveryBatches = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [extraNote, setExtraNote] = useState('');

  const [paymentStatus, setPaymentStatus] = useState('');

  const [batchesData, setBatchesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // حالات خاصة بالنافذة المنبثقة (Modal)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // حالة الملاحظة عند الرفض أو الاعتماد
  const [customNote, setCustomNote] = useState('');
  const [actionType, setActionType] = useState(null);

  // حالة لتخزين اسم المستخدم الحالي من السيرفر
  const [currentUsername, setCurrentUsername] = useState('');

  // حالات الـ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchBatches();
    fetchCurrentUsername();
  }, []);

  const fetchCurrentUsername = async () => {
    try {
      const response = await fetch(`${apiUrl}/batches/user`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const username = typeof data === 'object' ? (data.username || data.name || '') : data;
        setCurrentUsername(username);
      } else {
        console.error('فشل في جلب بيانات المستخدم');
      }
    } catch (e) {
      console.error('خطأ في الاتصال أثناء جلب هوية المستخدم:', e);
    }
  };

  const canModifyStatus = ['abd', 'yahya'].includes(currentUsername.toLowerCase());

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/batches`, {
        credentials: 'include',
      });
      const data = await response.json();

      const batches = Array.isArray(data) ? data : data.batches || [];

      const sortedBatches = batches.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return String(b._id).localeCompare(String(a._id));
      });
      setBatchesData(sortedBatches);
    } catch (error) {
      console.error('خطأ في جلب دفعات التوصيل:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (status) => {
    try {
      const { data } = await axios.put(`${apiUrl}/updatePaymentStatus/${selectedBatch._id}`, {
        status
      });

      if (!data.error) {
        toast.success("تم تعديل حالة الدفعة");
        setPaymentStatus(status);
        
        setBatchesData(prevBatches => 
          prevBatches.map(batch => 
            batch._id === selectedBatch._id ? data.batch : batch
          )
        );
      }
    } catch (error) {
      console.log(error.message);
      toast.error("حدث خطأ في تحديث الحالة");
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedBatch) return;

    if (newStatus === 'Rejected' && !customNote.trim()) {
      alert('الرجاء كتابة سبب الرفض في حقل الملاحظات.');
      return;
    }

    try {
      setUpdatingStatus(true);
      const response = await fetch(`${apiUrl}/batches/${selectedBatch._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          status: newStatus,
          customNote: customNote 
        }),
      });

      if (!response.ok) throw new Error('فشل تحديث حالة الدفعة');

      const updatedBatches = batchesData.map(b => 
        b._id === selectedBatch._id ? { ...b, status: newStatus, customNote: customNote } : b
      );
      setBatchesData(updatedBatches);
      setSelectedBatch(prev => ({ ...prev, status: newStatus, customNote: customNote }));

      alert(`تم تحديث حالة الدفعة إلى (${newStatus}) بنجاح!`);

      setCustomNote('');
      setActionType(null);
    } catch (error) {
      console.error('خطأ أثناء تحديث الحالة:', error);
      alert('حدث خطأ أثناء تحديث الحالة.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredBatches = batchesData.filter((batch) => {
    const idStr = batch._id ? String(batch._id) : '';
    const statusStr = batch.status ? String(batch.status) : '';

    const matchesSearch = idStr.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || statusStr.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBatches.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBatches = filteredBatches.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const handleViewBatch = (batch) => {
    setSelectedBatch(batch);
    setCustomNote(batch.customNote || '');
    setActionType(null);
    setIsModalOpen(true);
  };

  // دالة مساعدة لترجمة وتجميع مجاميع العناصر لكل الغرف في الدفعة الحالية
  const getBatchItemsSummary = (requests) => {
    if (!requests || !Array.isArray(requests)) return [];

    const itemNamesAr = {
      towels: 'مناشف عادية (Towels)',
      bathTowels: 'مناشف حمام (Bath Towels)',
      blankets: 'حرامات (Blankets)',
      pillows: 'وسائد (Pillows)',
      floorMats: 'دواسات أرضية (Floor Mats)',
      robeCovers: 'أغطية روب (Robe Covers)'
    };

    const summaryMap = {};

    requests.forEach(req => {
      Object.entries(req).forEach(([key, val]) => {
        if (val && typeof val === 'object' && 'count' in val && Number(val.count) > 0) {
          const count = Number(val.count) || 0;
          if (!summaryMap[key]) {
            summaryMap[key] = {
              key,
              name: itemNamesAr[key] || key,
              totalCount: 0
            };
          }
          summaryMap[key].totalCount += count;
        }
      });
    });

    return Object.values(summaryMap);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center mx-auto justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }


  const addExtraNote = async (id) => {
try{
  if (!extraNote.trim()) {
    alert('الرجاء كتابة الملاحظة قبل الإرسال.');
    return;
  }

const {data} = await axios.post(`${apiUrl}/batches/${id}/extra-note`, { extraNote }, { withCredentials: true });

if(data.error==false){
toast.success("تم إرسال الملاحظة بنجاح!");
}



  
}catch(error){
  console.log(error);
  toast.error("حدث خطأ أثناء إرسال الملاحظة. يرجى المحاولة مرة أخرى.");
  
}



  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen mt-16 md:mt-0 font-sans relative w-full" dir="rtl">

      {/* رأس الصفحة */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">استلام دراي كلين </h1>
        <p className="text-sm text-slate-500 mt-0.5">تتبع الدفعات المرسلة والمستلمة إلى المغسلة (الأحدث أولاً).</p>
      </div>

      {/* شريط البحث والفلترة */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="ابحث برقم الدفعة (_id)..."
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
            <option value="Dispatched">Dispatched (تم الإرسال)</option>
            <option value="Approved">Approved (معتمد)</option>
            <option value="Rejected">Rejected (مرفوض)</option>
            <option value="Received">Received (مستلم)</option>
          </select>
        </div>
      </div>

      {/* جدول البيانات */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase bg-slate-50/50">
                <th className="py-4 px-6">تاريخ الإنشاء</th>
                <th className="py-4 px-6">حالة الاستلام</th>
                <th className="py-4 px-6">حالة الدفعة</th>
                <th className="py-4 px-6">عدد الطلبات</th>
                <th className="py-4 px-6">إجمالي القطع</th>
                <th className="py-4 px-6">التكلفة الإجمالية</th>
                <th className="py-4 px-6">  الملاحظات</th>
                <th className="py-4 px-6 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {currentBatches.map((batch) => (
                <tr key={batch._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 text-slate-600">
                    {batch.createdAt ? new Date(batch.createdAt).toLocaleDateString() : 'غير متوفر'}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${
                      batch.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      batch.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {batch.status || 'Dispatched'}
                    </span>
                  </td>
                  <td>
                    <h1 className={`inline-flex mx-auto items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${batch.paymentStatus ? "bg-green-500 inline rounded-full text-white " : " bg-red-500 inline rounded-full text-white"}`}>{batch.paymentStatus ? "تم الدفع" : "لم يتم الدفع"}</h1>
                  </td>

                  <td className="py-4 px-6 text-slate-600 font-medium">{batch.totalRequests}</td>
                  <td className="py-4 px-6 text-slate-600 font-medium">{batch.totalItems}</td>
                  <td className="py-4 px-6 font-semibold text-slate-900">
                    {Number(batch.totalCost || 0).toFixed(2)}
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-900">
                   {batch.extraNote }
                  </td>
                  <td className="py-4 px-6 text-left">
                    <button
                      onClick={() => handleViewBatch(batch)}
                      className="p-2 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl transition-colors cursor-pointer"
                      title="عرض التفاصيل وإدارة الحالة"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}

              {currentBatches.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-400">
                    لا توجد دفعات تطابق بحثك.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* شريط الـ Pagination */}
        {filteredBatches.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/30">
            <span className="text-xs text-slate-500">
              عرض من <span className="font-semibold text-slate-700">{indexOfFirstItem + 1}</span> إلى <span className="font-semibold text-slate-700">{Math.min(indexOfLastItem, filteredBatches.length)}</span> من أصل <span className="font-semibold text-slate-700">{filteredBatches.length}</span> دفعة
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

      {/* نافذة تفاصيل الدفعة الشاملة (Modal) */}
      {isModalOpen && selectedBatch && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">

            {/* رأس النافذة */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-lg text-slate-900">تفاصيل الدفعة وإدارة الحالة</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* محتوى التفاصيل (قابل للتمرير) */}
            <div className="p-6 space-y-6 overflow-y-auto">

              {/* معلومات عامة */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="block text-xs text-slate-400 mb-1">معرف الدفعة (ID)</span>
                  <span className="font-bold text-slate-800 text-xs font-mono">{selectedBatch._id}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-400 mb-1">تاريخ الإنشاء</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {selectedBatch.createdAt ? new Date(selectedBatch.createdAt).toLocaleString() : 'غير متوفر'}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-400 mb-1">الحالة الحالية</span>
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold border ${
                    selectedBatch.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    selectedBatch.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                    'bg-blue-100 text-blue-700 border-blue-200'
                  }`}>
                    {selectedBatch.status || 'Dispatched'}
                  </span>
                </div>
              </div>

              {/* عرض الملاحظة الحالية إن وجدت */}
              {selectedBatch.customNote && (
                <div className="bg-slate-100 p-3 rounded-xl text-xs space-y-1">
                  <span className="font-semibold text-slate-500 block">الملاحظة المسجلة:</span>
                  <p className="text-800 font-medium">{selectedBatch.customNote}</p>
                </div>
              )}


<div>
<label className='text-xs font-semibold text-amber-800' htmlFor="">ملاحظات اضافية</label>
<textarea onChange={(e) => setExtraNote(e.target.value)} type="text" className='border rounded-lg w-full mt-2 h-12' />
<button onClick={() => addExtraNote(selectedBatch._id)} className='mt-3 flex-1 inline-flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white py-2 px-4 rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
               '>ارسال الملاحظة</button>

</div>



              <span className="block text-xs font-semibold text-amber-800">
                لوحة تحكم الصلاحيات (مرحباً {currentUsername}): يمكنك اعتماد أو رفض هذه الدفعة
              </span>

              {actionType === 'Rejected' && (
                <div className="space-y-1.5 animate-in fade-in duration-150">
                  <label className="block text-xs font-semibold text-rose-700">
                    سبب الرفض (إلزامي):
                  </label>
                  <textarea
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="اكتب سبب رفض هذه الدفعة..."
                    rows="2"
                    className="w-full p-2.5 bg-white border border-rose-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-500 shadow-sm"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => handleUpdateStatus('Approved')}
                  disabled={updatingStatus}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  <CheckCircle2 size={16} />
                  <span>اعتماد الدفعة (Approved)</span>
                </button>

                {actionType !== 'Rejected' ? (
                  <button
                    onClick={() => {
                      setActionType('Rejected');
                      setCustomNote('');
                    }}
                    disabled={updatingStatus}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <XCircle size={16} />
                    <span>رفض الدفعة (Rejected)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpdateStatus('Rejected')}
                    disabled={updatingStatus}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-rose-700 hover:bg-rose-800 text-white py-2 px-4 rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <XCircle size={16} />
                    <span>تأكيد الرفض وإرسال السبب</span>
                  </button>
                )}
              </div>

              {/* أزرار تغيير الحالة */}
              {canModifyStatus ? (
                <div className="bg-amber-50/60 border border-amber-200/60 p-4 rounded-xl space-y-3">
                  <span className="block text-xs font-semibold text-amber-800">
                    لوحة تحكم الصلاحيات (مرحباً {currentUsername}): يمكنك تحويل حالة الدفع
                  </span>

                  <div className="flex items-center gap-3">
                    <select 
                      value={paymentStatus} 
                      onChange={(e) => updatePaymentStatus(e.target.value)}
                      className='px-4 border border-1'
                    >
                      <option className='p-4' value="">لم يتم التحديد</option>
                      <option value="false">غير مدفوع (False)</option>
                      <option value="true">مدفوع (True)</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-100 p-3 rounded-xl text-center text-xs text-slate-500">
                  ملاحظة: الصلاحيات المتاحة لتغيير الحالة مقتصرة على المستخدمين (Abd أو yahya) فقط.
                </div>
              )}

              {/* **إضافة جديدة:** ملخص إجمالي العناصر لجميع الغرف في الدفعة */}
              <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl space-y-3">
                <h4 className="font-bold text-sm text-indigo-900 flex items-center gap-2">
                  <Package size={16} className="text-indigo-600" />
                  <span>إجمالي العناصر لجميع الغرف في هذه الدفعة:</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {getBatchItemsSummary(selectedBatch.requests).map((item) => (
                    <div key={item.key} className="bg-white border border-indigo-100 p-2.5 rounded-lg text-xs flex items-center justify-between shadow-2xs">
                      <span className="text-slate-700 font-medium truncate" title={item.name}>{item.name}</span>
                      <span className="bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-md text-xs">
                        {item.totalCount}
                      </span>
                    </div>
                  ))}
                  {(!selectedBatch.requests || selectedBatch.requests.length === 0) && (
                    <span className="text-xs text-slate-400">لا توجد طلبات متضمنة.</span>
                  )}
                </div>
              </div>

              {/* جدول الطلبات وتفاصيل القطع لكل غرفة */}
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                  <Package size={16} className="text-blue-600" />
                  <span>تفاصيل الطلبات والعناصر المتضمنة:</span>
                </h4>

                <div className="space-y-4">
                  {selectedBatch.requests && selectedBatch.requests.map((req, index) => {
                    const itemsList = Object.entries(req).filter(([key, val]) => 
                      val && typeof val === 'object' && 'count' in val && val.count > 0
                    );

                    return (
                      <div key={req._id || index} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                        {/* معلومات رأس الطلب */}
                        <div className="flex flex-wrap items-center justify-between border-b border-slate-200/60 pb-2.5 text-xs gap-2">
                          <div>
                            <span className="text-slate-400 ml-1">رقم الغرفة:</span>
                            <span className="font-bold text-slate-900 text-sm">{req.number || '---'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 ml-1">الموظف:</span>
                            <span className="font-semibold text-slate-700">{req.employee || '---'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 ml-1">نوع الطلب:</span>
                            <span className="font-semibold text-blue-600">
                              {req.type == "Full" ? "خروج" : "طلب"}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 ml-1">إجمالي الطلب:</span>
                            <span className="font-bold text-emerald-600">
                              {Number(req.total || 0).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* قائمة القطع التفصيلية */}
                        <div>
                          <span className="text-[11px] font-semibold text-slate-500 block mb-2">القطع المطلوبة:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {itemsList.map(([key, itemObj]) => {
                              const itemNamesAr = {
                                towels: 'مناشف عادية (Towels)',
                                bathTowels: 'مناشف حمام (Bath Towels)',
                                blankets: 'حرامات (Blankets)',
                                pillows: 'وسائد (Pillows)',
                                floorMats: 'دواسات أرضية (Floor Mats)',
                                robeCovers: 'أغطية روب (Robe Covers)'
                              };
                              const displayName = itemNamesAr[key] || key;
                              
                              const count = Number(itemObj.count) || 0;
                              const price = Number(itemObj.price) || 0;
                              const subtotal = count * price;

                              return (
                                <div key={key} className="bg-white border border-slate-200/80 p-2.5 rounded-lg text-xs flex flex-col justify-between gap-1.5 shadow-2xs">
                                  <span className="text-slate-700 font-bold truncate" title={displayName}>{displayName}</span>
                                  <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-1.5">
                                    <span>العدد: <strong className="text-slate-800">{count}</strong></span>
                                    <span>السعر: <strong className="text-blue-600">{price}</strong></span>
                                  </div>
                                  <div className="flex items-center justify-between text-[11px] bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                    <span className="text-slate-400">المجموع:</span>
                                    <strong className="text-emerald-700 font-bold">{subtotal}</strong>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* السعر الإجمالي النهائي */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-blue-50/40 p-4 rounded-xl border border-blue-100/60 text-xs">
                <div>
                  <span className="block text-slate-400 mb-1">إجمالي الطلبات:</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedBatch.totalRequests}</span>
                </div>
                <div>
                  <span className="block text-slate-400 mb-1">إجمالي القطع:</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedBatch.totalItems}</span>
                </div>
                <div>
                  <span className="block text-slate-400 mb-1">التكلفة الكلية:</span>
                  <span className="font-bold text-blue-600 text-sm">
                    {Number(selectedBatch.totalCost || 0).toFixed(2)}
                  </span>
                </div>
              </div>

            </div>

            {/* تذييل النافذة */}
            <div className="flex items-center justify-end px-6 py-3 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default DeliveryBatches;