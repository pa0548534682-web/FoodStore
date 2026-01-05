import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import userRoutes from './routes/user.js';
import productRoutes from './routes/product.js';
import orderRoutes from './routes/order.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
// הוספת ה-Middleware הזה לפני הגדרת ה-Routes שלך
app.use((req, res, next) => {
  console.log(`\x1b[36m%s\x1b[0m`, `--- בתהליך עיבוד בקשה: ${req.method} ${req.url} ---`); // צבע תכלת בטרמינל
  console.log(`זמן: ${new Date().toLocaleString()}`);
  
  // הדפסת כותרות חשובות (כדי לוודא שפוסטמן שולח JSON)
  console.log(`Content-Type: ${req.get('Content-Type')}`);

  // הדפסת ה-Body במידה וקיים (חשוב במיוחד ל-POST/PUT)
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`Body שנשלח:`, JSON.stringify(req.body, null, 2));
  } else if (req.method === 'POST' || req.method === 'PUT') {
    console.log(`\x1b[31m%s\x1b[0m`, `אזהרה: התקבל גוף בקשה (Body) ריק!`);
  }

  console.log(`-----------------------------------------------`);
  next();
});
console.log("HELLO")
// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// חיבור ל־MongoDB (גרסה מעודכנת)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });
 