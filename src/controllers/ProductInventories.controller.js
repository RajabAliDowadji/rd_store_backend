const ProductInventoriesModal = require("../models/ProductInventories.modal");
const ProductModal = require("../models/Product.modal");
const { PROD_QTY_API, COMMON } = require("../constants/Product.messages");
const { STATUS } = require("../constants/Constants");
const { apiResponse } = require("../helpers/apiResponse");
const { errorResponse } = require("../helpers/errorResponse");

module.exports.getProductInventories = async (req, resp, next) => {
  const productInventories = await ProductInventoriesModal.find().populate({
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
  if (productInventories) {
    return resp
      .status(STATUS.SUCCESS)
      .send(
        apiResponse(
          STATUS.SUCCESS,
          PROD_QTY_API.PROD_QTY_SUCCESS.message,
          productInventories
        )
      );
  } else {
    return resp
      .status(STATUS.INTERNAL_SERVER)
      .send(errorResponse(STATUS.INTERNAL_SERVER, COMMON.SERVER_ERROR.message));
  }
};

module.exports.addUpdateProductInventory = async (req, resp, next) => {
  const productId = req.body.product;
  const quantity = req.body.quantity;
  const product = await ProductModal.findOne({ _id: productId });
  const productinventory = await ProductInventoriesModal.findOne({
    product: productId,
  });
  if (product && !productinventory) {
    const productinventory = new ProductInventoriesModal({
      quantity: quantity,
      product: productId,
    });
    await productinventory.save();

    product.inventory = productinventory._id;

    await product.save();
    return resp
      .status(STATUS.CREATED)
      .send(
        apiResponse(
          STATUS.CREATED,
          PROD_QTY_API.PROD_QTY_CREATE.message,
          productinventory
        )
      );
  } else if (product && productinventory) {
    productinventory.quantity = quantity;
    productinventory.product = productId;

    await productinventory.save();

    return resp
      .status(STATUS.SUCCESS)
      .send(
        apiResponse(
          STATUS.SUCCESS,
          PROD_QTY_API.PROD_QTY_UPDATE.message,
          productinventory
        )
      );
  } else {
    return resp
      .status(STATUS.BAD)
      .send(errorResponse(STATUS.BAD, COMMON.BAD_REQUEST.message));
  }
};

module.exports.deleteProductInventory = async (req, resp, next) => {
  const productIneventoryId = req.params.id;
  const productIneventory = await ProductInventoriesModal.findOne({
    _id: productIneventoryId,
  });
  const product = await ProductModal.findOne({
    inventory: productIneventoryId,
  });

  if (productIneventory) {
    product.inventory = null;

    await product.save();

    await ProductInventoriesModal.findByIdAndRemove({
      _id: productIneventoryId,
    });

    return resp
      .status(STATUS.SUCCESS)
      .send(apiResponse(STATUS.SUCCESS, PROD_QTY_API.PROD_QTY_DELETE.message));
  } else {
    return resp
      .status(STATUS.BAD)
      .send(
        errorResponse(STATUS.BAD, PROD_QTY_API.PROD_QTY_INVALID_ID.message)
      );
  }
};
