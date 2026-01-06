import express from 'express';
import {
  getAllUsers,
  registerUser,
  loginUser,
  updateUser,
  deleteUser
} from '../controllers/user.js';

const router = express.Router();

/*
  POST /api/users/register
  רישום משתמש חדש כולל הצפנת סיסמאות"
*/ 
router.post('/register', registerUser);

/*
  POST /api/users/login
  התחברות משתמש קיים באמצעות אימייל וסיסמה
*/
router.post('/login', loginUser);




/*
  GET /api/users
  שליפת כל המשתמשים
*/
router.get('/', getAllUsers);


/*
  PUT /api/users/:id
  עדכון פרטי משתמש
*/
router.put('/:id', updateUser);

/*
  DELETE /api/users/:id
  מחיקת משתמש
*/
router.delete('/:id', deleteUser);

export default router;
