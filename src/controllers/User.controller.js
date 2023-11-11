require("dotenv").config();
const UserModal = require("../models/User.modal");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { USER_API, LOGIN_API, COMMON } = require("../constants/User.message");
const { STATUS } = require("../constants/Constants");
const { apiResponse } = require("../helpers/apiResponse");
const { errorResponse } = require("../helpers/errorResponse");

module.exports.addUser = async (req, resp, next) => {
  const { user_name, phone_number, email } = req.body;
  const user = await UserModal.findOne({ phone_number });
  if (!user) {
    const user = new UserModal({
      user_name: user_name,
      phone_number: phone_number,
      email: email,
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
