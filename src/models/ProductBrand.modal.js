const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductBrandSchema = Schema(
  {
    brand_name: {
      type: String,
      required: true,
    },
    search_name: {
      type: String,
      required: false,
    },
    sub_category_ids: {
      sub_category: [
        {
          type: Schema.Types.ObjectId,
          ref: "product_sub_categories",
          required: true,
        },
      ],
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("product_brand", ProductBrandSchema);
