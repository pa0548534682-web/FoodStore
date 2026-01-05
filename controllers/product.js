import Product from '../models/product.js';
//הצגת כל המוצרים
//הצגת מוצרים לפי קטגוריה
// שליפת מוצר בודד לפי מזהה (ID)
//הכנסת מוצר חדש
//מחיקת מוצר
//עדכון מוצר

// מחשב את מספר דפי המוצרים שיוצגו באתר
export const getTotalPages = async (req, res) => {
  let limit =req.query.limit || 4;
  try {
    let count = await Product.countDocuments();
    let totalPages = Math.ceil(count / limit);
    return res.json({ totalPages });
  } catch (error) {
    return res.status(500).json({ title: "Error retrieving total pages", message: error.message });
  }
}
/*
 שליפת כל המוצרים להצגה באתר
*/
export const getAllProducts = async (req, res) => {
  let limit = req.query.limit || 4;
  let page = req.query.page || 1;
  try {
    const products = await Product.find({}).skip((page - 1) * limit).limit(limit);
   return res.json(products);
  } catch (error) {
    return res.status(500).json({title:"Error retieving prodeucts", message: error.message });
  }
}; 

/*
 שליפת מוצר בודד לפי מזהה (ID)
*/
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) 
      return res.status(404).json({title:"no such product", message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({title:"Error", message: error.message });
  }
};
/*
 חיפוש מוצרים לפי קטגוריה
*/
export const searchProducts = async (req, res) => {
  try {
    const query = req.query.q;
    if(!query)
      return res.status(400).json({title:"missing query", message: 'Search query is required' });
    const products = await Product.find({
      category: { $regex: query, $options: 'i' }
      //ביטוי רגולרי המאפשר למצוא חלק מתת מחרוזת וכן ללא התחשבות באותיות קטנות או גדולות
    });
    return res.json(products);
  } catch (error) {
    return res.status(500).json({title:"Error searching products", message: error.message });
  }
};
/*
 שליפת מוצרים לפי קטגוריה
*/
export const getProductsByCategory = async (req, res) => {
  try {
// נחפש את כל המוצרים ששייכים לקטגוריה שנשלחה בפרמטר במערך הפרמטרים בכל מוצר
    const category = req.params.category;
    let prodeucts = await Product.find({ category: { $in: [category] } });

    return res.json(products);
  } catch (error) {
    res.status(500).json({title:"Error!", message: error.message });
  }
};



/*
 יצירת מוצר חדש במערכת
*/
export const createProduct = async (req, res) => {
  try {
    if(!req.body)
      return res.status(400).json({title:"missing body", message: 'Product data is required' });
    let { name, description, price, category, images, ingredients } = req.body;
    if(!name || !description || !price || !category || !ingredients||!images)
      return res.status(400).json({title:"missing fields", message: 'one or more of product fields are required' });
   if (price < 0)
      return res.status(400).json({title:"invalid price", message: 'Price must be greater than 0' });
let existingProduct = await Product.findOne({ name: name, ingredients: { $all: ingredients, $size: ingredients.length } });
 if(existingProduct)
      return res.status(409).json({title:"product exists", message: 'Product with the same name and ingredients already exists' });
    const newProduct = new Product(req.body);
    await newProduct.save();
    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({title:"Error creating product", message: error.message });
  }
};



/*
 עדכון פרטי מוצר לפי מזהה
*/
export const updateProduct = async (req, res) => {
  try {
    // בדיקת קיום גוף הבקשה
    if(!req.body)
      return res.status(400).json({title:"missing body", message: 'Product data is required for update' });
    let { name, description, price, category, images, ingredients } = req.body;
      // בדיקה עבור כל ערך : אם  התקבל ערך נבצע השמה אם לא נשמור על הערך המקורי
      let updateObject={};
      if(name!==undefined) updateObject.name=name;
      if(description!==undefined) updateObject.description=description;
      if(price!==undefined){
        if (price < 0)
          return res.status(400).json({title:"invalid price", message: 'Price must be greater than 0' });
        updateObject.price=price;
      }
      if(category!==undefined) updateObject.category=category;
      if(images!==undefined) updateObject.images=images;
      if(ingredients!==undefined) updateObject.ingredients=ingredients;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateObject },
      { new: true }
    );      
    // הסבר 4 השורות הקודמות:
    // findByIdAndUpdate - פונקציה של Mongoose לעדכון מסמך לפי מזהה
    // req.params.id - מזהה המוצר שמעודכן
    // { $set: updateObject } - אובייקט המכיל את השדות המעודכנים
    // כלומר: כל שדה שקיבלנו בבקשה יעדכן את הערך שלו במסמך
    // לפי הערך החדש, ושדות שלא נשלחו יישארו ללא שינוי
    // האופרטור $set משמש לעדכון שדות ספציפיים במסמך
    // נדע אילו שדות לעדכן לפי האובייקט updateObject
    // { new: true } - אופציה שמחזירה את המסמך המעודכן ולא המקורי

    //במקרה שלא נמצא מוצר עם המזהה הנתון 
    if (!updatedProduct) {
      return res.status(404).json({title:"Error! ", message: 'Product to update not found' });
    }

   return res.json(updatedProduct);
  } catch (error) {
   return res.status(500).json({title:"product not found", message: error.message });
  }
};

/*
 מחיקת מוצר מהמערכת לפי מזהה
*/
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ title:"Success!",message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// איך מעלים פרויקט לענן (render.com) - מדריך מלא:
// https://www.youtube.com/watch?v=1hHMwLxN6EM
// איך מגדירים משתני סביבה ב-Render.com:
// https://www.youtube.com/watch?v=Yk7n6YyM8Eg
// איך מחברים MongoDB Atlas לפרויקט ב-Render.com:
// https://www.youtube.com/watch?v=Z9pXU6Y1h1g
// לא קישורים אלה הסבר ממש כאן:
// לא רוצה קישור- הסבר בעמוד זה!
// 1. יוצרים חשבון ב-Render.com ומתחברים
// 2. יוצרים Web Service חדש ומחברים אותו למאגר הקוד שלנו ב-GitHub
// 3. מגדירים משתני סביבה (Environment Variables) בפרויקט ב-Render:
//    - MONGODB_URI - מחרוזת החיבור ל-MongoDB Atlas
//    - PORT - פורט ההאזנה של השרת (לרוב 10000 או 3000)
// 4. מגדירים את פקודת ההרצה של השרת (Start Command):
//    - לדוגמה:  node index.js  או  npm start
// 5. לוחצים על Create Web Service והפרויקט עולה לאוויר תוך מספר דקות
// זהו?
// כן, זהו! השרת אמור לפעול ולהיות נגיש דרך ה-URL שהוקצה לו ב-Render.com