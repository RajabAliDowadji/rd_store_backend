const CommissionModal = require("../models/Commission.modal");
const ProductRatingModal = require("../models/ProductRating.modal");
const { COM_API, COMMON } = require("../constants/Commission.message");
const { STATUS } = require("../constants/Constants");
const { apiResponse } = require("../helpers/apiResponse");
const { errorResponse } = require("../helpers/errorResponse");
const ProductModal = require("../models/Product.modal");

module.exports.getCommissions = async (req, resp, next) => {
  const commissions = await CommissionModal.find()
    .populate("commission_type")
    .populate("product");
  if (commissions) {
    return resp
      .status(STATUS.SUCCESS)
      .send(
        apiResponse(STATUS.SUCCESS, COM_API.COM_SUCCESS.message, commissions)
      );
  } else {
    return resp
      .status(STATUS.INTERNAL_SERVER)
      .send(errorResponse(STATUS.INTERNAL_SERVER, COMMON.SERVER_ERROR.message));
  }
};

module.exports.getCommissionById = async (req, resp, next) => {
  const commissionId = req.params.id;
  const commission = await CommissionModal.findOne({ _id: commissionId })
    .populate("commission_type")
    .populate("product");
  if (commission) {
    return resp
      .status(STATUS.SUCCESS)
      .send(
        apiResponse(STATUS.SUCCESS, COM_API.COM_SUCCESS.message, commission)
      );
  } else {
    return resp
      .status(STATUS.INTERNAL_SERVER)
      .send(errorResponse(STATUS.INTERNAL_SERVER, COMMON.SERVER_ERROR.message));
  }
};
module.exports.addCommission = async (req, resp, next) => {
  const productId = req.body.product;
  const commission_typeId = req.body.commission_type;
  const commission = req.body.commission;
  const isExist = await CommissionModal.findOne({ product: productId });
  const product = await ProductModal.findOne({ _id: productId });
  if (!isExist) {
    const commissionmodal = new CommissionModal({
      commission: commission,
      commission_type: commission_typeId,
      product: productId,
    });
    const productRatingmodal = new ProductRatingModal({
      product: productId,
    });

    const productRating = await productRatingmodal.save();
    await commissionmodal.save();
    await ProductModal.findOneAndUpdate(
      { _id: productId },
      {
        commission: commissionmodal._id,
        rating: productRating._id,
        is_published: product.inventory != null ? true : false,
      }
    );
    return resp
      .status(STATUS.CREATED)
      .send(
        apiResponse(STATUS.CREATED, COM_API.COM_CREATE.message, commissionmodal)
      );
  } else {
    return resp
      .status(STATUS.BAD)
      .send(errorResponse(STATUS.BAD, COM_API.COM_ALREADY_REGISTER.message));
  }
};

module.exports.updateCommission = async (req, resp, next) => {
  const productId = req.body.product;
  const commission_typeId = req.body.commission_type;
  const commission = req.body.commission;
  const findCommissionProduct = await CommissionModal.findOne({
    product: productId,
  });
  if (findCommissionProduct) {
    findCommissionProduct.commission = commission;
    findCommissionProduct.productId = productId;
    findCommissionProduct.commission_type = commission_typeId;
    await findCommissionProduct.save();
    return resp
      .status(STATUS.SUCCESS)
      .send(
        apiResponse(
          STATUS.SUCCESS,
          COM_API.COM_UPDATE.message,
          findCommissionProduct
        )
      );
  } else {
    return resp
      .status(STATUS.BAD)
      .send(errorResponse(STATUS.BAD, COM_API.COM_INVALID_ID.message));
  }
};

module.exports.deleteCommission = async (req, resp, next) => {
  const commissionId = req.params.id;
  const response = await CommissionModal.findOne({ _id: commissionId });
  if (response) {
    await ProductModal.findOneAndUpdate(
      { commission: commissionId },
      { is_published: false, commission: null }
    );
    await CommissionModal.findByIdAndRemove({ _id: commissionId });

    return resp
      .status(STATUS.SUCCESS)
      .send(apiResponse(STATUS.SUCCESS, COM_API.COM_DELETE.message));
  } else {
    return resp
      .status(STATUS.BAD)
      .send(errorResponse(STATUS.BAD, COM_API.COM_DELETE.message));
  }
};
