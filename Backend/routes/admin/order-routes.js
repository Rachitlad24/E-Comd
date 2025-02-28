const express = require("express");

const {
 getAllOrdersOfAllUsers,
 getOrderDetailsForAdmin,
 updateOrderStatus,
 changePaymentStatus
} = require("../../controllers/admin/order-controller");

const router = express.Router();


router.get("/get",getAllOrdersOfAllUsers);
router.get("/details/:id",getOrderDetailsForAdmin);
router.put("/update/:id",updateOrderStatus);
router.put('/status',changePaymentStatus)



module.exports = router;