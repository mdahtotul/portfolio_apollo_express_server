// external modules
const express = require("express");
const { join } = require("path");
require("dotenv").config();
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const typeDefs = require("./Schema/typeDefs");
const connectDB = require("./config/mongooseDB");
const colors = require("colors");
const mergedResolvers = require("./Schema/resolvers");
const isAuthenticate = require("./middleware/isAuthenticate");
const cookieParser = require("cookie-parser");
const { graphqlUploadExpress } = require("graphql-upload");
// const expressUpload = require("express-fileupload");

const clientUrl =
  process.env.NODE_ENV === "production"
    ? process.env.CLIENT_URL
    : "http://localhost:3000";

// initialization
const app = express();
const port = process.env.PORT || 4000;

// database connection
connectDB();

// middleware
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, PATCH, DELETE, OPTIONS"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });
app.use(cors());
app.use(express.json());
app.use(isAuthenticate);
app.use(express.static(join(__dirname, "./uploads")));
// parse cookie
app.use(cookieParser(process.env.COOKIE_SECRET));
// app.use(expressUpload());

// running async apollo server
async function runApolloServer() {
  app.use(graphqlUploadExpress());
  const server = new ApolloServer({
    typeDefs,
    resolvers: mergedResolvers,
    context: ({ req, res }) => ({ req, res }),
    introspection: true,
    // csrfPrevention: true,
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

// storing current server url
const server_string =
  process.env.NODE_ENV === "development"
    ? `http://localhost:${port}`
    : process.env.SERVER_URL;

app.get("/", (req, res) =>
  res.status(200).send(
    `Welcome to MD ARIFUL HASAN portfolio server😍.
      Thanks for visiting this server🤝`
  )
);
// uploading file to Upload folder in the root
// app.post("/upload", (req, res) => {
//   console.log("🚀🚀", req.files);
//   let uploadedFile = req.files.file;
//   const filename = uploadedFile.name;
//   uploadedFile.mv(`${__dirname}/Upload/${filename}`, (err) => {
//     if (err) {
//       return res.status(500).send(err);
//     }
//     return res.json(filename);
//   });
// });
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
