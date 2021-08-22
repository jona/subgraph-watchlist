import { query as allQuery } from '../lib/graphQL/transaction/all'
import { query as bySubgraphQuery } from '../lib/graphQL/transaction/bySubgraph'

export function transactionsQuery(
  ids: string[],
  timestamp: number,
  first: number = 100,
  skip: number = 0,
) {
  if (ids.length === 0) {
    return {
      operationName: 'transactions',
      variables: {
        first: first,
        skip: skip,
        timestamp: timestamp,
        OrderBy: 'timestamp',
        OrderDirection: 'desc',
      },
      query: allQuery,
    }
  } else {
    return {
      operationName: 'transactions',
      variables: {
        first: first,
        skip: skip,
        ids: ids,
        timestamp: timestamp,
        OrderBy: 'timestamp',
        OrderDirection: 'desc',
      },
      query: bySubgraphQuery,
    }
  }
}
