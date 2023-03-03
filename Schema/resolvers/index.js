const _ = require("lodash");
const categoryResolvers = require("./categoryResolvers");
const projectResolvers = require("./projectResolvers");
const reviewResolvers = require("./reviewResolver");
const tagResolvers = require("./tagResolvers");
const userResolvers = require("./userResolvers");
// const uploadResolvers = require("./uploadResolvers");
const { GraphQLUpload } = require("graphql-upload");

const uploadInitResolvers = {
  Upload: GraphQLUpload,
};

const mergedResolvers = _.merge(
  {},
  categoryResolvers,
  projectResolvers,
  tagResolvers,
  userResolvers,
  reviewResolvers,
  uploadInitResolvers
  // uploadResolvers
);

module.exports = mergedResolvers;
