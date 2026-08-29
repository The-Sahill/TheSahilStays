
const router = require('express').Router()
const whatsController = require('../../controllers/whatsapp/whatsappController')

router.post('/whatsapp', whatsController.sendWhatsapp )


module.exports=router
