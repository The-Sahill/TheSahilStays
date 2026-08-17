const express = require('express');
const Router = express.Router();
const financialController = require('../../controllers/transportation/financialController');

Router.get('/financialData', financialController.getFinancialData); // جلب البيانات المالية
Router.get('/financialDataForTypes', financialController.calcFinancialByVehicle); 

module.exports = Router;