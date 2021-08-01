import { Api } from '../lib/api'

import { subgraphWatchQuery } from '../lib/subgraphWatchQuery'
import { subgraphListQuery } from '../lib/subgraphListQuery'
import { subgraphTransactionsQuery } from '../lib/subgraphTransactionsQuery'

export async function fetchData(size) {
  const watchlist = window.localStorage.getItem('watchlist')?.split(',')

  const responses = await Promise.all(
    subgraphWatchQuery(watchlist).map(async subgraph => {
      const response = await Api().post('', subgraph)
      return response.data.data.subgraph
    }),
  )

  const transactions = await Promise.all(
    subgraphTransactionsQuery(watchlist, size).map(async transaction => {
      const response = await Api().post('', transaction)
      return response.data.data
    }),
  )

  const response = await Api().post('', subgraphListQuery())

  return {
    subgraphs: responses,
    subgraphList: response.data.data.subgraphs,
    transactions: transactions,
  }
}
