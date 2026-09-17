import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shirt, X, Calendar, Loader2, Save, User, Hash } from 'lucide-react';
const apiUrl = import.meta.env.VITE_BACKEND_URL;

const EditRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  
  // بيانات الطلب الأصلية (للاحتفاظ بتاريخ الإنشاء ورقم الغرفة إذا لم تكن قابلة للتعديل)
  const [requestInfo, setRequestInfo] = useState(null);

  // نموذج البيانات القابل للتعديل بالكامل (بما فيها customer)
  const [formData, setFormData] = useState({
    customer: '',
    customNotes: '',
    total: 0,
    towels: { count: 0, price: 0 },
    bathTowels: { count: 0, price: 0 },
    blankets: { count: 0, price: 0 },
    pillows: { count: 0, price: 0 },
    floorMats: { count: 0, price: 0 },
    bedSheets: { count: 0, price: 0 },
    robeCovers: { count: 0, price: 0 },
    robe: { count: 0, price: 0 },
  });

  const itemsList = [
    { key: 'towels', name: 'مناشف (Towels)' },
    { key: 'bathTowels', name: 'بشاكير (Bath Towels)' },
    { key: 'blankets', name: 'حرامات (Blankets)' },
    { key: 'pillows', name: 'مخدات (Pillows)' },
    { key: 'floorMats', name: 'أغطية أرضيات (Floor Mats)' },
    { key: 'bedSheets', name: 'شراشف (Bed Sheets)' },
    { key: 'robeCovers', name: 'كفر (Robe Covers)' },
    { key: 'robe', name: 'روب (Robe)' },
  ];

  // دالة جلب بيانات الطلب وتعبئة الفورم فور دخول الصفحة
  const fetchRequestDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/getRequest/${id}`);
      const data = response.data; // استجابة السيرفر بعد التعديل الأخير
      
      setRequestInfo(data);
      
      // تعبئة الفورم لتكون جاهزة للتعديل فوراً
      setFormData({
        customer: data.customer || '',
        customNotes: data.customNotes || '',
        total: data.total || 0,
        towels: data.towels || { count: 0, price: 0 },
        bathTowels: data.bathTowels || { count: 0, price: 0 },
        blankets: data.blankets || { count: 0, price: 0 },
        pillows: data.pillows || { count: 0, price: 0 },
        floorMats: data.floorMats || { count: 0, price: 0 },
        bedSheets: data.bedSheets || { count: 0, price: 0 },
        robeCovers: data.robeCovers || { count: 0, price: 0 },
        robe: data.robe || { count: 0, price: 0 },
      });
    } catch (err) {
      console.error('Error fetching request:', err);
      setError('فشل في جلب بيانات الطلب.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  // دالة تعديل عدد أو سعر أي قطعة وحساب الإجمالي تلقائياً
  const handleItemChange = (itemKey, field, value) => {
    const val = Number(value) || 0;
    setFormData((prev) => {
      const updatedItem = {
        ...prev[itemKey],
        [field]: val,
      };

      const updatedForm = {
        ...prev,
        [itemKey]: updatedItem,
      };

      let newTotal = 0;
      itemsList.forEach((i) => {
        const currentCount = i.key === itemKey && field === 'count' ? val : (updatedForm[i.key]?.count || 0);
        const currentPrice = i.key === itemKey && field === 'price' ? val : (updatedForm[i.key]?.price || 0);
        newTotal += currentCount * currentPrice;
      });

      return {
        ...updatedForm,
        total: newTotal,
      };
    });
  };

  // دالة حفظ التعديلات والرجوع لصفحة الطلبات
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await axios.put(`${apiUrl}/updateRequest/${id}`, formData);
      // بعد الحفظ بنجاح، العودة لصفحة الطلبات (يمكنك تعديل مسار الصفحة حسب رغبتك مثل /requests)
      navigate('/Dashboard/dry-clean'); 
    } catch (err) {
      console.error('Error updating request:', err);
      alert('حدث خطأ أثناء تعديل الطلب');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('ar-SA');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !requestInfo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 gap-4">
        <p className="text-red-500 font-semibold">{error || 'الطلب غير موجود'}</p>
        <button 
          onClick={() => navigate('/requests')}
          className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm cursor-pointer"
        >
          الرجوع لصفحة الطلبات
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border border-slate-100">
        
        {/* رأس الصفحة */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Shirt className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-lg text-slate-900">
              تعديل طلب غرفة ({requestInfo.number})
            </h3>
          </div>
          
          <button 
            onClick={() => navigate('/Dashboard/dry-clean')}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* نموذج التعديل */}
        <form onSubmit={handleSaveChanges} className="p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <span className="block text-xs text-slate-400 mb-1">رقم الغرفة</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Hash size={14} className="text-slate-400" /> غرفة {requestInfo.number}
              </span>
            </div>

            {/* تعديل اسم النزيل (Customer) */}
            <div>
              <span className="block text-xs text-slate-400 mb-1">اسم النزيل</span>
              <div className="relative flex items-center">
                <User size={14} className="absolute right-2 text-slate-400" />
                <input 
                  type="text" 
                  value={formData.customer}
                  onChange={(e) => setFormData({...formData, customer: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg pr-7 pl-2 py-1 text-xs text-slate-800 bg-white font-semibold focus:outline-blue-500"
                  placeholder="اسم النزيل..."
                />
              </div>
            </div>

            <div className="col-span-2 pt-2 border-t border-slate-200/60 flex items-center gap-2">
              <Calendar size={14} className="text-slate-400" />
              <div className='flex justify-between w-full'>
                <div>
                  <span className="block text-xs text-slate-400 mb-0.5">تاريخ ووقت الطلب</span>
                  <span className="font-bold text-slate-800 text-xs">{formatDate(requestInfo.createdAt)}</span>
                </div>
                <div className="w-1/2">
                  <span className="block text-xs text-slate-400 mb-0.5">الملاحظات</span>
                  <input 
                    type="text" 
                    value={formData.customNotes}
                    onChange={(e) => setFormData({...formData, customNotes: e.target.value})}
                    className="border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 bg-white w-full focus:outline-blue-500"
                    placeholder="أدخل الملاحظات..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* تعديل القطع والأسعار */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100 max-h-60 overflow-y-auto">
            <span className="block text-xs font-semibold text-slate-500 mb-2">تعديل القطع والأسعار:</span>
            
            {itemsList.map((item) => {
              const itemData = formData[item.key];

              return (
                <div key={item.key} className="flex justify-between items-center py-2 border-b border-slate-200/60 text-xs">
                  <span className="text-slate-600 font-medium">{item.name}</span>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-400">العدد:</span>
                      <input 
                        type="number" 
                        min="0"
                        value={itemData?.count || 0}
                        onChange={(e) => handleItemChange(item.key, 'count', e.target.value)}
                        className="w-16 border border-slate-300 rounded px-1.5 py-1 text-center bg-white text-xs font-bold focus:outline-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-400">السعر:</span>
                      <input 
                        type="number" 
                        min="0"
                        step="0.01"
                        value={itemData?.price || 0}
                        onChange={(e) => handleItemChange(item.key, 'price', e.target.value)}
                        className="w-16 border border-slate-300 rounded px-1.5 py-1 text-center bg-white text-xs font-bold focus:outline-blue-500"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* التكلفة الإجمالية */}
          <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-lg">
            <span className="text-sm font-semibold text-slate-600">التكلفة الإجمالية:</span>
            <span className="text-base font-bold text-emerald-600">
              {Number(formData.total || 0).toFixed(2)}
            </span>
          </div>

          {/* زر الحفظ */}
          <div className="flex gap-3 mt-4">
            <button 
              type="submit"
              disabled={actionLoading}
              className='bg-blue-600 hover:bg-blue-700 transition-colors text-white px-5 py-2.5 rounded-xl w-full font-semibold text-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-sm'
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save size={16} /> حفظ التعديلات والعودة</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditRequest;