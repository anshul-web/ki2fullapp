const express = require("express");
const { requireSignin, adminMiddleware } = require("../../common-middleware");
const {
  updateOrder,
  getCustomerOrders,
  getOrder
} = require("../../controller/admin/order");
const router = express.Router();

router.post(`/order/update`, requireSignin, adminMiddleware, updateOrder);
router.post(`/order/getCustomerOrders`, requireSignin, adminMiddleware, getCustomerOrders);
router.post("/order/getOrder", requireSignin, adminMiddleware, getOrder);

module.exports = router;