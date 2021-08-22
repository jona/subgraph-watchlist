import { gql } from '@apollo/client'

export const query = gql`
  query transactions(
    $id: ID!
    $timestamp: Int
    $OrderBy: NameSignalTransaction_orderBy
    $OrderDirection: OrderDirection
  ) {
    nameSignalTransactions(
      where: {
        subgraph: $id
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
        curator {
          nameSignals(where: { subgraph: $id }) {
            signalledTokens
            unsignalledTokens
          }
          id
          createdAt
          totalNameSignalledTokens
          totalNameUnsignalledTokens
          totalWithdrawnTokens
          totalNameSignal
          totalNameSignalAverageCostBasis
          totalAverageCostBasisPerNameSignal
          nameSignalCount
          activeNameSignalCount
        }
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
