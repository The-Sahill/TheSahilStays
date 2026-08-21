const express = require('express');
const router = express.Router();
const GuestRequest = require('../../models/userSytem/GuestRequest');

// 1. استقبال طلب جديد من النزيل
exports.createRequest = async (req, res) => {
  try {
    console.log("تم استلام البيانات في الباك إند:", req.body);
    console.log("الـ ID المستلم في الرابط:", req.params.id);

    const { guestName, roomNumber, selectedRequests, customNote } = req.body;

    if (!guestName || !roomNumber || !selectedRequests || selectedRequests.length === 0) {
      return res.status(400).json({ error: 'جميع الحقول الأساسية مطلوبة' });
    }

    const newRequest = await GuestRequest.create({
      guestName,
      roomNumber,
      selectedRequests,
      customNote
    });

    console.log("تم الحفظ في قاعدة البيانات بنجاح:", newRequest);
    res.status(201).json({ message: 'تم حفظ الطلب بنجاح', data: newRequest });
  } catch (err) {
    console.error("خطأ أثناء الحفظ في قاعدة البيانات:", err);
    res.status(500).json({ error: 'خطأ في الخادم الداخلي' });
  }
};

// 2. عرض جميع الطلبات
exports.getAllRequests = async (req, res) => {
  try {
    // جلب الطلبات وترتيبها من الأحدث للأقدم
    const requests = await GuestRequest.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: requests });
  } catch (err) {
    console.error("خطأ أثناء جلب الطلبات:", err);
    res.status(500).json({ error: 'خطأ في الخادم الداخلي' });
  }
};

// 3. تعديل حالة الطلب (Status)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params; // الـ ID الخاص بالطلب المراد تعديله
    const { status } = req.body; // الحالة الجديدة (مثلاً: pending, in-progress, completed)

    if (!status) {
      return res.status(400).json({ error: 'الحالة الجديدة مطلوبة' });
    }

    // البحث عن الطلب وتحديث حالته وإرجاع النسخة المحدثة
    const updatedRequest = await GuestRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true } // لكي ترجع الدالة البيانات بعد التحديث وليس قبله
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: 'الطلب غير موجود' });
    }

    console.log("تم تحديث حالة الطلب بنجاح:", updatedRequest);
    res.status(200).json({ message: 'تم تحديث حالة الطلب بنجاح', data: updatedRequest });
  } catch (err) {
    console.error("خطأ أثناء تحديث حالة الطلب:", err);
    res.status(500).json({ error: 'خطأ في الخادم الداخلي' });
  }
};