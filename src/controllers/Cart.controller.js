const CartModal = require("../models/Cart.modal");
const { CART_API, COMMON } = require("../constants/Cart.message");
const { STATUS } = require("../constants/Constants");
const { apiResponse } = require("../helpers/apiResponse");
const { errorResponse } = require("../helpers/errorResponse");

module.exports.getCartItems = async (req, resp, next) => {
  const { user_id } = req;
  const cartItem = await CartModal.findOne({ user: user_id }).populate(
    "cart_items.product"
  );
  if (cartItem) {
    return resp
      .status(STATUS.SUCCESS)
      .send(
        apiResponse(STATUS.SUCCESS, CART_API.CART_SUCCESS.message, cartItem)
      );
  } else {
    return resp
      .status(STATUS.INTERNAL_SERVER)
      .send(errorResponse(STATUS.INTERNAL_SERVER, COMMON.SERVER_ERROR.message));
  }
};

module.exports.addUpdateCartItems = async (req, resp, next) => {
  const { user_id } = req;
  const { cart_items } = req.body;
  const cartItem = await CartModal.findOne({ user: user_id });
  if (!cartItem) {
    const cart = new CartModal({
      user: user_id,
      cart_items: cart_items,
    });

    await cart.save();

    return resp
      .status(STATUS.CREATED)
      .send(apiResponse(STATUS.CREATED, CART_API.CART_CREATE.message, cart));
  } else {
    cartItem.user = user_id;
    cartItem.cart_items = cart_items;

    await cartItem.save();

    return resp
      .status(STATUS.SUCCESS)
      .send(
        apiResponse(STATUS.SUCCESS, CART_API.CART_UPDATE.message, cartItem)
      );
  }
};

module.exports.deleteCartItems = async (req, resp, next) => {
  const productId = req.params.id;
  const { user_id } = req;
  await CartModal.updateOne(
    { user: user_id },
    { $pull: { cart_items: { product: productId } } }
  );
  return resp
    .status(STATUS.SUCCESS)
    .send(apiResponse(STATUS.SUCCESS, CART_API.CART_DELETE.message));
};
