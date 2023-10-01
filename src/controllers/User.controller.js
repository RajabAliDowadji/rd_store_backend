require("dotenv").config();
const UserModal = require("../models/User.modal");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  USER_API,
  LOGIN_API,
  COMMON,
  RESET_PSWD_API,
} = require("../constants/User.message");
const { STATUS } = require("../constants/Constants");
const { apiResponse } = require("../helpers/apiResponse");
const { errorResponse } = require("../helpers/errorResponse");

module.exports.getUsers = async (req, resp, next) => {
  const users = await UserModal.find().select("-password");
  if (users) {
    return resp
      .status(STATUS.SUCCESS)
      .send(apiResponse(STATUS.SUCCESS, USER_API.USER_SUCCESS.message, users));
  } else {
    return resp
      .status(STATUS.INTERNAL_SERVER)
      .send(errorResponse(STATUS.INTERNAL_SERVER, COMMON.SERVER_ERROR.message));
  }
};

module.exports.addUser = async (req, resp, next) => {
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

module.exports.updateUser = async (req, resp, next) => {
  const userId = req.params.id;
  const { user_name, phone_number, email, password, user_type } = req.body;
  const user = await UserModal.findOne({ _id: userId });
  if (user) {
    const hashedPassword = await bcrypt.hash(password, 12);
    user.user_name = user_name;
    user.phone_number = phone_number;
    user.email = email;
    user.password = hashedPassword;
    user.user_type = user_type;

    await user.save();
    user.password = undefined;
    return resp
      .status(STATUS.SUCCESS)
      .send(apiResponse(STATUS.SUCCESS, USER_API.USER_UPDATE.message, user));
  } else {
    return resp
      .status(STATUS.BAD)
      .send(errorResponse(STATUS.BAD, USER_API.USER_INVALID_ID.message));
  }
};

module.exports.deleteUser = async (req, resp, next) => {
  const userId = req.params.id;
  const user = await UserModal.findOne({ _id: userId });
  if (user) {
    await UserModal.findByIdAndRemove({ _id: userId });
    return resp
      .status(STATUS.SUCCESS)
      .send(apiResponse(STATUS.SUCCESS, USER_API.USER_DELETE.message));
  } else {
    return resp
      .status(STATUS.BAD)
      .send(errorResponse(STATUS.BAD, USER_API.USER_NOT_FOUND.message));
  }
};

module.exports.loginUser = async (req, resp, next) => {
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

module.exports.forgotPasswordUser = async (req, resp, next) => {
  const { email } = req.body;
  const user = await UserModal.findOne({ email });
  if (user) {
    const token = await jwt.sign(
      { user_id: user._id, email, user_type: user.user_type },
      process.env.JWT_TOCKEN_KEY,
      {
        expiresIn: "24h",
      }
    );
    return resp.status(STATUS.SUCCESS).send(
      apiResponse(STATUS.SUCCESS, RESET_PSWD_API.RESET_PSWD_SUCCESS.message, {
        token: token,
      })
    );
  } else {
    return resp
      .status(STATUS.BAD)
      .send(errorResponse(STATUS.BAD, COMMON.BAD_REQUEST.message));
  }
};

module.exports.resetPasswordUser = async (req, resp, next) => {
  const { password } = req.body;
  const user = await UserModal.findOne({ _id: req.user_id });
  if (user) {
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;

    await user.save();

    const token = await jwt.sign(
      { user_id: user._id, email: user.email, user_type: user.user_type },
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
        apiResponse(
          STATUS.SUCCESS,
          RESET_PSWD_API.RESET_CONF_PSWD_SUCCESS.message,
          user
        )
      );
  } else {
    return resp
      .status(STATUS.BAD)
      .send(errorResponse(STATUS.BAD, COMMON.BAD_REQUEST.message));
  }
};
