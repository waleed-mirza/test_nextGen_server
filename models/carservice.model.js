const mongoose = require("mongoose");

const Car = new mongoose.Schema(
  {
    userid: { type: String, required: true },
    model: { type: String, required: true },
    price: { type: Number, required: true },
    phoneno: { type: Number, required: true },
    images: { type: [String], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", Car);
