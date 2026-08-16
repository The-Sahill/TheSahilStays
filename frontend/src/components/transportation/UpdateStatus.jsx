import React, { useEffect, useState } from 'react';
import { ArrowLeft, X, CheckCircle2, Plane, Calendar, Clock, Users, Car, CreditCard, Star, Edit3 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const UpdateRequest = () => {
    const [requestsData, setRequestsData] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    // جلب بيانات الطلبات عند تحميل المكون
  

    const getRequests = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${apiUrl}`, { withCredentials: true });
            if (data.success === true) {
                setRequestsData(data.data);
            }
        } catch (error) {
            console.log(error);
            toast.error("فشل في جلب البيانات");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getRequests();
    }, []);
    // عند النقر على طلب لعرضه
    const handleRowClick = (request) => {
        setSelectedRequest(request);
        setFormData(request); // تعبئة النموذج ببيانات الطلب الحالي للتعديل
        setIsEditing(false);
    };

    // التعامل مع تغيير حقول الإدخال أثناء التعديل
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // حفظ التعديلات وإرسالها للـ Backend
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // استبدل الـ URL برابط التحديث الخاص بك، مثلاً `${apiUrl}/${formData._id}`
            const { data } = await axios.put(`${apiUrl}/${formData._id}/updateRequest`, formData, { withCredentials: true });
            console.log("Response from update API:", formData);
            if (data.success === true) {
                toast.success("تم تحديث الطلب بنجاح");
                setSelectedRequest(data.requestItem);
                setIsEditing(false);
                getRequests(); // تحديث القائمة بالخلفية
            }
        } catch (error) {
            console.log(error);
            // للتجربة المحلية في حال لم تقم بإنشاء API التحديث بعد:
            setSelectedRequest(formData);
            setIsEditing(false);
            toast.success("تم تحديث الطلب محلياً (تأكد من ربط الـ API)");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'مكتمل':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">مكتمل</span>;
            case 'بانتظار الموافقة':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">بانتظار الموافقة</span>;
            case 'ملغي':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">ملغي</span>;
            case 'تمت الموافقة':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">تمت الموافقة</span>;
            case 'مرفوض':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">مرفوض</span>;
            default:
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fbfaf6] flex justify-center items-center" dir="rtl">
                <p className="text-[#1b2a32] font-bold text-lg">جاري تحميل البيانات...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#fbfaf6] p-4 md:p-8" dir="rtl">
            <div className="max-w-[1300px] mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-extrabold text-[#1b2a32]">قائمة الطلبات</h2>
                    <span className="text-xs font-semibold text-gray-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
                        العدد الكلي: {requestsData.length}
                    </span>
                </div>

                {/* جدول عرض الطلبات */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200/60 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                                    <th className="p-4">اسم الضيف</th>
                                    <th className="p-4">تاريخ السفر</th>
                                    <th className="p-4">المطار</th>
                                    <th className="p-4">نوع المركبة</th>
                                    <th className="p-4">الحالة</th>
                                    <th className="p-4 text-center">الإجراء</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {requestsData.length > 0 ? (
                                    requestsData.map((req) => (
                                        <tr 
                                            key={req._id} 
                                            onClick={() => handleRowClick(req)}
                                            className="hover:bg-gray-50/80 cursor-pointer transition-colors"
                                        >
                                            <td className="p-4 font-bold text-[#1b2a32]">{req.guestName}</td>
                                            <td className="p-4 text-gray-600">{req.travelDate}</td>
                                            <td className="p-4 text-gray-600">{req.airport}</td>
                                            <td className="p-4 text-gray-600">{req.vehicle}</td>
                                            <td className="p-4">{getStatusBadge(req.status)}</td>
                                            <td className="p-4 text-center">
                                                <button className="px-3 py-1.5 bg-[#cce0db] text-[#1b2a32] rounded-lg text-xs font-bold hover:bg-[#b8d4ce] transition-colors">
                                                    عرض / تعديل
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-gray-400 font-semibold">
                                            لا توجد طلبات متاحة
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal تفاصيل وتعديل الطلب */}
            {selectedRequest && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center overflow-y-auto p-4 md:p-8">
                    <div className="bg-[#fbfaf6] w-full max-w-[1300px] rounded-3xl shadow-2xl p-6 md:p-10 relative max-h-[90vh] overflow-y-auto">
                        
                        {/* زر إغلاق النافذة */}
                        <button 
                            onClick={() => { setSelectedRequest(null); setIsEditing(false); }}
                            className="absolute top-6 left-6 p-2 rounded-full bg-gray-200/60 hover:bg-gray-200 text-[#1b2a32] transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* رأس المودل */}
                        <div className="flex justify-between items-center mb-4">
                            <button 
                                onClick={() => { setSelectedRequest(null); setIsEditing(false); }}
                                className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#1b2a32]"
                            >
                                <ArrowLeft className="w-4 h-4" /> العودة للجدول
                            </button>

                            <button 
                                onClick={() => setIsEditing(!isEditing)}
                                className="flex ml-10 mt-10 items-center gap-2 px-4 py-2 bg-[#1b2a32] text-white rounded-xl text-xs font-bold hover:bg-opacity-90 transition-colors"
                            >
                                <Edit3 className="w-4  h-4" /> {isEditing ? 'إلغاء التعديل' : 'تعديل البيانات'}
                            </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mb-2">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1b2a32]">{selectedRequest.guestName}</h2>
                            {getStatusBadge(selectedRequest.status)}
                        </div>
                        <p className="text-xs text-gray-400 mb-8">
                            {selectedRequest._id}
                        </p>

                        {/* محتوى المودل (عرض أو تعديل) */}
                        {isEditing ? (
                            /* نموذج التعديل */
                            <form onSubmit={handleSave} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200/60 shadow-sm space-y-6">
                                <h3 className="text-xl font-bold text-[#1b2a32] mb-4">تعديل تفاصيل الطلب</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                               
                                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">المركبة نوع</label>
                      <select 
                        name="vehicle" 
                        value={formData.vehicle}
                        onChange={handleChange} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#1b2a32]"
                      >
                        <option>سبارة عادية</option>
                        <option>فان</option>
                      </select>
                    </div>
                                
                                  
                                   
                                

                                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">حالة الطلب</label>
                      <select 
                        name="status" 
                        value={formData.status}
                        onChange={handleChange} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#1b2a32]"
                      >
                        <option>بانتظار الموافقة</option>
                        <option>تمت الموافقة</option>
                        <option>مكتمل</option>
                        <option>مرفوض</option>
                        <option>ملغي</option>
                      </select>
                    </div>

                  
                                 
                                </div>
                                <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-bold text-sm"
                                    >
                                        إلغاء
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-6 py-2.5 bg-[#1b2a32] text-white rounded-xl font-bold text-sm hover:bg-opacity-90"
                                    >
                                        حفظ التعديلات
                                    </button>
                                </div>
                            </form>
                        ) : (
                            /* عرض تفاصيل الطلب التصميم الأصلي */
                            <div className="w-full grid grid-cols-1  gap-6">
                                <div className="lg:col-span-8 flex flex-col gap-6">
                                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200/60 shadow-sm relative">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">ملخص الرحلة</p>
                                                <h3 className="text-2xl font-bold text-[#1b2a32]">استقبال من المطار</h3>
                                            </div>
                                            <div className="p-3 bg-amber-100/70 text-amber-800 rounded-2xl">
                                                <Plane className="w-6 h-6" />
                                            </div>
                                        </div>

                                        <div className="w-full grid grid-cols-3 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                                            <div className="flex items-start gap-3">
                                                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <span className="block text-[10px] font-bold text-gray-400 uppercase">تاريخ السفر</span>
                                                    <span className="text-sm font-bold text-[#1b2a32]">{selectedRequest.travelDate}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <span className="block text-[10px] font-bold text-gray-400 uppercase">وقت الاستقبال</span>
                                                    <span className="text-sm font-bold text-[#1b2a32]">{selectedRequest.transferTime}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Plane className="w-5 h-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <span className="block text-[10px] font-bold text-gray-400 uppercase">الرحلة</span>
                                                    <span className="text-sm font-bold text-[#1b2a32]">{selectedRequest.transferType}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <span className="w-5 h-5 flex items-center justify-center text-gray-400 mt-0.5 font-bold">📍</span>
                                                <div>
                                                    <span className="block text-[10px] font-bold text-gray-400 uppercase">المطار</span>
                                                    <span className="block text-[10px] font-bold text-gray-400 uppercase">{selectedRequest.airport}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <span className="block text-[10px] font-bold text-gray-400 uppercase">الركاب</span>
                                                    <span className="text-sm font-bold text-[#1b2a32]">{selectedRequest.passengers}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Car className="w-5 h-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <span className="block text-[10px] font-bold text-gray-400 uppercase">المركبة</span>
                                                    <span className="text-sm font-bold text-[#1b2a32]">{selectedRequest.vehicle}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Car className="w-5 h-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <span className="block text-[10px] font-bold text-gray-400 uppercase">حالة الدفع</span>
                                                    <span className="text-sm font-bold text-[#1b2a32]">{selectedRequest.paymentStatus}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                             
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateRequest;