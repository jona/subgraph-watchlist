import { gql } from '@apollo/client'

export const query = gql`
  query transactions(
    $ids: [ID!]
    $first: Int
    $skip: Int
    $timestamp: Int
    $OrderBy: NameSignalTransaction_orderBy
    $OrderDirection: OrderDirection
  ) {
    nameSignalTransactions(
      first: $first
      skip: $skip
      where: {
        subgraph_in: $ids
        tokens_gt: 9000000000000000000
        timestamp_gt: $timestamp
      }
      orderBy: $OrderBy
      orderDirection: $OrderDirection
    ) {
      id
      timestamp
      type
      signer {
        id
      }
      nameSignal
      versionSignal
      tokens
      subgraph {
        id
        displayName
      }
    }
  }
`
