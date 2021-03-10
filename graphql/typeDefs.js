const gql = require("graphql-tag");

module.exports = gql`
  type Fournisseur {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    company: String!
    companyEmail: String!
    address: String!
    phone: String!
    description: String!
  }

  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  type Query {
    getFournisseurs: [Fournisseur]
    getFournisseur(fournisseurId: ID!): Fournisseur
  }

  type Mutation {
    admin_register(registerInput: RegisterInput): User!

    admin_login(username: String!, password: String!): User!
    createFournisseur(
      company: String!
      description: String!
      address: String!
      companyEmail: String!
      phone: String!
    ): Fournisseur!
  }
`;
