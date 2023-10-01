const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommissionSchema = Schema(
  {
    commission: {
      type: Number,
      required: true,
    },
    commission_type: {
      type: Schema.Types.ObjectId,
      ref: "commission_type",
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
module.exports = mongoose.model("commission", CommissionSchema);
