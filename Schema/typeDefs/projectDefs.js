const { gql } = require("apollo-server-express");

const projectType = gql`
  type Project {
    id: ID!
    name: String!
    slug: String!
  }

  input CreateProjectInput {
    name: String!
    slug: String!
  }

  input UpdateProjectInput {
    name: String!
    slug: String!
  }

  extend type Query {
    listProject: [Project!]
    getProject(id: ID!): Project!
    getProjectBySlug(slug: String!): Project!
  }

  extend type Mutation {
    createProject(input: CreateProjectInput!): Project!
    updateProject(id: ID!, input: UpdateProjectInput!): Project!
    deleteProject(id: ID!): Project
  }
`;

module.exports = projectType;
