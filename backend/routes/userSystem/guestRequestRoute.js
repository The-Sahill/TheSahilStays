
const router = require('express').Router()
const GuestRequestController = require('../../controllers/userSystem/GuestRequestController')

router.post('/create/userRequest/:id', GuestRequestController.createRequest )
router.get('/getAllUsersRequests', GuestRequestController.getAllRequests )
router.put('/updateRequestStatus/userRequest/:id', GuestRequestController.updateRequestStatus )



module.exports=router
