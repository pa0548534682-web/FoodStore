// קובץ זה אחראי על חיבור השרת למסד הנתונים MongoDB
// החיבור מתבצע באמצעות ספריית mongoose
import mongoose from 'mongoose';
// פונקציה אסינכרונית שמבצעת התחברות למסד הנתונים
export async function  connectDB  () {
try {
// ניסיון התחברות ל־MongoDB באמצעות כתובת מה־.env
await mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true, 
    useUnifiedTopology: true}
);
// הודעה שתודפס לטרמינל אם החיבור הצליח
console.log('MongoDB connected successfully');
} catch (error) {
// הדפסת שגיאה במקרה של כשל בחיבור
console.error('MongoDB connection failed:', error.message);
// עצירת הרצת השרת במקרה של שגיאה קריטית
process.exit(1);
}
};