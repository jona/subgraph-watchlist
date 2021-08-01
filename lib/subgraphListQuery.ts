import { query } from '../lib/graphQL/subgraph/list'

export function subgraphListQuery() {
  return {
    operationName: 'subgraphs',
    variables: {
      orderBy: 'currentSignalledTokens',
      orderDirection: 'desc',
      first: 1000,
      skip: 0,
    },
    query: query,
  }
}
