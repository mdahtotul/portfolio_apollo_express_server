const { parse, join } = require("path");
const fs = require("fs");
const { createWriteStream } = require("fs");

module.exports.readFile = async (file) => {
  try {
    const { createReadStream, filename } = await file;
    const stream = createReadStream();
    let { ext, name } = parse(filename);
    name = `single${Math.floor(Math.random() * 1000000) + 1}`;
    let url = join(__dirname, `../Upload/${name}-${Date.now()}${ext}`);
    const imageStream = createWriteStream(url);
    await stream.pipe(imageStream);
    const baseUrl = process.env.BASE_URL || "http://localhost";
    const port = process.env.PORT || 4000;
    url = `${baseUrl}:${port}/${url}`;
    return url;
  } catch (err) {
    console.log("Error in middleware/file.js ❌❌❌❌❌❌");
    console.log(err);
  }
};
