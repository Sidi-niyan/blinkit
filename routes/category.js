const express=require('express');
const passport = require('passport');
const router=express.Router();
const upload = require('../config/multerconfig');

const {productModel, validateProduct} = require('../models/product');
const {categoryModel,validateCategory} = require('../models/category');
const {validateAdmin} = require('../middlewares/admin');


router.post('/create',validateAdmin ,async function(req,res){
    let category= await categoryModel.create({
        name:req.body.name,

    });
    res.redirect("back");
    

})

module.exports=router;