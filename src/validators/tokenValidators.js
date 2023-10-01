require("dotenv").config();
const jwt = require("jsonwebtoken");
const { STATUS, COMMON_ERROR } = require("../constants/Constants");
const { errorResponse } = require("../helpers/errorResponse");

module.exports.tokenValidation = async (req, resp, next) => {
  const token = req.get("token");
  if (!token) {
    return resp
      .status(STATUS.UNAUTHORIZE)
      .send(
        errorResponse(STATUS.UNAUTHORIZE, COMMON_ERROR.TOKEN_EXPIRED.message)
      );
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_TOCKEN_KEY);
  } catch (err) {
    return resp
      .status(STATUS.INTERNAL_SERVER)
      .send(
        errorResponse(STATUS.INTERNAL_SERVER, COMMON_ERROR.SERVER_ERROR.message)
      );
  }
  if (!decodedToken) {
    return resp
      .status(STATUS.UNAUTHORIZE)
      .send(
        errorResponse(STATUS.UNAUTHORIZE, COMMON_ERROR.UNAUTHORIZE.message)
      );
  }
  req.user_type = decodedToken.user_type;
  req.user_id = decodedToken.user_id;
  next();
};
