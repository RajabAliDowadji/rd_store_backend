const express = require("express");
const { body } = require("express-validator");

const {
  addUpdateProductInventory,
  getProductInventories,
  deleteProductInventory,
} = require("../controllers/ProductInventories.controller");

const {
  productValidation,
  idValidation,
} = require("../middlewares/IdValidation");

const { tokenValidation } = require("../validators/tokenValidators");

const {
  rdAdminTokenValidation,
  adminTokenValidation,
} = require("../validators/userTypeValidators");

const { validation } = require("../validators/Validators");

const router = express.Router();

router.get(
  "/inventories",
  tokenValidation,
  adminTokenValidation,
  getProductInventories
);

router.post(
  "/inventory",
  tokenValidation,
  adminTokenValidation,
  [
    body("quantity").isNumeric().trim().notEmpty(),
    body("product").isString().trim().notEmpty(),
  ],
  validation,
  productValidation,
  addUpdateProductInventory
);

router.put(
  "/inventory/:id",
  idValidation,
  tokenValidation,
  adminTokenValidation,
  [
    body("quantity").isNumeric().trim().notEmpty(),
    body("product").isString().trim().notEmpty(),
  ],
  validation,
  productValidation,
  addUpdateProductInventory
);

router.delete(
  "/inventory/:id",
  idValidation,
  tokenValidation,
  rdAdminTokenValidation,
  deleteProductInventory
);

module.exports = router;
