const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller.js');

// Add an order
router.post('/', orderController.addOrder);
router.put('/:orderId', orderController.updateOrder);
router.post('/checkout', orderController.checkout);

// Get multiple orders (with optional deleted status filter)
router.get('/', orderController.getOrders);

// Mark an order as deleted
router.patch('/:orderId/delete', orderController.markOrderAsDeleted);

// Get only non-deleted orders
router.get('/active', orderController.getActiveOrders);

// Get a single order by ID
router.get('/:orderId', orderController.getOrderById);
router.get("/has-purchased/:userId/:productId", orderController.hasUserPurchasedProduct);

router.get("/user/:userId", orderController.getOrdersByUserId);
router.get("/check-stock/:userId", orderController.checkStockAvailability);

module.exports = router;
