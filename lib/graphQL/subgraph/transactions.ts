export const query =
  'query transactions($id: ID!, $timestamp: Int, $OrderBy: NameSignalTransaction_orderBy, $OrderDirection: OrderDirection){\n  nameSignalTransactions(where: {subgraph: $id, tokens_gt: 9000000000000000000, timestamp_gt: $timestamp}, orderBy: $OrderBy, orderDirection: $OrderDirection) {\nid\ntimestamp\ntype\nsigner{\nid\n}\nnameSignal\nversionSignal\ntokens\nsubgraph{\nid\ndisplayName}\n}\n}\n'
