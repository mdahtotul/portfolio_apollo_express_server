const { gql } = require("apollo-server-express");

const projectType = gql`
  type Project {
    id: ID!
    name: String!
    slug: String!
    categoriesId: [ID!]!
    categories: [Category]
    des: String
    tagsId: [ID!]
    tags: [Tag]
    rank: Float
    ratings: Float
    status: ProjectStatus
    clientId: ID
    client: User
    live_site: String
    client_repo: String
    server_repo: String
    thumb_img: String
    sub_images: [String]
    createdAt: String # Unix timestamp
    updatedAt: String
  }

  input CreateProjectInput {
    name: String!
    slug: String!
    categoriesId: [ID!]
    des: String
    tagsId: [ID!]
    rank: Float!
    ratings: Float
    status: ProjectStatus = Not_Started
    clientId: ID
    live_site: String
    client_repo: String
    server_repo: String
    thumb_img: String
    sub_images: [String]
  }

  input UpdateProjectInput {
    name: String
    slug: String
    categoriesId: [ID!]
    des: String
    tagsId: [ID!]
    rank: Float
    ratings: Float
    status: ProjectStatus
    clientId: ID
    live_site: String
    client_repo: String
    server_repo: String
    thumb_img: String
    sub_images: [String]
  }

  enum ProjectStatus {
    Not_Started
    In_Progress
    Completed
  }

  extend type Query {
    listProject: [Project]
    getProject(id: ID!): Project
    getProjectBySlug(slug: String!): Project
  }

  extend type Mutation {
    createProject(input: CreateProjectInput!): Project
    updateProject(id: ID!, input: UpdateProjectInput!): Project
    deleteProject(id: ID!): Project
  }
`;

module.exports = projectType;
