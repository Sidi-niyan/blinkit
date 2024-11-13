const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Category schema with validation
const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    minlength: [2, "Category name must be at least 2 characters"],
    maxlength: [50, "Category name can be at most 50 characters"],
    trim: true  // To remove extra spaces
  }
}, { timestamps: true });


// Joi schema for validating category data
const validateCategory = (data) => {
  const categorySchema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.base': '"Name" must be a string',
      'string.empty': '"Name" cannot be empty',
      'string.min': '"Name" must be at least 2 characters long',
      'string.max': '"Name" can be at most 50 characters long',
      'any.required': '"Name" is required'
    })
  });

  return categorySchema.validate(data);
};



module.exports ={
    categoryModel: mongoose.model("category", categorySchema),
    validateCategory,

}