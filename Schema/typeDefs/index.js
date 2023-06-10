const categoryType = require("./categoryDefs");
const projectType = require("./projectDefs");
const rootType = require("./rootDefs");
const tagType = require("./tagDefs");
const userType = require("./userDefs");
const reviewType = require("./reviewDefs");
const blogType = require("./blogDefs");

const typeDefsArray = [
  rootType,
  categoryType,
  projectType,
  tagType,
  userType,
  reviewType,
  blogType,
];

module.exports = typeDefsArray;
