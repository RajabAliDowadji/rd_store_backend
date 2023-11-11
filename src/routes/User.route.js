const express = require("express");
const { body } = require("express-validator");

const { addUser, loginUser } = require("../controllers/User.controller");

const {
  phoneNumberValidation,
} = require("../validators/PhoneNumberValidators");

const {
  rdAdminValidation,
  shopAdminUserValidation,
  shipperUserValidation,
  shopAdminUserTokenValidation,
  shipperUserTokenValidation,
  userValidation,
} = require("../validators/userTypeValidators");

const { validation } = require("../validators/Validators");

const { idValidation } = require("../middlewares/IdValidation");

const { tokenValidation } = require("../validators/tokenValidators");

const router = express.Router();

// // Get All types of users
// router.get("/users", getUsers);

// // All Super Admin API Start
// router.post(
//   "/rd_admin/create",
//   [
//     body("user_name").isString().trim().notEmpty(),
//     body("email").trim().isEmail().normalizeEmail(),
//     body("phone_number").isString(),
//     body("password").isString().trim().notEmpty().isLength({ min: 8, max: 16 }),
//     body("user_type").isString().trim().notEmpty(),
//   ],
//   phoneNumberValidation,
//   validation,
//   rdAdminValidation,
//   addUser
// );

// router.put(
//   "/rd_admin/:id",
//   idValidation,
//   [
//     body("user_name").isString().trim().notEmpty(),
//     body("email").trim().isEmail().normalizeEmail(),
//     body("phone_number").isString(),
//     body("password").isString().trim().notEmpty().isLength({ min: 8, max: 16 }),
//     body("user_type").isString().trim().notEmpty(),
//   ],
//   phoneNumberValidation,
//   validation,
//   rdAdminValidation,
//   updateUser
// );

// // All Super Admin API End

// // All Shop Admin API Start
// router.post(
//   "/shop_admin/create",
//   [
//     body("user_name").isString().trim().notEmpty(),
//     body("email").trim().isEmail().normalizeEmail(),
//     body("phone_number").isString(),
//     body("password").isString().trim().notEmpty().isLength({ min: 8, max: 16 }),
//     body("user_type").isString().trim().notEmpty(),
//   ],
//   phoneNumberValidation,
//   validation,
//   tokenValidation,
//   shopAdminUserValidation,
//   addUser
// );

// router.put(
//   "/shop_admin/:id",
//   idValidation,
//   [
//     body("user_name").isString().trim().notEmpty(),
//     body("email").trim().isEmail().normalizeEmail(),
//     body("phone_number").isString(),
//     body("password").isString().trim().notEmpty().isLength({ min: 8, max: 16 }),
//     body("user_type").isString().trim().notEmpty(),
//   ],
//   phoneNumberValidation,
//   validation,
//   tokenValidation,
//   shopAdminUserValidation,
//   updateUser
// );

// router.delete(
//   "/shop_admin/:id",
//   idValidation,
//   tokenValidation,
//   shopAdminUserTokenValidation,
//   deleteUser
// );

// // All Shop Admin API End

// // All Shipper API Start

// router.post(
//   "/shipper/create",
//   [
//     body("user_name").isString().trim().notEmpty(),
//     body("email").trim().isEmail().normalizeEmail(),
//     body("phone_number").isString(),
//     body("password").isString().trim().notEmpty().isLength({ min: 8, max: 16 }),
//     body("user_type").isString().trim().notEmpty(),
//   ],
//   phoneNumberValidation,
//   validation,
//   tokenValidation,
//   shipperUserValidation,
//   addUser
// );

// router.put(
//   "/shipper/:id",
//   idValidation,
//   [
//     body("user_name").isString().trim().notEmpty(),
//     body("email").trim().isEmail().normalizeEmail(),
//     body("phone_number").isString(),
//     body("password").isString().trim().notEmpty().isLength({ min: 8, max: 16 }),
//     body("user_type").isString().trim().notEmpty(),
//   ],
//   phoneNumberValidation,
//   validation,
//   tokenValidation,
//   shipperUserValidation,
//   updateUser
// );

// router.delete(
//   "/shipper/:id",
//   idValidation,
//   tokenValidation,
//   shipperUserTokenValidation,
//   deleteUser
// );

// // All Shipper Admin API End

// User All API Start

router.post(
  "/user/create",
  [
    body("user_name").isString().trim().notEmpty(),
    body("phone_number").isString(),
  ],
  phoneNumberValidation,
  validation,
  addUser
);

// router.put(
//   "/user/:id",
//   idValidation,
//   [
//     body("user_name").isString().trim().notEmpty(),
//     body("email").trim().isEmail().normalizeEmail(),
//     body("phone_number").isString(),
//     body("password").isString().trim().notEmpty().isLength({ min: 8, max: 16 }),
//     body("user_type").isString().trim().notEmpty(),
//   ],
//   phoneNumberValidation,
//   validation,
//   userValidation,
//   updateUser
// );

// router.delete(
//   "/user/:id",
//   idValidation,
//   tokenValidation,
//   shopAdminUserTokenValidation,
//   deleteUser
// );

// // User All API End

// // All User Login API Start

router.post(
  "/user/login",
  [body("phone_number").isString()],
  validation,
  phoneNumberValidation,
  loginUser
);

// // All User Login API End

// // All User Forgot Password API Start

// router.post(
//   "/forgot-password",
//   [body("email").trim().isEmail().normalizeEmail()],
//   validation,
//   forgotPasswordUser
// );

// router.post(
//   "/reset-password",
//   [body("password").isString().trim().notEmpty().isLength({ min: 8, max: 16 })],
//   validation,
//   tokenValidation,
//   resetPasswordUser
// );

// // All User Forget Password API End

module.exports = router;
