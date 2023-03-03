const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const singleUploadSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SingleUpload = model("SingleUpload", singleUploadSchema);

module.exports = SingleUpload;
