import { query } from '../lib/graphQL/subgraph/single'

export function subgraphWatchQuery(id: string) {
  return {
    operationName: 'subgraph',
    variables: {
      id: id,
      firstSignals: 5,
      nameSignalsOrderBy: 'signalledTokens',
      nameSignalsOrderDirection: 'desc',
    },
    query: query,
  }
}
