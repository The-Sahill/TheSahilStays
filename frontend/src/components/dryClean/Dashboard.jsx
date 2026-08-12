import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  DoorClosed, 
  FileText, 
  Shirt, 
  Layers, 
  FileSpreadsheet, 
  Tag, 
  Settings, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Package, 
  DollarSign, 
  TrendingUp,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import SideMenu from './SideMenu'; // تأكد من مسار ملف القائمة الجانبية لديك
const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function CleanMasterDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeRange, setTimeRange] = useState('Daily');

  // حالة تخزين الإحصائيات والقراءات الواردة من السيرفر
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    sentToLaundry: 0,
    received: 0,
    totalCost: 0,
    processedItems: 0,
    rejectedCount: 0
  });
  
  // بيانات تجريبية للرسوم البيانية تتغير بناءً على الفلتر الزمني (Daily, Weekly, Monthly)
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // تحديث بيانات الرسم البياني كلما تغير الفلتر الزمني
  useEffect(() => {
    updateChartDataByRange(timeRange);
  }, [timeRange]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/dashboard-stats`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('فشل في جلب الإحصائيات');

      const data = await response.json();
      setStats({
        pending: data.pending || 0,
        approved: data.approved || 0,
        sentToLaundry: data.sentToLaundry || 0,
        received: data.received || 0,
        totalCost: data.totalCost || 0,
        processedItems: data.processedItems || 0,
        rejectedCount: data.rejectedCount || 0
      });
    } catch (error) {
      console.error('خطأ في جلب بيانات لوحة التحكم:', error);
    } finally {
      setLoading(false);
    }
  };

  // دالة لتوليد بيانات وهمية أو حقيقية للرسوم البيانية حسب الفلتر
  const updateChartDataByRange = (range) => {
    if (range === 'Daily') {
      setChartData([
        { name: 'السبت', requests: 12, cost: 150 },
        { name: 'الأحد', requests: 19, cost: 230 },
        { name: 'الإثنين', requests: 15, cost: 180 },
        { name: 'الثلاثاء', requests: 22, cost: 310 },
        { name: 'الأربعاء', requests: 30, cost: 420 },
        { name: 'الخميس', requests: 25, cost: 350 },
        { name: 'الجمعة', requests: 10, cost: 120 },
      ]);
    } else if (range === 'Weekly') {
      setChartData([
        { name: 'الأسبوع 1', requests: 95, cost: 1250 },
        { name: 'الأسبوع 2', requests: 110, cost: 1480 },
        { name: 'الأسبوع 3', requests: 85, cost: 1100 },
        { name: 'الأسبوع 4', requests: 130, cost: 1750 },
      ]);
    } else {
      setChartData([
        { name: 'يناير', requests: 400, cost: 5200 },
        { name: 'فبراير', requests: 450, cost: 6100 },
        { name: 'مارس', requests: 380, cost: 4900 },
        { name: 'أبريل', requests: 520, cost: 7000 },
        { name: 'مايو', requests: 600, cost: 8200 },
        { name: 'يونيو', requests: 550, cost: 7500 },
      ]);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center mx-auto justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans w-full mt-16 md:mt-0" dir="rtl">
      
      <main className="flex-1 overflow-y-auto p-8">
        
        {/* رأس الصفحة */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">الاحصائيات</h1>
          <p className="text-sm text-slate-500 mt-0.5">نظرة عامة على عمليات التنظيف الجاف وتكاليفها.</p>
        </div>

        {/* شبكة البطاقات العلوية (Stats Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-slate-500">بانتظار الموافقة</span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-3xl font-bold text-slate-900 mt-4">{stats.pending}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-slate-500">الطلبات المعتمدة</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-3xl font-bold text-slate-900 mt-4">{stats.approved}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-slate-500">تم إرسالها إلى المغسلة</span>
              <Truck className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-3xl font-bold text-slate-900 mt-4">{stats.sentToLaundry}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-slate-500">تم استلامها</span>
              <Package className="w-5 h-5 text-purple-500" />
            </div>
            <span className="text-3xl font-bold text-slate-900 mt-4">{stats.received}</span>
          </div>

        </div>

        {/* شبكة البطاقات السفلية */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-slate-500">التكلفة الإجمالية</span>
              <DollarSign className="w-5 h-5 text-slate-400" />
            </div>
            <span className="text-3xl font-bold text-slate-900 mt-4">
              {stats.totalCost.toLocaleString()} دينار
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-slate-500">العناصر التي تمت معالجتها</span>
              <Layers className="w-5 h-5 text-slate-400" />
            </div>
            <span className="text-3xl font-bold text-slate-900 mt-4">{stats.processedItems}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-slate-500">تم رفضها</span>
              <ArrowUpRight className="w-5 h-5 text-slate-400" />
            </div>
            <span className="text-2xl font-bold text-slate-900 mt-4 truncate">{stats.rejectedCount}</span>
          </div>

        </div>

        {/* قسم الرسم البياني التفاعلي (Activity Trends & Charts) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* الرسم البياني الأول: اتجاهات الطلبات (Area Chart) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">حركة الطلبات</h3>
                <p className="text-xs text-slate-500 mt-0.5">عدد الطلبات بناءً على النطاق الزمني</p>
              </div>

              {/* أزرار الفلترة (Daily, Weekly, Monthly) */}
              <div className="inline-flex bg-slate-100 p-1 rounded-xl">
                {['Daily', 'Weekly', 'Monthly'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setTimeRange(tab)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                      timeRange === tab 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {tab === 'Daily' ? 'يومي' : tab === 'Weekly' ? 'أسبوعي' : 'شهري'}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip />
                  <Area type="monotone" dataKey="requests" name="عدد الطلبات" stroke="#3b82f6" fill="#93c5fd" fillOpacity={0.4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* الرسم البياني الثاني: التكاليف المالية (Bar Chart) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">التكاليف المالية</h3>
                <p className="text-xs text-slate-500 mt-0.5">إجمالي التكاليف (بالدينار) عبر الزمن</p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="cost" name="التكلفة" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}