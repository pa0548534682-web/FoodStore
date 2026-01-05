import Order from '../models/order.js';
import User from '../models/user.js';
import Product from '../models/product.js'; 

/*
*שליפת כל ההזמנות במערכת
 *יצירת הזמנה חדשה
* עדכון פרטי הזמנה (לדוגמה: כתובת למשלוח)
* עדכון סטטוס הזמנה(כולל מחיקת הזמנה)
* שליפת הזמנות של משתמש
* שליפת הזמנה לפי מזהה
* שליפת הזמנות לפי סטטוס
 *שליפת הזמנות לפי מוצר 
*/
export const createOrder = async (req, res) => {
    let { userId, items } = req.body;
    if (!userId || !items ) 
      return res.status(400).json({title:"Missing details",message: 'userId or product are required' });
    if(length(items)===0)
      return res.status(400).json({title:"Empty order",message: 'Order must contain at least one item' });
    try{
      let user=await User.findById(userId);
      if(!user)
        return res.status(404).json({title:"User not found",message: 'User does not exist' });
      for(let i=0;i<items.length;i++){
        let product=await Product.findById(items[i].productId);
        if(!product)
          return res.status(404).json({title:"Product not found",message: `Product with ID ${items[i].productId} does not exist` });
      }
      let newOrder = new Order({ 
        userId,
        items,
        totalPrice: items.reduce((total, item) => total + item.price * item.quantity, 0),
        status: 'pending'
      })
    await newOrder.save();
    return res.status(201).json(newOrder);
    }catch(err){
    return res.status(500).json({title:"Error adding order", message: err.message });
  }
}

/*
 שליפת כל ההזמנות במערכת
*/
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({title:"Error retrieving orders", message: error.message });
  }
};

/*
 שליפת הזמנה בודדת לפי מזהה
*/
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
   return res.json(order);
  } catch (error) {
   return  res.status(500).json({ message: error.message });
  }
};

/*
 שליפת כל ההזמנות של משתמש מסוים
*/
export const getOrdersByUser = async (req, res) => {
  try {
    let orders = await Order.find({ userId: req.params.userId });
    return res.json(orders);
  } catch (error) {
   return   res.status(500).json({ title:"Error retrieving oredrs",message: error.message });
  }
};

//שליפת הזמנות לפי סטטוס
export const getOrdersByStatus = async (req, res) => {
  try {
    let ordersByStatus = await Order.find({ status: req.params.status });
    return res.json(ordersByStatus);
  } catch (error) {
   return   res.status(500).json({ title:"Error retrieving oredrs",message: error.message });
  }
};

//שליפת הזמנות לפי מוצר
export const getOrdersByProduct = async (req, res) => {
  try {
                           
    let ordersByProduct = await Order.find({ 'items.productId': req.params.productId });
    return res.json(ordersByProduct);
  } catch (error) {
   return   res.status(500).json({ title:"Error retrieving oredrs",message: error.message });
  }
};

/*
 עדכון סטטוס הזמנה (לדוגמה: נשלחה, בוטלה)
*/
export const updateOrderStatus = async (req, res) => {
   let orderId=req.params.id;
   let { status }=req.body;
    if(!status||!['shipped', 'delivered', 'canceled'].includes(status))
      return res.status(400).json({title:"Invalid status",message: 'Status must be one of: shipped, delivered, canceled' });
      try {
    let updatedOrder = await Order.findById(orderId)
    if (!updatedOrder) 
      return res.status(404).json({title:"invalid order",  message: 'Order not found' });
    if(status=="canceled" && updatedOrder.status!="pending")
      return res.status(400).json({title:"cannot cancel", message: 'Only pending orders can be canceled' });
    if(status==="shipped" && updatedOrder.status!="pending")
      return res.status(400).json({title:"cannot ship", message: 'Only pending orders can be marked as shipped' });                                                                     
    if(status==="delivered" && updatedOrder.status!="shipped")
      return res.status(400).json({title:"cannot deliver", message: 'Only shipped orders can be marked as delivered' });
    updatedOrder.status=status;
    await updatedOrder.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({title:"Error updating order status", message: error.message });
  }
};

/*
 מחיקת הזמנה מהמערכת
*/
export const deleteOrder = async (req, res) => {
  try {
    let updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,                 // המזהה של ההזמנה (לפי ה-ID שנשלח ב-URL)
      { status: 'canceled ' },            // העדכון של הסטטוס (הערך החדש שיבוצע)
      { new: true }                  // להחזיר את ההזמנה אחרי העדכון, לא את הערך הקודם
    );
    if (!updatedOrder) {
      return res.status(404).json({title:"Error", message: 'Order not found' });
    }
    return res.json({ title: 'Order deleted successfully', message: updatedOrder });
  } catch (error) {
    return res.status(500).json({ title:"Error cancelling order",message: error.message });
  }
};
