const express= require("express")
const userRoute = express.Router();
const AsyncHandler = require("express-async-handler");
const { Error } = require("mongoose");
const generateToken = require("../utils/generateToken");
const protect = require("../middleware/auth");
const User = require("../models/user")

//register route
userRoute.post(
    "/login",
    AsyncHandler(async (req, res) => {

      const { email, password } = req.body;
      console.log("Received email:", email);
      console.log("Received password:", password);


      const foundUser = await User.findOne({ email });
      console.log("Found User:", foundUser);


      if (foundUser && (await foundUser.matchPassword(password))) {
        res.json({
          _id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          isAdmin: foundUser.isAdmin,
          token: generateToken(foundUser._id),
          createdAt: foundUser.createdAt,
        });
      } else {
        res.status(401).json({ message: "Invalid Email or Password" });
      }
    })
  ); // to send the email and pass od the user
 
 
 //register route:
 userRoute.post('/', 
  AsyncHandler(async (req, res) => {

  const { name, email, password} = req.body; //we check if the user exist we direct the user to login 
  const existUser = await User.findOne({ email });
  if (existUser){
    res.status(400);
    throw new Error("User Alredy Exist");
  }else { // if it doesn't exist we do the registration process
    const user = await User.create({
      name,
      email,
      password
    })

    if(user){
      res.status(201).json({
        _id: user._id,
        name : user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token : generateToken(user._id),
        createdAt: user.createdAt,
      })
      
    }else{
      res.status(400);
      throw new Error (" Invalid User Data");
    }

  }

 })
);


//get auth profile data
userRoute.get(
  "/profile",
  protect,
  AsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      });
    } else {
      res.status(404);
      throw new Error("USER NOT FOUND");
    }
  })
);
 

//user profile update
userRoute.put(
  "/profile", protect, AsyncHandler(async(req,res,next)=>{ //The protect middleware is used to ensure only authenticated users can access this route.
    const user= await User.findById(req.user._id)
    if (user) {
      user.name= req.body.name || user.name
      user.email = req.body.email || user.email
      if(req.body.password){
        user.password = req.body.password
      }
      const updatedUser= await user.save()
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        createdAt: updatedUser.createdAt,
        token:generateToken(updatedUser._id)
      })
    } else {
      res.status(404)
      throw new Error("USER NOT FOUND")      
    }
  })
)
 
 
 
 
  module.exports = userRoute;