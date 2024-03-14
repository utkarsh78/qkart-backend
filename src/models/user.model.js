const mongoose = require("mongoose");
// NOTE - "validator" external library and not the custom middleware at src/middlewares/validate.js
const validator = require("validator");
const config = require("../config/config");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/ApiError");

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Complete userSchema, a Mongoose schema for "users" collection
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      // validate(value) {
      //   if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
      //     throw new Error(
      //       "Password must contain at least one letter and one number"
      //     );
      //   }
      // },
    },
    walletMoney: {
      type: Number,
      required: true,
      default: 500
    },
    address: {
      type: String,
      default: config.default_address,
    },
  },
  // Create createdAt and updatedAt fields automatically
  {
    timestamps: true,
  }
);

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement the isEmailTaken() static method
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email) {
  if(validator.isEmail(email)){
    const user = await this.findOne({email : email});
    return !!user;
  }
  else{
    throw new ApiError(400, "Email is invalid");
  }
};

userSchema.pre("save", function(next){
  let user = this;

  if(!user.isModified("password")){
    return next();
  }

  const letterRegex = /[a-zA-Z]/;
  const numberRegex = /[0-9]/;

  // Check if the password contains at least one letter and one number
  if (!letterRegex.test(user.password) || !numberRegex.test(user.password)) {
    throw new ApiError(400,'Password must contain at least one letter and one number');
  }

  bcrypt.hash(user.password,10,(err,hash)=>{
    if(err){
      return next(err);
    }
    user.password = hash;
    next();
  });
});

/**
 * Check if entered password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  let user = this;


  return await bcrypt.compare(password, user.password)  
      
};



// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS


/**
 * Check if user have set an address other than the default address
 * - should return true if user has set an address other than default address
 * - should return false if user's address is the default address
 *
 * @returns {Promise<boolean>}
 */
userSchema.methods.hasSetNonDefaultAddress = async function () {
  const user = this;
   return user.address !== config.default_address;
};

/*
 * Create a Mongoose model out of userSchema and export the model as "User"
 * Note: The model should be accessible in a different module when imported like below
 * const User = require("<user.model file path>").User;
 */
/**
 * @typedef User
 */

 const User = mongoose.model('User', userSchema);
 module.exports = { User };
