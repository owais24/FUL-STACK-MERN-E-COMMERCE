const Product= require("../models/product");
const formidable= require("formidable");
const _ = require("lodash")
const fs= require("fs");
const product = require("../models/product");
const { sortBy } = require("lodash");

exports.getProductById=(req,res,next, id) =>{
    Product.findById(id).populate("category").exec((err,product) =>{
        if (err) {
            return res.status(400).json({
                error:"Product not found"
            })
        }

        req.product=product;
        next();
    })
};

exports.createProduct=(req,res) => {
    let form= formidable.IncomingForm();
    form.keepExtensions= true; //it says whether the files are in png or jpeg format

    form.parse(req,(err,fields,file) =>{
        if (err) {
            return res.status(400).json({
                error:"problem with the image"
            });
        }

        //destructure the fields
        const {name, description,price, category, stock}= fields;

       if (!name || !description || !price || !category || !stock) {
           return res.status(400).json({
               error:"Please include all fields"
           })
       }


        
        let product= new Product(fields)

        //handle file here
        if (file.photo) {
            if (file.photo.size >3000000) {
                  return res.status(400).json({
                      error:"File  size to big"
                  })
            }
            product.photo.data= fs.readFileSync(file.photo.path)  //line number 39,40 technically saves the photo in db check docs once u will find 
            product.photo.contentType= file.photo.type   //similar codes there 
        }

        //save to the db
        product.save((err,product) => {
            if (err) {
                 res.status(400).json({
                    error:"Saving tshirt in db failed"
                })
            }
              res.json(product) 
        })
    });
};

//getting a single product
exports.getProduct=(req,res) =>{
     req.product.photo= undefined;
     return res.json(req.product);
};

//middleware exports.photo is the middleware
exports.photo= (req,res,next) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
}

//delete controllers
exports.deleteProduct=(req,res) => {
    let product= req.product;
    product.remove((err,deletedProduct) => {
        if (err) {
            return  res.status(400).json({
                error:"Failed to delete the product"
            })
        }
        res.json({
            message:"Deletion was succcess", deletedProduct
        })
    })
};

//update controllers
exports.updateProduct=(req,res) => {
    let form= formidable.IncomingForm();
    form.keepExtensions= true; //it says whether the files are in png or jpeg format

    form.parse(req,(err,fields,file) =>{
        if (err) {
            return res.status(400).json({
                error:"problem with the image"
            });
        }

       

        //updation code
        let product= req.product;
        product= _.extend(product, fields)

        //handle file here
        if (file.photo) {
            if (file.photo.size >3000000) {
                  return res.status(400).json({
                      error:"File  size to big"
                  })
            }
            product.photo.data= fs.readFileSync(file.photo.path)  //line number 39,40 technically saves the photo in db check docs once u will find 
            product.photo.contentType= file.photo.type   //similar codes there 
        }

        //save to the db
        product.save((err,product) => {
            if (err) {
                 res.status(400).json({
                    error:"Updation of product failed"
                })
            }
              res.json(product) 
        })
    });
}

//product listing
exports.getAllProducts=(req,res) => {
    let limit= req.query.limit ? parseInt(req.query.limit) : 8
    let sortBy=req.query.sortBy ? req.query.sortBy : "_id"
    
    Product.find().select("-photo").populate("category").sort([[sortBy, "asc"]]).limit(limit).exec((err,products) => {
        if (err) {
            return res.status(400).json({
                error:"NO PRODUCT FOUND"
            })
        }
        res.json(products)
    })
}

exports.getAllUniqueCategories=(req,res) => {
    Product.distinct("category",{} , (err,category) => {
        if (err) {
            return res.status(400).json({
                error:"NO category found"
            })
        }

        res.json(category)
    })
}



exports.updateStock=(req,res, next) => {
    let myOperations=req.body.order.products.map(prod => {
        return {
            updateOne:{
                filter:{_id: prod._id},
                update:{$inc: {stock: -prod.count, sold: +prod.count}} //this count will be coming from frongt end
            }
        }
    })

    Product.bulkWrite(myOperations, {}, (err,products) => {
        if (err) {
            return res.status(400).json({
                error:"Bulk operations failed"
            })
        }
        next()
    })
}