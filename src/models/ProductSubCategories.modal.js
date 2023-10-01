const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSubCategoriesSchema = Schema(
  {
    sub_category_name: {
      type: String,
      required: true,
    },
    search_name: {
      type: String,
      required: false,
    },
    product_category: {
      type: Schema.Types.ObjectId,
      ref: "product_categories",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model(
  "product_sub_categories",
  ProductSubCategoriesSchema
);
