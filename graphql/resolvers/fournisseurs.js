const { AuthenticationError, UserInputError } = require("apollo-server");
const Post = require("../../models/Fournisseur");
const checkAuth = require("../../utils/check-auth");

module.exports = {
  Query: {
    async getFournisseurs() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getFournisseur(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createFournisseur(
      _,
      { company, companyEmail, address, phone, description },
      context
    ) {
      const user = checkAuth(context);

      if (company.trim() === "") {
        throw new Error("Company must not be empty");
      }

      const newPost = new Post({
        company,
        companyEmail,
        address,
        phone,
        description,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();

      return post;
    },
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_POST"),
    },
  },
};
