import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  DoorClosed, 
  FileText, 
  Shirt, 
  Layers, 
  FileSpreadsheet, 
  Settings,
  Menu,
  X,
  LogOut,
  User
} from 'lucide-react';
const apiUrl = import.meta.env.VITE_BACKEND_URL;


const SideMenu = ({ setPage, page }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOpen, setIsOpen] = useState(false); // حالة إظهار وإخفاء القائمة في الموبايل
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // حالات خاصة باسم المستخدم الحالي
  const [userName, setUserName] = useState('');
  const [loadingUser, setLoadingUser] = useState(true);

  // جلب اسم المستخدم عند تحميل القائمة الجانبية
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`${apiUrl}/batches/user`, {
          method: 'GET',
          credentials: 'include', // ضروري لإرسال الـ Cookie
        });

        if (response.ok) {
          const data = await response.json();
          // التعامل مع الشكل المحتمل للاستجابة سواء كان نصاً أو كائناً
          const name = typeof data === 'object' ? (data.username || data.name || '') : data;
          setUserName(name);
        }
      } catch (error) {
        console.error('فشل في جلب اسم المستخدم:', error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleTabClick = (id, label) => {
    setActiveTab(id);
    setPage(label);
    setIsOpen(false); // إغلاق القائمة تلقائياً في الشاشات الصغيرة عند اختيار صفحة
  };

  // دالة تسجيل الخروج والاتصال بالباك إند
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await fetch(`${apiUrl}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        window.location.href = '/login';
      } else {
        alert('فشل تسجيل الخروج، يرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      console.error('خطأ في الاتصال أثناء تسجيل الخروج:', error);
      alert('حدث خطأ ما أثناء الاتصال بالسيرفر.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* زر القائمة للشاشات الصغيرة (Mobile Menu Button) */}
      <div className="lg:hidden flex items-center justify-between bg-[#0B132B] text-white px-4 py-3 fixed top-0 right-0 left-0 z-50 shadow-md">
        <span className="font-bold text-lg tracking-wide">Dry Clean</span>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* خلفية معتمة عند فتح القائمة في الموبايل */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* الشريط الجانبي (SideMenu) */}
      <aside className={`
        fixed lg:static top-0 right-0 h-screen w-64 bg-[#0B132B] text-slate-300 
        flex flex-col justify-between select-none z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `} dir='rtl'>
        
        <div className="overflow-y-auto flex-1 pt-16 lg:pt-0">
          
          {/* شعار التطبيق */}
          <div className="p-6 hidden lg:flex items-center justify-between">
            <span className="text-white font-bold text-xl tracking-wide">Dry Clean</span>
          </div>

          {/* معلومات المستخدم الحالي (مرحباً، الاسم) */}
          <div className="mx-4 mb-4 p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
              <User size={18} />
            </div>
            <div className="overflow-hidden">
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider">مرحباً بك</span>
              <span className="block text-sm font-bold text-white truncate">
                {loadingUser ? 'جاري التحميل...' : (userName || 'موظف النظام')}
              </span>
            </div>
          </div>

          {/* قائمة العمليات */}
          <div className="px-4 py-2">
            <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase px-3 mb-2">العمليات</p>
            <nav className="space-y-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
                { id: 'rooms', label: 'Rooms', icon: <DoorClosed size={18} /> },
                { id: 'requests', label: 'Requests', icon: <FileText size={18} /> },
                { id: 'dry-cleaning', label: 'Dry Cleaning', icon: <Shirt size={18} /> },
                { id: 'batches', label: 'Batches', icon: <Layers size={18} /> },
                // { id: 'audit-log', label: 'Audit Log', icon: <FileSpreadsheet size={18} /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id, item.label)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === item.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                      : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* قائمة الإعدادات */}
          <div className="px-4 py-4">
            <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase px-3 mb-2">Settings</p>
            <nav className="space-y-1">
              {[
                { id: 'room-config', label: 'Room Config', icon: <Settings size={18} /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id, item.label)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === item.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                      : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          
        </div>

        {/* زر تسجيل الخروج في أسفل القائمة */}
        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all disabled:opacity-50 cursor-pointer"
          >
            <LogOut size={18} />
            <span>{isLoggingOut ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج'}</span>
          </button>
        </div>

      </aside>
    </>
  );
};

export default SideMenu;