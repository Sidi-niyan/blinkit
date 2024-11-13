const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Admin schema with validation
const adminSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must have at least 3 characters"],
    maxlength: [100, "Name can have at most 100 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],

  },
  role: {
    type: String,
    required: [true, "Role is required"],
    enum: ["admin", "superadmin"], // You can define specific roles here
    default: "admin"
  }
}, { timestamps: true });

const validateAdmin = (data) => {
    const adminSchema = Joi.object({
      name: Joi.string().min(3).max(100).required().messages({
        'string.base': '"Name" must be a string',
        'string.empty': '"Name" cannot be empty',
        'string.min': '"Name" must have at least 3 characters',
        'string.max': '"Name" can have a maximum length of 100 characters',
        'any.required': '"Name" is required'
      }),
      email: Joi.string().email().required().messages({
        'string.base': '"Email" must be a string',
        'string.email': '"Email" must be a valid email',
        'any.required': '"Email" is required'
      }),
      password: Joi.string().min(6).required().messages({
        'string.base': '"Password" must be a string',
        'string.min': '"Password" must have at least 6 characters',
        'any.required': '"Password" is required'
      }),
      role: Joi.string().valid("admin", "superadmin").required().messages({
        'string.base': '"Role" must be a string',
        'any.only': '"Role" must be either admin or superadmin',
        'any.required': '"Role" is required'
      })
    });
  
    return adminSchema.validate(data);
  };
  
  

module.exports = {
    adminModel:mongoose.model("admin", adminSchema),
    validateAdmin,

};
