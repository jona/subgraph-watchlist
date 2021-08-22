import { gql } from '@apollo/client'

export const query = gql`
  query subgraph(
    $id: ID!
    $firstSignals: Int
    $nameSignalsOrderBy: NameSignal_orderBy
    $nameSignalsOrderDirection: OrderDirection
  ) {
    subgraph(id: $id) {
      id
      displayName
      nameSignalCount
      description
      image
      createdAt
      updatedAt
      codeRepository
      website
      signalledTokens
      unsignalledTokens
      currentSignalledTokens
      nameSignalAmount
      owner {
        id
        defaultName {
          id
          name
          __typename
        }
        image
        __typename
      }
      nameSignals(
        first: $firstSignals
        orderBy: $nameSignalsOrderBy
        orderDirection: $nameSignalsOrderDirection
      ) {
        id
        averageCostBasisPerSignal
        lastNameSignalChange
        averageCostBasis
        signalledTokens
        unsignalledTokens
        nameSignal
        signal
        curator {
          id
          createdAt
          account {
            id
            image
            defaultName {
              id
              name
              __typename
            }
            __typename
          }
          totalNameSignalledTokens
          totalUnsignalledTokens
          nameSignals {
            id
            nameSignal
            subgraph {
              id
              image
              nameSignalAmount
              displayName
              currentVersion {
                id
                __typename
              }
              versions {
                id
                __typename
              }
              __typename
            }
            __typename
          }
          __typename
        }
        subgraph {
          id
          nameSignalAmount
          displayName
          currentVersion {
            id
            __typename
          }
          versions {
            id
            __typename
          }
          __typename
        }
        __typename
      }
      currentVersion {
        id
        createdAt
        label
        subgraphDeployment {
          id
          queryFeeRebates
          queryFeesAmount
          indexingRewardAmount
          schema
          signalledTokens
          signalAmount
          pricePerShare
          reserveRatio
          curatorFeeRewards
          network {
            id
            __typename
          }
          curatorSignals {
            id
            signal
            signalledTokens
            curator {
              id
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      versions {
        id
        createdAt
        label
        subgraphDeployment {
          id
          curatorFeeRewards
          schema
          signalledTokens
          signalAmount
          pricePerShare
          reserveRatio
          network {
            id
            __typename
          }
          curatorSignals {
            id
            signal
            signalledTokens
            averageCostBasis
            curator {
              id
              createdAt
              account {
                id
                image
                defaultName {
                  id
                  name
                  __typename
                }
                __typename
              }
              nameSignals {
                id
                nameSignal
                subgraph {
                  id
                  image
                  nameSignalAmount
                  displayName
                  currentVersion {
                    id
                    __typename
                  }
                  versions {
                    id
                    __typename
                  }
                  __typename
                }
                __typename
              }
              __typename
            }
            __typename
          }
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
          schema
          curatorFeeRewards
          signalledTokens
          signalAmount
          pricePerShare
          reserveRatio
          network {
            id
            __typename
          }
          curatorSignals {
            id
            signal
            signalledTokens
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
  }
`
