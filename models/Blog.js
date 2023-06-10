const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const blogSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    blog_url: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    categoriesId: [
      {
        type: mongoose.Types.ObjectId,
      },
    ],
    tagsId: [
      {
        type: mongoose.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Blog = model("Blog", blogSchema);

module.exports = Blog;
