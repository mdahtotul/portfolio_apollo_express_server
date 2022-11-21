const projectResolvers = {
  Query: {
    listProject: async (parent, args, context) => {
      console.log("listProject");
      console.log(context);
    },
  },
};

module.exports = projectResolvers;
