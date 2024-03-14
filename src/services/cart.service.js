const httpStatus = require("http-status");
const { Cart, Product, User } = require("../models");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");
const { convertToObject } = require("typescript");

// TODO: CRIO_TASK_MODULE_CART - Implement the Cart service methods

/**
 * Fetches cart for a user
 * - Fetch user's cart from Mongo
 * - If cart doesn't exist, throw ApiError
 * --- status code  - 404 NOT FOUND
 * --- message - "User does not have a cart"
 *
 * @param {User} user
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const getCartByUser = async (user) => {
  try {
    // Fetch the user's cart from MongoDB
    const cart = await Cart.findOne({ email: user.email });

    // If cart doesn't exist, throw an ApiError
    if (!cart) {
        throw new ApiError(404, "User does not have a cart");
    }
    return cart;
} catch (error) {
    throw error; // Re-throw the error to be caught by the caller
}
};

/**
 * Adds a new product to cart
 * - Get user's cart object using "Cart" model's findOne() method
 * --- If it doesn't exist, create one
 * --- If cart creation fails, throw ApiError with "500 Internal Server Error" status code
 *
 * - If product to add already in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product already in cart. Use the cart sidebar to update or remove product from cart"
 *
 * - If product to add not in "products" collection in MongoDB, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product doesn't exist in database"
 *
 * - Otherwise, add product to user's cart
 *
 *
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const addProductToCart = async (user, productId, quantity) => {

    let cart = await Cart.findOne({email : user.email});
    // console.log(cart);
    // console.log("if block yet to start");
    if(!cart){
      try{
        //console.log("cart creation");
        cart = await Cart({email:user.email, cartItems:[]});
        //console.log("cart created");
        //console.log(cart);
      }
      catch(error){
        console.log("In the cart creation");
        console.log(error);
        throw new ApiError(500, "Internal Server error");
      }
    }
    const product = await Product.findById(productId);
    //console.log(product);
    if (!product) {
      throw new ApiError(400, "Product doesn't exist in database");
    }

    let productinCart = false;
    console.log(cart);
    if(cart.cartItems != null){
      cart.cartItems.forEach((element) => {
        if(element.product._id==productId){
          productinCart=true;
        }
      });
    }

    if(productinCart){
      throw new ApiError(400,"Product not in cart");
    }


    const newItem = {
      product: product,
      quantity: quantity
  };
    
    cart.cartItems.push(newItem);
  
    await cart.save();
    console.log(cart);
    return cart;

};

/**
 * Updates the quantity of an already existing product in cart
 * - Get user's cart object using "Cart" model's findOne() method
 * - If cart doesn't exist, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User does not have a cart. Use POST to create cart and add a product"
 *
 * - If product to add not in "products" collection in MongoDB, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product doesn't exist in database"
 *
 * - If product to update not in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product not in cart"
 *
 * - Otherwise, update the product's quantity in user's cart to the new quantity provided and return the cart object
 *
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const updateProductInCart = async (user, productId, quantity) => {
    let cart = await Cart.findOne({email : user.email});

    if(!cart){
      throw new ApiError(400,"User does not have a cart. Use POST to create cart and add a product");
    }
   
    const product = await Product.findById(productId);
    if(!product){
      throw new ApiError(400,"Product doesn't exist in database");
    }
    let productinCart = false;
    let modCart = [];
    //console.log(productId);
    cart.cartItems.forEach((element) => {
      if(element.product._id==productId){
        productinCart=true;
        //console.log("Yes I have found it");
        element.quantity = quantity;
        modCart.push(element);
      }
      else{
        modCart.push(element);
      }
    });

    if(!productinCart){
      throw new ApiError(400,"Product not in cart");
    }
    console.log(cart);
    cart.cartItems = modCart;
    await cart.save();
    console.log(cart);
    return cart;

    // if (quantity === 0) {
    //   cart.cartItems.splice(existingCartItemIndex, 1);
    // }
  
};

/**
 * Deletes an already existing product in cart
 * - If cart doesn't exist for user, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User does not have a cart"
 *
 * - If product to update not in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product not in cart"
 *
 * Otherwise, remove the product from user's cart
 *
 *
 * @param {User} user
 * @param {string} productId
 * @throws {ApiError}
 */
const deleteProductFromCart = async (user, productId) => {

    let cart = await Cart.findOne({email : user.email});

    if(!cart){
      throw new ApiError(400,"User does not have a cart");
    }

    let productinCart = false;
    let modCart = [];
    cart.cartItems.forEach((element) => {
      if(element.product._id==productId){
        productinCart=true;
        modCart.push(element);
      }
    });

    if(!productinCart){
      throw new ApiError(400,"Product not in cart");
    }
    // console.log("Modified Cart");
    // console.log(modCart);
    let cartitem = modCart[0];
    console.log(cartitem);
    // console.log("here I come");
    // console.log(cartitem);
    // console.log(cartitem._id);
    console.log(cart);
    let modCart1 = [];
    console.log(cart.cartItems);
    //await Cart.deleteOne({_id : cartitem._id});
    for (item of cart.cartItems){
      console.log(item);
      if(item._id!=cartitem._id){
        modCart1.push(item);
      }
    }
    console.log(modCart1);

    cart.cartItems = modCart1;
    await cart.save();
    return cart;

    //console.log(user)
    //console.log(deleteditem);  

};

// TODO: CRIO_TASK_MODULE_TEST - Implement checkout function
/**
 * Checkout a users cart.
 * On success, users cart must have no products.
 *
 * @param {User} user
 * @returns {Promise}
 * @throws {ApiError} when cart is invalid
 */
const checkout = async (user) => {
  let cart = await Cart.findOne({email:user.email});
  //console.log(cart);

  if(!cart || cart==null){
    throw new ApiError(404,"User does not have a cart");
  }

  if(cart.cartItems.length===0){
    throw new ApiError(400,"Cart is empty");
  }

  const addressset = await user.hasSetNonDefaultAddress();
  if(!addressset){
    throw new ApiError(400,"User has not set the address");
  }

  let total = 0;
  cart.cartItems.forEach((element) => {
    total = total + (element.product.cost)*(element.quantity);
  });
  // console.log(total);
  // console.log("Wallet" , user.walletMoney);

  if(parseInt(total)>parseInt(user.walletMoney)){
    throw new ApiError(400,"Insufficient wallet Money");
  }
    cart.cartItems = [];
    user.walletMoney = user.walletMoney - total;
    await user.save();
    await cart.save();
};

module.exports = {
  getCartByUser,
  addProductToCart,
  updateProductInCart,
  deleteProductFromCart,
  checkout,
};
