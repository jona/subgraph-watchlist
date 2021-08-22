import { query } from '../lib/graphQL/subgraph/transactions'

export function subgraphTransactionsQuery(id: string, timestamp: number) {
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
}
