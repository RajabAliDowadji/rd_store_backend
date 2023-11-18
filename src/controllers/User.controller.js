require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserModal = require("../models/User.modal");
const CartModal = require("../models/Cart.modal");
const { USER_API, LOGIN_API, COMMON } = require("../constants/User.message");
const { STATUS, ACCOUNTTYPE } = require("../constants/Constants");
const { apiResponse } = require("../helpers/apiResponse");
const { errorResponse } = require("../helpers/errorResponse");

// RD Admin action start

module.exports.createRDAdminUser = async (req, resp, next) => {
  const { user_name, phone_number, email, password, user_type } = req.body;
  const user = await UserModal.findOne({ email });
  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new UserModal({
      user_name: user_name,
      phone_number: phone_number,
      email: email,
      password: hashedPassword,
      user_type: user_type,
    });
    await user.save();
    const token = await jwt.sign(
      { user_id: user._id, email, user_type },
      process.env.JWT_TOCKEN_KEY,
      {
        expiresIn: "24h",
      }
    );
    user.token = token;
    user.password = undefined;
    return resp
      .status(STATUS.CREATED)
      .send(apiResponse(STATUS.CREATED, USER_API.USER_CREATE.message, user));
  } else {
    return resp
      .status(STATUS.BAD)
      .send(errorResponse(STATUS.BAD, USER_API.USER_ALREADY_REGISTER.message));
  }
};

module.exports.loginRDAdminUser = async (req, resp, next) => {
  const { email, password } = req.body;
  const user = await UserModal.findOne({ email });
  if (user) {
    const response = await bcrypt.compare(password, user.password);
    if (response) {
      const token = await jwt.sign(
        { user_id: user._id, email, user_type: user.user_type },
        process.env.JWT_TOCKEN_KEY,
        {
          expiresIn: "24h",
        }
      );
      user.token = token;
      user.password = undefined;
      return resp
        .status(STATUS.SUCCESS)
        .send(
          apiResponse(STATUS.SUCCESS, LOGIN_API.LOGIN_API_SUCCESS.message, user)
        );
    } else {
      return resp
        .status(STATUS.BAD)
        .send(errorResponse(STATUS.BAD, COMMON.PASSWORD_ERROR.message));
    }
  } else {
    return resp
      .status(STATUS.BAD)
      .send(errorResponse(STATUS.BAD, COMMON.BAD_REQUEST.message));
  }
};

// RD Admin action End

// User action Start

module.exports.createUser = async (req, resp, next) => {
  const { user_name, phone_number, email } = req.body;
  const user = await UserModal.findOne({ phone_number });
  if (!user) {
    const user = new UserModal({
      user_name: user_name,
      phone_number: phone_number,
      email: email,
      user_type: ACCOUNTTYPE.USER,
    });
    await user.save();
    const token = await jwt.sign(
      { user_id: user._id, phone_number },
      process.env.JWT_TOCKEN_KEY,
      {
        expiresIn: "24h",
      }
    );
    user.token = token;
    const cartItem = await CartModal.findOne({ user: user._id }).populate(
      "cart_items.product"
    );
    if (cartItem) {
      user.cart_item = cartItem.cart_items;
    } else {
      const cart = new CartModal({
        user: user._id,
        cart_items: [],
      });

      await cart.save();
    }
    return resp
      .status(STATUS.CREATED)
      .send(apiResponse(STATUS.CREATED, USER_API.USER_CREATE.message, user));
  } else {
    return resp
      .status(STATUS.BAD)
      .send(errorResponse(STATUS.BAD, USER_API.USER_ALREADY_REGISTER.message));
  }
};

module.exports.loginUser = async (req, resp, next) => {
  const { phone_number } = req.body;
  const user = await UserModal.findOne({ phone_number });
  if (user) {
    const token = await jwt.sign(
      { user_id: user._id, phone_number },
      process.env.JWT_TOCKEN_KEY,
      {
        expiresIn: "24h",
      }
    );
    user.token = token;
    const cartItem = await CartModal.findOne({ user: user._id }).populate(
      "cart_items.product"
    );
    if (cartItem) {
      user.cart_item = cartItem.cart_items;
    } else {
      const cart = new CartModal({
        user: user._id,
        cart_items: [],
      });

      await cart.save();
    }
    return resp
      .status(STATUS.SUCCESS)
      .send(
        apiResponse(STATUS.SUCCESS, LOGIN_API.LOGIN_API_SUCCESS.message, user)
      );
  } else {
    return resp
      .status(STATUS.BAD)
      .send(errorResponse(STATUS.BAD, COMMON.BAD_REQUEST.message));
  }
};

// User action Start
