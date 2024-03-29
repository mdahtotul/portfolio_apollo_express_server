const { gql } = require("apollo-server-express");

const userType = gql`
  type Device {
    userIP: String
    onMobile: Boolean
    userPlatform: String
    userAgent: String
    userBrowser: String
    ipCity: String
    ipCountry: String
  }

  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    avatar: String
    cloudinary_id: String
    designation: String
    role: UserRole
    dialCode: String
    flag: String
    country: String
    phone: String
    numLen: String
    devices: [Device]
  }

  # type CloudinaryOptions {
  #   name: String
  # }

  type AuthPayload {
    userId: ID!
    userRole: UserRole
    token: String!
    tokenExpiration: Int!
  }

  type OTP {
    otp: String!
    userEmail: String!
    medium: String
    expireAt: String
  }

  enum UserRole {
    Admin
    Visitor
    Editor
    Moderator
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
    avatar: String
    role: UserRole = Visitor
    designation: String
    dialCode: String
    flag: String
    country: String
    cloudinary_id: String
    phone: String
    numLen: Int
  }

  input UpdateUserInput {
    name: String
    avatar: String
    cloudinary_id: String
    dialCode: String
    designation: String
    phone: String
    flag: String
    country: String
    numLen: Int
  }

  input UpdateUserRoleInput {
    role: UserRole
  }

  extend type Query {
    listUser: [User!]
    getUser(id: ID!): User
    verifyOTP(otp: String!, email: String!): Boolean!
    loginUser(
      email: String!
      password: String!
      userIP: String
      onMobile: Boolean
      userPlatform: String
      userAgent: String
      userBrowser: String
    ): AuthPayload!
    currentUser: User
  }

  extend type Mutation {
    getOtp(email: String!): String!
    createUser(input: CreateUserInput!): User
    updateUser(id: ID!, input: UpdateUserInput!): User
    uploadProfileImg(file: Upload!): User
    # uploadProfileImg(file: String!): User
    updateUserPassword(email: String!, password: String!): User
    updateUserRole(id: ID!, input: UpdateUserRoleInput!): User
    deleteUser(id: ID!): User
    removeDevice(
      userId: ID!
      onMobile: Boolean
      userPlatform: String
      userAgent: String
      userBrowser: String
    ): String
  }
`;

module.exports = userType;
