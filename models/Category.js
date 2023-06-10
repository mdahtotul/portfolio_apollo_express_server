const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  projectsId: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Project",
    },
  ],
  blogsId: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

const Category = model("Category", categorySchema);

module.exports = Category;
