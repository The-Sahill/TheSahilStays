const TransportationRequest = require('../../models/transportation/request');  

// جلب جميع الطلبات مع دعم البحث والفلاتر
exports.getRequests = async (req, res) => {
  try {
 
    const requests = await TransportationRequest.find().sort({ createdAt: -1 });
    console.log('Retrieved requests:', requests); // Log the retrieved requests for debugging

    res.status(200).json({
      success: true,
      data: requests
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// إنشاء طلب نقل جديد
exports.createRequest = async (req, res) => {
  try {
    const { guestName,mobileNumber, transferType, airport, travelDate, transferTime,passengers,bags,baggageSize,method } = req.body;

 


    const newRequest = await TransportationRequest.create({
      ...req.body,
    
      status: 'بانتظار الموافقة',
      paymentStatus: 'غير مدفوع'
    });

    res.status(201).json({
      success: true,
      message: 'تم إنشاء طلب النقل بنجاح',
      data: newRequest
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// عرض تفاصيل طلب معين
exports.getRequestById = async (req, res) => {
  try {
    const requestItem = await TransportationRequest.findOne({
      $or: [{ _id: req.params.id }, { requestId: req.params.id }]
    });

    if (!requestItem) {
      return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
    }

    res.status(200).json({
      success: true,
      data: requestItem
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// تحديث حالة الدفع للشريك
exports.updatePaymentStatus = async (req, res) => {
  try {
    const formData = req.body;
    const requestItem = await TransportationRequest.findByIdAndUpdate(
      req.params.id,
      formData,
      { new: true }
    );

    if (!requestItem) {
      return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
    }

    res.status(200).json({
      success: true,
      message: 'تم تحديث حالة الدفع بنجاح',
      data: requestItem
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


// تحديث حالة الدفع للشريك
exports.addRate = async (req, res) => {
  try {
    const formData = req.body;
    const requestItem = await TransportationRequest.findByIdAndUpdate(
      req.params.id,
      formData,
      { new: true }
    );

    if (!requestItem) {
      return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
    }

    res.status(200).json({
      success: true,
      message: 'تم تحديث حالة الدفع بنجاح',
      data: requestItem
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};