const express = require("express");
const { body } = require("express-validator");

const {
  addProdType,
  getProdTypes,
  updateProdType,
  deleteProdType,
  getProdTypeById,
} = require("../controllers/ProductType.controller");

const { idValidation } = require("../middlewares/IdValidation");

const { tokenValidation } = require("../validators/tokenValidators");

const { rdAdminTokenValidation } = require("../validators/userTypeValidators");

const { validation } = require("../validators/Validators");

const router = express.Router();

router.get("/types", tokenValidation, getProdTypes);

router.get("/type/:id", idValidation, tokenValidation, getProdTypeById);

router.post(
  "/type/create",
  tokenValidation,
  rdAdminTokenValidation,
  [body("type_name").isString().trim().notEmpty()],
  validation,
  addProdType
);

router.put(
  "/type/:id",
  idValidation,
  tokenValidation,
  rdAdminTokenValidation,
  [body("type_name").isString().trim().notEmpty()],
  validation,
  updateProdType
);

router.delete(
  "/type/:id",
  idValidation,
  tokenValidation,
  rdAdminTokenValidation,
  deleteProdType
);

module.exports = router;
