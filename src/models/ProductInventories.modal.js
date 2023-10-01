const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductInverntoriesSchema = Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model(
  "product_inverntories",
  ProductInverntoriesSchema
);
