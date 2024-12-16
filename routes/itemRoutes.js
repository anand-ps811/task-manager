const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

router.get('/', itemController.getAllItems);
router.post('/', itemController.createItem);
router.get('/:id', itemController.getItemById);
router.post('/update/:id', itemController.updateItemById);
router.post('/delete/:id', itemController.deleteItemById);

module.exports = router;
