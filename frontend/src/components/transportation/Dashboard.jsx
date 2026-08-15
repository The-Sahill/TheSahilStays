import React from 'react';
import { Bell, ChevronDown, Search, FileText, DollarSign, Building2, Users, ArrowRight, Star, CornerDownLeft, Plus } from 'lucide-react';
import Header from './Header';

// --- مكونات فرعية (Sub-components) مضمنة للتسهيل ---

const StatCard = ({ title, value, change, icon: Icon, bgColor, textColor, iconColor }) => (
  <div className={`${bgColor} p-6 rounded-3xl flex-1 min-w-[240px]`}>
    <div className="flex justify-between items-start mb-6">
      <div>
        <p className={`text-sm font-medium ${textColor} opacity-80 mb-1`}>{title}</p>
        <p className="text-4xl font-semibold text-[#1b2a32]">{value}</p>
      </div>
      <div className={`p-2.5 rounded-full ${iconColor}`}>
        <Icon className="w-5 h-5" strokeWidth={2.5} />
      </div>
    </div>
    <p className={`text-sm ${textColor} font-medium`}>{change}</p>
  </div>
);

const PipelineBar = ({ label, value, total, color, isCompleted }) => (
  <div className="flex items-center gap-4 text-sm">
    <div className="w-36 text-[#1b2a32] font-medium">{label}</div>
    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} rounded-full`}
        style={{ width: `${(value / total) * 100}%` }}
      />
    </div>
    <div className={`w-10 text-right font-semibold ${isCompleted ? 'text-[#1b2a32]' : 'text-gray-500'}`}>{value}</div>
  </div>
);

const VehicleItem = ({ name, requests }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
        <div className='p-2.5 rounded-xl bg-gray-100'>
            <Building2 className='w-6 h-6 text-[#1b2a32]'/>
        </div>
      <div>
        <p className="font-semibold text-[#1b2a32]">{name}</p>
        <p className="text-sm text-gray-500">{requests} طلبات</p>
      </div>
    </div>
    <div className="w-40 h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div className="h-full bg-[#1b2a32] rounded-full" style={{ width: `${(requests / 6) * 100}%` }} />
    </div>
  </div>
);

const GuestNote = ({ name, id, note, rating }) => (
  <div className="flex gap-4 items-start">
    <img src={`https://api.dicebear.com/8.x/avataaars/svg?seed=${name}`} alt={name} className="w-10 h-10 rounded-full bg-gray-100" />
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <div>
          <span className="font-semibold text-[#1b2a32]">{name}</span>
          <span className="text-xs text-gray-400 mr-2">{id}</span>
        </div>
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{note}</p>
    </div>
  </div>
);

// --- المكون الرئيسي ---

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#fbfaf6] text-[#1b2a32] font-sans">
      {/* الشريط العلوي */}
    <Header />

      {/* المحتوى الرئيسي */}
      <main className="max-w-[1600px] mx-auto p-6 md:p-10 grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* العمود الأوسط (البطاقات الرئيسية + Pipeline) */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          
          {/* قسم النظرة العامة */}
          <section>
            <p className="text-xs font-bold text-yellow-600 tracking-wider uppercase mb-2">الخميس، 13 أغسطس 2026</p>
            <h1 className="text-5xl font-extrabold text-[#1b2a32] mb-3">نظرة سريعة على المكتب.</h1>
            <p className="text-gray-600 mb-8 max-w-2xl">قراءة هادئة لوصول اليوم، التزامات الشركاء، وتجربة الضيوف.</p>
            <button className="flex items-center gap-2 bg-[#1b2a32] text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-lg">
                <Plus className="w-5 h-5" /> نقل جديد
            </button>
          </section>

          {/* بطاقات الإحصائيات */}
          <section className="flex flex-wrap gap-6">
            <StatCard title="إجمالي الطلبات" value="6" change="طلب واحد بانتظار الشريك" icon={FileText} bgColor="bg-[#f6e0bc]" textColor="text-yellow-900" iconColor="bg-[#e5b667]" />
            <StatCard title="الإيرادات هذه الفترة" value="$253.00" change="$20.00 مدفوعة للشركات" icon={DollarSign} bgColor="bg-white" textColor="text-gray-500" iconColor="bg-gray-100" />
            <StatCard title="ربح الفندق" value="$113.00" change="$120.00 بانتظار التسوية" icon={Building2} bgColor="bg-[#e0eae5]" textColor="text-emerald-900" iconColor="bg-[#c8dcd1]" />
            <StatCard title="انطباع النزلاء" value="4.5 / 5" change="تم استلام تقييمين للنزلاء" icon={Star} bgColor="bg-white" textColor="text-gray-500" iconColor="bg-gray-100" />
          </section>

          {/* قسم مسار الطلب */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-[#1b2a32]">مسار الطلبات</h2>
                <a href="#" className="text-sm text-[#1b2a32] font-semibold flex items-center gap-1.5 hover:gap-2 transition-all">
                    عرض الكل <ArrowRight className="w-4 h-4 rotate-180" />
                </a>
            </div>
            <p className='text-sm text-gray-500 mb-6'>كل عملية تسليم، برؤية واضحة ومباشرة.</p>
            <div className="space-y-4 mb-8">
              <PipelineBar label="بانتظار الموافقة" value={6} total={6} color="bg-[#e5b667]" isCompleted />
              <PipelineBar label="تمت الموافقة" value={6} total={6} color="bg-[#1b2a32]" isCompleted />
              <PipelineBar label="مكتمل" value={2} total={6} color="bg-[#1b2a32]" isCompleted />
              <PipelineBar label="مرفوض" value={1} total={6} color="bg-red-500" />
              <PipelineBar label="ملغي" value={1} total={6} color="bg-gray-300" />
            </div>
            <div className="grid grid-cols-3 gap-6 border-t border-gray-100 pt-8 text-center">
              <div>
                <p className="text-4xl font-semibold text-[#1b2a32] mb-1.5">2</p>
                <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">مكتمل</p>
              </div>
              <div>
                <p className="text-4xl font-semibold text-[#1b2a32] mb-1.5">6</p>
                <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">بانتظار الموافقة</p>
              </div>
              <div>
                <p className="text-4xl font-semibold text-[#1b2a32] mb-1.5">1</p>
                <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">ملغي</p>
              </div>
            </div>
          </section>
        </div>

        {/* العمود الأيمن (Partner Payments + Vehicles + Notes) */}
        <div className="flex flex-col gap-8">
          {/* بطاقة مدفوعات الشركاء */}
          <section className="bg-[#1b2a32] text-white p-8 rounded-3xl">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-bold text-white">مدفوعات الشركاء</h3>
              <DollarSign className="w-6 h-6 text-yellow-400" strokeWidth={2.5} />
            </div>
            <p className="text-5xl font-semibold text-white mb-2">$120.00</p>
            <p className="text-yellow-300 font-medium mb-12">بانتظار التسوية</p>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <p className='text-white leading-relaxed mb-6'>ابق على قُرب من شركائك. مكتب الدفع المرتب يجعل كل وصول يبدو سهلاً.</p>
                <a href="#" className="text-yellow-400 font-semibold flex items-center gap-1.5 hover:gap-2 transition-all">
                    فتح القسم المالي <ArrowRight className="w-4 h-4 rotate-180" />
                </a>
            </div>
          </section>

          {/* بطاقة المركبات قيد الحركة */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-[#1b2a32]">المركبات قيد الحركة</h3>
              <Building2 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-6">
              <VehicleItem name="سيارة عادية" requests={4} />
              <VehicleItem name="فان" requests={2} />
            </div>
          </section>

          {/* بطاقة ملاحظات النزلاء الأخيرة */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-[#1b2a32]">ملاحظات النزلاء الأخيرة</h3>
              <Star className="w-5 h-5 text-gray-400" />
            </div>
            <p className='text-sm text-gray-500 mb-8'>كلمات صغيرة، إشارات مفيدة.</p>
            <div className="space-y-8">
              <GuestNote name="Elena Rossi" id="TR-1040" note="استقبال سلس وسائق لطيف للغاية." rating={5} />
              <GuestNote name="Daniel Okafor" id="TR-1039" note="خدمة رائعة، لكن كان من الصعب بعض الشيء العثور على مكان الوصول." rating={4} />
            </div>
          </section>
        </div>

      </main>
    </div>
  );
}