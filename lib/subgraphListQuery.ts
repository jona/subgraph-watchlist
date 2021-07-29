import { query } from '../lib/graphQL/subgraph/list'

export const subgraphListQuery = {
  operationName: 'subgraphs',
  variables: {
    orderBy: 'currentSignalledTokens',
    orderDirection: 'desc',
    first: 1000,
    skip: 0,
  },
  query: query,
}
