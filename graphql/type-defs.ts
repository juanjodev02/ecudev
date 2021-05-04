import { gql } from '@apollo/client'

export const typeDefs = gql`
  type Auth {
    email: String!
    password: String!
  }

  type User {
    id: ID!
    username: String!
    facebook: String
    twitter: String
    github: String
  }

  input SignUpInput {
    email: String!
    username: String!
    password: String!
  }

  input SignInInput {
    email: String!
    password: String!
  }

  type SignUpPayload {
    user: User!
  }

  type SignInPayload {
    user: User!
  }

  type Query {
    viewer: User
  }

  type Mutation {
    signUp(input: SignUpInput!): SignUpPayload!
    signIn(input: SignInInput!): SignInPayload!
    signOut: Boolean!
  }
`
