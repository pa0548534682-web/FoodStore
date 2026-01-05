import {hash,compare,hashSync,compareSync} from 'bcryptjs';
import User from '../models/user.js';

/*
 רישום משתמש חדש למערכת
 כולל:
 - בדיקה אם קיים משתמש
 - הצפנת סיסמה
 - אימות "אני לא רובוט" (לוגי)
*/


//שליפת כל המשתמשים במערכת
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(
      { password: 0 }        // שדות להחרגה
    );
    return res.json(users);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      title: "Error retrieving users"
    });
  }
};
// רישום משתמש חדש
export const registerUser = async (req, res) => {
  try {
    if(!req.body)
      return res.status(400).json({ title: "missing body", message: 'Invalid request' });
    
    let { name,address,phone, email, password } = req.body;
    if(!password||!address )
      if(!name||name.length<2){
        return res.status(404).json({ title: "invalid name", message: 'Name is invalid or too short' });
      }
      return res.status(400).json({ title: "missing fields", message: 'Name, email and password are required' });
    if(!phone||phone.length<9||phone[0]!=0){
      return res.status(400).json({ title: "invalid phone", message: 'Phone number is invalid or wrong' });
    }
    if(!email||email.indexOf('@')===-1||email.indexOf('.')===-1){
      return res.status(400).json({ title: "invalid email", message: 'Email is invalid or wrong' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ title: "user exists", message: 'User already exists' });

    // הצפנת סיסמה
    let hashedPassword = await hashSync(password, 10);
    
    // יצירת משתמש חדש
    const user = new User({
      name,
      address,
      phone,
      email,
      password: hashedPassword
    });

    await user.save();

    let { pass, ...userData } = user.toObject(); // הסתרת הסיסמה מהתשובה

    return res.status(201).json({ title: "user created", message: 'User registered successfully', userData });

  } catch (error) {
    return res.status(500).json({ title: "server error", message: error.message });
  }                                          
};                                           
                                             
                                             
                                             
/*                                           
 התחברות משתמש קיים באמצעות אימייל וסיסמה
*/                                          
export const loginUser = async (req, res) => {
  try {
    // בבקשה body  בדיקה אם יש 
    if (!req.body) {
      return res.status(400).json({ 
        title: "missing body", 
        message: "Invalid request" 
      });
    }

    const { email, password } = req.body;

    // בדיקה אם שדות קיימים
    if (!email || !password) {
      return res.status(400).json({ 
        title: "missing fields", 
        message: "Email and password are required" 
      });
    }

    // חיפוש משתמש לפי אימייל
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        title: "Invalid email or password", 
        message: "Email is incorrect" 
      });
    }

    // בדיקת סיסמה
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        title: "Invalid email or password", 
        message: "Password is incorrect" 
      });
    }

    // הסתרת הסיסמה מהתשובה
    const { password: pass, ...userData } = user.toObject();

    return res.json({ 
      title: "login successful", 
      message: "Login successful", 
      userData 
    });

  } catch (error) {
    return res.status(500).json({ 
      title: "server error", 
      message: error.message 
    });
  }
};
/*
 עדכון פרטי משתמש לפי מזהה
 ניתן לעדכן שם ואימייל
*/

export const updateUser = async (req, res) => {
  try {
    let { name,address,phone, email, password } = req.body;
    let updateObject={};
    if(name!==undefined) {
      if(name.length<2){
        return res.status(400).json({ title: "invalid name", message: 'Name is invalid or too short' });
      }
      updateObject.name=name;
    }
    if(address!==undefined) updateObject.address=address;
    if(phone!==undefined){
      if(phone.length<9||phone[0]!=0){
        return res.status(400).json({ title: "invalid phone", message: 'Phone number is invalid or wrong' });
      }
      updateObject.phone=phone; 
    }
    if(email!==undefined) {
      if(email.indexOf('@')===-1||email.indexOf('.')===-1){
        return res.status(400).json({ title: "invalid email", message: 'Email is invalid or wrong' });
      }
      updateObject.email=email;
    }
    let updatedUsers = await User.findByIdAndUpdate(req.params.id,updateObject,{new:true}).select('-password');
    if (!updatedUsers) 
      return res.status(404).json({title:"error!", message: 'User not found' });
    return res.json(updatedUsers);
  } catch (error) {
    res.status(500).json({title:"Error update user", message: error.message });
  }
};

/*
 מחיקת משתמש מהמערכת לפי מזהה
*/
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' ,deleteUser: deletedUser});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};