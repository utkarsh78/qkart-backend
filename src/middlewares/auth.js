const passport = require("passport");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

/**
 * Custom callback function implementation to verify callback from passport
 * - If authentication failed, reject the promise and send back an ApiError object with
 * --- Response status code - "401 Unauthorized"
 * --- Message - "Please authenticate"
 *
 * - If authentication succeeded,
 * --- set the `req.user` property as the user object corresponding to the authenticated token
 * --- resolve the promise
 */
const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
  try {
    // If an error occurred during authentication, reject the promise
    if (err) {
        
        return reject(new ApiError(401, 'Please authenticate'));
    }
    
    // If authentication failed (user not found), reject the promise
    if (!user) {
      return reject(new ApiError(401, 'Please authenticate, Unauthorised User'));
    }

    // If authentication succeeded, set req.user as the authenticated user object
    req.user = user;
    // Resolve the promise
    resolve();
} catch (error) {
    // If any other error occurred, reject the promise with the error
    reject(new ApiError(401, 'Authentication failed'));
}
};

/**
 * Auth middleware to authenticate using Passport "jwt" strategy with sessions disabled and a custom callback function
 * 
 */
const auth = async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verifyCallback(req, resolve, reject)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
