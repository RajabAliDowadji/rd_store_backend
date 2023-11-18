const express = require("express");
const { body } = require("express-validator");

const {
  createUser,
  loginUser,
  createRDAdminUser,
  loginRDAdminUser,
} = require("../controllers/User.controller");

const {
  phoneNumberValidation,
} = require("../validators/PhoneNumberValidators");

const { rdAdminValidation } = require("../validators/userTypeValidators");

const { validation } = require("../validators/Validators");

const router = express.Router();

// RD Admin API Start

router.post(
  "/rd_admin/create",
  [
    body("user_name").isString().trim().notEmpty(),
    body("email").trim().isEmail().normalizeEmail(),
    body("phone_number").isString(),
    body("password").isString().trim().notEmpty().isLength({ min: 8, max: 16 }),
    body("user_type").isString().trim().notEmpty(),
  ],
  phoneNumberValidation,
  validation,
  rdAdminValidation,
  createRDAdminUser
);

router.post(
  "/rd_admin/login",
  [
    body("email").trim().isEmail().normalizeEmail(),
    body("password").isString().trim().notEmpty().isLength({ min: 8, max: 16 }),
  ],
  validation,
  loginRDAdminUser
);

// RD Admin API End

// User API Start

router.post(
  "/user/create",
  [
    body("user_name").isString().trim().notEmpty(),
    body("phone_number").isString(),
  ],
  phoneNumberValidation,
  validation,
  createUser
);

router.post(
  "/user/login",
  [body("phone_number").isString()],
  validation,
  phoneNumberValidation,
  loginUser
);
//  All User Login API End

module.exports = router;
