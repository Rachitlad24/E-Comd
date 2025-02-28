const express = require("express");

const {
  createOrder,
  capturePayment,
  getAllOrderByUser,
  getOrderDetails,
  sendEmail
} = require("../../controllers/shop/order-controller");

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture",capturePayment);
router.get("/list/:userId",getAllOrderByUser);
router.get("/details/:id",getOrderDetails);
router.post('/mail',sendEmail);


module.exports = router;