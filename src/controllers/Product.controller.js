const ProductModal = require("../models/Product.modal");
const CommissionModal = require("../models/Commission.modal");
const ProductRatingModal = require("../models/ProductRating.modal");
const ProductInventoriesModal = require("../models/ProductInventories.modal");
const { PROD_API, COMMON } = require("../constants/Product.messages");
const { STATUS, ACCOUNTTYPE } = require("../constants/Constants");
const { apiResponse } = require("../helpers/apiResponse");
const { errorResponse } = require("../helpers/errorResponse");

module.exports.getProducts = async (req, resp, next) => {
  const brand_name = req.query.brand_name;
  const sub_category_name = req.query.sub_category_name;
  let queryData = {};
  if (brand_name || sub_category_name) {
    queryData = {
      $or: [
        { product_sub_category: sub_category_name },
        { product_brand: brand_name },
      ],
    };
  }
  const products = await ProductModal.find(queryData)
    .populate("commission")
    .populate("rating")
    .populate("inventory")
    .populate("product_sub_category")
    .populate("product_brand");
  if (products) {
    return resp
      .status(STATUS.SUCCESS)
      .send(
        apiResponse(STATUS.SUCCESS, PROD_API.PROD_SUCCESS.message, products)
      );
  } else {
    return resp
      .status(STATUS.INTERNAL_SERVER)
      .send(errorResponse(STATUS.INTERNAL_SERVER, COMMON.SERVER_ERROR.message));
  }
};

module.exports.getProductById = async (req, resp, next) => {
  const productId = req.params.id;
  const product = await ProductModal.findOne({ _id: productId })
    .populate("product_sub_category")
    .populate("product_brand")
    .populate("product_images")
    .populate("commission")
    .populate("rating")
    .populate("inventory");

  if (product) {
    return resp
      .status(STATUS.SUCCESS)
      .send(
        apiResponse(STATUS.SUCCESS, PROD_API.PROD_SUCCESS.message, product)
      );
  } else {
    return resp
      .status(STATUS.INTERNAL_SERVER)
      .send(errorResponse(STATUS.INTERNAL_SERVER, COMMON.SERVER_ERROR.message));
  }
};

module.exports.addProduct = async (req, resp, next) => {
  const { product_title, product_price, product_brand } = req.body;
  const product = await ProductModal.findOne({
    product_title,
    product_price,
    product_brand,
  });
  if (!product) {
    const productmodal = new ProductModal({
      ...req.body,
      is_published: false,
    });

    await productmodal.save();

    return resp
      .status(STATUS.CREATED)
      .send(
        apiResponse(STATUS.CREATED, PROD_API.PROD_CREATE.message, productmodal)
      );
  } else {
    return resp
      .status(STATUS.BAD)
      .send(errorResponse(STATUS.BAD, PROD_API.PROD_ALREADY_REGISTER.message));
  }
};

module.exports.updateProduct = async (req, resp, next) => {
  const productId = req.params.id;
  const {
    product_title,
    search_name,
    product_price,
    product_MRP_price,
    product_description,
    product_images,
    isVegetarian,
    product_sub_category,
    product_brand,
    product_size,
    rating,
    inventory,
    commission,
  } = req.body;
  const product = await ProductModal.findOne({ _id: productId });
  if (product) {
    product.product_title = product_title;
    product.search_name = search_name;
    product.product_price = product_price;
    product.product_MRP_price = product_MRP_price;
    product.product_description = product_description;
    product.product_images = product_images;
    product.isVegetarian = isVegetarian;
    product.rating = rating;
    product.inventory = inventory;
    product.product_sub_category = product_sub_category;
    product.product_brand = product_brand;
    product.product_size = product_size;
    product.commission = commission;
    product.is_published = false;
    await product.save();

    return resp
      .status(STATUS.SUCCESS)
      .send(apiResponse(STATUS.SUCCESS, PROD_API.PROD_UPDATE.message, product));
  } else {
    return resp
      .status(STATUS.BAD)
      .send(errorResponse(STATUS.BAD, PROD_API.PROD_INVALID_ID.message));
  }
};

module.exports.deleteProduct = async (req, resp, next) => {
  const productId = req.params.id;
  const product = await ProductModal.findOne({ _id: productId });
  if (product) {
    await ProductInventoriesModal.findOneAndDelete({
      product: productId,
    });
    await CommissionModal.findByIdAndRemove({
      product: productId,
    });
    await ProductRatingModal.findByIdAndRemove({
      product: productId,
    });

    await ProductModal.findByIdAndRemove({ _id: productId });

    return resp
      .status(STATUS.SUCCESS)
      .send(apiResponse(STATUS.SUCCESS, PROD_API.PROD_DELETE.message));
  } else {
    return resp
      .status(STATUS.BAD)
      .send(errorResponse(STATUS.BAD, PROD_API.PROD_INVALID_ID.message));
  }
};
