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
try{
    

const requests = await TransportationRequest.find()

let totalCostCar = 0;
let partnerCostCar = 0;
let profitCar = 0;

let totalCostVan = 0;
let partnerCostVan = 0;
let profitVan = 0;

requests.forEach((request) => {
    if(request.vehicle === "سيارة عادية"){
        totalCostCar += request.guestPrice;
        partnerCostCar += request.partnerCost;
        profitCar += request.profit;
    }


    if(request.vehicle === "فان"){
        totalCostVan += request.guestPrice;
        partnerCostVan += request.partnerCost;
        profitVan += request.profit;
    }

})



        res.status(200).json({totalCostCar, partnerCostCar,profitCar,totalCostVan, partnerCostVan,profitVan,success: true});

}
catch(error){
    console.log(error);
    return res.status(500).json({ message: 'حدث خطأ أثناء حساب التكاليف حسب المركبة' });


}

}