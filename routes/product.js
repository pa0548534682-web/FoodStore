import express from 'express';
import {
  getTotalPages,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.js';

const router = express.Router();

// GET/api/products/pages?size= -חישוב מספר העמודים להצגה באתר-
router.get('/pages', getTotalPages);



// GET /api/products/category/:category – מוצרים לפי קטגוריה
router.get('/category/:category', getProductsByCategory);

// GET /api/products/:id – שליפת מוצר לפי מזהה
router.get('/:id', getProductById);

// GET /api/products – שליפת כל המוצרים
router.get('/', getAllProducts);



// POST /api/products – יצירת מוצר
router.post('/', createProduct);



// PUT /api/products/:id – עדכון מוצר
router.put('/:id', updateProduct);



// DELETE /api/products/:id – מחיקת מוצר
router.delete('/:id', deleteProduct);


export default router;
