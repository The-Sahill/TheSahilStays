import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X, Tag } from 'lucide-react';

const ItemTypesAndPricing = () => {
  // بيانات تجريبية لأنواع القطع والأسعار
  const [items, setItems] = useState([
    { id: 1, name: 'Bath Mat', category: 'Towels', description: 'Bathroom floor mat', price: '$4.50' },
    { id: 2, name: 'Bath Towel', category: 'Towels', description: 'Standard bath towel', price: '$3.50' },
    { id: 3, name: 'Bathrobe', category: 'Robes', description: 'Hotel bathrobe', price: '$12.00' },
    { id: 4, name: 'Bed Sheet (Double)', category: 'Bedding', description: 'Double/queen bed sheet', price: '$7.00' },
    { id: 5, name: 'Bed Sheet (Single)', category: 'Bedding', description: 'Single bed sheet', price: '$5.00' },
    { id: 6, name: 'Blanket', category: 'Bedding', description: 'Standard hotel blanket', price: '$8.50' },
    { id: 7, name: 'Duvet Cover', category: 'Bedding', description: 'Duvet/comforter cover', price: '$9.50' },
    { id: 8, name: 'Face Towel', category: 'Towels', description: 'Small face towel', price: '$1.50' },
    { id: 9, name: 'Hand Towel', category: 'Towels', description: 'Hand towel', price: '$2.00' },
    { id: 10, name: 'Pillow', category: 'Bedding', description: 'Standard hotel pillow', price: '$4.00' },
  ]);

  // حالات خاصة بالنافذة المنبثقة (Modal) وإدارة النموذج
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // إذا كان null يعني وضع إضافة، وإذا كان يحتوي على بيانات يعني وضع تعديل

  // حقول النموذج
  const [formData, setFormData] = useState({
    name: '',
    category: 'Towels',
    description: '',
    price: ''
  });

  // فتح نافذة الإضافة
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({ name: '', category: 'Towels', description: '', price: '' });
    setIsModalOpen(true);
  };

  // فتح نافذة التعديل مع تعبئة البيانات الحالية للصنف
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price.replace('$', '') // إزالة علامة الدولار للعرض المريح في الحقل
    });
    setIsModalOpen(true);
  };

  // حفظ البيانات (سواء إضافة جديد أو تحديث صنف قائم)
  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('يرجى تعبئة اسم الصنف والسعر على الأقل.');
      return;
    }

    const formattedPrice = formData.price.startsWith('$') ? formData.price : `$${Number(formData.price).toFixed(2)}`;

    if (editingItem) {
      // عملية تحديث صنف موجود
      setItems(items.map(item => item.id === editingItem.id ? {
        ...item,
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: formattedPrice
      } : item));
    } else {
      // عملية إضافة صنف جديد
      const newItem = {
        id: Date.now(),
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: formattedPrice
      };
      setItems([newItem, ...items]);
    }

    setIsModalOpen(false);
  };

  // حذف الصنف
  const handleDeleteItem = (id) => {
    if (confirm('هل أنت متأكد من حذف هذا الصنف؟')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans relative w-full" dir="rtl">
      
      {/* رأس الصفحة وزر الإضافة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">أنواع القطع والأسعار</h1>
          <p className="text-sm text-slate-500 mt-0.5">إدارة قطع الدراي كلين وأسعار الوحدات الخاصة بها.</p>
        </div>
        
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm shadow-blue-600/20 transition-all cursor-pointer"
        >
          <Plus size={18} />
          <span>إضافة نوع صنف (Add Item Type)</span>
        </button>
      </div>

      {/* جدول البيانات */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase bg-slate-50/50">
                <th className="py-4 px-6">اسم الصنف (Item Name)</th>
                <th className="py-4 px-6">التصنيف (Category)</th>
                <th className="py-4 px-6">الوصف (Description)</th>
                <th className="py-4 px-6">سعر الوحدة (Unit Price)</th>
                <th className="py-4 px-6 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">{item.name}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500">{item.description}</td>
                  <td className="py-4 px-6 font-semibold text-slate-900">{item.price}</td>
                  <td className="py-4 px-6 text-left">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-2 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl transition-colors cursor-pointer"
                        title="تعديل"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl transition-colors cursor-pointer"
                        title="حذف"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-slate-400">
                    لا توجد أصناف مضافة حالياً.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* نافذة الإضافة أو التعديل المنبثقة (Modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* رأس النافذة */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-lg text-slate-900">
                  {editingItem ? 'تعديل صنف (Edit Item Type)' : 'إضافة نوع صنف جديد (Add Item Type)'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* نموذج الإدخال */}
            <form onSubmit={handleSaveItem} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">اسم الصنف (Item Name)</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: Bath Towel"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">التصنيف (Category)</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-600 shadow-sm cursor-pointer"
                >
                  <option value="Towels">Towels</option>
                  <option value="Bedding">Bedding</option>
                  <option value="Robes">Robes</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">الوصف (Description)</label>
                <input
                  type="text"
                  placeholder="مثال: Standard bath towel"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">سعر الوحدة بالدولار (Unit Price)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="مثال: 3.50"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              {/* أزرار الحفظ والإلغاء */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-blue-600/20 transition-all cursor-pointer"
                >
                  {editingItem ? 'حفظ التعديلات' : 'إضافة الصنف'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default ItemTypesAndPricing;