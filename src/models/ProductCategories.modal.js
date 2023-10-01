const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductCategoriesSchema = Schema(
  {
    category_name: {
      type: String,
      required: true,
    },
    search_name: {
      type: String,
      required: false,
    },
    product_type: {
      type: Schema.Types.ObjectId,
      ref: "product_type",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("product_categories", ProductCategoriesSchema);
