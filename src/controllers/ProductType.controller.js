const ProductTypeModal = require("../models/ProductType.modal");
const { PROD_TYPE_API, COMMON } = require("../constants/Product.messages");
const { STATUS } = require("../constants/Constants");
const { apiResponse } = require("../helpers/apiResponse");
const { errorResponse } = require("../helpers/errorResponse");

module.exports.getProdTypes = async (req, resp, next) => {
  const productTypes = await ProductTypeModal.find();
  if (productTypes) {
    return resp
      .status(STATUS.SUCCESS)
      .send(
        apiResponse(
          STATUS.SUCCESS,
          PROD_TYPE_API.PROD_TYPE_SUCCESS.message,
          productTypes
        )
      );
  } else {
    return resp
      .status(STATUS.INTERNAL_SERVER)
      .send(errorResponse(STATUS.INTERNAL_SERVER, COMMON.SERVER_ERROR.message));
  }
};

module.exports.getProdTypeById = async (req, resp, next) => {
  const productTypeId = req.params.id;
  const prodType = await ProductTypeModal.findOne({ _id: productTypeId });
  if (prodType) {
    return resp
      .status(STATUS.SUCCESS)
      .send(
        apiResponse(
          STATUS.SUCCESS,
          PROD_TYPE_API.PROD_TYPE_SUCCESS.message,
          prodType
        )
      );
  } else {
    return resp
      .status(STATUS.INTERNAL_SERVER)
      .send(errorResponse(STATUS.INTERNAL_SERVER, COMMON.SERVER_ERROR.message));
  }
};

module.exports.addProdType = async (req, resp, next) => {
  const type_name = req.body.type_name;
  const search_name = req.body.search_name;
  const prodType = await ProductTypeModal.findOne({ type_name });
  if (!prodType) {
    const prodType = new ProductTypeModal({
      type_name: type_name,
      search_name: search_name,
    });
    await prodType.save();
    return resp
      .status(STATUS.CREATED)
      .send(
        apiResponse(
          STATUS.CREATED,
          PROD_TYPE_API.PROD_TYPE_CREATE.message,
          prodType
        )
      );
  } else {
    return resp
      .status(STATUS.BAD)
      .send(
        errorResponse(
          STATUS.BAD,
          PROD_TYPE_API.PROD_TYPE_ALREADY_REGISTER.message
        )
      );
  }
};

module.exports.updateProdType = async (req, resp, next) => {
  const productTypeId = req.params.id;
  const type_name = req.body.type_name;
  const search_name = req.body.search_name;
  const prodType = await ProductTypeModal.findOne({ _id: productTypeId });
  if (prodType) {
    prodType.type_name = type_name;
    prodType.search_name = search_name;
    await prodType.save();
    return resp
      .status(STATUS.SUCCESS)
      .send(
        apiResponse(
          STATUS.SUCCESS,
          PROD_TYPE_API.PROD_TYPE_UPDATE.message,
          prodType
        )
      );
  } else {
    return resp
      .status(STATUS.BAD)
      .send(
        errorResponse(STATUS.BAD, PROD_TYPE_API.PROD_TYPE_INVALID_ID.message)
      );
  }
};

module.exports.deleteProdType = async (req, resp, next) => {
  const productTypeId = req.params.id;
  const prodType = await ProductTypeModal.findOne({ _id: productTypeId });
  if (prodType) {
    await ProductTypeModal.findByIdAndRemove({ _id: productTypeId });
    return resp
      .status(STATUS.SUCCESS)
      .send(
        apiResponse(STATUS.SUCCESS, PROD_TYPE_API.PROD_TYPE_DELETE.message)
      );
  } else {
    return resp
      .status(STATUS.BAD)
      .send(
        errorResponse(STATUS.BAD, PROD_TYPE_API.PROD_TYPE_NOT_FOUND.message)
      );
  }
};
