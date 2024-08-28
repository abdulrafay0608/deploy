import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";

// Create new Order
export const newOrderController = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    const order = await orderModel.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });

    res.status(201).send({
      success: true,
      message: "Order Create Succesfully",
      order,
    });
  } catch (error) {
    console.log(`New Order Error ${error}`);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
};

// get Single Order
export const getSingleOrderController = async (req, res) => {
  try {
    const order = await orderModel
      .findById(req.params.id)
      .populate("user", "name email");

    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found with this Id",
      });
    }

    res.status(200).send({
      success: true,
      message: "get Single Order Successfully",
      order,
    });
  } catch (error) {
    console.log(`Get Single Order Error ${error}`);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
};

// get logged in user  Orders
export const myOrdersController = async (req, res) => {
  try {
    const orders = await orderModel.find({ user: req.user._id });

    res.status(200).send({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(`Get Logged In User Order Error ${error}`);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
};

// get all Orders -- Admin
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel.find();

    let totalAmount = 0;

    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });

    res.status(200).send({
      success: true,
      message: "Get All Order Amount Successfully",
      totalAmount,
      orders,
    });
  } catch (error) {
    console.log(`Get All Order Error ${error}`);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
};

// update Order Status -- Admin
export const updateOrderStatusController = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found with this Id",
      });
    }

    if (order.orderStatus === "Delivered") {
      return res.status(400).send({
        success: false,
        message: "You have already delivered this order",
      });
    }

    if (req.body.status === "Shipped") {
      order.orderItems.forEach(async (o) => {
        await updateStock(o.product, o.quantity);
      });
    }
    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).send({
      success: true,
      message: "Order Update Successfully",
      order,
    });
  } catch (error) {
    console.log(`Update Order Status Error ${error}`);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
};

async function updateStock(id, quantity) {
  try {
    const product = await productModel.findById(id);

    product.stock -= quantity;

    await product.save({ validateBeforeSave: false });
  } catch (error) {
    console.log(`Update Stock Error ${error}`);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
}

// delete Order -- Admin
export const deleteOrderController = async (req, res) => {
  const order = await orderModel.findById(req.params.id);

  if (!order) {
    return res.status(404).send({
      success: false,
      message: "Order not found with this Id",
    });
  }

  await order.remove();

  res.status(200).send({
    success: true,
    message: "Order Delete Successfully",
  });
};
