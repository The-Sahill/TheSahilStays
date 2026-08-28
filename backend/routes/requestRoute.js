
const router = require('express').Router()
const requestController = require('../controllers/requestController')

router.delete('/deleteRequest/:id', requestController.deleteRequest);
router.post('/createRequest/:id', requestController.createRequest )
router.get('/requests', requestController.getRequests);
router.put('/requests/:id', requestController.updateRequestStatus);


module.exports=router
