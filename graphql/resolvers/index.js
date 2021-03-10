const adminsResolvers = require("./admins");
const fournisseursResolvers = require("./fournisseurs");

module.exports = {
  Query: {
    ...fournisseursResolvers.Query,
  },
  Mutation: {
    ...adminsResolvers.Mutation,
    ...fournisseursResolvers.Mutation,
  },
};
