import React from 'react';
import { LayoutDashboard, FileText, DollarSign, Building2, X, Menu } from 'lucide-react';

export default function Sidebar({ setPage, page, isOpen, setIsOpen }) {
  const menuItems = [
    { id: 'Dashboard', label: 'نظرة عامة', icon: LayoutDashboard },
    { id: 'Requests', label: 'طلبات النقل', icon: FileText },
    { id: 'Financial', label: 'القسم المالي', icon: DollarSign },
  ];

  return (
    <>
      {/* 🍔 زر الـ Burger Menu يظهر ثابت في أعلى الشاشة على الموبايل عندما تكون القائمة مغلقة */}
      <div className="md:hidden mt-12 fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2.5 rounded-xl bg-[#1b2a32] text-white shadow-lg border border-white/10 hover:bg-[#243742] transition-colors"
          aria-label="فتح القائمة"
        >
          <Menu className="w-6 h-6 " />
        </button>
      </div>

      {/* خلفية معتمة للشاشات الصغيرة عند فتح القائمة */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* الـ Sidebar */}
      <aside 
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-[#1b2a32] text-gray-300 p-4 flex flex-col justify-between font-sans shrink-0 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`} 
        dir="rtl"
      >
        <div>
          {/* رأس القائمة (الشعار مع زر الإغلاق للموبايل) */}
          <div className="flex items-center justify-between px-2 mb-8 mt-2">
            <div className="flex items-center gap-3">
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

            {/* زر إغلاق القائمة في الشاشات الصغيرة */}
            <button 
              onClick={() => setIsOpen(false)}
              className="md:hidden text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* قسم مساحة العمل */}
          <div className="mb-4">
            <p className="text-[11px] font-bold text-gray-400 tracking-wider px-3 mb-3 uppercase">
              مساحة العمل
            </p>

            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = page === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setPage(item.id);
                      if (setIsOpen) setIsOpen(false); // إغلاق القائمة تلقائياً عند الضغط على صفحة في الموبايل
                    }}
                    className={`w-full flex items-center  gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
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
    </>
  );
}