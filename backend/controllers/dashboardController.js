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
        const { range = 'Daily' } = req.query; // 'Daily', 'Weekly', 'Monthly'

        // تحديد النطاق الزمني والفورمات بناءً على الفلتر
        let dateFormat = "%Y-%m-%d"; // افتراضي يومي
        let daysAgo = 30; // افتراضي آخر 30 يوم

        if (range === 'Weekly') {
            dateFormat = "%Y-%U"; // تجميع حسب السنة ورقم الأسبوع في السنة
            daysAgo = 90; // آخر 3 شهور مثلاً لعرض أسابيع واضحة
        } else if (range === 'Monthly') {
            dateFormat = "%Y-%m"; // تجميع حسب السنة والشهر
            daysAgo = 365; // آخر سنة لعرض الشهور
        }

        // تحديد نطاق البحث بالتاريخ
        const matchStage = {
            createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - daysAgo)) }
        };

        // 1. تجميع بيانات الطلبات (Requests)
        const requestsData = await Request.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
                    requests: { $sum: 1 }
                }
            }
        ]);

        // 2. تجميع بيانات الدفعات (Batches) للحصول على التكلفة
        const batchesData = await Batch.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
                    cost: { $sum: { $toDouble: "$totalCost" } }
                }
            },
            {
                $project: {
                    cost: { $round: ["$cost", 2] }
                }
            }
        ]);

        // 3. دمج النتائج بناءً على المفتاح الزمني (Date/Week/Month)
        const mergedMap = {};

        requestsData.forEach(item => {
            const key = item._id;
            if (!mergedMap[key]) {
                mergedMap[key] = { name: key, requests: 0, cost: 0 };
            }
            mergedMap[key].requests = item.requests;
        });

        batchesData.forEach(item => {
            const key = item._id;
            if (!mergedMap[key]) {
                mergedMap[key] = { name: key, requests: 0, cost: 0 };
            }
            mergedMap[key].cost = item.cost;
        });

        // تحويل الكائن إلى مصفوفة وترتيبها تصاعدياً حسب التاريخ/الفترة
        const finalData = Object.values(mergedMap).sort((a, b) => new Date(a.name) - new Date(b.name));

        res.status(200).json(finalData);
    } catch (error) {
        console.error("Error in getChartData:", error);
        res.status(500).json([]);
    }
};



