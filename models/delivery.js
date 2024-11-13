const Joi = require('joi');
const mongoose = require('mongoose');

// Mongoose Delivery schema with validation
const deliverySchema = mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order', // Assuming the referenced model is 'Order'
    required: [true, "Order reference is required"]
  },
  deliveryBoy: {
    type: String,
    required: [true, "Delivery boy name is required"],
    minlength: [3, "Delivery boy name must be at least 3 characters"],
    maxlength: [50, "Delivery boy name can be at most 50 characters"]
  },
  status: {
    type: String,
    required: [true, "Status is required"],
    enum: ["pending", "in-transit", "delivered", "cancelled"], // Predefined statuses
    default: "pending"
  },
  trackingURL: {
    type: String,
    required: [false],
     // Validate URL format
  },
  estimatedDeliveryTime: {
    type: Number,
    required: [false],
    min: [0, "Estimated delivery time must be at least 1 hour"]
  },
  totalPrice: {
    type: Number,
    required: [true, "Total price is required"],
    min: [0, "Total price cannot be negative"]
  }
}, { timestamps: true });

// Joi schema for validating delivery data
const validateDelivery = (data) => {
  const deliverySchema = Joi.object({
    order: Joi.string().required().custom((value, helper) => {
      // Check if the order ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helper.message('"Order" must be a valid ObjectId');
      }
      return true;
    }).messages({
      'string.empty': '"Order" is required',
      'any.required': '"Order" is required'
    }),
    
    deliveryBoy: Joi.string().min(3).max(50).required().messages({
      'string.base': '"Delivery Boy" must be a string',
      'string.empty': '"Delivery Boy" is required',
      'string.min': '"Delivery Boy" must be at least 3 characters long',
      'string.max': '"Delivery Boy" can be at most 50 characters long',
      'any.required': '"Delivery Boy" is required'
    }),
    
    status: Joi.string().valid("pending", "in-transit", "delivered", "cancelled").required().messages({
      'string.base': '"Status" must be a string',
      'any.only': '"Status" must be one of ["pending", "in-transit", "delivered", "cancelled"]',
      'any.required': '"Status" is required'
    }),

    trackingURL: Joi.string().uri().allow(null, '').messages({
      'string.uri': '"Tracking URL" must be a valid URL'
    }),
    
    estimatedDeliveryTime: Joi.number().min(1).allow(null).messages({
      'number.base': '"Estimated Delivery Time" must be a number',
      'number.min': '"Estimated Delivery Time" must be at least 1 hour'
    }),

    totalPrice: Joi.number().min(0).required().messages({
      'number.base': '"Total Price" must be a number',
      'number.min': '"Total Price" cannot be negative',
      'any.required': '"Total Price" is required'
    })
  });

  return deliverySchema.validate(data);
};
module.exports = {
    deliveryModel: mongoose.model("delivery", deliverySchema),
    validateDelivery,
}


