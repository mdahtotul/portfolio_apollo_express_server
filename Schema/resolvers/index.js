const _ = require("lodash");
const categoryResolvers = require("./categoryResolvers");
const projectResolvers = require("./projectResolvers");
const tagResolvers = require("./tagResolvers");
const userResolvers = require("./userResolvers");

const mergedResolvers = _.merge(
  {},
  categoryResolvers,
  projectResolvers,
  tagResolvers,
  userResolvers
);

module.exports = mergedResolvers;
