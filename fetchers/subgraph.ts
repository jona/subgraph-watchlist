// General
import moment from 'moment'

// Lib
import { Api } from '../lib/api'
import { subgraphWatchQuery } from '../lib/subgraphWatchQuery'
import { subgraphTransactionsQuery } from '../lib/subgraphTransactionsQuery'

export async function fetch(id: string, range: number) {
  const timestamp = moment().subtract(range, 'days').unix()

  const watchQuery = subgraphWatchQuery(id)
  const transactionQuery = subgraphTransactionsQuery(id, timestamp)

  const watchResponse = await Api().post('', watchQuery)
  const transactionResponse = await Api().post('', transactionQuery)

  return {
    subgraph: watchResponse.data.data.subgraph,
    transactions: transactionResponse.data.data.nameSignalTransactions,
  }
}
