import React from 'react';
import { LayoutDashboard, FileText, DollarSign, Building2 } from 'lucide-react';

export default function Sidebar({ setPage, page }) {
  const menuItems = [
    { id: 'Dashboard', label: 'نظرة عامة', icon: LayoutDashboard },
    { id: 'Requests', label: 'طلبات النقل', icon: FileText },
    { id: 'Financial', label: 'القسم المالي', icon: DollarSign },
  ];

  return (
    <aside className="w-64 bg-[#1b2a32] text-gray-300 h-full p-4 flex flex-col justify-between font-sans shrink-0" dir="rtl">
      <div>
        {/* رأس القائمة (الشعار) */}
        <div className="flex items-center gap-3 px-2 mb-8 mt-2">
          <div className="w-10 h-10 rounded-xl bg-[#e5b667] flex items-center justify-center text-[#1b2a32] shadow-md">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center text-lg font-bold tracking-wide">
              <span className="text-white">transfer</span>
              <span className="text-[#e5b667]">desk</span>
            </div>
            <p className="text-[10px] tracking-wider text-gray-400 font-semibold uppercase">
              عمليات الفنادق
            </p>
          </div>
        </div>

        {/* قسم مساحة العمل */}
        <div className="mb-4">
          <p className="text-[11px] font-bold text-gray-400 tracking-wider px-3 mb-3 uppercase">
            مساحة العمل
          </p>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              // نقوم بمقارنة الـ page القادمة من الـ props مع الـ id الخاص بالعنصر
              const isActive = page === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)} // إرسال الـ id للـ Home عند الضغط
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#e5b667] text-[#1b2a32] shadow-lg font-semibold'
                      : 'hover:bg-white/5 text-gray-300 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#1b2a32]' : 'text-gray-400'}`} />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}