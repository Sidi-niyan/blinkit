const express=require('express');
const passport = require('passport');
const router=express.Router();
const upload = require('../config/multerconfig');

const {productModel, validateProduct} = require('../models/product');
const {userModel,validateUser} = require('../models/category');
const validateAdmin = require('../middlewares/admin');


router.get('/login',function(req,res){

   res.render("user_login")

})
//profile page htana h baad mei
router.get('/profile',(req,res)=>{

    res.send("profile page")
 
 })
router.get('/logout',function(req,res,next){

    req.logout(function(err) {
        if (err) { return next(err); }
        req.session.destroy((err)=>{
         if(err) return next(err);
         res.clearCookie("connect.sid");
         res.redirect('/users/login');

        })
      
      });
 
 })



module.exports=router;