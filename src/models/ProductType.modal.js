const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductTypeSchema = Schema(
  {
    type_name: {
      type: String,
      required: true,
    },
    search_name: {
      type: String,
      required: false,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("product_type", ProductTypeSchema);
