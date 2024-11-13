const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Product schema with validation
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true, 
    minlength: 3,
    maxlength: 100, 
  },
  price: {
    type: Number,
    required: true, 
    min: 0, 
  },
  category: {
    type: String,
    required: true,

  },
  description: {
    type: String,

  },
  stock: {
    type: Number,
  
  },
  
  image: {
    type: Buffer,
    
  }
}, { timestamps: true });



// Joi schema for validating product data
const validateProduct = (data) => {
  const productSchema = Joi.object({
    name: Joi.string().required(),
    
    price: Joi.number().required(),

    category: Joi.string().required(),

    description: Joi.string().optional(),

    stock: Joi.number().required(),


    image: Joi.binary().optional(),
  });

  return productSchema.validate(data);
};

module.exports = validateProduct;

module.exports = {
    productModel:mongoose.model("product", productSchema),
    validateProduct,
} ;

