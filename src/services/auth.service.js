const httpStatus = require("http-status");
const userService = require("./user.service");
const ApiError = require("../utils/ApiError");
const { User } = require("../models");
const { UNAUTHORIZED } = require("http-status");

/**
 * Login with username and password
 * - Utilize userService method to fetch user object corresponding to the email provided
 * - Use the User schema's "isPasswordMatch" method to check if input password matches the one user registered with (i.e, hash stored in MongoDB)
 * - If user doesn't exist or incorrect password,
 * throw an ApiError with "401 Unauthorized" status code and message, "Incorrect email or password"
 * - Else, return the user object
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {

  if(!email || !password){
    throw new ApiError(400, "Field is required")
  }

  const user = await userService.getUserByEmail(email);
  if(!user){
    throw new ApiError(401,"No users with that email");
  }
  console.log(user);

  const passcheck = await user.isPasswordMatch(password);

  if(!passcheck){
    throw new ApiError(401, "Incorrect password");
  }

  return user;

};

module.exports = {
  loginUserWithEmailAndPassword,
};
