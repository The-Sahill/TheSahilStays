import React, { useState } from 'react';
import { Bell, ChevronDown, Search, Plus, ArrowLeft, X, Upload, Send, CheckCircle2, Plane, Calendar, Clock, Users, Car, CreditCard, Star } from 'lucide-react';

const initialRequestsData = [
  { id: 'TR-1039', name: 'دانيال أوكافور', type: 'استقبال من المطار - أورلي (ORY)', date: '12 أغسطس 2026', time: '07:30', vehicle: 'سيارة عادية', passengers: '3 ركاب', status: 'مكتمل', provider: 'أطلس للتنقل', flight: 'BA 304', guestPrice: '$40.00', partnerCost: '$20.00', profit: '$20.00', paymentStatus: 'غير مدفوع', rating: 4, review: 'خدمة رائعة، ولكن كان من الصعب بعض الشيء العثور على نقطة الوصول.' },
  { id: 'TR-1042', name: 'صوفيا لوران', type: 'استقبال من المطار - شارل ديغول (CDG)', date: '14 أغسطس 2026', time: '09:45', vehicle: 'سيارة عادية', passengers: '2 ركاب', status: 'بانتظار الموافقة', provider: 'أطلس للتنقل', flight: 'AF 112', guestPrice: '$40.00', partnerCost: '$20.00', profit: '$20.00', paymentStatus: 'غير مدفوع', rating: 5, review: 'ممتاز جداً.' },
  { id: 'TR-1037', name: 'آرثر بينيت', type: 'استقبال من المطار - شارل ديغول (CDG)', date: '16 أغسطس 2026', time: '20:50', vehicle: 'سيارة عادية', passengers: '2 ركاب', status: 'ملغي', provider: 'سكايلاين للتنقل', flight: 'EZ 554', guestPrice: '$35.00', partnerCost: '$18.00', profit: '$17.00', paymentStatus: 'مسترد', rating: 3, review: 'تم إلغاء الرحلة لظروف طارئة.' },
  { id: 'TR-1041', name: 'ماركوس تشين', type: 'توصيل إلى المطار - شارل ديغول (CDG)', date: '14 أغسطس 2026', time: '16:20', vehicle: 'فان', passengers: '4 ركاب', status: 'تمت الموافقة', provider: 'سكايلاين للتنقل', flight: 'LH 920', guestPrice: '$60.00', partnerCost: '$35.00', profit: '$25.00', paymentStatus: 'مدفوع', rating: 5, review: 'سائق محترف ومركبة واسعة.' },
  { id: 'TR-1038', name: 'هانا سوزوكي', type: 'توصيل إلى المطار - شارل ديغول (CDG)', date: '15 أغسطس 2026', time: '05:15', vehicle: 'فان', passengers: '5 ركاب', status: 'مرفوض', provider: 'نورثستار رايدز', flight: 'JL 401', guestPrice: '$65.00', partnerCost: '$40.00', profit: '$25.00', paymentStatus: 'غير مدفوع', rating: 1, review: 'تم الرفض لعدم توفر سيارات.' },
  { id: 'TR-1040', name: 'إيلينا روسي', type: 'استقبال من المطار - أورلي (ORY)', date: '13 أغسطس 2026', time: '11:10', vehicle: 'سيارة عادية', passengers: 'راكب واحد', status: 'مكتمل', provider: 'نورثستار رايدز', flight: 'AZ 322', guestPrice: '$35.00', partnerCost: '$18.00', profit: '$17.00', paymentStatus: 'مدفوع', rating: 4, review: 'تجربة جيدة جداً.' },
];

export default function Requests() {
  const [requestsData, setRequestsData] = useState(initialRequestsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // حقول نموذج الطلب الجديد
  const [formData, setFormData] = useState({
    guestName: '',
    mobileNumber: '',
    transferType: 'استقبال من المطار',
    airport: 'مطار دبلن (DUB)',
    travelDate: '',
    transferTime: '',
    flightNumber: '',
    passengers: '1',
    bags: '0',
    baggageSize: 'صغير',
    baggageNotes: '',
    vehicle: 'سيارة عادية',
    partner: 'أطلس للتنقل',
    price: '40'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newRequest = {
      id: `TR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.guestName || 'ضيف جديد',
      type: `${formData.transferType} - ${formData.airport}`,
      date: formData.travelDate || '18 أغسطس 2026',
      time: formData.transferTime || '12:00',
      vehicle: formData.vehicle,
      passengers: `${formData.passengers} ركاب`,
      status: 'بانتظار الموافقة',
      provider: formData.partner,
      flight: formData.flightNumber || 'EI 0612',
      guestPrice: `$${formData.price}.00`,
      partnerCost: '$20.00',
      profit: '$20.00',
      paymentStatus: 'غير مدفوع',
      rating: 5,
      review: 'طلب جديد تم إنشاؤه عبر النظام.'
    };

    setRequestsData([newRequest, ...requestsData]);
    setIsModalOpen(false);
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
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fbfaf6] text-[#1b2a32] font-sans">
      
      {/* الشريط العلوي */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <nav className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2 font-medium text-sm">
              <span className='text-gray-400'>مساحة العمل /</span> طلبات النقل
            </div>
            <div className="font-bold text-lg">صباح الخير، مايا</div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-gray-50 text-gray-500 relative">
              <Bell className="w-5 h-5" />
              <span className='absolute top-1.5 left-1.5 w-2 h-2 bg-yellow-400 rounded-full border-2 border-white'/>
            </button>
            <button className="flex items-center gap-2.5 pr-3 pl-1.5 py-1.5 rounded-full hover:bg-gray-50 border border-gray-100">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Maya" className="w-8 h-8 rounded-full" />
              <span className="font-semibold text-sm">مايا سينغ</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </nav>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="max-w-[1600px] mx-auto p-6 md:p-10 flex flex-col gap-8">
        
        {/* العنوان والوصف وزر الإضافة */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-yellow-600 tracking-wider uppercase mb-2">طلبات النقل</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1b2a32] mb-3">اجعل كل عملية تسليم واضحة.</h1>
            <p className="text-gray-600 max-w-2xl">ابحث في مكتب الطلبات الحية، قم بالتصفية حسب العمل الذي يتطلب اهتمامك، وافتح سجلاً للقصة كاملة.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#1b2a32] text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-lg shrink-0"
          >
            <Plus className="w-5 h-5" /> طلب جديد
          </button>
        </div>

        {/* شريط البحث والفلاتر */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-[500px]">
            <Search className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="ابحث عن نزيل، معرف الطلب، أو الرحلة..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1b2a32] text-sm"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none cursor-pointer flex-1 md:flex-initial">
              <option value="all">جميع الحالات</option>
              <option value="completed">مكتمل</option>
              <option value="pending">بانتظار الموافقة</option>
              <option value="cancelled">ملغي</option>
            </select>

            <select className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none cursor-pointer flex-1 md:flex-initial">
              <option value="all">جميع المركبات</option>
              <option value="car">سيارة عادية</option>
              <option value="van">فان</option>
            </select>
          </div>
        </div>

        {/* الجدول (Requests Table) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-4 bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-400 tracking-wider">
            <div className="col-span-4">النزيل والطلب</div>
            <div className="col-span-3">الرحلة والموعد</div>
            <div className="col-span-3">المركبة</div>
            <div className="col-span-2">الحالة</div>
          </div>

          <div className="divide-y divide-gray-100">
            {requestsData
              .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((item, index) => (
              <div 
                key={index} 
                onClick={() => setSelectedRequest(item)}
                className="grid grid-cols-12 px-6 py-5 items-center hover:bg-gray-50/80 transition-colors cursor-pointer group"
              >
                <div className="col-span-4 flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#1b2a32]">{item.name}</span>
                    <span className="text-xs text-gray-400 font-mono">{item.id}</span>
                  </div>
                  <span className="text-xs text-gray-500 mt-0.5">{item.type}</span>
                </div>

                <div className="col-span-3 flex flex-col">
                  <span className="font-medium text-[#1b2a32] text-sm">{item.date}</span>
                  <span className="text-xs text-gray-400 mt-0.5">{item.time}</span>
                </div>

                <div className="col-span-3 flex flex-col">
                  <span className="font-medium text-[#1b2a32] text-sm">{item.vehicle}</span>
                  <span className="text-xs text-gray-400 mt-0.5">{item.passengers} • {item.provider}</span>
                </div>

                <div className="col-span-2 flex items-center justify-between">
                  <div>{getStatusBadge(item.status)}</div>
                  <ArrowLeft className="w-4 h-4 text-gray-300 group-hover:text-[#1b2a32] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* نافذة تفاصيل الطلب (Details Modal) */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center overflow-y-auto p-4 md:p-8">
          <div className="bg-[#fbfaf6] w-full max-w-[1300px] rounded-3xl shadow-2xl p-6 md:p-10 relative max-h-[90vh] overflow-y-auto">
            
            {/* زر إغلاق النافذة */}
            <button 
              onClick={() => setSelectedRequest(null)}
              className="absolute top-6 left-6 p-2 rounded-full bg-gray-200/60 hover:bg-gray-200 text-[#1b2a32] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* زر العودة والترويسة */}
            <button 
              onClick={() => setSelectedRequest(null)}
              className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#1b2a32] mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> كل الطلبات
            </button>

            <div className="flex flex-wrap items-center gap-4 mb-2">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1b2a32]">{selectedRequest.name}</h2>
              {getStatusBadge(selectedRequest.status)}
            </div>
            <p className="text-xs text-gray-400 mb-8">{selectedRequest.id} · تم الإنشاء 13 أغسطس 2026</p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* القسم الأيسر: ملخص الرحلة ومسار العمل */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* بطاقة ملخص الرحلة */}
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

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <span className="block text-[10px] font-bold text-gray-400 uppercase">تاريخ السفر</span>
                        <span className="text-sm font-bold text-[#1b2a32]">{selectedRequest.date}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <span className="block text-[10px] font-bold text-gray-400 uppercase">وقت الاستقبال</span>
                        <span className="text-sm font-bold text-[#1b2a32]">{selectedRequest.time}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Plane className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <span className="block text-[10px] font-bold text-gray-400 uppercase">الرحلة الجوية</span>
                        <span className="text-sm font-bold text-[#1b2a32]">{selectedRequest.flight}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 flex items-center justify-center text-gray-400 mt-0.5 font-bold">📍</span>
                      <div>
                        <span className="block text-[10px] font-bold text-gray-400 uppercase">المطار</span>
                        <span className="text-sm font-bold text-[#1b2a32]">{selectedRequest.type.includes('أورلي') ? 'أورلي (ORY)' : 'شارل ديغول (CDG)'}</span>
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
                  </div>
                </div>

                {/* بطاقة مسار العمل (Workflow) */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200/60 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">مسار العمل</p>
                      <h3 className="text-xl font-bold text-[#1b2a32]">متابعة التوصيل</h3>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">مباشر</span>
                  </div>

                  <div className="relative flex items-center justify-between max-w-2xl mx-auto py-6">
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 z-0"></div>
                    
                    <div className="flex flex-col items-center relative z-10">
                      <div className="w-8 h-8 rounded-full bg-[#1b2a32] text-white flex items-center justify-center shadow-md">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-gray-600 mt-2">إرسال الطلب</span>
                    </div>

                    <div className="flex flex-col items-center relative z-10">
                      <div className="w-8 h-8 rounded-full bg-[#1b2a32] text-white flex items-center justify-center shadow-md">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-gray-600 mt-2">قرار الشريك</span>
                    </div>

                    <div className="flex flex-col items-center relative z-10">
                      <div className="w-8 h-8 rounded-full bg-[#1b2a32] text-white flex items-center justify-center shadow-md">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-gray-600 mt-2">اكتمال الرحلة</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* القسم الأيمن: الأرقام وتقييم الضيف */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* بطاقة الأرقام المالية */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200/60 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">الأرقام المالية</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">سعر الضيف</span>
                      <span className="font-bold text-[#1b2a32]">{selectedRequest.guestPrice}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm pb-3 border-b border-gray-100">
                      <span className="text-gray-500">تكلفة الشريك</span>
                      <span className="font-bold text-[#1b2a32]">{selectedRequest.partnerCost}</span>
                    </div>
                    <div className="flex justify-between items-center text-base">
                      <span className="font-bold text-[#1b2a32]">ربح الفندق</span>
                      <span className="font-extrabold text-[#1b2a32]">{selectedRequest.profit}</span>
                    </div>
                  </div>

                  <div className="bg-gray-100/70 p-4 rounded-2xl flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                      <CreditCard className="w-4 h-4 text-gray-400" /> حالة الدفع
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                      {selectedRequest.paymentStatus}
                    </span>
                  </div>

                  <button className="w-full py-3 bg-[#cce0db] text-[#1b2a32] rounded-xl font-bold text-sm hover:bg-[#b8d4ce] transition-colors flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> تحديد الشريك كمدفوع
                  </button>
                </div>

                {/* بطاقة تقييم الضيف */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200/60 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">تقييم الضيف</p>
                  <div className="flex items-center gap-1 mb-3 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < selectedRequest.rating ? 'fill-current' : 'text-gray-200'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 italic mb-4">"{selectedRequest.review}"</p>
                  <span className="text-[10px] text-gray-400 block">{selectedRequest.date}</span>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* نافذة إنشاء طلب جديد (Modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-start overflow-y-auto p-4 md:p-10">
          <div className="bg-[#fbfaf6] w-full max-w-[1200px] rounded-3xl shadow-2xl p-6 md:p-10 relative my-auto">
            
            {/* زر إغلاق النافذة */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 left-6 p-2 rounded-full bg-gray-200/60 hover:bg-gray-200 text-[#1b2a32] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* رأس النموذج */}
            <div className="mb-8">
              <p className="text-xs font-bold text-yellow-600 tracking-wider uppercase mb-1">طلب نقل جديد</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1b2a32] mb-2">اجعل الرحلة تبدأ حركة.</h2>
              <p className="text-sm text-gray-600">سجل التفاصيل مرة واحدة. سيتلقى شريكك ملخصاً واضحاً وكاملاً.</p>
            </div>

            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* القسم الأيسر: المدخلات والبيانات */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* بطاقة: الضيف والرحلة */}
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
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1b2a32]" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">نوع النقل</label>
                      <select 
                        name="transferType" 
                        value={formData.transferType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#1b2a32]"
                      >
                        <option>استقبال من المطار</option>
                        <option>توصيل إلى المطار</option>
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
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1b2a32]" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">وقت النقل</label>
                      <input 
                        type="time" 
                        name="transferTime" 
                        value={formData.transferTime}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1b2a32]" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">رقم الرحلة</label>
                      <input 
                        type="text" 
                        name="flightNumber" 
                        placeholder="EI 0612" 
                        value={formData.flightNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1b2a32]" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">تذكرة الرحلة</label>
                      <label className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white cursor-pointer hover:bg-gray-50">
                        <span className="text-gray-400">اختر ملفاً...</span>
                        <Upload className="w-4 h-4 text-gray-500" />
                        <input type="file" className="hidden" />
                      </label>
                      <span className="text-[10px] text-gray-400 mt-1 block">JPG, PNG, or PDF - اختياري</span>
                    </div>
                  </div>
                </div>

                {/* بطاقة: الأمتعة والمركبة */}
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
                        <option>صغير</option>
                        <option>متوسط</option>
                        <option>كبير</option>
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
                </div>

              </div>

              {/* القسم الأيمن: بطاقة ملخص الإرسال */}
              <div className="lg:col-span-4">
                <div className="bg-[#1b2a32] text-white p-6 md:p-8 rounded-3xl sticky top-24 shadow-xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">اجعل الموافقة سهلة.</h3>
                    <p className="text-xs text-gray-300 leading-relaxed mb-8">
                      الطلب المحدد بالسعر والواضح يتم الموافقة عليه بشكل أسرع.
                    </p>

                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-2">نوع المركبة</label>
                        <select 
                          name="vehicle" 
                          value={formData.vehicle}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none cursor-pointer"
                        >
                          <option className="bg-[#1b2a32] text-white">سيارة عادية</option>
                          <option className="bg-[#1b2a32] text-white">فان</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-2">شركة الشريك</label>
                        <select 
                          name="partner" 
                          value={formData.partner}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none cursor-pointer"
                        >
                          <option className="bg-[#1b2a32] text-white">أطلس للتنقل</option>
                          <option className="bg-[#1b2a32] text-white">سكايلاين للتنقل</option>
                          <option className="bg-[#1b2a32] text-white">نورثستار رايدز</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-2">سعر الضيف</label>
                        <div className="relative">
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                          <input 
                            type="text" 
                            name="price" 
                            value={formData.price}
                            onChange={handleInputChange}
                            className="w-full pr-8 pl-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none" 
                          />
                        </div>
                        <span className="text-[11px] text-gray-400 mt-1.5 block">تسعير السيارة العادية: $35 - $40</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button 
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-[#e5b667] text-[#1b2a32] py-3.5 rounded-xl font-bold hover:bg-[#d8a95d] transition-colors shadow-lg"
                    >
                      <Send className="w-4 h-4" /> إرسال الطلب
                    </button>
                    <p className="text-[10px] text-center text-gray-400 mt-3">
                      يتم احتساب تكلفة الشريك من الشركة المعينة.
                    </p>
                  </div>

                </div>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}