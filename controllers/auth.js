const User = require("../models/user")
const { body, validationResult, check } = require('express-validator');
var jwt=require("jsonwebtoken")
var expressJwt=require("express-jwt") //in documentation this expressJwt is called as jwt already we are using jwt so we now changed & using expressJwt


exports.signup = (req, res) => {

   const errors= validationResult(req)

   if (!errors.isEmpty()) {
       return res.status(422).json({
           error:errors.array()[0].msg
       })
       
   }




    const user = new User(req.body)
    user.save((err, user) => {
        if(err | !user){
            return res.status(400).json({
                err: "Not able to save user in DB"
            })
        }
        res.json({
          name:user.name,
          email:user.email,
          id:user._id
        });
    })
}

exports.signin=(req,res) => {
    const errors= validationResult(req)
    const {email,password}= req.body;

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error:errors.array()[0].msg
        })
        
    }
  //findOne means it exactly find one correct user which matched it very accurate
    User.findOne({email}, (err, user) =>{
        if (err || !user) {
            res.status(400).json({
                error:"USER EMAIL IS NOT FOUND"
            })
        }

        if (!user.authenticate(password)) {
            return res.status(401).json({
                error:"Email and Password does not match"
            })
            
        }
    //create token the below line is written with help of docs
    const token=jwt.sign({_id:user._id}, process.env.SECRET);

    //put token in user cookie the below is written with help of docs check it
    res.cookie("token", token,  {expire: new Date() + 999});
    //to set cookie we need key value payer key "token" and value token and expiree day for cookie to expire

    //send response to frontend
    const {_id,name,email,role}= user;
    return res.json({token, user:{_id,name,email,role}});

    })
}



exports.signout = (req, res) => {
    //this clearCookie come fro the cookie parser check in app.js
    res.clearCookie("token");
    res.json({
        message: "User signout successfully"
    })
}

//protected routes

exports.isSignedIn= expressJwt({
    secret:process.env.SECRET,
    userProperty:"auth"
    //sigin means the user is signedin and can move around
})



//custom middle ware

exports.isAuthenticated=(req,res,next) => {
    let checker= req.profile && req.auth && req.profile._id == req.auth._id; 
    //this req.auth is coming from upper one isSignedIn and req.profile is set up from front end
    if (!checker) {
        return res.status(403).json({
            error:"ACCES DENIED"
        })
    }
    next();

    //athutnetication measn user can change few things on his own account
}

exports.isAdmin=(req,res,next)=>{
    if (req.profile.role ===0) {
        return res.status(403).json({
            error:"You are not admin, ACCESS DENIED"
        })
        
    }
    next();
}