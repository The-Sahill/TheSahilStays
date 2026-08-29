const Batch = require('../models/batch');
const Request = require('../models/request');

exports.getDashboardStats = async (req, res) => {
    try {
        // استخدام قيم Boolean للبحث في الطلبات
        const pendingCount = await Request.countDocuments({ status: false });
        const approvedCount = await Request.countDocuments({ status: true });
        
        // الحالات الخاصة بالدفعة (Batch)
        const sentToLaundryCount = await Batch.countDocuments({ status: 'Dispatched' });
        const receivedCount = await Batch.countDocuments({ status: 'Approved' });
        const rejectedCount = await Batch.countDocuments({ status: 'Rejected' });

        // جلب جميع الدفعات مرة واحدة لحساب التكلفة، القطع، والفواتير غير المدفوعة
        const batches = await Batch.find({});
        
        let totalCost = 0;
        let processedItems = 0;
        let invoice = 0;

        batches.forEach(batch => {
            const cost = Number(batch.totalCost) || 0;
            const items = Number(batch.totalItems) || 0;

            totalCost += cost;
            processedItems += items;

            // التحقق من أن الحالة Approved وأن حالة الدفع false
            if (batch.status === 'Approved' && batch.paymentStatus === false) {
                invoice += cost;
            }
        });

        return res.status(200).json({
            error: false,
            pending: pendingCount,
            approved: approvedCount,
            sentToLaundry: sentToLaundryCount,
            received: receivedCount,
            totalCost: totalCost,
            processedItems: processedItems,
            rejectedCount: rejectedCount,
            invoice
        });

    } catch (error) {
        console.error('خطأ في جلب إحصائيات لوحة التحكم:', error);
        return res.status(500).json({
            error: true,
            message: "حدث خطأ ما أثناء جلب الإحصائيات"
        });
    }
};

exports.getChartData = async (req, res) => {
    try {
        const { range } = req.query; 

        // تحديد نطاق البحث (آخر 30 يوماً افتراضياً)
        const matchStage = {
            createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
        };

        // 1. تجميع بيانات الطلبات (Requests) للحصول على عدد الطلبات لكل يوم
        const requestsData = await Request.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    requests: { $sum: 1 }
                }
            }
        ]);

        // 2. تجميع بيانات الدفعات (Batches) للحصول على التكلفة لكل يوم
     // 2. تجميع بيانات الدفعات (Batches) للحصول على التكلفة لكل يوم
     const batchesData = await Batch.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                cost: { $sum: { $toDouble: "$totalCost" } }
            }
        },
        {
            $project: {
                cost: { $round: ["$cost", 2] }
            }
        }
    ]);

        // 3. دمج النتائج بناءً على التاريخ (Date) لضمان توافق البيانات في الرسم البياني
        const mergedMap = {};

        // إضافة بيانات الـ Requests
        requestsData.forEach(item => {
            const dateStr = item._id;
            if (!mergedMap[dateStr]) {
                mergedMap[dateStr] = { name: dateStr, requests: 0, cost: 0 };
            }
            mergedMap[dateStr].requests = item.requests;
        });

        // إضافة بيانات الـ Batches (التكلفة)
        batchesData.forEach(item => {
            const dateStr = item._id;
            if (!mergedMap[dateStr]) {
                mergedMap[dateStr] = { name: dateStr, requests: 0, cost: 0 };
            }
            mergedMap[dateStr].cost = item.cost;
        });

        // تحويل الكائن إلى مصفوفة وترتيبها تصاعدياً حسب التاريخ
        const finalData = Object.values(mergedMap).sort((a, b) => new Date(a.name) - new Date(b.name));

        res.status(200).json(finalData);
    } catch (error) {
        console.error("Error in getChartData:", error);
        res.status(500).json([]); // إرسال مصفوفة فارغة في حالة الخطأ لتجنب تعطل الفرونت إند
    }
};