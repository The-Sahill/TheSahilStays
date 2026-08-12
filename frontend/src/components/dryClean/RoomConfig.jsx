import React, { useState, useEffect } from 'react';
import { Save, Sliders, Loader2, Plus, X, DollarSign } from 'lucide-react';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_BACKEND_URL;
const RoomConfig = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [currentRoomData, setCurrentRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // حالات نموذج إضافة غرفة جديدة
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomFloor, setNewRoomFloor] = useState('');
  const [creating, setCreating] = useState(false);

  const categories = [
    {
      name: 'مستلزمات الغرف والأسرة (Room Inventory)',
      items: [
        { key: 'towels', name: 'مناشف (Towels)' },
        { key: 'bathTowels', name: 'بشاكير (Bath Towels)' },
        { key: 'blankets', name: 'حرامات (Blankets)' },
        { key: 'pillows', name: 'مخدات (Pillows)' },
        { key: 'floorMats', name: 'أغطية أرضيات (Floor Mats)' },
        { key: 'bedSheets', name: 'شراشف (Bed Sheets)' },
        { key: 'robeCovers', name: 'كفر روب (Robe Covers)' },
      ]
    }
  ];

  useEffect(() => {
    let isMounted = true;

    const loadRooms = async () => {
      try {
        const response = await axios.get(`${apiUrl}/rooms`);
        if (isMounted) {
          const roomsData = Array.isArray(response.data) 
            ? response.data 
            : (response.data.rooms || response.data.data || []);

          setRooms(roomsData);
          
          if (roomsData.length > 0) {
            setSelectedRoomId(roomsData[0]._id);
            setCurrentRoomData(roomsData[0]);
          }
        }
      } catch (error) {
        console.error('خطأ في جلب الغرف:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadRooms();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectRoom = (room) => {
    setSelectedRoomId(room._id);
    setCurrentRoomData({ ...room });
  };

  // دالة تحديث الكمية
  const updateCount = (itemKey, delta) => {
    if (!currentRoomData) return;
    
    const currentObj = currentRoomData[itemKey] || { count: 0, price: 0 };
    const updatedCount = Math.max(0, currentObj.count + delta);

    setCurrentRoomData({
      ...currentRoomData,
      [itemKey]: {
        ...currentObj,
        count: updatedCount
      }
    });
  };

  // دالة تحديث السعر مباشرة عند الكتابة في الحقل
  const updatePrice = (itemKey, newPrice) => {
    if (!currentRoomData) return;
    
    const currentObj = currentRoomData[itemKey] || { count: 0, price: 0 };
    const parsedPrice = Math.max(0, parseFloat(newPrice) || 0);

    setCurrentRoomData({
      ...currentRoomData,
      [itemKey]: {
        ...currentObj,
        price: parsedPrice
      }
    });
  };

  const handleSaveConfig = async () => {
    if (!currentRoomData) return;

    try {
      setSaving(true);
      await axios.put(`${apiUrl}/rooms/${selectedRoomId}`, currentRoomData);
      alert(`تم حفظ تكوين الغرفة ${currentRoomData.number} بنجاح!`);
      
      setRooms(rooms.map(r => r._id === selectedRoomId ? currentRoomData : r));
    } catch (error) {
      console.error('خطأ في حفظ البيانات:', error);
      alert('حدث خطأ أثناء حفظ التكوين.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomNumber || !newRoomFloor) {
      alert('الرجاء إدخال رقم الغرفة والطابق');
      return;
    }
    
    try {
      setCreating(true);
      const response = await axios.post(`${apiUrl}/rooms`, {
        number: newRoomNumber,
        floor: newRoomFloor
      });
      
      const createdRoom = response.data.room || response.data;
      
      setRooms([...rooms, createdRoom]);
      setSelectedRoomId(createdRoom._id);
      setCurrentRoomData(createdRoom);
      
      setShowAddModal(false);
      setNewRoomNumber('');
      setNewRoomFloor('');
      alert('تم إنشاء الغرفة بنجاح!');
    } catch (error) {
      console.error('خطأ في إنشاء الغرفة:', error);
      alert(error.response?.data?.message || 'حدث خطأ أثناء إنشاء الغرفة.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center mx-auto min-h-screen bg-slate-50" dir="rtl">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="mr-2 text-slate-600 font-medium">جاري تحميل الغرف...</span>
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen mt-16 md:mt-0 font-sans w-full" dir="rtl">
      
      {/* رأس الصفحة وزر إضافة غرفة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">تكوين الغرف (Room Config)</h1>
          <p className="text-sm text-slate-500 mt-0.5">تكوين وإدارة متطلبات المخزون الافتراضية والأسعار لكل غرفة.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>إضافة غرفة جديدة (Add Room)</span>
        </button>
      </div>

      {/* نافذة منبثقة (Modal) لإضافة غرفة */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-base text-slate-900">إضافة غرفة جديدة</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">رقم الغرفة (Room Number)</label>
                <input
                  type="text"
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  placeholder="مثال: 101"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 bg-slate-50/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الطابق (Floor)</label>
                <input
                  type="text"
                  value={newRoomFloor}
                  onChange={(e) => setNewRoomFloor(e.target.value)}
                  placeholder="مثال: الطابق الأول"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 bg-slate-50/50"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {creating && <Loader2 size={16} className="animate-spin" />}
                  <span>{creating ? 'جاري الإنشاء...' : 'حفظ وإنشاء'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* تخطيط الصفحة الرئيسي */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* قائمة اختيار الغرفة (4 أعمدة) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">اختر غرفة (Select a Room)</h3>
          </div>
          
          <div className="overflow-y-auto divide-y divide-slate-100 flex-1">
            {rooms.length > 0 ? (
              rooms.map((room) => {
                const isSelected = selectedRoomId === room._id;
                return (
                  <button
                    key={room._id}
                    onClick={() => handleSelectRoom(room)}
                    className={`w-full text-right px-6 py-4 flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected ? 'bg-blue-50/60 border-r-4 border-blue-600' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <div>
                      <div className={`font-bold text-base ${isSelected ? 'text-blue-600' : 'text-slate-900'}`}>
                        غرفة {room.number}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{room.floor}</div>
                    </div>
                    <Sliders size={16} className={isSelected ? 'text-blue-600' : 'text-slate-300'} />
                  </button>
                );
              })
            ) : (
              <div className="p-6 text-center text-slate-400 text-sm">لا توجد غرف متاحة حالياً</div>
            )}
          </div>
        </div>

        {/* لوحة إعداد مخزون الغرفة المحددة (8 أعمدة) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          
          {currentRoomData ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">مخزون وتعرية غرفة {currentRoomData.number}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">الطابق: {currentRoomData.floor}</p>
                </div>

                <button
                  onClick={handleSaveConfig}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  <span>{saving ? 'جاري الحفظ...' : 'حفظ التكوين (Save Configuration)'}</span>
                </button>
              </div>

              <div className="space-y-6 max-h-[480px] overflow-y-auto pl-2">
                {categories.map((cat, catIdx) => (
                  <div key={catIdx} className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{cat.name}</h4>
                    
                    <div className="space-y-3">
                      {cat.items.map((item, idx) => {
                        const itemData = currentRoomData[item.key] || { count: 0, price: 0 };
                        return (
                          <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-slate-200/80 rounded-2xl hover:border-slate-300 transition-all bg-white">
                            <div>
                              <div className="font-bold text-sm text-slate-900">{item.name}</div>
                              <div className="text-xs text-slate-400 mt-0.5">إدارة الكمية والسعر لكل وحدة</div>
                            </div>

                            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                              {/* حقل تعديل السعر */}
                              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 shadow-sm px-2 py-1.5">
                                <span className="text-slate-400 text-xs ml-1">$</span>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={itemData.price}
                                  onChange={(e) => updatePrice(item.key, e.target.value)}
                                  className="w-16 text-center text-sm font-bold text-slate-900 bg-transparent focus:outline-none"
                                  placeholder="السعر"
                                />
                                <span className="text-slate-400 text-[10px] mr-1">/وحدة</span>
                              </div>

                              {/* أزرار التحكم بالكمية */}
                              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 shadow-sm">
                                <button
                                  onClick={() => updateCount(item.key, -1)}
                                  className="px-3 py-2 text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer text-sm font-bold"
                                >
                                  –
                                </button>
                                <span className="w-10 text-center font-bold text-slate-900 text-sm">
                                  {itemData.count}
                                </span>
                                <button
                                  onClick={() => updateCount(item.key, 1)}
                                  className="px-3 py-2 text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer text-sm font-bold"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-slate-400 text-sm">يرجى اختيار غرفة من القائمة الجانبية أو إضافة غرفة جديدة</div>
          )}

        </div>

      </div>

    </div>
  );
};

export default RoomConfig;