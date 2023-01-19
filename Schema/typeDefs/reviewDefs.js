const { gql } = require("apollo-server-express");

const reviewType = gql`
  type Review {
    id: ID!
    title: String!
    reviewerId: ID!
    reviewer: User
    projectStartDate: String
    projectEndDate: String
    rating: Float
    comment: String!
  }

  input CreateReviewInput {
    title: String!
    reviewerId: ID
    projectStartDate: String
    projectEndDate: String
    rating: Float
    comment: String!
  }

  input UpdateReviewInput {
    title: String!
    reviewerId: ID!
    projectStartDate: String
    projectEndDate: String
    rating: Float
    comment: String!
  }

  extend type Query {
    listReview: [Review]
    getReview(id: ID!): Review
    getReviewByReviewerId(reviewerId: ID!): [Review]
  }

  extend type Mutation {
    createReview(input: CreateReviewInput!): Review
    updateReview(id: ID!, input: UpdateReviewInput!): Review
    deleteReview(id: ID!): Review
  }
`;

module.exports = reviewType;
