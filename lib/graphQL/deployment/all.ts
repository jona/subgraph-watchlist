import { gql } from '@apollo/client'

export const query = gql`
  query deployments(
    $first: Int
    $OrderBy: Indexer_orderBy
    $OrderDirection: OrderDirection
  ) {
    subgraphDeployments(
      first: $first
      orderBy: $OrderBy
      orderDirection: $OrderDirection
    ) {
      id
      originalName
    }
  }
`
