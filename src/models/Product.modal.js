const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = Schema(
  {
    product_title: {
      type: String,
      required: true,
    },
    product_size: {
      type: String,
      required: true,
    },
    product_MRP_price: {
      type: Number,
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
    product_images: [
      {
        type: Schema.Types.ObjectId,
        ref: "file",
        required: false,
      },
    ],
    commission: {
      type: Schema.Types.ObjectId,
      ref: "commission",
      required: false,
    },
    rating: {
      type: Schema.Types.ObjectId,
      ref: "product_rating",
      required: false,
      default: null,
    },
    inventory: {
      type: Schema.Types.ObjectId,
      ref: "product_inverntories",
      required: false,
      default: null,
    },
    product_sub_category: {
      type: Schema.Types.ObjectId,
      ref: "product_sub_categories",
      required: true,
    },
    product_brand: {
      type: Schema.Types.ObjectId,
      ref: "product_brand",
      required: true,
    },
    search_name: {
      type: String,
      required: false,
    },
    product_rating: {
      type: Schema.Types.ObjectId,
      ref: "product_rating",
      required: false,
      default: null,
    },
    is_published: {
      type: Boolean,
      required: true,
      default: false,
    },
    is_vegetarian: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("product", ProductSchema);
