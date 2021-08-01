import { query } from '../lib/graphQL/subgraph/transactions'

export function subgraphTransactionsQuery(watchlist, timestamp) {
  return watchlist.map(id => {
    return {
      operationName: 'transactions',
      variables: {
        id: id,
        timestamp: timestamp,
        OrderBy: 'timestamp',
        OrderDirection: 'desc',
      },
      query: query,
    }
  })
}
