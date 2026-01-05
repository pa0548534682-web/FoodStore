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
  //  מדועהפרויקט לא מצליח לעלות לgithub?
//  // ודא שיצרת מאגר (Repository) חדש ב-GitHub
// יש שם קובץ README.md כברירת מחדל
// איך לדחוף (Push) את הקוד המקומי שלך למאגר ב-GitHub?
// // 1. פתח טרמינל בספריית הפרויקט המקומית שלך
// // 2. הרץ את הפקודות הבאות:
// git init
// git add . אך איך מעלים בפעם הראשונה?
// git commit -m "Initial commit"
// git branch -M main
//git branch -M main
//  :הסבר על הפקודה
//  // git init - יוצר מאגר Git חדש בספרייה הנוכחית
//  // git add . - מוסיף את כל הקבצים לשלב ההכנה (staging area) לקומיט
//  // git commit -m "Initial commit" - יוצר קומיט עם ההודעה הנתונה
//  // git branch -M main - משנה את שם הסניף הראשי ל-main
// מה זאת אומרת?
//  // ברירת המחדל של GitHub לסניף הראשי היא main ולא master
//  // לכן חשוב לשנות את שם הסניף המקומי שלך ל-main כדי להתאים
// 
// // // 3. חבר את המאגר המקומי שלך למאגר הרחוק ב-GitHub
// 