const { AuthenticationError } = require("apollo-server-express");
const models = require("../../models");

const categoryResolvers = {
  Query: {
    listCategory: async (parent, args, context) => {
      try {
        const categories = await models.DB_Category.find({})
          .collation({ locale: "en_US", strength: 2 })
          .sort({ name: 1 });
        return categories;
      } catch (err) {
        throw new Error(err);
      }
    },

    getCategory: async (parent, args, context) => {
      try {
        const category = await models.DB_Category.findById(args?.id);
        return category;
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Category: {
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
    createCategory: async (parent, args, { req, res }) => {
      try {
        if (!req.isAuth || !req.userId || req.userRole !== "Admin") {
          throw new AuthenticationError("Unauthenticated! ⛔");
        }

        const existCategory = await models.DB_Category.findOne({
          name: args.input.name,
        });

        if (existCategory) {
          throw new Error("Category already exist!");
        }

        const newCategory = new models.DB_Category({
          name: args.input.name,
        });
        return await newCategory.save();
      } catch (err) {
        throw new Error(err);
      }
    },
    updateCategory: async (parent, args, { req, res }) => {
      try {
        if (!req.isAuth || !req.userId || req.userRole !== "Admin") {
          throw new AuthenticationError("Unauthenticated! ⛔");
        }

        const updateCategory = new models.DB_Category({
          _id: args.id,
          name: args.input.name,
        });
        return await models.DB_Category.findOneAndUpdate(
          { _id: args.id },
          updateCategory,
          {
            new: true,
          }
        );
      } catch (err) {
        throw new Error(err);
      }
    },
    deleteCategory: async (parent, args, { req, res }) => {
      try {
        if (!req.isAuth || !req.userId || req.userRole !== "Admin") {
          throw new AuthenticationError("Unauthenticated! ⛔");
        }

        const category = await models.DB_Category.findByIdAndDelete(args.id);

        // NOTE: removing categoriesId from projects
        if (category?.projectsId?.length > 0) {
          await models.DB_Project.updateMany(
            { _id: { $in: category.projectsId } },
            { $pull: { categoriesId: category._id } }
          );
        }
        // NOTE: removing categoriesId from blogs
        if (category?.blogsId?.length > 0) {
          await models.DB_Blog.updateMany(
            { _id: { $in: category.blogsId } },
            { $pull: { categoriesId: category._id } }
          );
        }

        return category;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};

module.exports = categoryResolvers;
