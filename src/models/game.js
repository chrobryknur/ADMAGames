const mongoose = require("mongoose");
const { Schema } = mongoose;

const options = { timestapms: true };

const GameSchema = new Schema({
  title: String,
  price: Number,
  year: Number,
  category: String,
  miniatureUrl: String,
  description: String,
}, options);

const Game = mongoose.model("Game", GameSchema);

module.exports = { Game, GameSchema };
