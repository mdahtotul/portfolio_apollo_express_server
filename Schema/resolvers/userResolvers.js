const { GraphQLError } = require("graphql");
const models = require("../../models");
const bcrypt = require("bcrypt");
const { UserInputError } = require("apollo-server-express");

const userResolvers = {
  Query: {
    listUser: async (parent, args, context) => {
      return await models.DB_People.find({});
    },
    getUser: async (parent, args, context) => {
      return await models.DB_People.findById(args.id);
    },
  },

  Mutation: {
    createUser: async (parent, args, context) => {
      try {
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
        const hashedPassword = await bcrypt.hash(args.input.password, salt);
        if (!hashedPassword) throw new Error("❌ Failed to hash password");

        const newUser = new models.DB_People({
          name: args.input.name,
          email: args.input.email,
          password: hashedPassword,
          avatar: args.input.avatar || "",
          role: args.input.role,
          dialCode: args.input.dialCode || "",
          phone: args.input.phone || null,
        });
        return await newUser.save();
      } catch (err) {
        console.log("❌ Failed to register user: \n", err);
        console.log(err.keyValue);
        if (err.code === 11000) {
          let errField = Object.keys(err.keyValue)[0];
          throw new UserInputError(
            `❌ ${errField} already exists in Database!`
          );
        } else {
          throw new GraphQLError(
            `❌ Failed to register user: \n ${err.message}`
          );
        }
      }
    },
    updateUser: async (parent, args, context) => {
      const updatedUserInfo = new models.DB_People({
        _id: args.id,
        name: args.input.name,
        password: args.input.password,
        avatar: args.input.avatar,
        dialCode: args.input.dialCode,
        phone: args.input.phone,
      });

      return await models.DB_People.findOneAndUpdate(
        { _id: args.id },
        updatedUserInfo,
        {
          new: true,
        }
      );
    },
    updateUserRole: async (parent, args, context) => {
      const updatedUserRole = new models.DB_People({
        _id: args.id,
        role: args.input.role,
      });

      return await models.DB_People.findOneAndUpdate(
        { _id: args.id },
        updatedUserRole,
        {
          new: true,
        }
      );
    },
    deleteUser: async (parent, args, context) => {
      return await models.DB_People.findByIdAndDelete(args.id);
    },
    loginUser: async (parent, args, context) => {},
  },
};

module.exports = userResolvers;
