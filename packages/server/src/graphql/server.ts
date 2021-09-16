import { PrismaClient } from "@prisma/client";
import { ApolloServer, gql } from "apollo-server";

const prisma = new PrismaClient();

const typeDefs = gql`
  type User {
    email: String!
    name: String
  }
  type Query {
    allUsers: [User!]!
  }
`;

const resolvers = {
  Query: {
    allUsers: () => {
      return prisma.user.findMany();
    },
  },
};

const server = new ApolloServer({ resolvers, typeDefs });

export default (port = 4000) => {
  server.listen({ port });
};
