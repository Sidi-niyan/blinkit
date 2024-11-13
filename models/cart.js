
const Joi = require('joi');
const mongoose = require('mongoose');

// Mongoose Cart schema with validation
const cartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "User reference is required"]
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',  // Assuming 'Product' is the correct model name
    required: [true, "Product reference is required"]
  }],
  totalPrice: {
    type: Number,
    required: [true, "Total price is required"],
    min: [0, "Total price cannot be negative"]
  }
}, { timestamps: true });

// Joi schema for validating cart data
const validateCart = (data) => {
  const cartSchema = Joi.object({
    user: Joi.string().required().custom((value, helper) => {
      // Check if the user ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helper.message('"User" must be a valid ObjectId');
      }
      return true;
    }).messages({
      'string.empty': '"User" is required',
      'any.required': '"User" is required'
    }),
    
    products: Joi.array().items(
      Joi.string().custom((value, helper) => {
        // Check if the product ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helper.message('"Product" must be a valid ObjectId');
        }
        return true;
      })
    ).min(1).required().messages({
      'array.min': '"Products" should contain at least one product',
      'any.required': '"Products" is required'
    }),

    totalPrice: Joi.number().min(0).required().messages({
      'number.base': '"Total Price" must be a number',
      'number.min': '"Total Price" cannot be negative',
      'any.required': '"Total Price" is required'
    })
  });

  return cartSchema.validate(data);
};

  
  module.exports = {
    cartModel:mongoose.model('cart',cartSchema),
    validateCart,
  }


