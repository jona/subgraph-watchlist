// General
import moment from 'moment'

// Lib
import { Api } from '../lib/api'
import { transactionsQuery } from '../lib/transactionsQuery'

export async function fetch(
  range: number,
  skip: number = 0,
  aggregateTransactions: [] = [],
): Promise<any> {
  const timestamp = moment().subtract(range, 'days').unix()
  let transactionsResponse

  transactionsResponse = await Api().post(
    '',
    transactionsQuery([], timestamp, 1000, skip),
  )

  const transactions = transactionsResponse.data.data.nameSignalTransactions
  const newAggregateTransactions: any =
    aggregateTransactions.concat(transactions)

  if (transactions.length < 1000) return newAggregateTransactions

  return fetch(range, skip + 1000, newAggregateTransactions)
}
