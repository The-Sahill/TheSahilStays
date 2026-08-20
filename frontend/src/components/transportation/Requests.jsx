import React, { useEffect, useState, useMemo } from 'react';
import { Bell, ChevronDown, Search, Plus, ArrowLeft, X, Upload, Send, CheckCircle2, Plane, Calendar, Clock, Users, Car, CreditCard, Star, ChevronRight, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_BACKEND_URL;
 
export default function Requests() {
  const [loading, setLoading] = useState(false);
  const [requestsData, setRequestsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // عدد العناصر في كل صفحة

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

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
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">{status || 'غير محدد'}</span>;
    }
  };

  const getRequests = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/`, { withCredentials: true });
      if (data.success === true) {
        setRequestsData(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  const createRequest = async () => {
    try {
      setLoading(true)
      const { data } = await axios.post(`${apiUrl}/createRequest`, formData, { withCredentials: true });
      if (data.success === true) {
        toast.success(data.message);
        setLoading(false)
        setIsModalOpen(false);
        getRequests(); // إعادة جلب البيانات لتحديث الجدول
      }
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ أثناء إنشاء الطلب");
      setLoading(false)
    }
  };

  // تصفية البيانات (Filtering) بناءً على البحث، الحالة، والمركبة
  const filteredRequests = useMemo(() => {
    return requestsData.filter(item => {
      const matchesSearch = 
        (item.guestName && item.guestName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item._id && item._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.transferType && item.transferType.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      
      const matchesVehicle = vehicleFilter === 'all' || 
        (vehicleFilter === 'car' && item.vehicle && item.vehicle.includes('سيارة')) ||
        (vehicleFilter === 'van' && item.vehicle && item.vehicle.includes('فان')) ||
        (item.vehicle === vehicleFilter);

      return matchesSearch && matchesStatus && matchesVehicle;
    });
  }, [requestsData, searchTerm, statusFilter, vehicleFilter]);

  // حساب البيانات الخاصة بالصفحة الحالية (Pagination)
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage) || 1;
  const currentTableData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(start, start + itemsPerPage);
  }, [filteredRequests, currentPage]);

  // إعادة الصفحة إلى 1 عند تغيير الفلاتر أو البحث
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, vehicleFilter]);

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
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none cursor-pointer flex-1 md:flex-initial"
            >
              <option value="all">جميع الحالات</option>
              <option value="مكتمل">مكتمل</option>
              <option value="بانتظار الموافقة">بانتظار الموافقة</option>
              <option value="ملغي">ملغي</option>
              <option value="تمت الموافقة">تمت الموافقة</option>
              <option value="مرفوض">مرفوض</option>
            </select>

            <select 
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none cursor-pointer flex-1 md:flex-initial"
            >
              <option value="all">جميع المركبات</option>
              <option value="car">سيارة عادية</option>
              <option value="van">فان</option>
            </select>
          </div>
        </div>

        {/* الجدول (Requests Table) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-4 bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-400 tracking-wider">
            <div className="col-span-3">النزيل والطلب</div>
            <div className="col-span-2">الرحلة والموعد</div>
            <div className="col-span-3">المركبة</div>
            <div className="col-span-2">حالة الرحلة</div>
            <div className="col-span-2">حالة الدفع</div>
          </div>

          <div className="divide-y divide-gray-100">
            {currentTableData.length > 0 ? (
              currentTableData.map((item, index) => (
                <div 
                  key={index} 
                  onClick={() => setSelectedRequest(item)}
                  className="grid grid-cols-12 px-6 py-5 items-center hover:bg-gray-50/80 transition-colors cursor-pointer group"
                >
                  <div className="col-span-3 flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#1b2a32]">{item.guestName}</span>
                    </div>
                    <span className="text-xs text-gray-500 mt-0.5">{item.transferType}</span>
                  </div>

                  <div className="col-span-2 flex flex-col">
                    <span className="font-medium text-[#1b2a32] text-sm">
                
    {item.travelDate ? item.travelDate.split('T')[0] : ''}
                    </span>
                    <span className="text-xs text-gray-400 mt-0.5">{item.transferTime}</span>
                  </div>

                  <div className="col-span-3 flex flex-col">
                    <span className="font-medium text-[#1b2a32] text-sm">{item.vehicle}</span>
                    <span className="text-xs text-gray-400 mt-0.5">الركاب: {item.passengers} </span>
                  </div>

                  <div className="col-span-2 flex items-center justify-between">
                    <div>{getStatusBadge(item.status)}</div>
                    
                  </div>
                  <div className="col-span-2 flex items-center justify-between">
                    <div className={`${item.paymentStatus == "تم الدفع" ? "px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800" : "px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800"}`}>{item.paymentStatus}</div>
                    <ArrowLeft className="w-4 h-4 text-gray-300 group-hover:text-[#1b2a32] transition-colors" />
                  </div>
                  
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-400 text-sm">
                لا توجد طلبات مطابقة للبحث أو الفلترة
              </div>
            )}
          </div>
        </div>

        {/* أزرار التنقل بين الصفحات (Pagination Controls) */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" /> السابق
            </button>
            <span className="text-sm font-medium text-gray-600">
              صفحة <span className="font-bold text-[#1b2a32]">{currentPage}</span> من <span className="font-bold text-[#1b2a32]">{totalPages}</span>
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              التالي <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

      </main>

      {/* نافذة تفاصيل الطلب (Details Modal) */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center overflow-y-auto p-4 md:p-8">
          <div className="bg-[#fbfaf6] w-full max-w-[1300px] rounded-3xl shadow-2xl p-6 md:p-10 relative max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => setSelectedRequest(null)}
              className="absolute top-6 left-6 p-2 rounded-full bg-gray-200/60 hover:bg-gray-200 text-[#1b2a32] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <button 
              onClick={() => setSelectedRequest(null)}
              className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#1b2a32] mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> كل الطلبات
            </button>

            <div className="flex flex-wrap items-center gap-4 mb-2">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1b2a32]">{selectedRequest.guestName}</h2>
              {getStatusBadge(selectedRequest.status)}
              <Link to={`/Rate/${selectedRequest._id}`}>
              <button className='bg-amber-100/70 text-amber-800 px-3 py-1 rounded-full'>تقييم</button>
              </Link>
            </div>
            <p className="text-xs text-gray-400 mb-8">



              
             {selectedRequest.createdAt ? new Date(selectedRequest.createdAt).toLocaleDateString('EG', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }) + ' - ' + new Date(selectedRequest.createdAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                }) : ''}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200/60 shadow-sm relative">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">ملخص الرحلة</p>
                      <h3 className="text-2xl font-bold text-[#1b2a32]">{selectedRequest.transferType}</h3>
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
                        <span className="text-sm font-bold text-[#1b2a32]">
                       
    {selectedRequest.travelDate ? selectedRequest.travelDate.split('T')[0] : ''}

                        </span>
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
                        <span className="block text-[10px] font-bold text-gray-400 uppercase">الرحلة </span>
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
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <span className="block text-[10px] font-bold text-gray-400 uppercase">طريقة الحجز</span>
                        <span className="text-sm font-bold text-[#1b2a32]">{selectedRequest.method}</span>
                      </div>

                   
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-6">
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
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 left-6 p-2 rounded-full bg-gray-200/60 hover:bg-gray-200 text-[#1b2a32] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-8">
              <p className="text-xs font-bold text-yellow-600 tracking-wider uppercase mb-1">طلب نقل جديد</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1b2a32] mb-2">اجعل الرحلة تبدأ حركة.</h2>
              <p className="text-sm text-gray-600">سجل التفاصيل مرة واحدة. سيتلقى شريكك ملخصاً واضحاً وكاملاً.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-12 flex flex-col gap-6">
                
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
                      <label className="block text-xs font-semibold text-gray-600 mb-2">طريقة الحجز</label>
                      <select 
                        name="method" 
                        value={formData.method}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#1b2a32]"
                      >
                        <option value="Reception">Reception</option>
                        <option value="Booking">Booking</option>
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
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1b2a32]" 
                      />
                    </div>
                  </div>
                </div>

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

                  <button disabled={loading} onClick={createRequest} className={`${loading ? "cursor-not-allowed" : "cursor-pointer"} mt-5 bg-black text-white px-5 py-3 w-full rounded-md font-semibold`}>
                  {loading ? "جاري انشاء الطلب...." : "انشاء طلب"}
                  
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}