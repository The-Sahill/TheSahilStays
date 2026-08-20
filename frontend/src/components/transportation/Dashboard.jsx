import React, { useState, useEffect } from 'react';
import { Bell, ChevronDown, Search, FileText, DollarSign, Building2, Users, ArrowRight, Star, CornerDownLeft, Plus } from 'lucide-react';
import Header from './Header';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // تأكد من أن الـ Route في الباك إند هو GET /dashboardData بدون أي معاملات إضافية
    fetch(`${apiUrl}/dashboardData`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDashboardData(data.data);
          console.log("data",data.data)
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);
        setLoading(false);
      });
  }, []);

  const data = dashboardData || {
    requestsCont: 0,
    financialEntitlements: 0,
    financialCost: 0,
    financialProfit: 0,
    financialRate: 0,
    carTotal: 0,
    vanTotal: 0,
    statusCounts: { pending: 0, approved: 0, completed: 0, rejected: 0, cancelled: 0 },
    latestReviews: []
  };

  return (
    <div className="min-h-screen bg-[#fbfaf6] text-[#1b2a32] font-sans">
      <Header />

      <main className="max-w-[1600px] mx-auto p-6 md:p-10 grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* العمود الأوسط */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          
          <section>
            <p className="text-xs font-bold text-yellow-600 tracking-wider uppercase mb-2">
              {new Date().toLocaleDateString("ar-JO", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <h1 className="text-5xl font-extrabold text-[#1b2a32] mb-3">نظرة سريعة على المكتب.</h1>
            <p className="text-gray-600 mb-8 max-w-2xl">قراءة هادئة لوصول اليوم، التزامات الشركاء، وتجربة الضيوف.</p>
          </section>

          {/* بطاقات الإحصائيات */}
          <section className="flex flex-wrap gap-6">
            <div className="bg-[#f6e0bc] p-6 rounded-3xl flex-1 min-w-[240px]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm font-medium text-yellow-900 opacity-80 mb-1">إجمالي الطلبات</p>
                  <p className="text-4xl font-semibold text-[#1b2a32]">{data.requestsCont}</p>
                </div>
                <div className="p-2.5 rounded-full bg-[#e5b667]">
                  <FileText className="w-5 h-5 text-yellow-900" strokeWidth={2.5} />
                </div>
              </div>
              <p className="text-sm text-yellow-900 font-medium">{data.statusCounts.pending} طلب بانتظار الشريك</p>
            </div>

            <div className="bg-white p-6 rounded-3xl flex-1 min-w-[240px]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 opacity-80 mb-1">الإيرادات هذه الفترة</p>
                  <p className="text-4xl font-semibold text-[#1b2a32]">${data.financialEntitlements.toFixed(2)}</p>
                </div>
                <div className="p-2.5 rounded-full bg-gray-100">
                  <DollarSign className="w-5 h-5 text-gray-500" strokeWidth={2.5} />
                </div>
              </div>
              <p className="text-sm text-gray-500 font-medium">${data.financialCost.toFixed(2)} مدفوعة للشركات</p>
            </div>

            <div className="bg-[#e0eae5] p-6 rounded-3xl flex-1 min-w-[240px]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm font-medium text-emerald-900 opacity-80 mb-1">ربح الفندق</p>
                  <p className="text-4xl font-semibold text-[#1b2a32]">${data.financialProfit.toFixed(2)}</p>
                </div>
                <div className="p-2.5 rounded-full bg-[#c8dcd1]">
                  <Building2 className="w-5 h-5 text-emerald-900" strokeWidth={2.5} />
                </div>
              </div>
            
            </div>

            <div className="bg-white p-6 rounded-3xl flex-1 min-w-[240px]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 opacity-80 mb-1">انطباع النزلاء</p>
                  <p className="text-4xl font-semibold text-[#1b2a32]">{data.financialRate.toFixed(1)} / 5</p>
                </div>
                <div className="p-2.5 rounded-full bg-gray-100">
                  <Star className="w-5 h-5 text-gray-500" strokeWidth={2.5} />
                </div>
              </div>
              <p className="text-sm text-gray-500 font-medium">بناءً على التقييمات المستلمة</p>
            </div>
          </section>

          {/* مسار الطلبات */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-[#1b2a32]">مسار الطلبات</h2>
                <a href="#" className="text-sm text-[#1b2a32] font-semibold flex items-center gap-1.5 hover:gap-2 transition-all">
                    عرض الكل <ArrowRight className="w-4 h-4 rotate-180" />
                </a>
            </div>
            <p className='text-sm text-gray-500 mb-6'>كل عملية تسليم، برؤية واضحة ومباشرة.</p>
            <div className="space-y-4 mb-8">
              {[
                { label: "بانتظار الموافقة", val: data.statusCounts.pending, col: "bg-[#e5b667]", comp: true },
                { label: "تمت الموافقة", val: data.statusCounts.approved, col: "bg-[#1b2a32]", comp: true },
                { label: "مكتمل", val: data.statusCounts.completed, col: "bg-[#1b2a32]", comp: true },
                { label: "مرفوض", val: data.statusCounts.rejected, col: "bg-red-500", comp: false },
                { label: "ملغي", val: data.statusCounts.cancelled, col: "bg-gray-300", comp: false }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 text-sm">
                  <div className="w-36 text-[#1b2a32] font-medium">{item.label}</div>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.col} rounded-full`} style={{ width: data.requestsCont > 0 ? `${(item.val / data.requestsCont) * 100}%` : '0%' }} />
                  </div>
                  <div className={`w-10 text-right font-semibold ${item.comp ? 'text-[#1b2a32]' : 'text-gray-500'}`}>{item.val}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-6 border-t border-gray-100 pt-8 text-center">
              <div>
                <p className="text-4xl font-semibold text-[#1b2a32] mb-1.5">{data.statusCounts.completed}</p>
                <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">مكتمل</p>
              </div>
              <div>
                <p className="text-4xl font-semibold text-[#1b2a32] mb-1.5">{data.statusCounts.pending}</p>
                <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">بانتظار الموافقة</p>
              </div>
              <div>
                <p className="text-4xl font-semibold text-[#1b2a32] mb-1.5">{data.statusCounts.cancelled}</p>
                <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">ملغي</p>
              </div>
            </div>
          </section>
        </div>

        {/* العمود الأيمن */}
        <div className="flex flex-col gap-8">
          
        <section className="bg-[#1b2a32] text-white p-8 rounded-3xl">
  <div className="flex justify-between items-center mb-10">
    <h3 className="text-xl font-bold text-white">الملخص المالي العام</h3>
    <DollarSign className="w-6 h-6 text-yellow-400" strokeWidth={2.5} />
  </div>
  
  <p className="text-5xl font-semibold text-white mb-2">
    ${data.financialProfit.toFixed(2)}
  </p>
  
  <p className="text-yellow-300 font-medium mb-12">إجمالي الأرباح المحققة</p>
  
  <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
    <p className="text-white leading-relaxed mb-6">
      رؤية شاملة للتدفقات المالية والإيرادات، لإدارة أدق وأكثر مرونة لعمليات الفندق.
    </p>
    
    <a 
      href="#" 
      onClick={(e) => {
        e.preventDefault();
        setPage('Financial'); // الانتقال التلقائي للقسم المالي إذا كنت تستخدم نظام التنقل الخاص بك
      }}
      className="text-yellow-400 font-semibold flex items-center gap-1.5 hover:gap-2 transition-all cursor-pointer"
    >
       القسم المالي 
    </a>
  </div>
</section>

          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-[#1b2a32]">المركبات قيد الحركة</h3>
              <Building2 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-6">
              {[
                { name: "سيارة عادية", count: data.carTotal },
                { name: "فان", count: data.vanTotal }
              ].map((veh, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <div className='p-2.5 rounded-xl bg-gray-100'>
                          <Building2 className='w-6 h-6 text-[#1b2a32]'/>
                      </div>
                    <div>
                      <p className="font-semibold text-[#1b2a32]">{veh.name}</p>
                      <p className="text-sm text-gray-500">{veh.count} طلبات</p>
                    </div>
                  </div>
                  <div className="w-40 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1b2a32] rounded-full" style={{ width: data.requestsCont > 0 ? `${(veh.count / data.requestsCont) * 100}%` : '0%' }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-[#1b2a32]">ملاحظات النزلاء الأخيرة</h3>
              <Star className="w-5 h-5 text-gray-400" />
            </div>
            <p className='text-sm text-gray-500 mb-8'>كلمات صغيرة، إشارات مفيدة.</p>
            <div className="space-y-8">
              {data.latestReviews && data.latestReviews.length > 0 ? (
                data.latestReviews.map((rev, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <img src={`https://api.dicebear.com/8.x/avataaars/svg?seed=${rev.guestName || 'guest'}`} alt="avatar" className="w-10 h-10 rounded-full bg-gray-100" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className="font-semibold text-[#1b2a32]">{rev.guestName || 'نزيل'}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < rev.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{rev.review}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">لا توجد تقييمات متاحة حالياً.</p>
              )}
            </div>
          </section>

        </div>

      </main>
    </div>
  );
}