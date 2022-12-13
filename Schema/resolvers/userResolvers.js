const models = require("../../models");

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
      const newUser = new models.DB_People({
        name: args.input.name,
        email: args.input.email,
        password: args.input.password,
        avatar: args.input.avatar || "",
        role: args.input.role,
        dialCode: args.input.dialCode || "",
        phone: args.input.phone || "",
      });
      return await newUser.save();
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
  },
};

module.exports = userResolvers;
