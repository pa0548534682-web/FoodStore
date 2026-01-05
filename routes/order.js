import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  getOrdersByStatus,
  getOrdersByProduct,
  updateOrderStatus,
  deleteOrder
} from '../controllers/order.js';

const router = express.Router();

/* CRUD הזמנות */

// POST /api/orders – יצירת הזמנה חדשה
router.post('/', createOrder);

// GET /api/orders/user/:userId – שליפת הזמנות של משתמש
router.get('/user/:userId', getOrdersByUser);
// GET /api/orders/:id – שליפת הזמנה לפי מזהה
router.get('/:id', getOrderById);
// GET /api/orders – שליפת כל ההזמנות
router.get('/', getAllOrders);
//GET/api/orders/status/:status -שליפת הזמנות לפי סטטוס
router.get('/status/:status', getOrdersByStatus);
//GET /api/orders/product/:productId -שליפת הזמנות לפי מוצר 
router.get('/product/:productId', getOrdersByProduct);

// PUT /api/orders/:id – עדכון סטטוס הזמנה
router.put('/:id', updateOrderStatus);

// DELETE /api/orders/:id – מחיקת הזמנה
router.delete('/:id', deleteOrder);

export default router;
