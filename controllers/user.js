const User= require("../models/user");
const Order=require("../models/order");


exports.getUserById= (req , res, next, id) =>{
    User.findById(id).exec((err, user) => {
        if (err || !user) {
             return res.status(400).json({
                 error:"No user was found in DB"
             });
        }
        req.profile=user;
        next();
    });
};


exports.getUser=(req, res) => { 
    req.profile.salt= undefined; //req.profile.salt= ""; //if we use " " then req.profile.salt="" that will be shown
    req.profile.encry_password= undefined; //req.profile.encry_password= "" your wish undefined will takr out total salt and encry will not be seen 
    req.profile.createdAt= undefined;
    req.profile.updatedAt= undefined;
  
    //we arer not making them undefined in the database WE ARE JUST MAKING THEM UNDEFINED IN THE USERS PROFILE

    return res.json(req.profile);
};

exports.updateUser= (req,res) => {
     User.findByIdAndUpdate(
         {_id: req.profile._id}, //finding the user
         {$set: req.body},  //what we need to set or update
         {new:true, useFindAndModify: false}, //compualsory parameters when we are using findByIdAnsUpdate
         (err,user) => {
             if (err || !user) {
                  return res.status(400).json({
                      error:"You are not anauthorized to update this user"
                  })
             }
             user.salt= undefined; //req.profile.salt= ""; //if we use " " then req.profile.salt="" that will be shown
             user.encry_password= undefined; //req.profile.encry_password= "" your wish undefined will takr out total salt and encry will not be seen 
             res.json(user)
         }
     )

};

exports.userPurchaseList=(req,res) =>{
     Order.find({user: req.profile._id})
     .populate("user", "_id name") //no comma b/w _id name because syntax is like that we can write email also i.e "_id name email"
     .exec((err,order) =>{
         if (err) {
             return res.status(400).json({
                 error:"No order in this account"
             })
         }
         return res.json(order)
     })
};

exports.pushOrderInPurchaseList=(req,res,next) => {

   let purchases=[]
   req.body.order.products.forEach(product => {
       purchases.push({
           _id:product._id,
           name:product.name,
           description:product.description,
           category:product.category,
           quantity:product.quantity,
           amount:req.body.order.amount,
           transaction_id:req.body.order.transaction_id,
       });
   });

   //store in that above in db
   User.findOneAndUpdate(
       {_id:req.profile._id},
       {$push: {purchases: purchases}}, 
   //1st purchases comes from user model and 2nd purcahses is from line 63 means line 63 purchases is pushing in to that purchases in db
       {new: true}, 
   //whenever u set new:true that means remeber we recieve 2 things from db error and object i.e(user,product which u written in (err,user) likethat) when we set new from db set an obj which is updated one not oldd one
       (err,purchases) => {
           if (err) {
               return res.status(400).json({
                   error:"Unable to save purchase list"
               })
           }
           next();
       }
   )

//whenever u r writing middleware next is must be used the above method is middleware
  
};