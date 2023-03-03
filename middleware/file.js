const { parse, join } = require("path");
const { createWriteStream, unlink } = require("fs");

const readFile = async (file) => {
  let fullName;
  try {
    const { createReadStream, filename } = await file;
    const stream = createReadStream();
    let { ext, name } = parse(filename);
    name = `single${Math.floor(Math.random() * 1000000) + 1}`;
    fullName = `${name}-${Date.now()}${ext}`;
    let url = join(__dirname, `../uploads/${fullName}`);

    await new Promise((resolve, reject) => {
      const imageStream = createWriteStream(url);
      stream.pipe(imageStream).on("finish", resolve).on("error", reject);
    });
  } catch (err) {
    console.log("Error in middleware/file.js ❌❌❌❌❌❌");
    console.log(err);
  } finally {
    return fullName;
  }
};

const removeFile = async (filePath) => {
  unlink(filePath, (err) => {
    if (err) {
      console.log(err);
      throw new Error("Failed to delete image");
    }
    console.log("Image deleted from uploads folder");
  });
};

module.exports = { readFile, removeFile };
