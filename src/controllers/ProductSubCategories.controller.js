const ProductSubCategoriesModal = require("../models/ProductSubCategories.modal");
const { PROD_SUB_CAT_API, COMMON } = require("../constants/Product.messages");
const { STATUS } = require("../constants/Constants");
const { apiResponse } = require("../helpers/apiResponse");
const { errorResponse } = require("../helpers/errorResponse");

module.exports.getProductSubCategories = async (req, resp, next) => {
  const productSubCategories = await ProductSubCategoriesModal.find().populate({
    path: "product_category",
    populate: [
      {
        path: "product_type",
      },
    ],
  });
  if (productSubCategories) {
    return resp
      .status(STATUS.SUCCESS)
      .send(
        apiResponse(
          STATUS.SUCCESS,
          PROD_SUB_CAT_API.PROD_SUB_CAT_SUCCESS.message,
          productSubCategories
        )
      );
  } else {
    return resp
      .status(STATUS.INTERNAL_SERVER)
      .send(errorResponse(STATUS.INTERNAL_SERVER, COMMON.SERVER_ERROR.message));
  }
};

module.exports.getProductSubCategoryById = async (req, resp, next) => {
  const subCategoryId = req.params.id;
  const prodSubCategory = await ProductSubCategoriesModal.findOne({
    _id: subCategoryId,
  }).populate({
    path: "product_category",
    populate: [
      {
        path: "product_type",
      },
    ],
  });
  if (prodSubCategory) {
    return resp
      .status(STATUS.SUCCESS)
      .send(
        apiResponse(
          STATUS.SUCCESS,
          PROD_SUB_CAT_API.PROD_SUB_CAT_SUCCESS.message,
          prodSubCategory
        )
      );
  } else {
    return resp
      .status(STATUS.INTERNAL_SERVER)
      .send(errorResponse(STATUS.INTERNAL_SERVER, COMMON.SERVER_ERROR.message));
  }
};

module.exports.addProductSubCategory = async (req, resp, next) => {
  const sub_category_name = req.body.sub_category_name;
  const search_name = req.body.search_name;
  const product_category = req.body.product_category;

  const prodSubCategory = await ProductSubCategoriesModal.findOne({
    sub_category_name: sub_category_name,
  });

  if (!prodSubCategory) {
    const prodSubCategory = new ProductSubCategoriesModal({
      sub_category_name: sub_category_name,
      search_name: search_name,
      product_category: product_category,
    });

    await prodSubCategory.save();

    return resp
      .status(STATUS.CREATED)
      .send(
        apiResponse(
          STATUS.CREATED,
          PROD_SUB_CAT_API.PROD_SUB_CAT_CREATE.message,
          prodSubCategory
        )
      );
  } else {
    return resp
      .status(STATUS.BAD)
      .send(
        errorResponse(
          STATUS.BAD,
          PROD_SUB_CAT_API.PROD_SUB_CAT_ALREADY_REGISTER.message
        )
      );
  }
};

module.exports.updateProductSubCategory = async (req, resp, next) => {
  const subCategoryId = req.params.id;
  const sub_category_name = req.body.sub_category_name;
  const search_name = req.body.search_name;
  const product_category = req.body.product_category;
  const prodSubCategory = await ProductSubCategoriesModal.findOne({
    _id: subCategoryId,
  });
  if (prodSubCategory) {
    prodSubCategory.sub_category_name = sub_category_name;
    prodSubCategory.search_name = search_name;
    prodSubCategory.product_category = product_category;

    await prodSubCategory.save();

    return resp
      .status(STATUS.SUCCESS)
      .send(
        apiResponse(
          STATUS.SUCCESS,
          PROD_SUB_CAT_API.PROD_SUB_CAT_UPDATE.message,
          prodSubCategory
        )
      );
  } else {
    return resp
      .status(STATUS.BAD)
      .send(
        errorResponse(
          STATUS.BAD,
          PROD_SUB_CAT_API.PROD_SUB_CAT_INVALID_ID.message
        )
      );
  }
};

module.exports.deleteProductSubCategory = async (req, resp, next) => {
  const subCategoryId = req.params.id;
  const prodSubCategory = await ProductSubCategoriesModal.findOne({
    _id: subCategoryId,
  });
  if (prodSubCategory) {
    await ProductSubCategoriesModal.findByIdAndRemove({ _id: subCategoryId });

    return resp
      .status(STATUS.SUCCESS)
      .send(
        apiResponse(
          STATUS.SUCCESS,
          PROD_SUB_CAT_API.PROD_SUB_CAT_DELETE.message
        )
      );
  } else {
    return resp
      .status(STATUS.BAD)
      .send(
        errorResponse(
          STATUS.BAD,
          PROD_SUB_CAT_API.PROD_SUB_CAT_NOT_FOUND.message
        )
      );
  }
};
