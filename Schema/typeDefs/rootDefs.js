const { gql } = require("apollo-server-express");

const rootType = gql`
  scalar Upload
  type Query {
    root: String
  }

  type Mutation {
    root: String
  }
`;

module.exports = rootType;
