const express = require("express");
const { getNotificationList } = require("../../controllers/admin/notifications-controller");

const router = express.Router();

router.get("/notifications", getNotificationList);
 // New route

module.exports = router;
