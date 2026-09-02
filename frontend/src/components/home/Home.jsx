
import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import { 
  Wrench, 
  Shirt, 
  Road, 
  ArrowLeft, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Layers,
  Warehouse ,
  Star ,
  Logs 
} from 'lucide-react';

const systems = [
  // {
  //   id: 'maintenance',
  //   title: 'نظام الاصلاحات',
  //   description: 'متابعة كميات المخزون و ادارة الطلبات و المشتريات و متابعة الموردين.',
  //   icon: <Wrench className="w-6 h-6 text-blue-600" />,
  //   href: '/maintenance',
  //   gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
  //   borderColor: 'hover:border-blue-500/50',
  //   badge: 'نشط',
  //   badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  //   stats: '12 طلب جديد'
  // },
  {
    id: 'dry-clean',
    title: 'نظام الدراي كلين ',
    description: 'إدارة دورة حياة الغسيل، استلام وتسليم العملاء، وتتبع الحالة  بدقة.',
    icon: <Shirt className="w-6 h-6 text-green-600" />,
    href: '/Dashboard/dry-clean',
    gradient: 'from-green-500/10 via-green-500/5 to-transparent',
    borderColor: 'hover:border-green-500/50',
    badge: 'نشط',
    badgeColor: 'bg-green-50 text-green-700 border-green-200',
    stats: '45 قطعة اليوم'
  },
  {
    id: 'transportation',
    title: 'نظام التوصيل ',
    description: 'ادارة الرحلات من و الى المطار و تتبع الطلبات وادارة الامور المالية',
    icon: <Road className="w-6 h-6 text-amber-600" />,
    href: '/Dashboard/transportation',
    gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
    borderColor: 'hover:border-amber-500/50',
    badge: 'سريع',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    id: 'store',
    title: 'نظام المخزن ',
    description: 'ادارة المخزن و تتبع كميات العناصر ',
    icon: <Warehouse  className="w-6 h-6 text-red-600" />,
    href: '/StoreManagement',
    gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
    borderColor: 'hover:border-amber-500/50',
    badge: 'سريع',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },

  {
    id: 'guestReview',
    title: 'نظام تقييم النزلاء ',
    description: 'ادارة التقييمات       ',
    icon: <Star   className="w-6 h-6 text-yellow-600" />,
    href: '/guestReview',
    gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
    borderColor: 'hover:border-amber-500/50',
    badge: 'سريع',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },

  {
    id: 'hotelReview',
    title: 'نظام تقييم الاوتيل ',
    description: 'ادارة التقييمات و معرفة اراء النزلاء   ',
    icon: <Star   className="w-6 h-6 text-yellow-600" />,
    href: '/hotelReview',
    gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
    borderColor: 'hover:border-amber-500/50',
    badge: 'سريع',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },

  {
    id: 'Orders',
    title: 'نظام  طلبات النزلاء ',
    description: 'ادارة طلبات    النزلاء   ',
    icon: <Logs    className="w-6 h-6 text-emerald-600" />,
    href: '/AdminUsersRequests',
    gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
    borderColor: 'hover:border-amber-500/50',
    badge: 'سريع',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  
];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSystems = systems.filter(sys => 
    sys.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sys.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between relative overflow-hidden" dir="rtl">
      
      {/* خلفية جمالية (Glow Effects) */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* المحتوى الرئيسي */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full">
        
        {/* الهيدر والترحيب */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-800 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>منصة الإدارة الموحدة</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              لوحة التحكم المركزية kfsdsafsdfsad
            </h1>
            <p className="mt-2 text-slate-400 text-base sm:text-lg">
              اختر النظام الفرعي الذي تود إدارته والانتقال إليه مباشرة.
            </p>
          </div>

          {/* شريط البحث السريع داخل المنصة */}
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="ابحث عن نظام..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* شبكة الأنظمة (Grid Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSystems.map((system) => (
            <Link
              key={system.id}
              to={system.href}
              className={`group relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 ${system.borderColor} flex flex-col justify-between overflow-hidden`}
            >
              {/* تدرج خلفي خفيف عند الـ Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${system.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

              <div>
                {/* رأس البطاقة (الأيقونة والـ Badge) */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    {system.icon}
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${system.badgeColor}`}>
                    {system.badge}
                  </span>
                </div>

                {/* العنوان والتفاصيل */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors relative z-10">
                  {system.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 relative z-10">
                  {system.description}
                </p>
              </div>

              {/* أسفل البطاقة (الإحصائية وزر الدخول) */}
              <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between relative z-10">
              
                
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
                  <span>فتح النظام</span>
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* رسالة في حال لم يتم العثور على نتائج للبحث */}
        {filteredSystems.length === 0 && (
          <div className="text-center py-16 bg-slate-800/20 border border-slate-800 rounded-2xl">
            <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-lg">لم يتم العثور على أي نظام مطابق لبحثك.</p>
          </div>
        )}

      </div>

      {/* الفوتر السفلي */}
      <footer className="border-t border-slate-800/80 bg-slate-900/50 py-6 text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة - منصة الإدارة الموحدة</p>
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>بيئة آمنة ومحمية للصلاحيات</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;