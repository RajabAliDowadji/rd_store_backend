const parsePhoneNumber = require("libphonenumber-js");
const { COMMON } = require("../constants/Shop.messages");
const { STATUS } = require("../constants/Constants");
const { errorResponse } = require("../helpers/errorResponse");

module.exports.phoneNumberValidation = (req, resp, next) => {
  const phone_number = req.body.phone_number;
  const phoneNumberResponse = parsePhoneNumber(`${phone_number}`);
  if (phoneNumberResponse && phoneNumberResponse.isValid()) {
    next();
  } else {
    return resp
      .status(STATUS.BAD)
      .send(errorResponse(STATUS.BAD, COMMON.PHONE_NUMBER_ERROR.message));
  }
};
