const { gql } = require("apollo-server-express");

const blogType = gql`
  type Blog {
    id: ID!
    name: String!
    blog_url: String!
    img: String
    categoriesId: [ID!]
    categories: [Category]
    tagsId: [ID!]
    tags: [Tag]
  }

  input CreateBlogInput {
    name: String!
    blog_url: String!
    img: String
    categoriesId: [ID!]
    tagsId: [ID!]
  }

  input UpdateBlogInput {
    name: String
    blog_url: String
    img: String
    categoriesId: [ID!]
    tagsId: [ID!]
  }

  extend type Query {
    listBlog: [Blog]
    getBlog(id: ID!): Blog
  }

  extend type Mutation {
    createBlog(input: CreateBlogInput!): Project!
    updateBlog(id: ID!, input: UpdateBlogInput!): Project!
    deleteBlog(id: ID!): Project
  }
`;

module.exports = blogType;
