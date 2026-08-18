import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const CustomerForm = () => {
    const navigate = useNavigate();
    const [successModal, setSuccessModal] = useState(false);
    const [loading,setLoading] = useState(false);

    // حقول نموذج الطلب الجديد
    const [formData, setFormData] = useState({
        guestName: '',
        mobileNumber: '',
        method: 'Reception',
        transferType: 'استقبال من المطار',
        airport: 'مطار الملكة علياء الدولي',
        travelDate: '',
        transferTime: '',
        flightNumber: '',
        passengers: '',
        bags: '',
        baggageSize: 'صغير',
        baggageNotes: '',
        vehicle: 'لم يتم التحديد بعد',
        partner: '',
        price: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const createRequest = async (e) => {
    setLoading(true);
        e.preventDefault();
        try {
            const { data } = await axios.post(`${apiUrl}/createRequest`, formData, { withCredentials: true });
            if (data.success === true) {
                // إظهار رسالة النجاح في منتصف الشاشة
                setSuccessModal(true);
                
                // تفريغ البيانات
                setFormData({
                    guestName: '',
                    mobileNumber: '',
                    method: 'Reception',
                    transferType: 'استقبال من المطار',
                    airport: 'مطار الملكة علياء الدولي',
                    travelDate: '',
                    transferTime: '',
                    flightNumber: '',
                    passengers: '',
                    bags: '',
                    baggageSize: 'صغير',
                    baggageNotes: '',
                    vehicle: 'لم يتم التحديد بعد',
                    partner: '',
                    price: ''
                });
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            toast.error("حدث خطأ أثناء إنشاء الطلب");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#fbfaf6] p-4 md:p-10 flex justify-center items-start relative" dir="rtl">
            <div className="bg-[#fbfaf6] w-full max-w-[1200px] rounded-3xl p-6 md:p-10">
                
                <div className="mb-8">
                    <p className="text-xs font-bold text-yellow-600 tracking-wider uppercase mb-1">طلب نقل جديد</p>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#1b2a32] mb-2">اجعل الرحلة تبدأ حركة.</h2>
                    <p className="text-sm text-gray-600">سجل التفاصيل مرة واحدة. سيتلقى شريكك ملخصاً واضحاً وكاملاً.</p>
                </div>

                <form onSubmit={createRequest} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-12 flex flex-col gap-6">
                        
                        {/* القسم الأول: الضيف والرحلة */}
                        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200/60 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-7 h-7 rounded-full bg-[#f6e0bc] text-yellow-900 font-bold flex items-center justify-center text-xs">01</span>
                                <div>
                                    <h3 className="font-bold text-[#1b2a32]">الضيف والرحلة</h3>
                                    <p className="text-xs text-gray-400">الأساسيات لاستقبال سلس.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">اسم الضيف</label>
                                    <input 
                                        type="text" 
                                        name="guestName" 
                                        placeholder="مثال: إيلينا روسي" 
                                        value={formData.guestName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1b2a32]" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">رقم الجوال</label>
                                    <input 
                                        type="text" 
                                        name="mobileNumber" 
                                        placeholder="+353 87 000 0000" 
                                        value={formData.mobileNumber}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1b2a32]" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">طريقة الحجز</label>
                                    <select 
                                        name="method" 
                                        value={formData.method}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#1b2a32]"
                                    >
                                        <option value="Reception">Reception</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">نوع النقل</label>
                                    <select 
                                        name="transferType" 
                                        value={formData.transferType}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#1b2a32]"
                                    >
                                        <option value="استقبال من المطار">استقبال من المطار</option>
                                        <option value="توصيل إلى المطار">توصيل إلى المطار</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">المطار</label>
                                    <input 
                                        type="text" 
                                        name="airport" 
                                        value={formData.airport}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1b2a32]" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">تاريخ السفر</label>
                                    <input 
                                        type="date" 
                                        name="travelDate" 
                                        value={formData.travelDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1b2a32]" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">وقت اقلاع الطائرة</label>
                                    <input 
                                        type="time" 
                                        name="transferTime" 
                                        value={formData.transferTime}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1b2a32]" 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* القسم الثاني: الأمتعة والمركبة */}
                        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200/60 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-7 h-7 rounded-full bg-[#f6e0bc] text-yellow-900 font-bold flex items-center justify-center text-xs">02</span>
                                <div>
                                    <h3 className="font-bold text-[#1b2a32]">الأمتعة والمركبة</h3>
                                    <p className="text-xs text-gray-400">منح السائق التفاصيل التي يحتاجها.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">الركاب</label>
                                    <input 
                                        type="number" 
                                        name="passengers" 
                                        value={formData.passengers}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1b2a32]" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">الحقائب</label>
                                    <input 
                                        type="number" 
                                        name="bags" 
                                        value={formData.bags}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1b2a32]" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">حجم الأمتعة</label>
                                    <select 
                                        name="baggageSize" 
                                        value={formData.baggageSize}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#1b2a32]"
                                    >
                                        <option value="صغير">صغير</option>
                                        <option value="متوسط">متوسط</option>
                                        <option value="كبير">كبير</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2">ملاحظات الأمتعة</label>
                                <input 
                                    type="text" 
                                    name="baggageNotes" 
                                    placeholder="حقيبة كبيرة، عربة أطفال..." 
                                    value={formData.baggageNotes}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1b2a32]" 
                                />
                                <span className="text-[10px] text-gray-400 mt-1 block">اختياري</span>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className={`${loading ? "cursor-not-allowed" : "cursor-pointer"} mt-6 bg-[#1b2a32] text-white px-6 py-3.5 w-full rounded-xl font-semibold text-sm hover:bg-opacity-90 transition-colors shadow-sm`}
                            >
                                {loading ? "جاري  ارسال الطلب..." : "ارسال الطلب"}
                            </button>
                        </div>

                    </div>
                </form>

            </div>

            {/* نافذة رسالة النجاح في منتصف الشاشة */}
            {successModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl text-center flex flex-col items-center animate-in fade-in zoom-in duration-200">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-extrabold text-[#1b2a32] mb-2">تم تسجيل البيانات بنجاح</h3>
                        <p className="text-sm text-gray-600 leading-relaxed mb-6">
                            يرجى مراجعة الريسيبشن للدفع من أجل تثبيت الحجز.
                        </p>
                        <button 
                            onClick={() => setSuccessModal(false)}
                            className="w-full bg-[#1b2a32] text-white py-3 rounded-xl font-bold text-sm hover:bg-opacity-95 transition-colors"
                        >
                            حسناً، فهمت
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerForm;