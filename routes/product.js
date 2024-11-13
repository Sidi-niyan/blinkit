const express=require('express');
const passport = require('passport');
const router=express.Router();
const upload = require('../config/multerconfig');

const {productModel, validateProduct} = require('../models/product');
const{cartModel}=require('../models/cart');
const {categoryModel,validateCategory} = require('../models/category');
const {validateAdmin,userIsLoggedIn} = require('../middlewares/admin');

router.get('/delete/:id', validateAdmin,async function(req, res){
  if(req.user.admin){
    let prods=  await productModel.findOneAndDelete({_id:req.params.id});
  return res.redirect("/admin/products");
  }
  res.send("you are not allowed to delete");
});
router.post('/delete', validateAdmin,async function(req, res){
  let productId = req.body.product_id.trim();
  if(req.user.admin){
    let prods=  await productModel.findOneAndDelete({_id:productId});
  return res.redirect("back");
  }
  res.send("you are not allowed to delete");
});
router.get('/', userIsLoggedIn ,async function(req, res){
  let somethingInCart=false;
  const resultArray= await productModel.aggregate([
    // Stage 1: Group products by category and collect all products in an array
    {
      $group: {
        _id: "$category", // Group by the 'category' field (which is a string)
        products: { $push: "$$ROOT" } // Push the entire product document into an array
      }
    },
    // Stage 2: Limit the number of products per category to 10
    {
      $project: {
        _id: 0,
        category:"$_id", // Keep the category field
        products: { $slice: ["$products", 10] } // Slice the array to get only the first 10 products
      }
    },
    
   
  ]);
  let cart= await cartModel.findOne({user:req.session.passport.user})
  if(cart && cart.products.length>0) somethingInCart=true;
  let rnproducts = await productModel.aggregate([{$sample:{size:5}}])
  //converting arry in to obj
  const resultObject=resultArray.reduce((acc, item) => {
    acc[item.category] = item.products;
    return acc;
  }, {});
  let cartCount = cart ? cart.products.length : 0;
 
  res.render("index",{products:resultObject,rnproducts,somethingInCart,cartCount});
});
router.post("/", upload.single("image"), async function(req, res){
  
    let{ name,price,category,description,stock,image}=req.body;
    let {error}=validateProduct({name,price,category,description,stock,image})
    if(error)return res.send(error.message);
    


    let product=await productModel.create({
      name,
      price,
      category,
      description,
      stock,
      image:req.file.buffer,
    })
    let iscategory=await categoryModel.findOne({name:category});
    if(!iscategory){
     await categoryModel.create({name:category})
    }
    
    res.redirect("/admin/dashboard");

  
  });
  

module.exports=router;


