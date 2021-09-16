import { ApolloServer, gql } from "apollo-server";

export default gql`
  enum PayloadType {
    TEXT
    EJS
  }

  type User {
    id: String!
    email: String!
    name: String!
  }

  type Command {
    id: String!
    name: String!
    description: String
    payloadType: String!
    payload: String!
    args: [Argument!]!
  }

  type Argument {
    id: String
    name: String
    description: String
    commandId: String
    command: Command
  }

  type Server {
    id: String
    serverDisplayName: String
    discordServerID: String
    commandPrefix: String
  }
`;
