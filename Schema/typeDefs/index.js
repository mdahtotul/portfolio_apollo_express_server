const categoryType = require("./categoryDefs");
const projectType = require("./projectDefs");
const rootType = require("./rootDefs");
const tagType = require("./tagDefs");
const userType = require("./userDefs");

const typeDefsArray = [rootType, categoryType, projectType, tagType, userType];

module.exports = typeDefsArray;
