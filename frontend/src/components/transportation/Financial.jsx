import React, { useEffect, useState } from 'react';
import { Bell, ChevronDown, DollarSign, Building2, Calendar, ArrowRight, Check, BarChart2 } from 'lucide-react';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_BACKEND_URL;


export default function FinancialDesk() {
  const [filter, setFilter] = useState('all');
  const [financialData, setFinancialData] = useState({
    totalCost: 0,
    partnerCost: 0,
    profit: 0,
  });

  const [financialDataForVehicle, setFinancialDataForVehicle] = useState({
    totalCostCar: 0,
    partnerCostCar: 0,
    profitCar: 0,
    totalCostVan: 0,
    partnerCostVan: 0,
    profitVan: 0,
  });

  

  useEffect(() => {
    const getFinancialData = async () => {
      try {
        const { data } = await axios.get(
          `${apiUrl}/financialData`
        );
  
        if (data.success) {
          setFinancialData({
            totalCost: data.totalCost,
            partnerCost: data.partnerCost,
            profit: data.profit,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    getFinancialData();
  }, []);

  useEffect(() => {

    const financialDataForTypes = async () => {
      try {
        const { data } = await axios.get(
          `${apiUrl}/financialDataForTypes`
        );
  
        if (data.success) {
          console.log("Financial Data by Vehicle Type:", data);
          setFinancialDataForVehicle({
            totalCostCar: data.totalCostCar,
            partnerCostCar: data.partnerCostCar,
            profitCar: data.profitCar,
            totalCostVan: data.totalCostVan,
            partnerCostVan: data.partnerCostVan,
            profitVan: data.profitVan,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }

    financialDataForTypes()

  }, []);

  return (
    <div className="min-h-screen w-full bg-[#fbfaf6] text-[#1b2a32] font-sans">
      
      {/* الشريط العلوي */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <nav className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2 font-medium text-sm">
              <span className='text-gray-400'>مساحة العمل /</span> القسم المالي
            </div>
            <div className="font-bold text-lg">صباح الخير، مايا</div>
          </div>
       
        </nav>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="max-w-[1600px] mx-auto p-6 md:p-10 flex flex-col gap-8">
        
        {/* العنوان والوصف */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-yellow-600 tracking-wider uppercase mb-2">القسم المالي</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1b2a32] mb-3">المال، بدون أي غموض.</h1>
            <p className="text-gray-600 max-w-2xl">الإيرادات الواردة، تكاليف الشركاء، والهامش الذي يحتفظ به فندقك في كل رحلة.</p>
          </div>
          <h1 className="flex items-center gap-2 bg-white border border-gray-200 text-[#1b2a32] px-4 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-sm shrink-0 text-sm">
            <Calendar className="w-4 h-4 text-gray-500" /> هذه الفترة
          </h1>
        </div>

        {/* بطاقات الإحصائيات العليا */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">إجمالي الإيرادات</p>
              <p className="text-4xl font-semibold text-[#1b2a32] mb-2">{financialData.totalCost}</p>
              <p className="text-xs text-gray-500">رسوم النزلاء</p>
            </div>
            <div className="p-2.5 rounded-full bg-gray-50 text-gray-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#f6e0bc] p-6 rounded-3xl border border-yellow-200/50 shadow-sm flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-yellow-900 opacity-80 tracking-wider uppercase mb-2">المدفوع للشركاء</p>
              <p className="text-4xl font-semibold text-yellow-950 mb-2">{financialData.partnerCost}</p>
              <p className="text-xs text-yellow-900 opacity-90">تكاليف الشركات المسواة</p>
            </div>
            <div className="p-2.5 rounded-full bg-[#e5b667] text-yellow-950">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#e0eae5] p-6 rounded-3xl border border-emerald-200/50 shadow-sm flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-emerald-900 opacity-80 tracking-wider uppercase mb-2">ربح الفندق</p>
              <p className="text-4xl font-semibold text-emerald-950 mb-2">{financialData.profit}</p>
              <p className="text-xs text-emerald-900 opacity-90">الإيرادات مطروحاً منها تكاليف الشركاء</p>
            </div>
            <div className="p-2.5 rounded-full bg-[#c8dcd1] text-emerald-950">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* قسم الرسم البياني + طابور التسوية */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* الإيرادات حسب المركبة */}
          <div className="xl:col-span-7 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-[#1b2a32]">الإيرادات حسب المركبة</h3>
                <BarChart2 className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mb-8">رؤية واضحة للمكان الذي يعمل فيه المكتب.</p>
              
              <div className="space-y-8">
                {/* سيارة عادية */}
                <div>
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="font-semibold text-[#1b2a32]">سيارة عادية</span>
                    <span className="font-bold text-[#1b2a32]">{financialDataForVehicle.profitCar} ربح</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden flex mb-2">
                    <div className="bg-[#1b2a32] h-full" style={{ width: '65%' }}></div>
                    <div className="bg-[#e5b667] h-full" style={{ width: '35%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>إيراد {financialDataForVehicle.totalCostCar} • تكلفة {financialDataForVehicle.partnerCostCar}</span>
                  </div>
                </div>

                {/* فان */}
                <div>
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="font-semibold text-[#1b2a32]">فان</span>
                    <span className="font-bold text-[#1b2a32]">{financialDataForVehicle.profitVan} ربح</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden flex mb-2">
                    <div className="bg-[#1b2a32] h-full" style={{ width: '60%' }}></div>
                    <div className="bg-[#e5b667] h-full" style={{ width: '40%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>إيراد {financialDataForVehicle.totalCostVan} • تكلفة {financialDataForVehicle.partnerCostVan}.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* مفتاح الدلالة (Legend) */}
            <div className="flex items-center gap-6 border-t border-gray-100 pt-6 mt-8 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#1b2a32]"></span>
                <span>الإيرادات</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#e5b667]"></span>
                <span>تكلفة الشريك</span>
              </div>
            </div>
          </div>

       {/* طابور التسوية (Reconciliation Queue) */}
<div className="xl:col-span-5 bg-[#1b2a32] text-white p-8 rounded-3xl flex flex-col justify-between">
  <div>
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-sm font-bold tracking-wider text-gray-400 uppercase">
        طابور التسوية
      </h3>
      <DollarSign className="w-5 h-5 text-yellow-400" />
    </div>

    <p className="text-5xl font-semibold text-white mb-2">
      التسويات المالية
    </p>

    <p className="text-yellow-400 font-medium mb-8">
      مراجعة ومتابعة العمليات المالية المعلقة
    </p>

    <div className="bg-white/5 p-5 rounded-2xl border border-white/10 mb-6">
      <p className="text-xs text-gray-300 leading-relaxed">
        يمكنك مراجعة العمليات المالية وتحديث حالة التسوية
        لضمان دقة السجلات والمعاملات.
      </p>
    </div>
  </div>

</div>

        </div>

        {/* دفتر الأستاذ (Payment Ledger Table) */}
       

      </main>
    </div>
  );
}