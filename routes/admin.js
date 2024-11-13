const express=require('express');
const product = require('../models/product');
const router=express.Router();
const {adminModel} = require('../models/admin');
const{productModel} = require('../models/product');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const {validateAdmin} = require('../Middlewares/admin');

require('dotenv').config();
if( typeof process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'DEVELOPMENT')
{
    router.get('/create', async function(req,res){
        try{

      let salt=  await bcrypt.genSalt(10);
      let hash= await bcrypt.hash("admin",salt)
        let user= new adminModel({
            name: "Siddharth Suyal",
              email:"admin@blink.com" ,
              password: hash,
              role:  "admin",
        })
        await user.save();
        let token=jwt.sign({email:"admin@blink.com", admin:true},process.env.JWT_KEY);
        res.cookie("token",token);
        res.send("admin created successfully")
    }
    catch(err){
        res.send(err.message);
    }

    });
}

router.get("/login",function(req,res){
    res.render("admin_login");
})
router.post("/login",async function(req,res){
let{email,password}=req.body;
let admin=await adminModel.findOne({email})
if(!admin) return res.send("Invalid email or password");
let valid=await bcrypt.compare(password,admin.password);
if(valid){
    let token=jwt.sign({email:"admin@blink.com",admin:true},process.env.JWT_KEY);
        res.cookie("token",token);
        res.redirect("/admin/dashboard");

}

})
router.get("/dashboard",validateAdmin ,async function(req,res){
    let prodcount = await productModel.countDocuments();
    let categcount = await productModel.countDocuments();
    res.render("admin_dashboard",{prodcount,categcount});
})
router.get("/logout",validateAdmin ,function(req,res){
    res.cookie("token","");
    res.redirect("/admin/login");
})
router.get("/products",validateAdmin ,async function(req,res){
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
      //converting arry in to obj
      const resultObject=resultArray.reduce((acc, item) => {
        acc[item.category] = item.products;
        return acc;
      }, {});
      res.render("admin_products",{products: resultObject});
})
module.exports=router;

