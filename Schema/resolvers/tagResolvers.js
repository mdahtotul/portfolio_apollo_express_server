const { AuthenticationError } = require("apollo-server-express");
const models = require("../../models");

const tagResolvers = {
  Query: {
    listTag: async (parent, args, context) => {
      try {
        return await models.DB_Tag.find({})
          .collation({ locale: "en_US", strength: 2 })
          .sort({ name: 1 });
      } catch (err) {
        throw new Error(err);
      }
    },
    getTag: async (parent, args, context) => {
      try {
        return await models.DB_Tag.findById(args.id);
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  // POPULATE: getting population data using  graphQL query
  Tag: {
    projects: async (parent, args, context) => {
      try {
        return await models.DB_Project.find({
          _id: { $in: parent.projectsId },
        });
      } catch (err) {
        throw new Error(err);
      }
    },
    blogs: async (parent, args, context) => {
      try {
        return await models.DB_Blog.find({ _id: { $in: parent.blogsId } });
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    createTag: async (parent, args, { req, res }) => {
      try {
        if (!req.isAuth || !req.userId || req.userRole !== "Admin") {
          throw new AuthenticationError("Unauthenticated! ⛔");
        }

        const existTag = await models.DB_Tag.findOne({
          name: args.input.name,
        });

        if (existTag) {
          throw new Error("Tag already exist!");
        }

        const newTag = new models.DB_Tag({
          name: args.input.name,
        });
        return await newTag.save();
      } catch (err) {
        throw new Error(err);
      }
    },
    updateTag: async (parent, args, { req, res }) => {
      try {
        if (!req.isAuth || !req.userId || req.userRole !== "Admin") {
          throw new AuthenticationError("Unauthenticated! ⛔");
        }
        const updateTag = new models.DB_Tag({
          _id: args.id,
          name: args.input.name,
        });
        return await models.DB_Tag.findOneAndUpdate(
          { _id: args.id },
          updateTag,
          {
            new: true,
          }
        );
      } catch (err) {
        throw new Error(err);
      }
    },
    deleteTag: async (parent, args, { req, res }) => {
      try {
        if (!req.isAuth || !req.userId || req.userRole !== "Admin") {
          throw new AuthenticationError("Unauthenticated! ⛔");
        }
        const tag = await models.DB_Tag.findByIdAndDelete(args.id);

        // NOTE: removing tagsId from projects
        if (tag?.projectsId?.length > 0) {
          await models.DB_Project.updateMany(
            { _id: { $in: tag.projectsId } },
            { $pull: { tagsId: tag._id } }
          );
        }
        // NOTE: removing tagsId from blogs
        if (tag?.blogsId?.length > 0) {
          await models.DB_Blog.updateMany(
            { _id: { $in: tag.blogsId } },
            { $pull: { tagsId: tag._id } }
          );
        }

        return tag;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};

module.exports = tagResolvers;
