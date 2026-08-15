const Request = require('../../models/transportation/request');

const getFinancialData = (requests) => {
try{

    let totalCost = 0;
    Request.forEach((request) => {
        totalCost += request.guestPrice;
        });

        partnerCost = 0;
        Request.forEach((request) => {
        partnerCost += request.partnerCost;
        })

        let profit = 0;
        Request.forEach((request) => {
        profit += request.profit;
        })

        return res.status(200).json({totalCost, partnerCost, profit,success: true});



}
catch (error) {
console.log(error);
return res.status(500).json({ message: 'حدث خطأ أثناء حساب التكاليف' });
}



}


const calcFinancialByVehicle = async (req, res) => {
try{
const  car = Request.forEach((request) => {
    if(request.vehicle === "سيارة عادية"){
        totalCost += request.guestPrice;
        partnerCost += request.partnerCost;
        profit += request.profit;
    }})

    const  van = Request.forEach((request) => {
        if(request.vehicle === "فان"){
            totalCost += request.guestPrice;
            partnerCost += request.partnerCost;
            profit += request.profit;
        }})


        res.status(200).json({car, van, success: true});

}
catch(error){
    console.log(error);
    return res.status(500).json({ message: 'حدث خطأ أثناء حساب التكاليف حسب المركبة' });


}

}