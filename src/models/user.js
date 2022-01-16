const mongoose = require("mongoose");
const { GameSchema } = require("./game");
const { Schema } = mongoose;

const options = { timestapms: true };

const CartGameSchema = new Schema({
  title: String,
  price: Number,
  year: Number,
  category: String,
  tags: [String],
  miniatureUrl: String,
  description: String,
});

const UserSchema = new Schema({
  email: String,
  password: String,
  name: String,
  surname: String,
  admin: { type: Boolean, default: false },
  cart: [CartGameSchema],
}, options);

const User = mongoose.model("User", UserSchema);

module.exports = User;