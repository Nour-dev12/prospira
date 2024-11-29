const express = require("express");
const app= express();
const dotenv= require('dotenv')
const products= require('./data/products')

dotenv.config()

const PORT =process.env.PORT


//test api product the route:
// app.get("/api/products/", (req,res)=>{
//     res.json(products) 
// })
// app.get("/api/products/:id", (req,res)=>{
//    const product = products.find((product)=>product.id===req.params.id)
//     res.json(product) 
// })

const mongoose = require('mongoose');

//connect to DB
//mongodb+srv://netninja:set1234@cluster0.ayv0d.mongodb.net/REACT-NODE-APP
mongoose.connect(process.env.MONGOOSEDB_RUL)
    .then(()=>{
    console.log('DB connected')
    })
    .catch(err=>{
        console.log('err')
    })


const userRoute = require("./routes/user");    

const databaseSeeder = require('./databaseSeeder');

const productRoute = require('./routes/product');
const orderRoute = require("./routes/order");

app.use(express.json())


// db seeder routes 

app.use('/api/seed', databaseSeeder)

//routes for users
//api/users/login
app.use('/api/users', userRoute)



//routes for Products
app.use("/api/products", productRoute)

//routes for orders
app.use("/api/orders", orderRoute)


app.listen(PORT ||9000, ()=>{
    console.log(`server listening on port ${PORT}`);
}
)

