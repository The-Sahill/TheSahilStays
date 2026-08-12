import React, { useState, useEffect } from 'react';
import { Search, Shirt, Filter, ChevronLeft, ChevronRight, X, Loader2, Package } from 'lucide-react';
const apiUrl = import.meta.env.VITE_BACKEND_URL;

const RoomsStatus = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [roomsData, setRoomsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // حالات الـ Modal والنموذج
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [customNotes, setCustomNotes] = useState('');
  const [customer, setCustomer] = useState('');
  const [currentModalItems, setCurrentModalItems] = useState({});
  
  // حالة لتحديد نوع الطلب داخل النافذة (Full أو Manual)
  const [washType, setWashType] = useState('Full'); // افتراضياً غسيل كامل

  // الأصناف مطابقة 100% لحقول الـ Mongoose Schema لديك
  const categories = [
    {
      name: 'ROOM ITEMS & INVENTORY',
      items: [
        { key: 'towels', name: 'مناشف (Towels)' },
        { key: 'bathTowels', name: 'بشاكير (Bath Towels)' },
        { key: 'blankets', name: 'حرامات (Blankets)' },
        { key: 'pillows', name: 'مخدات (Pillows)' },
        { key: 'floorMats', name: 'أغطية أرضيات (Floor Mats)' },
        { key: 'bedSheets', name: 'شراشف (Bed Sheets)' },
        { key: 'robeCovers', name: 'كفر روب (Robe Covers)' },
      ]
    },
  ];

  // 1. جلب الغرف من الـ Backend عند تحميل الصفحة مع تضمين الكوكيز
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/rooms`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      setRoomsData(data);
    } catch (error) {
      console.error('خطأ في جلب بيانات الغرف:', error);
    } finally {
      setLoading(false);
    }
  };

  // تصفية الغرف للبحث والفلترة
  const filteredRooms = roomsData.filter((item) => {
    const roomNumStr = item.number ? String(item.number) : '';
    const matchesSearch = roomNumStr.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFloor = selectedFloor === 'all' || String(item.floor) === String(selectedFloor);

    return matchesSearch && matchesFloor;
  });

  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const currentRooms = filteredRooms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // دالة لحساب إجمالي عدد القطع في الغرفة الواحدة
  const calculateRoomTotalCount = (room) => {
    let total = 0;
    const keys = ['towels', 'bathTowels', 'blankets', 'pillows', 'floorMats', 'bedSheets', 'robeCovers'];
    keys.forEach(key => {
      if (room[key] && typeof room[key].count === 'number') {
        total += room[key].count;
      }
    });
    return total;
  };

  // 2. فتح الـ Modal وتعيين الوضع الافتراضي (غسيل كامل)
  const handleOpenModal = (room) => {
    setSelectedRoom(room);
    setCustomNotes('');
    setWashType('Full');
    
    const roomItemsState = {
      towels: { count: room.towels?.count ?? 0, price: room.towels?.price ?? 0 },
      bathTowels: { count: room.bathTowels?.count ?? 0, price: room.bathTowels?.price ?? 0 },
      blankets: { count: room.blankets?.count ?? 0, price: room.blankets?.price ?? 0 },
      pillows: { count: room.pillows?.count ?? 0, price: room.pillows?.price ?? 0 },
      floorMats: { count: room.floorMats?.count ?? 0, price: room.floorMats?.price ?? 0 },
      bedSheets: { count: room.bedSheets?.count ?? 0, price: room.bedSheets?.price ?? 0 },
      robeCovers: { count: room.robeCovers?.count ?? 0, price: room.robeCovers?.price ?? 0 },
    };

    setCurrentModalItems(roomItemsState);
    setIsModalOpen(true);
  };

  // عند تغيير نوع الغسيل (Full أو Manual)
  const handleWashTypeChange = (type) => {
    setWashType(type);
    
    if (type === 'Manual') {
      // تصفير القيم عند اختيار الغسيل اليدوي لتسهيل إدخالها من جديد
      const resetItems = {};
      Object.keys(currentModalItems).forEach(key => {
        resetItems[key] = { count: 0, price: 0 };
      });
      setCurrentModalItems(resetItems);
    } else if (type === 'Full' && selectedRoom) {
      // استعادة القيم الأصلية الخاصة بالغرفة عند اختيار الغسيل الكامل
      setCurrentModalItems({
        towels: { count: selectedRoom.towels?.count ?? 0, price: selectedRoom.towels?.price ?? 0 },
        bathTowels: { count: selectedRoom.bathTowels?.count ?? 0, price: selectedRoom.bathTowels?.price ?? 0 },
        blankets: { count: selectedRoom.blankets?.count ?? 0, price: selectedRoom.blankets?.price ?? 0 },
        pillows: { count: selectedRoom.pillows?.count ?? 0, price: selectedRoom.pillows?.price ?? 0 },
        floorMats: { count: selectedRoom.floorMats?.count ?? 0, price: selectedRoom.floorMats?.price ?? 0 },
        bedSheets: { count: selectedRoom.bedSheets?.count ?? 0, price: selectedRoom.bedSheets?.price ?? 0 },
        robeCovers: { count: selectedRoom.robeCovers?.count ?? 0, price: selectedRoom.robeCovers?.price ?? 0 },
      });
    }
  };

  // تعديل الـ count أو الـ price يدوياً (مفعل فقط في وضع الـ Manual)
  const handleItemChange = (itemKey, field, value) => {
    if (washType === 'Full') return; // منع التعديل في وضع الغسيل الكامل
    const numericValue = Math.max(0, parseFloat(value) || 0);
    
    setCurrentModalItems(prev => ({
      ...prev,
      [itemKey]: {
        ...prev[itemKey],
        [field]: numericValue
      }
    }));
  };

  // 3. إرسال الطلب (createRequest)
  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const roomNumber = selectedRoom.number;

    // حساب المجموع الكلي بناءً على القيم المدخلة (العدد × السعر)
    let calculatedTotal = 0;
    Object.values(currentModalItems).forEach(item => {
      calculatedTotal += (item.count || 0) * (item.price || 0);
    });

    try {
      const response = await fetch(`${apiUrl}/createRequest/${roomNumber}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...currentModalItems,
          total: calculatedTotal,
          customer,
          customNotes,
          type: washType 
        }),
      });


      if (!response.ok) throw new Error('فشل إنشاء الطلب في الخادم');

      alert(`تم إرسال طلب الغسيل (${washType}) للغرفة ${roomNumber} بنجاح! والمجموع الكلي: ${calculatedTotal}`);
      setIsModalOpen(false);
    } catch (error) {
      console.error('خطأ أثناء إرسال الطلب:', error);
      alert('حدث خطأ أثناء الاتصال بالخادم أو أن جلسة تسجيل الدخول انتهت.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center mx-auto justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const calculateRoomTotalPrice = (room) => {
    let total = 0;
    const keys = ['towels', 'bathTowels', 'blankets', 'pillows', 'floorMats', 'bedSheets', 'robeCovers'];
    
    keys.forEach(key => {
      const count = room[key]?.count || 0;
      const price = room[key]?.price || 0;
      total += (count * price);
    });
    
    return total;
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen mt-16 md:mt-0 font-sans relative w-full" dir="rtl">
      
      {/* رأس الصفحة */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">حالة الغرف</h1>
        <p className="text-sm text-slate-500 mt-0.5">عرض تفاصيل الغرف ومحتوياتها وإدارة طلبات الغسيل والمستلزمات.</p>
      </div>

      {/* شريط البحث والفلترة */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="ابحث برقم الغرفة..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm"
          />
        </div>

        <div className="relative w-full sm:w-48">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
            <Filter size={16} />
          </div>
          <select
            value={selectedFloor}
            onChange={(e) => {
              setSelectedFloor(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm appearance-none cursor-pointer"
          >
            <option value="all">جميع الطوابق</option>
            <option value="1">الطابق الأول</option>
            <option value="2">الطابق الثاني</option>
            <option value="3">الطابق الثالث</option>
            <option value="4">الطابق الرابع</option>
          </select>
        </div>
      </div>

      {/* جدول البيانات المفصل */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase bg-slate-50/50">
                <th className="py-4 px-6">رقم الغرفة</th>
                <th className="py-4 px-6">الطابق</th>
                <th className="py-4 px-6">إجمالي عدد القطع</th>
                <th className="py-4 px-6">القيمة الإجمالية (السعر)</th>
                <th className="py-4 px-6 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {currentRooms.map((room) => {
                const totalItemsCount = calculateRoomTotalCount(room);
                const totalPrice = calculateRoomTotalPrice(room);
                
                return (
                  <tr key={room._id || room.number} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">{room.number}</td>
                    <td className="py-4 px-6 text-slate-600">الطابق {room.floor}</td>
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium text-xs">
                        <Package size={14} className="text-slate-500" />
                        <span>{totalItemsCount} قطعة</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-bold text-blue-600">
                        {totalPrice.toLocaleString()} دينار
                      </span>
                    </td>
                    <td className="py-4 px-6 text-left">
                      <button
                        onClick={() => handleOpenModal(room)}
                        className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
                      >
                        <Shirt size={15} />
                        <span>طلب غسيل</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* التنقل بين الصفحات (Pagination) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500">
            عرض الصفحة <span className="font-semibold text-slate-800">{currentPage}</span> من <span className="font-semibold text-slate-800">{totalPages}</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
              <span>السابق</span>
            </button>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span>التالي</span>
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>
      )}

      {/* النافذة المنبثقة (Modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  طلب غسيل - الغرفة ({selectedRoom?.number})
                </h3>
                <p className="text-xs text-slate-500">الطابق {selectedRoom?.floor}</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="p-6 space-y-4 overflow-y-auto flex-1">


              
              {/* أزرار اختيار نوع الغسيل */}
              <div>
                <h1 className='block text-xs font-semibold text-slate-600 '>النزيل:</h1>
<input type="text" onChange={(e) => setCustomer(e.target.value)} required={true}  className='border  b-1 w-full rounded-md pt-2 my-4' />


                <label className="block text-xs font-semibold text-slate-600 mb-2">نوع الطلب:</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleWashTypeChange('Full')}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      washType === 'Full' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    غسيل كامل (Full Wash)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleWashTypeChange('Manual')}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      washType === 'Manual' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    إضافة يدوية / مخصص (Manual)
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-600">مستلزمات الغرفة والأسعار والكميات:</label>
                  {washType === 'Full' && (
                    <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      الحقول مقفلة لأنك في وضع الغسيل الكامل
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  {categories.map((cat, catIdx) => (
                    <div key={catIdx} className="space-y-3">
                      {cat.items.map((item) => {
                        const itemData = currentModalItems[item.key] || { count: 0, price: 0 };

                        return (
                          <div key={item.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-100">
                            <span className="text-xs font-semibold text-slate-800">{item.name}</span>
                            
                            <div className="flex items-center gap-3">
                              {/* حقل السعر (يظهر ويكون قابلاً للتعديل في وضع الـ Manual) */}
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-slate-400">السعر:</span>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  disabled={washType === 'Full'}
                                  value={itemData.price}
                                  onChange={(e) => handleItemChange(item.key, 'price', e.target.value)}
                                  className={`w-20 px-2.5 py-1.5 border rounded-lg text-xs text-center font-bold text-slate-900 transition-colors ${
                                    washType === 'Full' 
                                      ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed' 
                                      : 'bg-slate-50 border-slate-200 focus:bg-white'
                                  }`}
                                  placeholder="السعر"
                                />
                              </div>

                              {/* حقل العدد */}
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="number"
                                  min="0"
                                  disabled={washType === 'Full'}
                                  value={itemData.count}
                                  onChange={(e) => handleItemChange(item.key, 'count', e.target.value)}
                                  className={`w-20 px-2.5 py-1.5 border rounded-lg text-xs text-center font-bold text-slate-900 transition-colors ${
                                    washType === 'Full' 
                                      ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed' 
                                      : 'bg-slate-50 border-slate-200 focus:bg-white'
                                  }`}
                                  placeholder="العدد"
                                />
                                <span className="text-xs text-slate-500">قطعة</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">ملاحظات إضافية</label>
                <textarea
                  rows="2"
                  placeholder="أي تفاصيل أخرى..."
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'جاري الحفظ...' : 'إرسال وتحديث الطلب'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default RoomsStatus;