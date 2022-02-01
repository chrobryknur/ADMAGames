const mongoose = require("mongoose");
const { Schema } = mongoose;

const options = { timestapms: true };

const DeliverySchema = new Schema({
  name: String,
  price: Number,
  estimatedTime: Number
}, options);

const Delivery = mongoose.model("Delivery", DeliverySchema);

module.exports = { Delivery, DeliverySchema };