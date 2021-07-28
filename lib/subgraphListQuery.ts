import { query } from '../lib/graphQL/subgraph/list'

export const subgraphList = {
  operationName: 'subgraphs',
  variables: {
    orderBy: 'currentSignalledTokens',
    orderDirection: 'desc',
    first: 1000,
    skip: 0,
  },
  query: query,
}
