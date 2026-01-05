import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  searchProducts,
  getRecommendedProducts,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} from '../controllers/product.js';

const router = express.Router();

// GET/api/products/pages?size= -חישוב מספר העמודים להצגה באתר-

// GET /api/products/search?q= – חיפוש מוצרים לפי שם/קטגוריה
router.get('/search', searchProducts);

// GET /api/products/recommended – מוצרים מומלצים
router.get('/recommended', getRecommendedProducts);

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
