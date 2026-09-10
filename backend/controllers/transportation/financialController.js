const TransportationRequest = require("../../models/transportation/request");

exports.getFinancialData = async (req, res) => {
  try {
    const requests = await TransportationRequest.find();

    let totalCost = 0;
    let partnerCost = 0;
    let profit = 0;

    requests.forEach((request) => {
      totalCost += Number(request.guestPrice || 0);
      partnerCost += Number(request.partnerCost || 0);
      profit += Number(request.profit || 0);
    });

    return res.status(200).json({
      success: true,
      totalCost,
      partnerCost,
      profit,
    });

  } catch (error) {
    console.log("FINANCIAL DATA ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.calcFinancialByVehicle = async (req, res) => {
  try {
    const requests = await TransportationRequest.find();

    let totalCostCar = 0;
    let partnerCostCar = 0;
    let profitCar = 0;

    let totalCostVan = 0;
    let partnerCostVan = 0;
    let profitVan = 0;

    requests.forEach((request) => {
      if (request.vehicle === "سيارة عادية") {
        totalCostCar += Number(request.guestPrice || 0);
        partnerCostCar += Number(request.partnerCost || 0);
        profitCar += Number(request.profit || 0);
      }

      if (request.vehicle === "فان") {
        totalCostVan += Number(request.guestPrice || 0);
        partnerCostVan += Number(request.partnerCost || 0);
        profitVan += Number(request.profit || 0);
      }
    });

    res.status(200).json({
      totalCostCar,
      partnerCostCar,
      profitCar,
      totalCostVan,
      partnerCostVan,
      profitVan,
      success: true,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'حدث خطأ أثناء حساب التكاليف حسب المركبة' });
  }
};

// الدالة الجديدة لجلب البيانات المالية للشهر الحالي فقط
exports.getFinancialDataCurrentMonth = async (req, res) => {
  try {
    // تحديد بداية الشهر الحالي (اليوم الأول الساعة 00:00:00)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // تحديد بداية الشهر القادم (لنتمكن من جلب كل ما يقع ضمن الشهر الحالي)
    const startOfNextMonth = new Date(startOfMonth);
    startOfNextMonth.setMonth(startOfNextMonth.getMonth() + 1);

    // افتراض أن حقل التاريخ في نموذجك اسمه createdAt (قم بتغييره حسب اسم الحقل لديك مثل date أو createdAt)
    const requests = await TransportationRequest.find({
      createdAt: {
        $gte: startOfMonth,
        $lt: startOfNextMonth,
      },
    });

    let totalCost = 0;
    let partnerCost = 0;
    let profit = 0;

    requests.forEach((request) => {
      totalCost += Number(request.guestPrice || 0);
      partnerCost += Number(request.partnerCost || 0);
      profit += Number(request.profit || 0);
    });

    return res.status(200).json({
      success: true,
      month: startOfMonth.toLocaleString('default', { month: 'long', year: 'numeric' }),
      totalRequestsCount: requests.length,
      totalCost,
      partnerCost,
      profit,
    });

  } catch (error) {
    console.log("FINANCIAL DATA CURRENT MONTH ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};