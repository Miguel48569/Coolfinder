const mongoose = require("mongoose");

const lojaSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
    },
    endereco: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    foto: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Loja", lojaSchema);
