import { gql } from '@apollo/client'

export const query = gql`
  query subgraphs(
    $orderBy: Subgraph_orderBy
    $orderDirection: OrderDirection
    $first: Int
    $skip: Int
  ) {
    subgraphs(
      orderBy: $orderBy
      orderDirection: $orderDirection
      first: $first
      skip: $skip
      where: { currentVersion_not: null, displayName_not: "" }
    ) {
      id
      displayName
      description
      image
      createdAt
      updatedAt
      signalledTokens
      unsignalledTokens
      currentSignalledTokens
      owner {
        id
        image
        defaultName {
          id
          name
          __typename
        }
        __typename
      }
      currentVersion {
        id
        subgraphDeployment {
          id
          stakedTokens
          signalledTokens
          queryFeesAmount
          __typename
        }
        __typename
      }
      pastVersions {
        id
        createdAt
        label
        subgraphDeployment {
          id
          signalledTokens
          __typename
        }
        __typename
      }
      versions {
        id
        __typename
      }
      __typename
    }
  }
`
// Params to be used later
// export function subgraphListQuery() {
//   return {
//     operationName: 'subgraphs',
//     variables: {
//       orderBy: 'currentSignalledTokens',
//       orderDirection: 'desc',
//       first: 1000,
//       skip: 0,
//     },
//     query: query,
//   }
// }
