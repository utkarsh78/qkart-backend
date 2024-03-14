const Joi = require("joi");
const ApiError = require("../utils/ApiError");
const { password } = require("./custom.validation");

// TODO: CRIO_TASK_MODULE_AUTH - Define request validation schema for user registration
/**
 * Check request *body* for fields (all are *required*)
 * - "email" : string and satisyfing email structure
 * - "password": string and satisifes the custom password structure defined in "src/validations/custom.validation.js"
 * - "name": string
 */
//  password: Joi.string().custom((value, helpers) => {
//   // Use custom validation from "custom.validation.js"
//   const isValid = password(value);
//   if (!isValid) {
//       throw new ApiError(400,'any.invalid');
//   }
//   return value;

 const register = {
  body : Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().custom(password).required(),
    name: Joi.string().required()
  }),
};
/**
 * Check request *body* for fields (all are *required*)
 * - "email" : string and satisyfing email structure
 * - "password": string and satisifes the custom password structure defined in "src/validations/custom.validation.js"
 */
const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().custom(password).required()
  }),
};


module.exports = {
  register,
  login,
};
