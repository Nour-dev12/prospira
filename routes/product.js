const express = require("express");
const productRoute = express.Router();
const AsyncHandler = require("express-async-handler")
const Product = require("../models/product")


productRoute.get(
    "/",
    AsyncHandler(async (req, res) => {
        const products = await Product.find({}); // we won't use protect middleware bcz we don't need any key in the homepage any one can access to it and see it 
        res.json(products);
    }))




productRoute.get(
    "/:id",
    AsyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id); // we won't use protect middleware bcz we don't need any key in the homepage any one can access to it and see it 
        if(product){
            res.json(product);
        }else{
            res.status(404);
            throw new Error ("product NOT FOUND");
        }
           
    }))
module.exports = productRoute;