// external imports
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// schema
const peopleSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    flag: {
      type: String,
    },
    country: {
      type: String,
    },
    dialCode: {
      type: String,
      trim: true,
    },
    numLen: {
      type: Number,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      // bellow 3 lines will make sure that field is unique and indexed and will have no problem when multiple users are trying to register using null phone number
      index: {
        unique: true,
        partialFilterExpression: { phone: { $type: "string" } },
      },
    },
    designation: {
      type: String,
      trim: true,
    },
    devices: [
      {
        type: Schema.Types.Object,
      },
    ],
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ["Admin", "Visitor", "Editor", "Moderator"],
      default: "Visitor",
    },
    cloudinary_id: {
      type: String,
    },
    projectsId: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Project",
      },
    ],
    reviewsId: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// model
const People = model("People", peopleSchema);

module.exports = People;
