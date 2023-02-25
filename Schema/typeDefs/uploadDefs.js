const { gql } = require("apollo-server-express");

const uploadType = gql`
  type SuccessMessage {
    message: String
  }

  extend type Query {
    greetings: String
  }

  extend type Mutation {
    singleUpload(file: Upload!): SuccessMessage!
  }
`;

module.exports = uploadType;
