require('dotenv').config()

const mongoose = require("mongoose");

const express=require("express");
const app= express();

//the below three lines 9 10 11 are middlewares which we have installed through npm and using here for fututre code 
const bodyParser=require("body-parser");
const cookieParser=require("cookie-parser");
const cors=require("cors")


//My Routes
const authRoutes=require("./routes/auth");
const userRoutes=require("./routes/user");
const categoryRoutes=require("./routes/category");
const productRoutes=require("./routes/product");
const orderRoutes=require("./routes/order");
const stripeRoutes=require("./routes/stripepayment");
const paymentBRoutes=require("./routes/paymentBRoutes");

//DB CONNECTION
mongoose.connect(process.env.DATABASE, { 
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(() =>{
    console.log("DB IS CONNECTED")
}).catch(()=>{
    console.log("DB NOT CONNCTED")
});



//MIDDLEWARES
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//MY ROUTES
app.use("/api",authRoutes);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);
app.use("/api",productRoutes);
app.use("/api",orderRoutes);
app.use("/api", stripeRoutes);
app.use("/api", paymentBRoutes);

//PORT
const port= process.env.PORT || 8000;


//heruko
if(process.env.NODE_ENV =='production') {
    app.use(express.static("projfrontend/build"));
    const path= require("path");
    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, 'projfrontend', 'build', 'index.html'))
    })

}




//STARTING A SERVER
app.listen(port, ()=> {
    console.log(`app is running at ${port}`)
});