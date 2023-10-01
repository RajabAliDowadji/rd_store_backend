const express = require("express");
const { body } = require("express-validator");

const {
  getUserOrders,
  placeOrder,
  paidOrder,
  shopAcceptOrder,
  shipperAcceptOrder,
  deliveredOrder,
} = require("../controllers/Order.controller");

const {
  userTokenValidation,
  shopUserTokenValidation,
  shipperLoginUserValidation,
} = require("../validators/userTypeValidators");

const { idValidation } = require("../middlewares/IdValidation");

const { tokenValidation } = require("../validators/tokenValidators");

const { validation } = require("../validators/Validators");

const router = express.Router();

router.get("/orders/:id", idValidation, tokenValidation, getUserOrders);

router.post("/order/placed", tokenValidation, userTokenValidation, placeOrder);

router.post(
  "/order/paid/:id",
  idValidation,
  tokenValidation,
  userTokenValidation,
  [body("transition_id").isString().trim().notEmpty()],
  validation,
  paidOrder
);

router.post(
  "/order/shop/accept/:id",
  idValidation,
  tokenValidation,
  shopUserTokenValidation,
  shopAcceptOrder
);

router.post(
  "/order/shipper/accept/:id",
  idValidation,
  tokenValidation,
  shipperLoginUserValidation,
  shipperAcceptOrder
);

router.post(
  "/order/delivered/:id",
  tokenValidation,
  shipperLoginUserValidation,
  deliveredOrder
);

module.exports = router;
