import { query } from '../lib/graphQL/subgraph/single'
import { watchList } from '../watchList'

export const subgraphWatchQuery = watchList.map(id => {
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
})
