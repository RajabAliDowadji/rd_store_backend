const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = Schema(
  {
    total_qty: {
      type: Number,
      required: true,
    },
    total_price: {
      type: Number,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    paid: {
      type: Boolean,
      required: false,
      default: false,
    },
    transition_id: {
      type: String,
      required: false,
      default: false,
    },
    shop_accepted: {
      type: Boolean,
      required: false,
      default: false,
    },
    shop_id: {
      type: Schema.Types.ObjectId,
      ref: "shop",
      default: null,
    },
    shipper_accepted: {
      type: Boolean,
      required: false,
      default: false,
    },
    shipper_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: false,
      default: null,
    },
    deliverd: {
      type: Boolean,
      required: false,
      default: false,
    },
    user: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone_number: {
        type: String,
        required: true,
      },
    },
    order_item: [
      {
        product: {
          product_id: {
            type: Schema.Types.ObjectId,
            ref: "product",
            required: true,
          },
          product_qty: {
            type: Number,
            required: true,
          },
          product_title: {
            type: String,
            required: true,
          },
          product_brand: {
            type: String,
            required: true,
          },
          product_size: {
            type: String,
            required: true,
          },
          product_price: {
            type: Number,
            required: true,
          },
          product_description: {
            type: String,
            required: true,
          },
        },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("order", OrderSchema);
