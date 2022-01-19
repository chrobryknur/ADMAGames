const mongoose = require("mongoose");
const { DeliverySchema } = require("./delivery");
const { GameSchema } = require("./game");
const { Schema } = mongoose;

const options = { timestapms: true };

const AddressSchema = new Schema({
  city: String,
  street: String,
  building: String,
  apartment: String,
  postalCode: String,
});

const UserSchema = new Schema({
  email: String,
  name: String,
  surname: String,
});

const OrderSchema = new Schema({
  user: UserSchema,
  address: AddressSchema,
  games: [GameSchema],
  delivery: DeliverySchema,
  phoneNumber: String,
  price: Number,
  date: Date,
}, options);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
