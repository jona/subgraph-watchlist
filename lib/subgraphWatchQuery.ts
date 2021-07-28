import { query } from '../lib/graphQL/subgraph/single'
import { watchList } from '../watchList'

export const subgraphs = watchList.map(id => {
  return {
    operationName: 'subgraph',
    variables: {
      id: id,
      firstSignals: 1000,
      nameSignalsOrderBy: 'averageCostBasis',
      nameSignalsOrderDirection: 'desc',
    },
    query: query,
  }
})
