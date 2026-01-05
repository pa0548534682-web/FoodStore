import mongoose from 'mongoose';

// הגדרת סכמת מוצר
const productSchema = new mongoose.Schema(
  {
    // שם המוצר
    name: {
      type: String,
      required: true
    },

    // תיאור המוצר
    description: {
      type: String,
      required: true
    },

    // מחיר המוצר
    price: {
      type: Number,
      required: true
    },

    // קטגוריית המוצר
    category:[ {
      type: String,
      required: true
    }],
    // כתובת תמונה
    images:[{
      type: String

    }],
//מרכיבים
    ingredients:[{
      type: String,
      required: true
    }],
},
  {
    timestamps: true
  }
);
const Product = mongoose.model('Product', productSchema);
export default Product;
