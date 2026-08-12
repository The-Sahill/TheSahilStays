const Request = require('../models/request');
const jwt = require('jsonwebtoken');
exports.createRequest = async (req, res) => {
    try {
        // 1. استخراج التوكن من الكوكيز
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "غير مصرح لك، يرجى تسجيل الدخول" });
        }

        // 2. فك التشفير للحصول على معلومات المستخدم (الاسم)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const employeeName = decoded.name; // هذا هو الاسم الذي خزنته في الـ payload عند تسجيل الدخول

        const roomNumber = req.params.id;
        const { 
            customNotes, total, towels, bathTowels, blankets, 
            pillows, floorMats, bedSheets, robeCovers ,type,customer
        } = req.body;

        const newRequestData = {
            number: roomNumber,
            type: type,
            employee: employeeName, // استخدام الاسم المستخرج تلقائياً
            customNotes: customNotes,   
            customer,
            total: total || 0,
            towels, bathTowels, blankets, pillows, floorMats, bedSheets, robeCovers
        };

        const savedRequest = await Request.create(newRequestData);

        res.status(201).json({
            success: true,
            message: 'تم إنشاء الطلب بنجاح',
            request: savedRequest
        });
    } catch (error) {
        console.error('خطأ في إنشاء الطلب:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. جلب جميع الطلبات لعرضها في صفحة الـ Dispatch
exports.getRequests = async (req, res) => {
    try {
        // يمكنك ترتيب الطلبات تنازلياً حسب تاريخ الإنشاء لظهر الأحدث أولاً
        const requests = await Request.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: requests.length,
            requests: requests
        });
    } catch (error) {
        console.error('خطأ في جلب الطلبات:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};