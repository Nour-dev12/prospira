const express = require("express");
const orderRoute = express.Router();
const protect = require("../middleware/auth");
const asyncHandler = require("express-async-handler");
const Order = require("../models/order");

orderRoute.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethods,
      shippingPrice,
      taxPrice,
      totalPrice,
      price,
    } = req.body;
    console.log(orderItems)

    if (orderItems && orderItems.length === 0) { // verify if the order iTEMS length is =0 => if there's no  an order 
      res.status(400);
      throw new Error("no order items found"); // here's the result if the length is =0 there's not an order
    } else { // else and if ther is an order so do this 
      const order = new Order({
        orderItems,
        shippingAddress,
        paymentMethods,
        shippingPrice,
        taxPrice,
        totalPrice,
        price,
        user: req.user._id,
      })
      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
})
);

// if you wanna update something you need to use the out method 
//Order payment Route
orderRoute.put(
  '/:id/payment',
  protect,
  asyncHandler(async(req,res)=>{
    const order = await Order.findById(req.params.id)
    if(order){
      console.log("Order found:", order),
      order.isPaid= true;
      order.paidAt= Date.now();
      order.paymentResult = {
        status: req.body.status,
        updated_time : req.body.updated_time,
        email_address: req.body.email_address,
      } 

      const updatedOrder = await order.save()
      console.log("Order Updated:", updatedOrder)
      res.status(200).json(updatedOrder)
    }
    else {
      console.log("Order not found for ID:", req.params.id); 
      res.status(404).json({ message: "Order Not Found"})
    }
  })

)


//we will get the order list
orderRoute.get("/", protect, asyncHandler(async(req,res)=>{
  const orders = await Order.find({user:req.user._id}).sort({_id:-1})
  if(orders){
    res.status(200).json(orders)
  }
  else{
    res.status(404);
    throw new Error("Orders Not Found")
  }
}))

//order find by ID 
orderRoute.get("/:id", protect, asyncHandler(async(req,res)=>{
  const order = await Order.findById(req.params.id).populate("user","email");
  if(order){
    res.status(200).json(order)

  }else{
    res.status(404)
    throw new Error("Orders Not Found");

  }
}))
module.exports = orderRoute
