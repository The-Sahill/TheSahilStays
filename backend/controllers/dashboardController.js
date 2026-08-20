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

exports.getChartData = async (req, res) => {
    try {
        const { range } = req.query; // 'Daily', 'Weekly', 'Monthly'

        // تحديد نطاق البحث (مثلاً آخر 30 يوم)
        const matchStage = {
            createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
        };

        const data = await Request.aggregate([
            { $match: matchStage },
            {
                $group: {
                    // تجميع حسب التاريخ (يوم، أسبوع، أو شهر)
                    _id: { 
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } 
                    },
                    requests: { $sum: 1 },
                    // نفترض أن كل طلب له cost (قم بتعديل الحقل حسب قاعدة بياناتك)
                    cost: { $sum: { $toDouble: "$cost" } } 
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    requests: 1,
                    cost: 1
                }
            }
        ]);

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "خطأ في جلب بيانات الرسم البياني" });
    }
};