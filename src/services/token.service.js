const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { tokenTypes } = require("../config/tokens");

/**
 * Generate jwt token
 * - Payload must contain fields
 * --- "sub": `userId` parameter
 * --- "type": `type` parameter
 *
 * - Token expiration must be set to the value of `expires` parameter
 *
 * @param {ObjectId} userId - Mongo user id
 * @param {Number} expires - Token expiration time in seconds since unix epoch
 * @param {string} type - Access token type eg: Access, Refresh
 * @param {string} [secret] - Secret key to sign the token, defaults to config.jwt.secret
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    type: type,
    exp: expires
  };

  return jwt.sign(payload, secret, );
};

/**
 * Generate auth token
 * - Generate jwt token
 * - Token type should be "ACCESS"
 * - Return token and expiry date in required format
 *
 * @param {User} user
 * @returns {Promise<Object>}
 *
 * Example response:
 * "access": {
 *          "token": "eyJhbGciOiJIUzI1NiIs...",
 *          "expires": "2021-01-30T13:51:19.036Z"
 * }
 */
const generateAuthTokens = async (user) => {

  // const expiresIn = 10800;

  //   const payload = {
  //       sub: user.userId, // Assuming user object has a userId property
  //       type: "ACCESS"
  //   };

  //   const token = jwt.sign(payload, config.jwt.secret, { expiresIn });
  const accessToken = generateToken(user._id, Date.now() + config.jwt.accessExpirationMinutes*60*1000, tokenTypes.ACCESS, config.jwt.secret);
  //console.log(accessToken);

    const expiresIn = new Date(Date.now() + config.jwt.accessExpirationMinutes*60*1000) // Convert expiration time to ISO string format

    return {
        access: {
            token: accessToken,
            expires: expiresIn
        }
    };
};

module.exports = {
  generateToken,
  generateAuthTokens,
};
