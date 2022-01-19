const mongoose = require("mongoose");
const { GameSchema } = require("./game");
const { Schema } = mongoose;

const options = { timestapms: true };

const UserSchema = new Schema({
  email: String,
  password: String,
  name: String,
  surname: String,
  admin: { type: Boolean, default: false },
  cart: [GameSchema],
}, options);

const User = mongoose.model("User", UserSchema);

module.exports = { User, UserSchema };