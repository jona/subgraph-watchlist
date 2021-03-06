export const allQuery =
  'query transactions($first: Int, $skip: Int, $timestamp: Int, $OrderBy: NameSignalTransaction_orderBy, $OrderDirection: OrderDirection){\n  nameSignalTransactions(first: $first, skip: $skip, where: {tokens_gt: 9000000000000000000, timestamp_gt: $timestamp}, orderBy: $OrderBy, orderDirection: $OrderDirection) {\nid\ntimestamp\ntype\nsigner{\nid\n}\nnameSignal\nversionSignal\ntokens\nsubgraph{\nid\ndisplayName}\n}\n}\n'

export function transactionsQuery(
  timestamp: number,
  first: number = 100,
  skip: number = 0,
) {
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
}
