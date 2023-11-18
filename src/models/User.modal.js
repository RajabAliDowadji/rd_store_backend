const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema(
  {
    user_name: {
      type: String,
      require: false,
    },
    email: {
      type: String,
      require: false,
    },
    phone_number: {
      type: String,
      require: true,
    },
    token: {
      type: String,
      require: false,
    },
    cart_items: [
      {
        product_qty: {
          type: Number,
          required: false,
        },
        product: {
          type: Schema.Types.ObjectId,
          ref: "product",
          required: false,
        },
      },
    ],
  },

  { timestamps: true, versionKey: false }
);
module.exports = mongoose.model("user", UserSchema);
