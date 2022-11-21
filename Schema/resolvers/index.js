const _ = require("lodash");
const categoryResolvers = require("./categoryResolvers");
const projectResolvers = require("./projectResolvers");
const tagResolvers = require("./tagResolvers");

const mergedResolvers = _.merge(
  {},
  categoryResolvers,
  projectResolvers,
  tagResolvers
);

module.exports = mergedResolvers;
