const { STATUS } = require("../constants/Constants");
const { COMMON } = require("../constants/Shop.messages");
const { errorResponse } = require("../helpers/errorResponse");
const { validationResult } = require("express-validator");

module.exports.RangeValidation = (req, resp, next) => {
  const errors = validationResult(req);
  const lower_range = req.body.lower_range;
  const upper_range = req.body.upper_range;
  if (!errors.isEmpty()) {
    return resp
      .status(STATUS.BAD)
      .send(errorResponse(STATUS.BAD, COMMON.BAD_REQUEST.message));
  }
  if (lower_range >= upper_range) {
    return resp
      .status(STATUS.BAD)
      .send(errorResponse(STATUS.BAD, COMMON.VALIDATE_ERROR.message));
  }
  next();
};
