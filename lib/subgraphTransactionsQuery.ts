import { query } from '../lib/graphQL/subgraph/transactions'

export function subgraphTransactionsQuery(watchlist, size) {
  return watchlist.map(id => {
    return {
      operationName: 'transactions',
      variables: {
        id: id,
        first: size,
        OrderBy: 'timestamp',
        OrderDirection: 'desc',
      },
      query: query,
    }
  })
}
