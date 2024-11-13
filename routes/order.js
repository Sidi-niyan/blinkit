const express=require('express');
const { paymentModel } = require('../models/payment');
const router=express.Router();

router.get('/:orderid/:paymentid/:signature', async function(req, res){

    let paymentDetails = await paymentModel.findOne({
        orderId: req.params.orderid,
    
       
    })
    console.log('Payment Details:', paymentDetails);

    if(!paymentDetails) return res.send("Sorry,Payment not completed")
   
   
    if(req.params.signature === paymentDetails.signature ){
        res.send("Payment successful")
    }
    else{
        res.send("Payment not successful")
    }

});


module.exports =router;