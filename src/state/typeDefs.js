import gql from 'graphql-tag'

export default gql`
extend type Query {
  connected: Boolean!
  darkMode: Boolean!
  currentProjectId: String
}

extend type Mutation {
  connectedSet (value: Boolean!): Boolean
  darkModeSet (enabled: Boolean!): Boolean
  currentProjectIdSet (projectId: String): Boolean
}
`
