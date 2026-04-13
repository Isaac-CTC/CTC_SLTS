const express = require('express');
const itemController = require('../Controllers/itemControllers.js');
const authenticateToken = require('../Middleware/authenticateToken.js');

const router = express.Router();

router.use(authenticateToken);

router.get('/', itemController.getItems);
router.post('/', itemController.createItem);
router.get('/stats', itemController.getDashboardStats);
router.put('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

module.exports = router;
