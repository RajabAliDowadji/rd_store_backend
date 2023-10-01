const OrderModal = require("../models/Order.modal");
const CartModal = require("../models/Cart.modal");
const UserModal = require("../models/User.modal");
const ProductModal = require("../models/Product.modal");
const { ORDER_API, COMMON } = require("../constants/Order.message");
const { STATUS } = require("../constants/Constants");
const { apiResponse } = require("../helpers/apiResponse");
const { errorResponse } = require("../helpers/errorResponse");

module.exports.getUserOrders = async (req, resp, next) => {
  const user_id = req.params.id;
  const pastOrders = await OrderModal.find({
    user_id: user_id,
    deliverd: true,
  });
  if (pastOrders) {
    return resp
      .status(STATUS.SUCCESS)
      .send(
        apiResponse(STATUS.SUCCESS, ORDER_API.ORDER_SUCCESS.message, pastOrders)
      );
  } else {
    return resp
      .status(STATUS.INTERNAL_SERVER)
      .send(errorResponse(STATUS.INTERNAL_SERVER, COMMON.SERVER_ERROR.message));
  }
};

module.exports.placeOrder = async (req, resp, next) => {
  const { user_id } = req;
  let total_qty = 0;
  let total_price = 0;
  let orderItem = [];
  const cartItem = await CartModal.findOne({ user: user_id });
  const user = await UserModal.findOne({ _id: user_id });
  const product_items = await ProductModal.find({
    _id: { $in: cartItem.cart_items.map((item) => item.product) },
  }).populate("product_brand");
  if (cartItem) {
    cartItem.cart_items.map((item) => {
      return (total_qty = item.product_qty + total_qty);
    });
    cartItem.cart_items.map(
      (item) =>
        (total_price =
          total_price +
          item.product_qty *
            product_items.find(
              (product) => product._id.toString() === item.product.toString()
            ).product_price)
    );
    cartItem.cart_items.map((item) => {
      const product = product_items.find(
        (product) => product._id.toString() === item.product.toString()
      );
      orderItem.push({
        product: {
          product_id: product._id,
          product_qty: item.product_qty,
          product_title: product.product_title,
          product_brand: product.product_brand.brand_name,
          product_size: product.product_size,
          product_price: product.product_price,
          product_description: product.product_description,
        },
      });
    });
    const orderBody = {
      total_qty: total_qty,
      total_price: total_price,
      user_id: user_id,
      user: {
        name: user.user_name,
        email: user.email,
        phone_number: user.phone_number,
      },
      order_item: orderItem,
    };
    const order = new OrderModal(orderBody);

    await order.save();

    await CartModal.updateOne({ user: user_id }, { $set: { cart_items: [] } });

    return resp
      .status(STATUS.CREATED)
      .send(
        apiResponse(STATUS.CREATED, ORDER_API.ORDER_SUCCESS.message, order)
      );
  } else {
    return resp
      .status(STATUS.INTERNAL_SERVER)
      .send(errorResponse(STATUS.INTERNAL_SERVER, COMMON.SERVER_ERROR.message));
  }
};

module.exports.paidOrder = async (req, resp, next) => {
  const orderId = req.params.id;
  const { transition_id } = req.body;
  const order = await OrderModal.findOne({ _id: orderId });

  if (order) {
    order.transition_id = transition_id;
    order.paid = true;

    await order.save();

    return resp
      .status(STATUS.SUCCESS)
      .send(
        apiResponse(STATUS.SUCCESS, ORDER_API.ORDER_PAYMENT.message, order)
      );
  } else {
    return resp
      .status(STATUS.INTERNAL_SERVER)
      .send(errorResponse(STATUS.INTERNAL_SERVER, COMMON.SERVER_ERROR.message));
  }
};

module.exports.shopAcceptOrder = async (req, resp, next) => {
  const orderId = req.params.id;

  const order = await OrderModal.findOne({ _id: orderId });

  if (order) {
    order.shop_accepted = true;
    order.shop_id = req.user_id;

    await order.save();

    return resp
      .status(STATUS.SUCCESS)
      .send(apiResponse(STATUS.SUCCESS, ORDER_API.SHOP_ACCEPT.message, order));
  } else {
    return resp
      .status(STATUS.INTERNAL_SERVER)
      .send(errorResponse(STATUS.INTERNAL_SERVER, COMMON.SERVER_ERROR.message));
  }
};

module.exports.shipperAcceptOrder = async (req, resp, next) => {
  const orderId = req.params.id;

  const order = await OrderModal.findOne({ _id: orderId });

  if (order) {
    if (order.shop_accepted) {
      order.shipper_accepted = true;
      order.shipper_id = req.user_id;

      await order.save();

      return resp
        .status(STATUS.SUCCESS)
        .send(
          apiResponse(STATUS.SUCCESS, ORDER_API.SHIP_ACCEPT.message, order)
        );
    } else {
      return resp
        .status(STATUS.INTERNAL_SERVER)
        .send(
          errorResponse(STATUS.INTERNAL_SERVER, COMMON.SERVER_ERROR.message)
        );
    }
  } else {
    return resp
      .status(STATUS.INTERNAL_SERVER)
      .send(errorResponse(STATUS.INTERNAL_SERVER, COMMON.SERVER_ERROR.message));
  }
};

module.exports.deliveredOrder = async (req, resp, next) => {
  const orderId = req.params.id;

  const order = await OrderModal.findOne({ _id: orderId });

  if (order) {
    if (order.shop_accepted && order.shipper_accepted) {
      order.deliverd = true;

      await order.save();

      return resp
        .status(STATUS.SUCCESS)
        .send(
          apiResponse(STATUS.SUCCESS, ORDER_API.ORDER_DELIVERED.message, order)
        );
    } else {
      return resp
        .status(STATUS.INTERNAL_SERVER)
        .send(
          errorResponse(STATUS.INTERNAL_SERVER, COMMON.SERVER_ERROR.message)
        );
    }
  } else {
    return resp
      .status(STATUS.INTERNAL_SERVER)
      .send(errorResponse(STATUS.INTERNAL_SERVER, COMMON.SERVER_ERROR.message));
  }
};
