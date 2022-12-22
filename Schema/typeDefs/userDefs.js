const { gql } = require("apollo-server-express");

const userType = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    avatar: String
    role: UserRole
    dialCode: String
    phone: String
  }

  enum UserRole {
    Admin
    User
    Editor
    Moderator
  }

  type AuthPayload {
    user: User
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
    avatar: String
    role: UserRole = USER
    dialCode: String
    phone: String
  }

  input UpdateUserInput {
    name: String
    password: String
    avatar: String
    dialCode: String
    phone: String
  }

  input UpdateUserRoleInput {
    role: UserRole
  }

  extend type Query {
    listUser: [User!]
    getUser(id: ID!): User
    getLogin(email: String!, password: String!): AuthPayload
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): User
    updateUser(id: ID!, input: UpdateUserInput!): User
    updateUserRole(id: ID!, input: UpdateUserRoleInput!): User
    deleteUser(id: ID!): User
    login(email: String!, password: String!): AuthPayload
  }
`;

module.exports = userType;
