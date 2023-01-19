const { AuthenticationError } = require("apollo-server-express");
const models = require("../../models");

const reviewResolvers = {
  Query: {
    listReview: async (parent, args, { req, res }) => {
      return await models.DB_Review.find({});
    },
    getReview: async (parent, args, { req, res }) => {
      return await models.DB_Review.findById(args.id);
    },
    getReviewByReviewerId: async (parent, args, { req, res }) => {
      return await models.DB_Review.find({ reviewerId: args.reviewerId });
    },
  },

  // POPULATE: getting population data using  graphQL query
  Review: {
    reviewer: async (parent, args, context) => {
      console.log(parent.reviewerId);
      return await models.DB_People.find({ _id: { $in: parent.reviewerId } });
    },
  },

  Mutation: {
    createReview: async (parent, args, { req, res }) => {
      // NOTE: check if user is authenticated
      if (!req.isAuth || !req.userId) {
        throw new AuthenticationError("Unauthenticated!");
      }

      try {
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
  },
};

module.exports = reviewResolvers;
