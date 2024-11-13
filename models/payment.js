const Joi = require('joi');
const mongoose = require('mongoose');

// Mongoose Payment schema with validation
const paymentSchema = mongoose.Schema({
  orderId: {
    type: String,
     // Assuming 'Order' is the correct model
    required: [true, "Order reference is required"]
  },
  paymentID:{
    type:String,
  },
  signature: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
    
  },
  currency: {
    type: String,
    
    required:true,
  },
  status: {
    type: String,
  
    default: "pending",
   
  },
  
}, { timestamps: true });


// Joi schema for validating payment data




module.exports =
{
    paymentModel: mongoose.model("payment", paymentSchema),
  
} ;