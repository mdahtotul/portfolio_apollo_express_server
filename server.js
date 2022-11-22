// external modules
const express = require("express");
require("dotenv").config();
const { ApolloServer, gql } = require("apollo-server-express");
const typeDefs = require("./Schema/typeDefs");
const connectDB = require("./config/mongooseDB");
const colors = require("colors");
const models = require("./models");
const mergedResolvers = require("./Schema/resolvers");

// initialization
const app = express();
const port = process.env.PORT || 4000;

// database connection
connectDB();

// running async apollo server
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

// getting current time
const today = new Date();
const time =
  today.getHours() +
  ":" +
  today.getMinutes() +
  ":" +
  today.getSeconds() +
  "sec";

// stroing current server url
const server_string =
  process.env.NODE_ENV === "development"
    ? `http://localhost:${port}/`
    : process.env.prod_server;

// watching server on console with some styles
app.listen({ port: port }, () =>
  console.log(
    `==========================================================================================
    ${time.red.bold} 🚀 GraphQL ${process.env.NODE_ENV} sever endpoint ` +
      `${server_string}/graphql`.yellow.underline +
      `\n                📢 ${process.env.NODE_ENV} server url ${server_string}` +
      `   ➡️  port:${port}`.green
  )
);
