const { gql } = require("apollo-server-express");

const tagType = gql`
  type Tag {
    id: ID!
    name: String!
    projectsId: [ID!]
    projects: [Project!]
    blogsId: [ID!]
    blogs: [Blog!]
  }

  input CreateTagInput {
    name: String!
  }

  input UpdateTagInput {
    name: String!
  }

  extend type Query {
    listTag: [Tag!]
    getTag(id: ID!): Tag
  }

  extend type Mutation {
    createTag(input: CreateTagInput!): Tag
    updateTag(id: ID!, input: UpdateTagInput!): Tag
    deleteTag(id: ID!): Tag
  }
`;

module.exports = tagType;
