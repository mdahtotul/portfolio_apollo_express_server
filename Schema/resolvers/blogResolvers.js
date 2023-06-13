const { AuthenticationError } = require("apollo-server-express");
const models = require("../../models");

const blogResolvers = {
  Query: {
    listBlog: async (parent, args, context) => {
      try {
        let blogs = await models.DB_Blog.find({})
          .collation({ locale: "en_US", strength: 2 })
          .sort({ name: 1 });
        return blogs;
      } catch (err) {
        throw new Error(err);
      }
    },
    getBlog: async (parent, args, context) => {
      try {
        return await models.DB_Blog.findById(args.id);
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  // POPULATE: getting population data using  graphQL query
  Blog: {
    categories: async (parent, args, context) => {
      try {
        return await models.DB_Category.find({
          _id: { $in: parent.categoriesId },
        });
      } catch (err) {
        throw new Error(err);
      }
    },
    tags: async (parent, args, context) => {
      try {
        return await models.DB_Tag.find({ _id: { $in: parent.tagsId } });
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    createBlog: async (parent, args, { req, res }) => {
      try {
        // NOTE: check if user is authenticated
        if (!req.isAuth || !req.userId || req.userRole !== "Admin") {
          throw new AuthenticationError("Unauthenticated! ⛔");
        }

        const existBlog = await models.DB_Blog.findOne({
          name: args.input.name,
        });
        if (existBlog) {
          throw new Error("Blog already exist!");
        }
        const newBlog = new models.DB_Blog({
          name: args.input.name,
          blog_url: args.input.blog_url,
          img: args.input.img,
          categoriesId: args.input.categoriesId,
          tagsId: args.input.tagsId || null,
        });
        const blog = await newBlog.save();

        // NOTE: update category blogsId to get blog data
        if (blog?.categoriesId?.length > 0) {
          blog.categoriesId.forEach(async (category_id) => {
            await models.DB_Category.updateOne(
              { _id: category_id },
              { $push: { blogsId: blog._id } }
            );
          });
        }

        // NOTE: update category blogsId to get blog data
        if (blog?.tagsId?.length > 0) {
          blog.tagsId.forEach(async (tag_id) => {
            await models.DB_Tag.updateOne(
              { _id: tag_id },
              { $push: { blogsId: blog._id } }
            );
          });
        }

        return blog;
      } catch (err) {
        throw new Error("Internal server error!");
      }
    },
    updateBlog: async (parent, args, { req, res }) => {
      try {
        if (!req.isAuth || !req.userId || req.userRole !== "Admin") {
          throw new AuthenticationError("Unauthenticated! ⛔");
        }
        const updateBlogInfo = new models.DB_Blog({
          _id: args.id,
          name: args.input.name,
          blog_url: args.input.blog_url,
          img: args.input.img,
          categoriesId: args.input.categoriesId,
          tagsId: args.input.tagsId || null,
        });
        const updateBlog = await models.DB_Blog.findOneAndUpdate(
          { _id: args.id },
          updateBlogInfo,
          {
            new: true,
          }
        );

        // NOTE: update category blogsId to get updateBlog data
        if (updateBlog?.categoriesId?.length > 0) {
          updateBlog.categoriesId.forEach(async (category_id) => {
            await models.DB_Category.updateOne(
              { _id: category_id },
              { $addToSet: { blogsId: updateBlog._id } }
            );
          });
        }

        // NOTE: update tag blogsId to get updateBlog data
        if (updateBlog?.tagsId?.length > 0) {
          updateBlog.tagsId.forEach(async (tag_id) => {
            await models.DB_Tag.updateOne(
              { _id: tag_id },
              { $addToSet: { blogsId: updateBlog._id } }
            );
          });
        }

        return updateBlog;
      } catch (err) {
        throw new Error(err);
      }
    },

    deleteBlog: async (parent, args, { req, res }) => {
      try {
        if (!req.isAuth || !req.userId || req.userRole !== "Admin") {
          throw new AuthenticationError("Unauthenticated! ⛔");
        }
        const blog = await models.DB_Blog.findByIdAndDelete(args.id);
        // NOTE: removing blogsId from category
        if (blog?.categoriesId?.length > 0) {
          blog.categoriesId.forEach(async (category_id) => {
            await models.DB_Category.updateOne(
              { _id: category_id },
              { $pull: { blogsId: blog._id } }
            );
          });
        }

        // NOTE: removing blogsId from tag
        if (blog?.tagsId?.length > 0) {
          blog.tagsId.forEach(async (tag_id) => {
            await models.DB_Tag.updateOne(
              { _id: tag_id },
              { $pull: { blogsId: blog._id } }
            );
          });
        }

        return blog;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};

module.exports = blogResolvers;
