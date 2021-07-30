import { query } from '../lib/graphQL/subgraph/transactions'
import { watchList } from '../watchList'

export const subgraphTransactionsQuery = watchList.map(id => {
  return {
    operationName: 'transactions',
    variables: {
      id: id,
      first: 50,
      OrderBy: 'timestamp',
      OrderDirection: 'desc',
    },
    query: query,
  }
})
