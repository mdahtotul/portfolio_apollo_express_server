// external modules
const express = require("express");
require("dotenv").config();
const { ApolloServer, gql } = require("apollo-server-express");
const typeDefs = require("./Schema/typeDefs");
const connectDB = require("./config/mongooseDB");
const colors = require("colors");
const models = require("./models");
const mergedResolvers = require("./Schema/resolvers");

const port = process.env.PORT || 4000;
const app = express();

connectDB();

async function runApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers: mergedResolvers,
    context: { models },
    introspection: true,
  });
  await server.start();
  server.applyMiddleware({ app });
}

runApolloServer();

app.listen({ port: port }, () =>
  console.log(
    `🚀 GraphQL ${process.env.NODE_ENV} Server ready at ` +
      `http://localhost:${port}/graphql`.yellow.underline
  )
);
