const express = require("express");
const { body } = require("express-validator");
const {
  addUserAddress,
  getAddresses,
  deleteUserAddress,
} = require("../controllers/UserAddress.controller");
const { tokenValidation } = require("../validators/tokenValidators");
const { userTokenValidation } = require("../validators/userTypeValidators");

const router = express.Router();

router.get("/address", tokenValidation, getAddresses);

router.post("/address/create", tokenValidation, addUserAddress);

router.delete("/address/:id", tokenValidation, deleteUserAddress);

module.exports = router;
