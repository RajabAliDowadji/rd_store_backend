const express = require("express");
const { body } = require("express-validator");

const {
  getCartItems,
  addUpdateCartItems,
  deleteCartItems,
} = require("../controllers/Cart.controller");

const {
  productValidation,
  idValidation,
} = require("../middlewares/IdValidation");

const { userTokenValidation } = require("../validators/userTypeValidators");

const { tokenValidation } = require("../validators/tokenValidators");

const { validation } = require("../validators/Validators");

const router = express.Router();

router.get("/cart/items", tokenValidation, userTokenValidation, getCartItems);

router.post(
  "/cart/item",
  tokenValidation,
  userTokenValidation,
  validation,
  addUpdateCartItems
);

router.put(
  "/cart/item/:id",
  idValidation,
  tokenValidation,
  userTokenValidation,
  validation,
  addUpdateCartItems
);

router.delete(
  "/cart/item/:id",
  idValidation,
  tokenValidation,
  userTokenValidation,
  deleteCartItems
);

module.exports = router;
