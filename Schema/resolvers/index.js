const _ = require("lodash");
const categoryResolvers = require("./categoryResolvers");
const projectResolvers = require("./projectResolvers");

const mergedResolvers = _.merge({}, categoryResolvers, projectResolvers);

module.exports = mergedResolvers;
