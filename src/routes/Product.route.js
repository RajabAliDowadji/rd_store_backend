const express = require("express");
const { body } = require("express-validator");

const {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  getProductById,
} = require("../controllers/Product.controller");

const {
  productSubCategoryValidation,
  productBrandValidation,
  idValidation,
  commissionValidation,
} = require("../middlewares/IdValidation");

const { validation } = require("../validators/Validators");

const { tokenValidation } = require("../validators/tokenValidators");

const {
  rdAdminTokenValidation,
  adminTokenValidation,
} = require("../validators/userTypeValidators");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", idValidation, tokenValidation, getProductById);

router.post(
  "/create",
  tokenValidation,
  adminTokenValidation,
  [
    body("product_title").isString().trim().notEmpty(),
    body("product_price").isNumeric().isLength({ min: 1 }),
    body("product_MRP_price").isNumeric().isLength({ min: 1 }),
    body("product_description").isString().trim().notEmpty(),
    body("product_images").isArray({ min: 2 }),
  ],
  productSubCategoryValidation,
  productBrandValidation,
  validation,
  addProduct
);

router.put(
  "/:id",
  idValidation,
  tokenValidation,
  adminTokenValidation,
  [
    body("product_title").isString().trim().notEmpty(),
    body("product_price").isNumeric().isLength({ min: 1 }),
    body("product_MRP_price").isNumeric().isLength({ min: 1 }),
    body("product_description").isString().trim().notEmpty(),
    body("product_images").isArray({ min: 2 }),
  ],
  validation,
  productSubCategoryValidation,
  productBrandValidation,
  updateProduct
);

router.delete(
  "/:id",
  idValidation,
  tokenValidation,
  rdAdminTokenValidation,
  deleteProduct
);

module.exports = router;
