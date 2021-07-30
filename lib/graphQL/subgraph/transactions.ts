export const query =
  'query transactions($id: ID!, $first: Int, $OrderBy: NameSignalTransaction_orderBy, $OrderDirection: OrderDirection){\n  nameSignalTransactions(first: $first, where: { subgraph: $id }, orderBy: $OrderBy, orderDirection: $OrderDirection) {\nid\ntimestamp\ntype\nnameSignal\nversionSignal\ntokens\nsubgraph{\ndisplayName}\n}\n}\n'
