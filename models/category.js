const mongoose = require("mongoose")

const categorySchema= new mongoose.Schema({
    name:{
        type: String,
        trim:true,
        required:true,
        maxlength:32,
        unique:true
    }
},{timestamps:true}) //this timestamps autmotcially create time in dabase like created at and updated at


module.exports = mongoose.model("Category", categorySchema)