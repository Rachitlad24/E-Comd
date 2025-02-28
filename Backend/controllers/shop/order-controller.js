const paypal = require('../../helpers/paypal')
const Order = require("../../models/Order");
const Cart = require('../../models/Cart');
const Product = require('../../models/Product')
const User = require('../../models/User')
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
require("dotenv").config();


const createOrder = async (req, res) => {
    try {
        const {
            userId,
            cartItems,
            addressInfo,
            orderStatus,
            paymentMethod,
            paymentStatus,
            totalAmount,
            orderDate,
            orderUpdateDate,
            paymentId,
            payerId,
            cartId,
          } = req.body;

          const create_payment_json = {
            intent: process.env.INTENT,
            payer: {
              payment_method: process.env.PAYMENT_METHOD,
            },
            redirect_urls: {
              return_url: process.env.RETURN_URL,
              cancel_url: process.env.CANCEL_URL,
            },
            transactions: [
              {
                item_list: {
                  items: cartItems.map((item) => ({
                    name: item.title,
                    sku: item.productId,
                    price: item.price.toFixed(2),
                    currency: process.env.CURRENCY,
                    quantity: item.quantity,
                  })),
                },
                amount: {
                  currency: process.env.CURRENCY,
                  total: totalAmount.toFixed(2),
                },
                description: "Order Payment",
              },
            ],
          };

          paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
            if (error) {
              console.log(error);
      
              return res.status(500).json({
                success: false,
                message: "Error while creating paypal payment",
              });
            } else {
              const newlyCreatedOrder = new Order({
                userId,
                cartItems,
                addressInfo,
                orderStatus,
                paymentMethod,
                paymentStatus,
                totalAmount,
                orderDate,
                orderUpdateDate,
                paymentId,
                payerId,
                cartId
              });
      
              await newlyCreatedOrder.save();
              if (paymentMethod === "cod") {
                for (let item of cartItems) {
                  let product = await Product.findById(item.productId);
                  if (!product) {
                    return res.json({
                      success: false,
                      message: `Product ${item.title} not found`,
                    });
                  }
                  if (product.totalStock < item.quantity) {
                    return res.json({
                      success: false,
                      message: `Insufficient stock for product: ${item.title}`,
                    });
                  }
                  product.totalStock -= item.quantity;
                  await product.save();
                }
          
                await Cart.findByIdAndDelete(cartId);
                return res.status(201).json({
                  success: true,
                  message: "Order placed successfully with Cash on Delivery!",
                  orderId:  newlyCreatedOrder._id,
                });
              }
      
              const approvalURL = paymentInfo.links.find(
                (link) => link.rel === "approval_url"
              ).href;
      
              res.status(201).json({
                success: true,
                approvalURL,
                orderId: newlyCreatedOrder._id,
              });
            }
          });
      

    }catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Some error occured!"
        })
        
    }
}

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.json({
        success: false,
        message: "Order not found",
      });
    }

    // 🚨 Check if payment was already processed
    if (order.paymentStatus === "paid") {
      return res.json({
        success: false,
        message: "Order has already been paid for",
      });
    }
    
    if (order.paymentMethod === "cod") {
      // For COD orders, directly confirm order
      order.paymentStatus = "pending"; // Payment is still pending for COD
      order.orderStatus = "confirmed";
    } else if (order.paymentMethod === "paypal") {
      // Ensure PayPal order has necessary payment details
      if (!paymentId || !payerId) {
        return res.json({ success: false, message: "Missing PayPal payment details" });
      }


    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;
    }
    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.json({
          success: false,
          message: 'Product ${item.productId} not found'
        });
      }

      // 🚨 Ensure stock does not go negative
      if (product.totalStock < item.quantity) {
        return res.json({
          success: false,
          message: 'Not enough stock for ${product.title}',
        });
      }

      product.totalStock -= item.quantity;
      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });

  } catch (e) {
    console.log("Payment error:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};


const getAllOrderByUser = async(req,res)=>{
  try{
    const { userId } = req.params;

    const orders = await Order.find({ userId });

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
}

const getOrderDetails = async (req, res) => {
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
const sendEmail = async (req, res) => {
  try {
  const { orderId, email } = req.body;
  console.log(orderId,'orderId');
  console.log(email,'email');
  
  
  let order = await Order.findById(orderId);
  if (!order) {
    return res.json({
      success: false,
      message: "Order can not be found",
    });
  }
  const tempPath = path.join(__dirname, process.env.ORDER_HTML);
  let orderHtml = fs.readFileSync(tempPath, "utf8");
  const pdfBuffer=await generatePdf(order)
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASSWORD,
    },
  });
  const message = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Order COnfirmation Mail",
    
    html: orderHtml
      .replaceAll("{{ORDER_NUMBER}}", order._id)
      .replaceAll("{{ORDER_TOTAL}}", order.totalAmount),
      attachments: [
        {
          filename: `Invoice_${order._id}.pdf`,
          content: pdfBuffer, // Attach PDF from memory
          contentType: "application/pdf",
        },
      ],
  };
  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.error("Error in sending email:", error);
      return res.status(500).send({
        message: "Failed to send Email of confirmation.",
        success: false,
      });
    }
    console.log("Email sent:", info.response);
    res.json({
      success:true,
      message:'Email send Successfully'
    })
  });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
  
};
const generatePdf=async(order)=>{
  const user=await User.findById(order.userId)
  if(!user){
    return res.json({
      success:false,
      message:'User not found'
    })
  }
  const browser=await puppeteer.launch({headless:'new'})
 
  const page=await browser.newPage()
  console.log(order.addressInfo.address," ",order.addressInfo.city,' ',user.userName);
  
  const tempPath=path.join(__dirname,process.env.INVOICE_HTML)
  let htmlContent= fs.readFileSync(tempPath,'utf8')
  const orderItemsHtml=order.cartItems.map((item) => `
  <tr>
    <td>${item.title}</td>
    <td>${item.quantity}</td>
    <td>$${parseFloat(item.price).toFixed(2)}</td>
    <td>$${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
  </tr>`
).join('')
htmlContent=htmlContent
.replace('{{ORDER_ID}}',order._id)
.replaceAll('{{ORDER_TOTAL}}',order.totalAmount.toFixed(2))
.replace("{{ORDER_DATE}}", new Date(order.orderDate).toLocaleDateString())
.replaceAll('{{NAME}}',user.userName)
.replace('{{ADDRESS_AREA}}',order.addressInfo.address)
.replace('{{ADDRESS_CITY}}',order.addressInfo.city)
.replace('{{ADDRESS_PINCODE}}',order.addressInfo.pincode)
.replace("{{ORDER_ITEMS}}", orderItemsHtml);
await page.setContent(htmlContent)
const pdfBuffer=await page.pdf({format:"A4",printBackground:true})
await browser.close()
return pdfBuffer
}
const changePaymentStatus=async(req,res)=>{
  try {
    const {orderId}=req.body
    const order=await Order.findById(orderId);
     if(!order){
      return res.json({
        success:false,
        message:"Order is not found"
      }) 
     }
     if(order.orderStatus==='delivered' && order.paymentMethod==='cod')
      {
        order.paymentStatus='paid'
      }
      res.json({
        success:true,
        message:"Payment status is change to paid",
        data:order
      })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
     
}


module.exports ={createOrder,capturePayment,getAllOrderByUser,getOrderDetails, sendEmail,changePaymentStatus} 