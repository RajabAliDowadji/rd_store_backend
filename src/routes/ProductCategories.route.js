const express = require("express");
const { body } = require("express-validator");

const {
  addProductCategory,
  getProductCategories,
  updateProductCategory,
  deleteProductCategory,
  getProductCategoryById,
} = require("../controllers/ProductCategories.controller");

const {
  productTypeValidation,
  idValidation,
} = require("../middlewares/IdValidation");

const { tokenValidation } = require("../validators/tokenValidators");

const { rdAdminTokenValidation } = require("../validators/userTypeValidators");

const { validation } = require("../validators/Validators");

const router = express.Router();

router.get(
  "/categories",
  tokenValidation,
  rdAdminTokenValidation,
  getProductCategories
);

router.get(
  "/category/:id",
  idValidation,
  tokenValidation,
  rdAdminTokenValidation,
  getProductCategoryById
);

router.post(
  "/category/create",
  tokenValidation,
  rdAdminTokenValidation,
  [
    body("category_name").isString().trim().notEmpty(),
    body("product_type").isString().trim().notEmpty(),
  ],
  validation,
  productTypeValidation,
  addProductCategory
);

router.put(
  "/category/:id",
  idValidation,
  tokenValidation,
  rdAdminTokenValidation,
  [
    body("category_name").isString().trim().notEmpty(),
    body("product_type").isString().trim().notEmpty(),
  ],
  validation,
  productTypeValidation,
  updateProductCategory
);

router.delete(
  "/category/:id",
  idValidation,
  tokenValidation,
  rdAdminTokenValidation,
  deleteProductCategory
);

module.exports = router;
