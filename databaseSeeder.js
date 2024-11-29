const router = require("express").Router();
const User = require("./models/user");
const users = require("./data/users");
const Product = require("./models/product");
const products = require("./data/products");
const AsynHandler = require("express-async-handler"); //Setup Express Error Handler

router.post( 
  "/users",
  AsynHandler(async (req, res) => {
    await User.deleteMany({}); //Deletes all existing users from the User collection.
    const UserSeeder = await User.insertMany(users); //Inserts new user data from users (assumed to be an array of user objects from data/Users.js).
    res.send({ UserSeeder });//Sends the result back as JSON
  })
);

router.get(
  "/products",
  AsynHandler(async (req, res) => {
    await Product.deleteMany({});
    const ProductSeeder = await Product.insertMany(products);
    res.send({ ProductSeeder });
  })
);

module.exports = router;