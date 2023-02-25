const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const multipleUploadSchema = new Schema(
  {
    images: [
      {
        url: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const MultipleUpload = model("MultipleUpload", multipleUploadSchema);

module.exports = MultipleUpload;
