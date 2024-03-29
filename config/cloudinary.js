// external imports
require("dotenv").config();
const cloudinary = require("cloudinary");

// setting cloud data variable
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// export function
module.exports = cloudinary;
