// מודל הזמנה – מייצג הזמנה שבוצעה על ידי משתמש
import mongoose from 'mongoose';
// הגדרת סכמת הזמנה
const orderSchema = new mongoose.Schema(
  {
    // מזהה המשתמש שביצע את ההזמנה
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // פריטי ההזמנה (מגיעים מהעגלה בריאקט)
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        price: {
          type: Number,
          required: true
        }
      }
    ],
    // סכום כולל להזמנה
    totalPrice: {
      type: Number,
      required: true
    },

    // סטטוס ההזמנה
    status: {
      type: String,
      enum: ['pending', 'shipped', 'delivered', 'canceled'],
      default: 'pending'
    } 
  },
  {
 timestamps: true
  }
);
// יצירת מודל Order
export const  Order = mongoose.model('Order', orderSchema);
export default Order;  