const tagResolvers = {
  Query: {
    listTag: async (parent, args, { models }) => {
      return await models.DB_Tag.find({});
    },
    getTag: async (parent, args, { models }) => {
      return await models.DB_Tag.findById(args.id);
    },
  },

  // POPULATE: getting population data using  graphQL query
  Tag: {
    projects: async (parent, args, { models }) => {
      return await models.DB_Project.find({ _id: { $in: parent.projectsId } });
    },
  },

  Mutation: {
    createTag: async (parent, args, { models }) => {
      const newTag = new models.DB_Tag({
        name: args.input.name,
      });
      return await newTag.save();
    },

    updateTag: async (parent, args, { models }) => {
      const updateTag = new models.DB_Tag({
        _id: args.id,
        name: args.input.name,
      });
      return await Tag.findOneAndUpdate({ _id: args.id }, updateTag, {
        new: true,
      });
    },
    deleteTag: async (parent, args, { models }) => {
      return await models.DB_Tag.findByIdAndDelete(args.id);
    },
  },
};

module.exports = tagResolvers;
