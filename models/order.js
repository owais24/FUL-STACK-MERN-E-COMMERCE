const mongoose= require("mongoose")

const {ObjectId}=mongoose.Schema;

const ProductCartSchema= new mongoose.Schema({
    product:{
        type:ObjectId,
        ref:"Product"
    },
    name:String,
    count:Number,
    price:Number,
  
})

const ProdcutCart= mongoose.model("ProductCart",ProductCartSchema)

//There are multiple ways to write schema multiple schema can be written into one schema for example ProdcutCartSchema is written above and it is
//used in the below OrderSchema and products:[PrdocutCartSchema] just like the Objectid using we can use that also but this is also a way

const  OrderSchema= new mongoose.Schema ({
     products:[ProductCartSchema],
     transaction_id:{},
     amount: { type: Number},
     address: String,
     status:{
        type:String,
        default:"Recieved",
        enum:["Cancelled", "Delivered", "Shipped", "Processing", "Recieved"]
     },
     updated: Date,
     user:{
         type:ObjectId,
         ref:"User"
     }




}, {timestamps:true});


const Order= mongoose.model("Order", OrderSchema)

module.exports= {Order,ProdcutCart}