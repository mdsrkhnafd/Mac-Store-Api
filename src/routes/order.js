const express = require("express");
const { auth, vendorAuth } = require("../middleware/auth.js");

const {
  createOrder,
  // createPaymentIntent,
  paymentIntent,
  getPaymentIntentById,
  getOrdersByBuyerId,
  getOrdersByVendorId,
  updateOrderDelivered,
  updateOrderProcessing,
  deleteOrderById,
  getAllOrders,
} = require("../controllers/order.controller.js");
const orderRouter = express.Router();

// Api for creating order
orderRouter.post("/api/orders", auth, createOrder);

// api for payment
// orderRouter.post("/api/payment", createPaymentIntent);

// api for payment-intent
orderRouter.post("/api/payment-intent",auth, paymentIntent);

// api for payement-intent by id
orderRouter.get("/api/payment-intent/:id",auth, getPaymentIntentById);


// Api for getting orders by buyerId
orderRouter.get("/api/orders/:buyerId",auth, getOrdersByBuyerId);

// Api for getting orders by vendorId
orderRouter.get("/api/orders/vendors/:vendorId", auth,vendorAuth, getOrdersByVendorId);

// Api for update delivered status to true
orderRouter.patch("/api/orders/:id/delivered", updateOrderDelivered);

// Api for update processing status to false
orderRouter.patch("/api/orders/:id/processing", updateOrderProcessing);

// Api for delete a specific order by _id
orderRouter.delete("/api/orders/:id", auth, deleteOrderById);

// Api for getting all orders
orderRouter.get("/api/orders", getAllOrders);

module.exports = orderRouter;
