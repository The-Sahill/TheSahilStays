const express = require('express');
const router = express.Router();
const storeController = require('../../controllers/storeItem/storeItemController'); // عدل المسار حسب هيكلة مشروعك

router.post('/store/add', storeController.addStoreItem);
router.get('/store/getAll', storeController.getAllStoreItems);
router.put('/store/updateQuantity/:id', storeController.updateItemQuantity);

module.exports = router;