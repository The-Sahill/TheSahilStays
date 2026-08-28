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
exports.updateRequestStatus = async (req, res) => {
    try{
    // 1. تصحيح اسم المتغير من requestId إلى id (حسب الـ Route :id)
    const { id } = req.params; 
    
    // 2. استقبال status بدلاً من approved (أو استقبال الاثنين لدعم الحالتين)
    const { status, approved } = req.body; 
    
    // تحديد القيمة المراد تحديثها (سواء أرسلت status أو approved)
    const updateValue = status !== undefined ? status : approved;
    
    console.log(`تحديث حالة الطلب: ${id} إلى ${updateValue}`);
    
    const updatedRequest = await Request.findByIdAndUpdate(
        id,
        { approved: updateValue }, // أو الحقل المناسب عندك في الـ Schema
        { returnDocument: 'after' } // حل تحذير Mongoose الجديد
    );
    
    if (!updatedRequest) {
        return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
    }
    
    res.status(200).json({
        success: true,
        message: 'تم تحديث حالة الطلب بنجاح',
        request: updatedRequest
    });
    
    }
    catch(error){
        console.error('خطأ في تحديث حالة الطلب:', error);
        res.status(500).json({ success: false, error: error.message });
    }
    };


    exports.deleteRequest = async (req,res) => {
        try{
const {id} = req.params
const deleteReq = await Request.findByIdAndDelete(id)
res.status(200).json({error:false,message :"تم الحذف الطلب بنجاح"})
        }catch(error){
            console.log(error)
            res.status(500).json({error:true,message :"حدث خطا اثناء حذف الطلب"})
        }

    }