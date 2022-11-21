const { gql } = require("apollo-server-express");

const categoryType = gql`
  type Category {
    id: ID!
    name: String!
    projectsId: [ID!]
    projects: [Project!]
  }

  input CreateCategoryInput {
    name: String!
  }

  input UpdateCategoryInput {
    name: String
  }

  extend type Query {
    listCategory: [Category!]
    getCategory(id: ID!): Category
  }

  extend type Mutation {
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): Category
  }
`;

module.exports = categoryType;
