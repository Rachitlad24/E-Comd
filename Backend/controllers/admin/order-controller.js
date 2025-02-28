

const Order = require('../../models/Order')

const getAllOrdersOfAllUsers = async(req,res)=>{
  try{
  

    const orders = await Order.find({ });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  }
  catch(e){
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
    
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};
const updateOrderStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { orderStatus } = req.body;
  
      const order = await Order.findById(id);
  
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found!",
        });
      }
  
      await Order.findByIdAndUpdate(id, { orderStatus });
  
      res.status(200).json({
        success: true,
        message: "Order status is updated successfully!",
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Some error occured!",
      });
    }
  };

  const changePaymentStatus=async(req,res)=>{
    try{
      const{orderId}=req.body
      let order=await Order.findById(orderId);
      console.log(order);

      if(!order){
        return res.json({
          success:false,
          message:"Order is not found"
        })
      }
      if(order.orderStatus==='delivered' && order.paymentMethod==='cod'){
        order.paymentStatus='paid'
        await order.save()
        return res.json({
          success:true,
          message:'Payment status is change to paid',
          data:order
        })
      }
      res.json({
        success:false,
        message:"Payment status is not change to paid"
      })
    }
    catch(error){
      console.log(error);
      res.status(500).json({
        success:false,
        message:'Some error occured'
      });
      
    }
  }


module.exports={getAllOrdersOfAllUsers,getOrderDetailsForAdmin,updateOrderStatus,changePaymentStatus}