import Order from "../model/order.js";
import mongoose from "mongoose";

//@desc     create new order
//@Route    POST /api/orders
//@access   Private
export const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0)
      return res.status(400).json({ message: "No order Item(s)" });

    const newOrder = await new Order({
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
      user: req.user._id,
    });

    await newOrder.save();
    res.status(201).json({
      orderItems: newOrder.orderItems,
      shippingAddress: newOrder.shippingAddress,
      paymentMethod: newOrder.paymentMethod,
      taxPrice: newOrder.taxPrice,
      shippingPrice: newOrder.shippingPrice,
      totalPrice: newOrder.totalPrice,
      _id: newOrder._id,
    });
  } catch (error) {
    next(error);
  }
};

//@desc     Get order by Id
//@Route    GET /api/orders/:orderId
//@access   Private
export const getOrderById = async (req, res, next) => {
  const id = req.params.orderId;
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ message: "Invalid order Id" });

  const order = await Order.findById(id).populate("user", "email name");

  if (!order) return res.status(400).json({ message: "order not found." });

  res.json({ order });
};

//@desc     Update order payment
//@Route    PUT /api/orders/:orderId
//@access   Private
export const updateOrderPayment = async (req, res, next) => {
  const id = req.params.orderId;
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ message: "Invalid order Id" });

  const order = await Order.findById(id);
  if (!order) return res.status(400).json({ message: "order not found." });

  order.isPaid = true;

  order.paidAt = Date.now();

  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer.email_address,
  };

  await order.save();

  res.json({ order });
};
