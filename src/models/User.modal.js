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
    password: {
      type: String,
      required: false,
    },
    user_type: {
      type: String,
      required: false,
    },
  },

  { timestamps: true, versionKey: false }
);
module.exports = mongoose.model("user", UserSchema);
