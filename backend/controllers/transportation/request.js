const TransportationRequest = require('../../models/transportation/request');  

// جلب جميع الطلبات مع دعم البحث والفلاتر
exports.getRequests = async (req, res) => {
  try {
    const { search, status, vehicle } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { guestName: { $regex: search, $options: 'i' } },
        { requestId: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (vehicle && vehicle !== 'all') {
      query.vehicle = vehicle;
    }

    const requests = await TransportationRequest.find(query).sort({ createdAt: -1 });

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
    const { guestName, transferType, airport, travelDate, transferTime, vehicle, partner, guestPrice } = req.body;

    // توليد معرف فريد للطلب
    const requestId = `TR-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // حساب تكلفة الشريك والربح افتراضياً
    const parsedPrice = parseFloat(guestPrice) || 0;
    const partnerCost = parsedPrice * 0.5;
    const profit = parsedPrice - partnerCost;

    let ticketPath = '';
    if (req.file) {
      ticketPath = req.file.path;
    }

    const newRequest = await TransportationRequest.create({
      ...req.body,
      requestId,
      partnerCost,
      profit,
      ticketPath,
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
    const requestItem = await TransportationRequest.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: 'مدفوع' },
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