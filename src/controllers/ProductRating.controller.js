const ProductRatingModal = require("../models/ProductRating.modal");
const ProductModal = require("../models/Product.modal");
const { COMMON_ERROR } = require("../constants/Constants");
const { STATUS } = require("../constants/Constants");
const { apiResponse } = require("../helpers/apiResponse");
const { errorResponse } = require("../helpers/errorResponse");

module.exports.getProductsRatings = async (req, resp, next) => {
  const ProductRatings = await ProductRatingModal.find().populate({
    path: "product",
    populate: [
      {
        path: "product_brand",
      },
      {
        path: "product_sub_category",
      },
    ],
  });
  if (ProductRatings) {
    return resp
      .status(STATUS.SUCCESS)
      .send(
        apiResponse(
          STATUS.SUCCESS,
          COMMON_ERROR.SUCCESS.message,
          ProductRatings
        )
      );
  } else {
    return resp
      .status(STATUS.INTERNAL_SERVER)
      .send(
        apiResponse(STATUS.INTERNAL_SERVER, COMMON_ERROR.SERVER_ERROR.message)
      );
  }
};

module.exports.addProductRatings = async (req, resp, next) => {
  const productId = req.body.product;
  const productRating = req.body.rating;
  const Product = await ProductModal.findOne({
    _id: productId,
  });
  const ProductRating = await ProductRatingModal.findOne({
    product: productId,
  });
  if (Product) {
    if (ProductRating) {
      ProductRating.product = productId;
      ProductRating.rating = productRating;

      await ProductRating.save();
    } else {
      const productRatingmodal = new ProductRatingModal({
        product: productId,
        rating: productRating,
      });

      await productRatingmodal.save();

      Product.rating = productRatingmodal._id;
      Product.save();
    }
    return resp
      .status(STATUS.SUCCESS)
      .send(apiResponse(STATUS.SUCCESS, COMMON_ERROR.SUCCESS.message));
  } else {
    return resp
      .status(STATUS.INTERNAL_SERVER)
      .send(
        apiResponse(STATUS.INTERNAL_SERVER, COMMON_ERROR.SERVER_ERROR.message)
      );
  }
};

module.exports.deleteProductRatings = async (req, resp, next) => {
  const productRatingId = req.params.id;
  const ProductRating = await ProductRatingModal.findOne({
    _id: productRatingId,
  });
  const Product = await ProductModal.findOne({ rating: productRatingId });
  if (ProductRating) {
    Product.rating = null;

    await Product.save();

    await ProductRatingModal.findByIdAndRemove({
      _id: productRatingId,
    });

    return resp
      .status(STATUS.SUCCESS)
      .send(apiResponse(STATUS.SUCCESS, COMMON_ERROR.SUCCESS.message));
  } else {
    return resp
      .status(STATUS.INTERNAL_SERVER)
      .send(
        apiResponse(STATUS.INTERNAL_SERVER, COMMON_ERROR.SERVER_ERROR.message)
      );
  }
};
