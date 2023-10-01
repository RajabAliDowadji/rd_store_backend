const express = require("express");
const { body } = require("express-validator");

const {
  getProductsRatings,
  addProductRatings,
  deleteProductRatings,
} = require("../controllers/ProductRating.controller");

const {
  idValidation,
  productValidation,
} = require("../middlewares/IdValidation");

const { validation } = require("../validators/Validators");

const { tokenValidation } = require("../validators/tokenValidators");

const { rdAdminTokenValidation } = require("../validators/userTypeValidators");

const router = express.Router();

router.get(
  "/ratings",
  tokenValidation,
  rdAdminTokenValidation,
  getProductsRatings
);

router.post(
  "/rating/create",
  tokenValidation,
  productValidation,
  addProductRatings
);

router.put("/rating", tokenValidation, productValidation, addProductRatings);

router.delete(
  "/rating/:id",
  idValidation,
  tokenValidation,
  rdAdminTokenValidation,
  deleteProductRatings
);

module.exports = router;
