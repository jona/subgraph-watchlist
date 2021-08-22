import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: 'https://gateway.thegraph.com/network',
  cache: new InMemoryCache(),
})

export default client
