const Joi = require('joi');
const mongoose = require('mongoose');

// Mongoose Order schema with validation
const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Assuming 'User' is the correct model
    required: [true, "User reference is required"]
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',  // Assuming 'Product' is the correct model
    required: [true, "Product reference is required"]
  }],
  totalPrice: {
    type: Number,
    required: [true, "Total price is required"],
    min: [0, "Total price cannot be negative"]
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    minlength: [5, "Address must be at least 5 characters long"],
    maxlength: [100, "Address can be at most 100 characters long"]
  },
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled"],
    default: "pending",
    required: [true, "Status is required"]
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',  // Assuming 'Payment' is the correct model
    required: [true, "Payment reference is required"]
  },
  delivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery',  // Assuming 'Delivery' is the correct model
    required: [true, "Delivery reference is required"]
  }
}, { timestamps: true });



// Joi schema for validating order data
const validateOrder = (data) => {
  const orderSchema = Joi.object({
    user: Joi.string().required().custom((value, helper) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helper.message('"User" must be a valid ObjectId');
      }
      return true;
    }).messages({
      'any.required': '"User" is required'
    }),
    
    products: Joi.array().items(
      Joi.string().custom((value, helper) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helper.message('"Product" must be a valid ObjectId');
        }
        return true;
      })
    ).min(1).required().messages({
      'array.min': '"Products" must contain at least one product',
      'any.required': '"Products" are required'
    }),

    totalPrice: Joi.number().min(0).required().messages({
      'number.base': '"Total Price" must be a number',
      'number.min': '"Total Price" cannot be negative',
      'any.required': '"Total Price" is required'
    }),

    address: Joi.string().min(5).max(100).required().messages({
      'string.base': '"Address" must be a string',
      'string.min': '"Address" must be at least 5 characters long',
      'string.max': '"Address" can be at most 100 characters long',
      'any.required': '"Address" is required'
    }),

    status: Joi.string().valid("pending", "shipped", "delivered", "cancelled").required().messages({
      'any.only': '"Status" must be one of ["pending", "shipped", "delivered", "cancelled"]',
      'any.required': '"Status" is required'
    }),

    payment: Joi.string().required().custom((value, helper) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helper.message('"Payment" must be a valid ObjectId');
      }
      return true;
    }).messages({
      'any.required': '"Payment" is required'
    }),

    delivery: Joi.string().required().custom((value, helper) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helper.message('"Delivery" must be a valid ObjectId');
      }
      return true;
    }).messages({
      'any.required': '"Delivery" is required'
    })
  });

  return orderSchema.validate(data);
};

module.exports = validateOrder;

module.exports ={
    orderModel: mongoose.model("order", orderSchema),
    validateOrder,
} ;
