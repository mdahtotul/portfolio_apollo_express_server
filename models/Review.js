const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const reviewSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    reviewerId: {
      type: mongoose.Types.ObjectId,
      ref: "People",
    },
    projectStartDate: {
      // type: Date,
      type: String,
    },
    projectEndDate: {
      type: String,
      // type: Date,
    },
    rating: {
      type: Number,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Review = model("Review", reviewSchema);

module.exports = Review;
