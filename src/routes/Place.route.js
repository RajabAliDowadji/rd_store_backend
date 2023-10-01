const express = require("express");
const { body } = require("express-validator");

const {
  addPlace,
  getPlace,
  getPlaceById,
  getPlaces,
  updatePlace,
  deletePlace,
} = require("../controllers/Place.controller");

const { rdAdminTokenValidation } = require("../validators/userTypeValidators");

const { idValidation } = require("../middlewares/IdValidation");

const { pinCodeValidation } = require("../validators/PincodeValidators");

const { tokenValidation } = require("../validators/tokenValidators");

const router = express.Router();

router.get("/places", tokenValidation, rdAdminTokenValidation, getPlaces);

router.get(
  "/place/:id",
  idValidation,
  tokenValidation,
  rdAdminTokenValidation,
  getPlaceById
);

router.post(
  "/place",
  [body("pincode").trim().isLength({ min: 6, max: 6 })],
  tokenValidation,
  rdAdminTokenValidation,
  pinCodeValidation,
  getPlace
);

router.post(
  "/place/create",
  [body("pincode").trim().isLength({ min: 6, max: 6 })],
  pinCodeValidation,
  tokenValidation,
  rdAdminTokenValidation,
  addPlace
);

router.put(
  "/place/:id",
  idValidation,
  [body("pincode").trim().isLength({ min: 6, max: 6 })],
  pinCodeValidation,
  tokenValidation,
  rdAdminTokenValidation,
  updatePlace
);

router.delete(
  "/place/:id",
  idValidation,
  tokenValidation,
  rdAdminTokenValidation,
  deletePlace
);

module.exports = router;
