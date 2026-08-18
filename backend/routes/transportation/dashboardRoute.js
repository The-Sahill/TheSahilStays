const express = require('express');
const Router = express.Router();
const dashController = require('../../controllers/transportation/dashboard');

Router.get('/dashboardData', dashController.dashboardData);

module.exports = Router;