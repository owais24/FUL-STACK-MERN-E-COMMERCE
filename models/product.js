const mongoose= require("mongoose")
const {ObjectId}=mongoose.Schema;

const productSchema= new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        maxlength:32
    },
    description:{
        type:String,
        trim:true,
        required:true,
        maxlength:2000
    },
    price:{
        type:Number,
        trim:true,
        required:true,
        maxlength:32
    },
    category:{
        type:ObjectId,
        ref:"Category",//pulling out from category.js linking prodcut with caterogry line 2 also is part of this same should be done everywehre to link 2 schemas
        required:true
    },
    stock:{
        type:Number
    },
    sold:{
        type:Number,
        default:0
    },
    photo:{
        data:Buffer,    //this data and buffer is an way to keep pics there are many others we can do this is one of them
        contentType:String
    }

},{timestamps:true});  //this timestamps autmotcially create time in dabase like created at and updated at


module.exports= mongoose.model("Product",productSchema);