const e = require("express");
const Order = require("../models/order.js");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

console.log(process.env.STRIPE_SECRET_KEY);


const createOrder = async (req, res) => {
  try {
    const {
      fullName,
      email,
      state,
      city,
      locality,
      productName,
      productPrice,
      quantity,
      category,
      image,
      vendorId,
      buyerId,
      paymentStatus,
      paymentIntentId,
      paymentMethod,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !state ||
      !city ||
      !locality ||
      !productName ||
      !productPrice ||
      !quantity ||
      !category ||
      !image ||
      !vendorId ||
      !buyerId ||
      !paymentStatus ||
      !paymentIntentId ||
      !paymentMethod
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const createdAt = new Date().getMilliseconds(); // Get the current timestamp date and time
    // Create a new order
    const newOrder = new Order({
      fullName,
      email,
      state,
      city,
      locality,
      productName,
      productPrice,
      quantity,
      category,
      image,
      vendorId,
      buyerId,
      createdAt,
      paymentStatus,
      paymentIntentId,
      paymentMethod,
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: error.message });
  }
};

// payment api
// const createPaymentIntent = async (req, res) => {
//   try {
//       const {orderId , paymentMethodId , currency = "pkr"} = req.body;
//       // validate the presence of the required fields
//       if(!orderId || !paymentMethodId || !currency){
//           return res.status(400).json({message: "All fields are required"});
//       }

//       // query for the order by orderId
//       const order = await Order.findById(orderId);

//       if(!order){
//           return res.status(404).json({message: "Order not found"});
//       }

//       // calculate the total amount of the order total amount = product price * quantity
//       const totalAmount = order.productPrice * order.quantity;

//       // Ensure the amount is at least $0.50 or more than 0
//       const minimumAmount = 0.5;
//       if(totalAmount < minimumAmount){
//           return res.status(400).json({message: "Amount must be at least $0.50"});
//       }
      
//       // convert total amount to cents(stripe requires the amount in cents)
//       const amountInCents = Math.round(totalAmount * 100);

//       // Now create the payment intent with the correct amount
//       const paymentIntent = await stripe.paymentIntents.create({
//         amount: amountInCents,
//         currency: currency,
//         payment_method: paymentMethodId,
//         automatic_payment_methods: {enabled: true}
//       });

//       console.log(`Payment Status: ${paymentIntent.status}`);
      
//       // return the client secret to the client
//       res.status(200).json({
//         status: "success",
//         paymentIntent: paymentIntent.id,
//         amount: paymentIntent.amount / 100,
//         currency: paymentIntent.currency,
//       });

//   } catch (error) {
//     console.error("Error creating payment intent:", error);
//     res.status(500).json({ error: error.message });
//   }
// }

//

// method for simple payment intent
const paymentIntent = async (req, res) => {
  try {
    const {amount , currency} = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      // automatic_payment_methods: {enabled: true}
    });

    console.log(`Payment Status: ${paymentIntent.status}`);
      
    // return the client secret to the client
    res.status(200).json({paymentIntent});
    
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: error.message });
  }
}
// mthod for payment intent by id
const getPaymentIntentById = async (req, res) => {
  try {
    const {id} = req.params;
    const paymentIntent = await stripe.paymentIntents.retrieve(id);
    res.status(200).json(paymentIntent);
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: error.message });
  }
}
const getOrdersByBuyerId = async (req, res) => {
  try {
    const { buyerId } = req.params;
    const orders = await Order.find({ buyerId });

    if (orders.length == 0) {
      return res
        .status(400)
        .json({ message: "No orders found for this buyer" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: error.message });
  }
};

const getOrdersByVendorId = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const orders = await Order.find({ vendorId });

    if (orders.length == 0) {
      return res
        .status(400)
        .json({ message: "No orders found for this vendor" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateOrderDelivered = async (req, res) => {
  try {
    const { id } = req.params;
    const updateOrder = await Order.findByIdAndUpdate(
      id,
      { delivered: true, processing: false },
      { new: true }
    );
    if (!updateOrder) {
      return res.status(404).json({ message: "Order not found" });
    } else {
      res.status(200).json(updateOrder);
    }
  } catch (error) {
    console.error("Error deliverd order:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateOrderProcessing = async (req, res) => {
  try {
    const { id } = req.params;
    const updateOrder = await Order.findByIdAndUpdate(
      id,
      { processing: false, delivered: false },
      { new: true }
    );
    if (!updateOrder) {
      return res.status(404).json({ message: "Order not found" });
    } else {
      res.status(200).json(updateOrder);
    }
  } catch (error) {
    console.error("Error Cancel order:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
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
};
