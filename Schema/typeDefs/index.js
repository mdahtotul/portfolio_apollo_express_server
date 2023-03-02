const categoryType = require("./categoryDefs");
const projectType = require("./projectDefs");
const rootType = require("./rootDefs");
const tagType = require("./tagDefs");
const userType = require("./userDefs");
const reviewType = require("./reviewDefs");
// const uploadType = require("./uploadDefs");

const typeDefsArray = [
  rootType,
  categoryType,
  projectType,
  tagType,
  userType,
  reviewType,
  // uploadType,
];

module.exports = typeDefsArray;
