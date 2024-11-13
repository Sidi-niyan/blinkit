const mongoose = require('mongoose');

// Mongoose Address schema with validation
const AddressSchema = mongoose.Schema({
  state: {
    type: String,
    required: [true, "State is required"],
    minlength: [2, "State must have at least 2 characters"],
    maxlength: [50, "State can have at most 50 characters"]
  },
  zip: {
    type: Number,
    required: [true, "Zip code is required"],
    min: [1000, "Zip code must be at least 4 digits"],
    max: [999999, "Zip code cannot exceed 6 digits"]
  },
  city: {
    type: String,
    required: [true, "City is required"],
    minlength: [2, "City must have at least 2 characters"],
    maxlength: [50, "City can have at most 50 characters"]
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    minlength: [5, "Address must have at least 5 characters"],
    maxlength: [255, "Address can have at most 255 characters"]
  }
});

// Mongoose User schema with validation
const userSchema = mongoose.Schema({
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
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]  //reg expressions
  },
  password: {
    type: String,
    minlength: [6, "Password must be at least 6 characters"]
  },
  phone: {
    type: Number,
    min: [1000000000, "Phone number must be at least 10 digits"],
    max: [9999999999, "Phone number cannot exceed 10 digits"]
  },
  addresses: {
    type: [AddressSchema],
    required: true
  }
}, { timestamps: true });
const validateUser = (data) => {
    const userSchema = Joi.object({
      name: Joi.string().min(3).max(100).required().messages(),
      email: Joi.string().email().required().messages(),
      password: Joi.string().min(6).required().messages(),
      phone: Joi.number().min(1000000000).max(9999999999).required().messages({
        'number.base': '"Phone" must be a number',
        'number.min': '"Phone" must have at least 10 digits',
        'number.max': '"Phone" must not exceed 10 digits',
        'any.required': '"Phone" is required'
      }),
      addresses: {
        type: [AddressSchema],
        required: true
      }
    }, { timestamps: true });
    return userSchema.validate(data);
};






module.exports ={
    validateUser: validateUser,
    userModel: mongoose.model("User", userSchema)  // exporting model for use in other files
} 