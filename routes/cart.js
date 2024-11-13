const express=require('express');
const passport = require('passport');
const router=express.Router();
const upload = require('../config/multerconfig');

const {productModel, validateProduct} = require('../models/product');
const {cartModel,validateCart} = require('../models/cart');
const {validateAdmin,userIsLoggedIn} = require('../middlewares/admin');


router.get('/',userIsLoggedIn ,async function(req,res){
    try{
    let cart = await cartModel.findOne({user: req.session.passport.user}).populate("products");
    let cartDataStructure={};
    cart.products.forEach((product) => {
    let key=product._id.toString();
    if(cartDataStructure[key]){
    cartDataStructure[key].quantity += 1;
    }
    else{
        cartDataStructure[key]={
                ...product._doc,
                quantity: 1,
              
                }
    }
    
    });
    let finalarray=Object.values(cartDataStructure);
    let finalprice= cart.totalPrice+34;
  
    res.render("cart",{cart: finalarray,finalprice:finalprice});
    }catch(err){
        res.send(err.message);
    }
  
    

});
router.get('/add/:id',userIsLoggedIn ,async function(req,res){
    
    try{
        let cart = await cartModel.findOne({user: req.session.passport.user});
       let product = await  productModel.findOne({_id:req.params.id})
        if(!cart){
        cart = await cartModel.create(
            {user: req.session.passport.user,
                products:[req.params.id],
                totalPrice:Number(product.price)});
   
        }
        else{
            cart.products.push(req.params.id)
            cart.totalPrice+=Number(product.price)
            await cart.save()
        }

        res.redirect("back");
        }catch(err){
            res.send(err.message);
        }
});

router.get("/remove/:id",userIsLoggedIn ,async function(req,res){

    try
    {
    let cart = await cartModel.findOne({user: req.session.passport.user});
    let product = await  productModel.findOne({_id:req.params.id})
    if(!cart) return res.send("Your cart is empty ");
    let index=cart.products.indexOf(req.params.id);
    //removing one element
    if(index!==-1){cart.products.splice(index,1);
    cart.totalPrice-=Number(product.price)}
    else return res.send("item is not in the cart")
    await cart.save();
    res.redirect("back");
}
    catch(err){
        res.send(err.message);
    }


});

module.exports=router;