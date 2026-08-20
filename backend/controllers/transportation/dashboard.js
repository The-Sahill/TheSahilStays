const Transportation = require('../../models/transportation/request')

exports.dashboardData = async (req, res) => {
    try {
        const requests = await Transportation.find()
        const requestsCont = requests.length

        let financialEntitlements = 0
        let financialCost = 0
        let financialProfit = 0
        let totalRate = 0
        let financialRate = 0
        let carTotal = 0 
        let vanTotal = 0

        // عدادات الحالات (Status Counts)
        let statusCounts = {
            pending: 0,       // بانتظار الموافقة
            approved: 0,      // تمت الموافقة
            completed: 0,     // مكتمل
            rejected: 0,      // مرفوض
            cancelled: 0      // ملغي
        }

        requests.forEach((request) => {
            financialEntitlements += request.guestPrice || 0
            financialCost += request.partnerCost || 0
            financialProfit += request.profit || 0
            
            // جمع التقييمات إذا وجدت
            if (request.rating) {
                totalRate += request.rating
            }

            // حساب أنواع المركبات
            if (request.vehicle == "سيارة عادية") {
                carTotal = carTotal + 1
            } else if (request.vehicle == "فان") {
                vanTotal = vanTotal + 1
            }

            // حساب الحالات (Status)
            switch (request.status) {
                case "بانتظار الموافقة":
                    statusCounts.pending++;
                    break;
                case "تمت الموافقة":
                    statusCounts.approved++;
                    break;
                case "مكتمل":
                    statusCounts.completed++;
                    break;
                case "مرفوض":
                    statusCounts.rejected++;
                    break;
                case "ملغي":
                    statusCounts.cancelled++;
                    break;
            }
        })

        // حساب معدل التقييم العام (تجنب القسمة على صفر)
        if (requestsCont > 0) {
            financialRate = totalRate / requestsCont
        }

        // جلب آخر تقييمين (Rating + Review) مرتبة تنازلياً حسب تاريخ الإنشاء أو المعرف الأحدث
        // ملاحظة: تأكد من وجود حقل createdAt في المودل أو استبدله بـ _id لترتيب الأحدث
        const latestReviews = await Transportation.find({ review: { $exists: true, $ne: null } })
            .sort({ createdAt: -1 }) // أو .sort({ _id: -1 }) إذا لم يكن لديك حقل تاريخ
            .limit(2)
            .select('rating review createdAt guestName');

        // إرسال البيانات للواجهة
        return res.status(200).json({
            success: true,
            data: {
                requestsCont,
                financialEntitlements,
                financialCost,
                financialProfit,
                financialRate,
                carTotal,
                vanTotal,
                statusCounts,
                latestReviews
            }
        });

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: error.message })
    }
}