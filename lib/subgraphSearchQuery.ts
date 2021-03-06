import { query } from '../lib/graphQL/subgraph/search'

export function subgraphSearchQuery(name: string) {
  return {
    operationName: 'subgraphs',
    variables: {
      name: name,
      first: 10,
    },
    query: query,
  }
}
