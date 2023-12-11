const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserAddressSchema = Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    user_address: [
      {
        address_line1: {
          type: String,
          required: false,
          default: "",
        },
        address_line2: {
          type: String,
          required: false,
          default: "",
        },
        address_type: {
          type: String,
          required: false,
        },
        place_id: {
          type: Schema.Types.ObjectId,
          ref: "place",
          required: false,
        },
      },
    ],
  },

  { timestamps: true, versionKey: false }
);
module.exports = mongoose.model("user_address", UserAddressSchema);
