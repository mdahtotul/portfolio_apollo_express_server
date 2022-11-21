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
    },
    password: {
      type: String,
      required: true,
    },
    dialCode: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ["Admin", "User", "Editor", "Moderator"],
    },
    cloudinary_id: {
      type: String,
    },
    projects: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Project",
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
