const Batch = require('../models/batch');
const Request = require('../models/request');

exports.getDashboardStats = async (req, res) => {
    try {
        // استخدام قيم Boolean للبحث (يمكنك عكس القيم حسب منطق قاعدة البيانات لديك)
        const pendingCount = await Request.countDocuments({ status: false });
        const approvedCount = await Request.countDocuments({ status: true });
        
        // إذا كانت الحالات الأخرى (مثل الإرسال أو الاستلام) لها حقول منفصلة أو تعتمد على قيم أخرى
        const sentToLaundryCount = await Batch.countDocuments({ status: 'Dispatched' });
        const receivedCount = await Batch.countDocuments({ status: 'Approved' });
        const rejectedCount = await Batch.countDocuments({ status: 'Rejected' });

        // حساب التكلفة وإجمالي القطع من الدفعات
        const batches = await Batch.find({});
        
        let totalCost = 0;
        let processedItems = 0;
        
        batches.forEach(batch => {
            totalCost += Number(batch.totalCost) || 0;
            processedItems += Number(batch.totalItems) || 0;
        });


        return res.status(200).json({
            error: false,
            pending: pendingCount,
            approved: approvedCount,
            sentToLaundry: sentToLaundryCount,
            received: receivedCount,
            totalCost: totalCost,
            processedItems: processedItems,
            rejectedCount: rejectedCount
        });

    } catch (error) {
        console.error('خطأ في جلب إحصائيات لوحة التحكم:', error);
        return res.status(500).json({
            error: true,
            message: "حدث خطأ ما أثناء جلب الإحصائيات"
        });
    }
};