import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Minus, CheckCircle2, AlertCircle, RefreshCw, PackagePlus } from 'lucide-react';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function StoreManagementPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [popup, setPopup] = useState({ show: false, message: '', type: '' });

  // نموذج إضافة عنصر جديد
  const [formData, setFormData] = useState({ itemName: '', quantity: 1, category: '' });
  const [adding, setAdding] = useState(false);

  // جلب العناصر
  const fetchStoreItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/store/getAll`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('فشل في جلب بيانات المخزن');
      const result = await response.json();
      setItems(result.data || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreItems();
  }, []);

  // إضافة عنصر جديد
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!formData.itemName) {
      setPopup({ show: true, message: 'الرجاء إدخال اسم العنصر', type: 'error' });
      return;
    }

    setAdding(true);
    try {
      const response = await fetch(`${apiUrl}/store/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('فشل إضافة العنصر');

      setPopup({ show: true, message: 'تم إضافة العنصر للمخزن بنجاح', type: 'success' });
      setFormData({ itemName: '', quantity: 1, category: '' });
      fetchStoreItems();
      setTimeout(() => setPopup({ show: false, message: '', type: '' }), 3000);
    } catch (err) {
      setPopup({ show: true, message: err.message, type: 'error' });
    } finally {
      setAdding(false);
    }
  };

  // تعديل الكمية (زيادة أو نقصان)
  const handleQuantityChange = async (id, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 0) return; // لا يمكن أن تكون أقل من صفر

    try {
      const response = await fetch(`${apiUrl}/store/updateQuantity/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ quantity: newQty })
      });
      if (!response.ok) throw new Error('فشل تحديث الكمية');

      // تحديث الواجهة محلياً
      setItems(prev => prev.map(item => item._id === id ? { ...item, quantity: newQty } : item));
    } catch (err) {
      setPopup({ show: true, message: err.message, type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-10" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">إدارة المخزن والمستودع</h1>
            <p className="text-sm text-gray-400 mt-1">إضافة ومتابعة الكميات المتوفرة في المستودع</p>
          </div>
          <button
            onClick={fetchStoreItems}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 px-4 py-2.5 rounded-xl text-sm font-medium text-cyan-400 cursor-pointer"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span>تحديث</span>
          </button>
        </div>

        {/* Form to Add Item */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8 shadow-xl">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-cyan-400">
            <PackagePlus size={20} />
            <span>إضافة عنصر جديد للمخزن</span>
          </h2>
          <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="اسم العنصر (مثلاً: مناشف، شامبو...)"
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              className="bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-500"
            />
            <input
              type="number"
              min="1"
              placeholder="الكمية الابتدائية"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              className="bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={adding}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 rounded-xl transition-all cursor-pointer flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {adding ? <Loader2 className="animate-spin" size={18} /> : <span>إضافة للمخزن</span>}
            </button>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-sm flex items-center gap-3">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Table View */}
        {loading && items.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-cyan-500" size={40} />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/50 border border-gray-800/60 rounded-2xl">
            <p className="text-gray-400 text-lg">المخزن فارغ حالياً</p>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-gray-950 border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                    <th className="py-4 px-6 font-semibold">اسم العنصر</th>
                    <th className="py-4 px-6 font-semibold">الكمية المتوفرة</th>
                    <th className="py-4 px-6 font-semibold text-center">تعديل الكمية (زيادة / نقصان)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-sm">
                  {items.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-850 transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-100">{item.itemName}</td>
                      <td className="py-4 px-6">
                        <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-3 py-1 rounded-xl text-xs font-semibold">
                          {item.quantity} وحدة
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity, -1)}
                            className="bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 p-2 rounded-xl transition-all cursor-pointer"
                            title="نقصان الكمية"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-bold text-gray-200">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity, 1)}
                            className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 p-2 rounded-xl transition-all cursor-pointer"
                            title="زيادة الكمية"
                          >
                            <Plus size={16} />
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