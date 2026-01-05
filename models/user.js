// מודל משתמש – מייצג משתמש במערכת (לקוחות ומנהלים)
// בשלב זה אין הבדל בהרשאות – לכולם מותר הכל
import mongoose from 'mongoose';

// הגדרת סכמת המשתמש
const userSchema = new mongoose.Schema(
  {
    // שם מלא של המשתמש
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required:true
     
    },
    phone: {
      type: String,
      required:true
    },
     // כתובת אימייל – משמשת להתחברות
     email: {
        type: String,
        required: true,
        unique: true
      },
      // סיסמה מוצפנת באמצעות bcryptjs
      password: {
        type: String,
        required: true
      },
        // תפקיד המשתמש (לעתיד – ללא אכיפה כרגע)
      role: {
        type: String,
        default: 'customer'
      },

    },
    {
      // הוספת שדות createdAt ו־updatedAt אוטומטית
      timestamps: true
    }
);

// יצירת מודל User וייצואו
const User = mongoose.model('User', userSchema);
export default User;