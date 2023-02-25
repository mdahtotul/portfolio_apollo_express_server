const { readFile } = require("../../middleware/file");
const SingleUpload = require("../../models/singleUpload");

const uploadResolvers = {
  Query: {
    greetings: async () => {
      return "Hello World";
    },
  },
  Mutation: {
    singleUpload: async (parent, { file }) => {
      console.log("file🚀🚀", file);
      const imageUrl = await readFile(file);

      const singleFile = new SingleUpload({
        image: imageUrl,
      });

      await singleFile.save();
      return {
        message: "File Uploaded Successfully!",
      };
    },
  },
};

module.exports = uploadResolvers;
