const Batch = require('../models/batch');
const Request = require('../models/request');
const jwt = require('jsonwebtoken');

exports.createBatchAndDispatch = async (req, res) => {
    try {
        // استقبال مصفوفة IDs الطلبات المراد إرسالها من الواجهة الأمامية
        const { requestIds  } = req.body;

        if (!requestIds || requestIds.length === 0) {
            return res.status(400).json({ success: false, message: 'لا توجد طلبات للإرسال' });
        }

        // 1. جلب الطلبات المراد إرسالها لحساب الإجماليات
        const requestsToDispatch = await Request.find({ _id: { $in: requestIds }, status: false });

        if (requestsToDispatch.length === 0) {
            return res.status(400).json({ success: false, message: 'جميع الطلبات المحددة مُرسلة مسبقاً' });
        }

        let totalItemsSum = 0;
        let totalCostSum = 0;

        // دالة لحساب عدد القطع لكل طلب
        const calculateItems = (item) => {
            const keys = ['towels', 'bathTowels', 'blankets', 'pillows', 'floorMats', 'bedSheets', 'robeCovers'];
            let sum = 0;
            keys.forEach(key => {
                if (item[key] && typeof item[key].count === 'number') {
                    sum += item[key].count;
                }
            });
            return sum;
        };

        requestsToDispatch.forEach(reqItem => {
            totalItemsSum += calculateItems(reqItem);
            totalCostSum += reqItem.total || 0;
        });

        // 2. إنشاء سجل الـ Batch الجديد
        const newBatch = await Batch.create({
            requests: requestIds,
            totalRequests: requestsToDispatch.length,
            totalItems: totalItemsSum,
            totalCost: totalCostSum
        });

        // 3. تحديث حقل الـ type للطلبات ليصبح true (يعني أنها أُرسلت ولن تظهر في قائمة الانتظار الجديدة)
        await Request.updateMany(
            { _id: { $in: requestIds } },
            { $set: { status: true } }
        );

        res.status(201).json({
            success: true,
            message: 'تم إرسال الدفعة بنجاح وتحديث الطلبات',
            batch: newBatch
        });

    } catch (error) {
        console.error('خطأ في إنشاء دفعة الإرسال:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// جلب تفاصيل الدفعات السابقة (إن أردت عرضها)
exports.getBatches = async (req, res) => {
    try {
        const batches = await Batch.find().populate('requests').sort({ createdAt: -1 });
        res.status(200).json({ success: true, batches });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// في ملف الـ Routes أو Controller
exports.getCurrentUser = async (req, res) => {
    try {
        const token = req.cookies.token;
        
        if (!token) return res.status(401).json({ name: '' });
        console.log("Token from cookies:", token); // تحقق من وجود التوكن في الكوكيز

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded); // تحقق من محتوى التوكن بعد فك التشفير
        
        res.status(200).json({error:false, name: decoded.name });
    } catch (error) {
        res.status(401).json({ name: '' });
    }
};

// دالة لتحديث حالة الدفعة (مثل Approved أو Rejected)
exports.updateBatchStatus = async (req, res) => {
    try {
        const { id } = req.params; // معرف الدفعة
        const { status , customNote } = req.body; // الحالة الجديدة المرسلة من الواجهة الأمامية

        if (!status) {
            return res.status(400).json({ success: false, message: 'الحالة المطلوبة غير موجودة' });
        }

        // البحث عن الدفعة وتحديث حالتها
        const updatedBatch = await Batch.findByIdAndUpdate(
            id, 
            { $set: { status: status, customNote } }, 
            { new: true } // لإرجاع الدفعة بعد التحديث
        ).populate('requests');

        if (!updatedBatch) {
            return res.status(404).json({ success: false, message: 'الدفعة غير موجودة' });
        }

        res.status(200).json({
            success: true,
            message: 'تم تحديث حالة الدفعة بنجاح',
            batch: updatedBatch
        });

    } catch (error) {
        console.error('خطأ في تحديث حالة الدفعة:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};