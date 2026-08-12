import React, { useState } from 'react';
import { Search, Filter, Shield, Activity } from 'lucide-react';

const AuditLog = () => {
  const [searchUser, setSearchUser] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');

  // بيانات تجريبية لسجل التدقيق مطابقة للتصميم
  const auditData = [
    {
      id: 1,
      timestamp: 'Aug 6, 2026 7:18:18 AM',
      user: 'سشييش',
      role: 'employee',
      action: 'REQUEST CREATED',
      actionArabic: 'إنشاء طلب',
      entity: 'request #10',
      changes: '{"status":"pending_approval","roomNumber":"101"}'
    },
    {
      id: 2,
      timestamp: 'Aug 5, 2026 2:55:01 PM',
      user: '//',
      role: 'supervisor',
      action: 'REQUEST APPROVED',
      actionArabic: 'موافقة على طلب',
      entity: 'request #9',
      changes: '{"status":"pending_approval"} → {"status":"approved","room":"101"}'
    },
    {
      id: 3,
      timestamp: 'Aug 5, 2026 2:54:45 PM',
      user: 'kj',
      role: 'employee',
      action: 'REQUEST CREATED',
      actionArabic: 'إنشاء طلب',
      entity: 'request #9',
      changes: '{"status":"pending_approval","roomNumber":"101"}'
    },
    {
      id: 4,
      timestamp: 'Aug 5, 2026 2:50:12 PM',
      user: 'sfdsdf',
      role: 'employee',
      action: 'LAUNDRY RECEIVED',
      actionArabic: 'استلام مغسلة',
      entity: 'batch #2',
      changes: '{"status":"sent_to_dry_cleaning"} → {"status":"completed"}'
    },
    {
      id: 5,
      timestamp: 'Aug 5, 2026 2:49:44 PM',
      user: 'dsasad',
      role: 'employee',
      action: 'DELIVERY BATCH CREATED',
      actionArabic: 'إنشاء دفعة توصيل',
      entity: 'batch #2',
      changes: '{"batchNumber":"DCB-20260805-002","totalItems":27}'
    },
    {
      id: 6,
      timestamp: 'Aug 5, 2026 2:49:03 PM',
      user: 'hjvn',
      role: 'supervisor',
      action: 'REQUEST APPROVED',
      actionArabic: 'موافقة على طلب',
      entity: 'request #8',
      changes: '{"status":"pending_approval"} → {"status":"approved"}'
    },
    {
      id: 7,
      timestamp: 'Aug 5, 2026 2:48:40 PM',
      user: 'hj',
      role: 'employee',
      action: 'REQUEST CREATED',
      actionArabic: 'إنشاء طلب',
      entity: 'request #8',
      changes: '{"status":"pending_approval","roomNumber":"101"}'
    }
  ];

  // تصفية السجلات بناءً على البحث أو الفلاتر
  const filteredAudit = auditData.filter((item) => {
    const matchesSearch = item.user.toLowerCase().includes(searchUser.toLowerCase());
    const matchesAction = actionFilter === 'all' || item.action === actionFilter;
    const matchesEntity = entityFilter === 'all' || item.entity.includes(entityFilter);

    return matchesSearch && matchesAction && matchesEntity;
  });

  return (
    <div className="p-8 bg-slate-50 min-h-screen mt-16 md:mt-0 font-sans w-full" dir="rtl">
      
      {/* رأس الصفحة */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">سجل التدقيق (Audit Log)</h1>
        <p className="text-sm text-slate-500 mt-0.5">مراجعة نشاط النظام، الموافقات، وتغييرات البيانات.</p>
      </div>

      {/* شريط البحث والفلاتر */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        
        {/* خانة البحث عن المستخدم */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="ابحث باسم المستخدم..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-sm"
          />
        </div>

        {/* فلتر الإجراءات */}
        <div className="relative w-full md:w-56">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
            <Filter size={16} />
          </div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-600 shadow-sm appearance-none cursor-pointer"
          >
            <option value="all">جميع الإجراءات (All Actions)</option>
            <option value="REQUEST CREATED">إنشاء طلب (Request Created)</option>
            <option value="REQUEST APPROVED">موافقة على طلب (Request Approved)</option>
            <option value="DELIVERY BATCH CREATED">إنشاء دفعة (Batch Created)</option>
            <option value="LAUNDRY RECEIVED">استلام مغسلة (Laundry Received)</option>
          </select>
        </div>

        {/* فلتر الكيانات */}
        <div className="relative w-full md:w-56">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
            <Activity size={16} />
          </div>
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-600 shadow-sm appearance-none cursor-pointer"
          >
            <option value="all">جميع الكيانات (All Entities)</option>
            <option value="request">الطلبات (Requests)</option>
            <option value="batch">الدفعات (Batches)</option>
          </select>
        </div>

      </div>

      {/* جدول السجلات */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase bg-slate-50/50">
                <th className="py-4 px-6">الوقت والتاريخ</th>
                <th className="py-4 px-6">المستخدم</th>
                <th className="py-4 px-6">الإجراء</th>
                <th className="py-4 px-6">الكيان</th>
                <th className="py-4 px-6">التغييرات (Changes)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredAudit.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* الوقت والتاريخ */}
                  <td className="py-4 px-6 text-slate-600 text-xs whitespace-nowrap">{log.timestamp}</td>
                  
                  {/* المستخدم والصلاحية */}
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900">{log.user}</div>
                    <div className="text-xs text-slate-400">{log.role}</div>
                  </td>

                  {/* الإجراء */}
                  <td className="py-4 px-6">
                    <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 tracking-wide">
                      {log.action}
                    </span>
                  </td>

                  {/* الكيان */}
                  <td className="py-4 px-6 font-medium text-slate-800">{log.entity}</td>

                  {/* التغييرات برمجياً */}
                  <td className="py-4 px-6">
                    <div className="bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-1.5 font-mono text-xs text-slate-700 max-w-md overflow-x-auto whitespace-nowrap">
                      {log.changes}
                    </div>
                  </td>

                </tr>
              ))}

              {filteredAudit.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-slate-400">
                    لا توجد سجلات مطابقة لبحثك.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AuditLog;