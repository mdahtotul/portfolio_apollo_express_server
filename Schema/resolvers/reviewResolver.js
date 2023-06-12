const { AuthenticationError } = require("apollo-server-express");
const models = require("../../models");

const reviewResolvers = {
  Query: {
    listReview: async (parent, args, { req, res }) => {
      try {
        const foundReview = await models.DB_Review.find({});
        foundReview.sort(
          (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt)
        );
        return foundReview;
      } catch (err) {
        throw new Error(err);
      }
    },
    getReview: async (parent, args, { req, res }) => {
      try {
        return await models.DB_Review.findById(args.id);
      } catch (err) {
        throw new Error(err);
      }
    },
    getReviewByReviewerId: async (parent, args, { req, res }) => {
      try {
        return await models.DB_Review.find({ reviewerId: args.reviewerId });
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  // POPULATE: getting population data using  graphQL query
  Review: {
    reviewer: async (parent, args, context) => {
      try {
        return await models.DB_People.findById(parent.reviewerId);
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    createReview: async (parent, args, { req, res }) => {
      try {
        // NOTE: check if user is authenticated
        if (!req.isAuth || !req.userId) {
          throw new AuthenticationError("Unauthenticated!");
        }

        const newReview = new models.DB_Review({
          title: args.input.title,
          reviewerId: req.userId,
          projectStartDate: args.input.projectStartDate || "",
          projectEndDate: args.input.projectEndDate || "",
          rating: parseFloat(args.input.rating || 0),
          comment: args.input.comment,
        });
        const review = await newReview.save();

        if (review.reviewerId) {
          await models.DB_People.updateOne(
            { _id: review.reviewerId },
            { $push: { reviewsId: review._id } }
          );
        }
        return review;
      } catch (err) {
        throw new Error(err);
      }
    },

    updateReview: async (parent, args, { req, res }) => {
      try {
        // NOTE: check if user is authenticated
        if (!req.isAuth || !req.userId) {
          if (req?.userId !== args.input.reviewerId)
            throw new AuthenticationError("Unauthenticated!");
          else if (req?.userRole !== "Admin")
            throw new AuthenticationError("Unauthenticated!");
        }

        const updateReviewInfo = new models.DB_Review({
          _id: args.id,
          title: args.input.title,
          reviewerId: req.userId,
          projectStartDate: args.input.projectStartDate,
          projectEndDate: args.input.projectEndDate,
          rating: parseFloat(args.input.rating),
          comment: args.input.comment,
        });

        const updateReview = await models.DB_Review.findOneAndUpdate(
          { _id: args.id },
          updateReviewInfo,
          {
            new: true,
          }
        );

        return updateReview;
      } catch (err) {
        throw new Error(err);
      }
    },

    deleteReview: async (parent, args, { req, res }) => {
      try {
        // NOTE: check if user is authenticated
        if (!req.isAuth || !req.userId) {
          if (req?.userId !== args.input.reviewerId)
            throw new AuthenticationError("Unauthenticated!");
          else if (req?.userRole !== "Admin")
            throw new AuthenticationError("Unauthenticated!");
        }

        const deleteReview = await models.DB_Review.findByIdAndDelete(args.id);

        return deleteReview;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};

module.exports = reviewResolvers;
