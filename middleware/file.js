const { parse, join } = require("path");
const { createWriteStream } = require("fs");

module.exports.readFile = async (file) => {
  let fullName;
  try {
    const { createReadStream, filename } = await file;
    const stream = createReadStream();
    let { ext, name } = parse(filename);
    name = `single${Math.floor(Math.random() * 1000000) + 1}`;
    fullName = `${name}-${Date.now()}${ext}`;
    let url = join(__dirname, `../uploads/${fullName}`);
    const imageStream = createWriteStream(url);
    await stream.pipe(imageStream);
    const baseUrl = process.env.BASE_URL || "http://localhost";
    const port = process.env.PORT || 4000;
    url = `${baseUrl}:${port}/${fullName}`;
    // return url;
  } catch (err) {
    console.log("Error in middleware/file.js ❌❌❌❌❌❌");
    console.log(err);
  } finally {
    return fullName;
  }
};
