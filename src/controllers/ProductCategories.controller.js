const ProductCategoriesModal = require("../models/ProductCategories.modal");
const { PROD_CAT_API, COMMON } = require("../constants/Product.messages");
const { STATUS } = require("../constants/Constants");
const { apiResponse } = require("../helpers/apiResponse");
const { errorResponse } = require("../helpers/errorResponse");

module.exports.getProductCategories = async (req, resp, next) => {
  const productCategories = await ProductCategoriesModal.find().populate(
    "product_type"
  );
  if (productCategories) {
    return resp
      .status(STATUS.SUCCESS)
      .send(
        apiResponse(
          STATUS.SUCCESS,
          PROD_CAT_API.PROD_CAT_SUCCESS.message,
          productCategories
        )
      );
  } else {
    return resp
      .status(STATUS.INTERNAL_SERVER)
      .send(errorResponse(STATUS.INTERNAL_SERVER, COMMON.SERVER_ERROR.message));
  }
};
module.exports.getProductCategoryById = async (req, resp, next) => {
  const productCategoryId = req.params.id;
  const productCategory = await ProductCategoriesModal.findOne({
    _id: productCategoryId,
  }).populate("product_type");
  if (productCategory) {
    return resp
      .status(STATUS.SUCCESS)
      .send(
        apiResponse(
          STATUS.SUCCESS,
          PROD_CAT_API.PROD_CAT_SUCCESS.message,
          productCategory
        )
      );
  } else {
    return resp
      .status(STATUS.INTERNAL_SERVER)
      .send(errorResponse(STATUS.INTERNAL_SERVER, COMMON.SERVER_ERROR.message));
  }
};
module.exports.addProductCategory = async (req, resp, next) => {
  const category_name = req.body.category_name;
  const search_name = req.body.search_name;
  const product_type = req.body.product_type;
  const productCategory = await ProductCategoriesModal.findOne({
    category_name,
  });
  if (!productCategory) {
    const productCategory = new ProductCategoriesModal({
      category_name: category_name,
      search_name: search_name,
      product_type: product_type,
    });
    await productCategory.save();
    return resp
      .status(STATUS.CREATED)
      .send(
        apiResponse(
          STATUS.CREATED,
          PROD_CAT_API.PROD_CAT_CREATE.message,
          productCategory
        )
      );
  } else {
    return resp
      .status(STATUS.BAD)
      .send(
        errorResponse(
          STATUS.BAD,
          PROD_CAT_API.PROD_CAT_ALREADY_REGISTER.message
        )
      );
  }
};

module.exports.updateProductCategory = async (req, resp, next) => {
  const productCategoryId = req.params.id;
  const category_name = req.body.category_name;
  const search_name = req.body.search_name;
  const product_type = req.body.product_type;
  const productCategory = await ProductCategoriesModal.findOne({
    _id: productCategoryId,
  });
  if (productCategory) {
    productCategory.category_name = category_name;
    productCategory.search_name = search_name;
    productCategory.product_type = product_type;

    await productCategory.save();

    return resp
      .status(STATUS.SUCCESS)
      .send(
        apiResponse(
          STATUS.SUCCESS,
          PROD_CAT_API.PROD_CAT_UPDATE.message,
          productCategory
        )
      );
  } else {
    return resp
      .status(STATUS.BAD)
      .send(
        errorResponse(STATUS.BAD, PROD_CAT_API.PROD_CAT_INVALID_ID.message)
      );
  }
};

module.exports.deleteProductCategory = async (req, resp, next) => {
  const productCategoryId = req.params.id;
  const productCategory = await ProductCategoriesModal.findOne({
    _id: productCategoryId,
  });
  if (productCategory) {
    await ProductCategoriesModal.findByIdAndRemove({ _id: productCategoryId });
    return resp
      .status(STATUS.SUCCESS)
      .send(apiResponse(STATUS.SUCCESS, PROD_CAT_API.PROD_CAT_DELETE.message));
  } else {
    return resp
      .status(STATUS.BAD)
      .send(errorResponse(STATUS.BAD, PROD_CAT_API.PROD_CAT_NOT_FOUND.message));
  }
};
