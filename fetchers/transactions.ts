// General
import moment from 'moment'

// Lib
import { Api } from '../lib/api'
import { transactionsQuery } from '../lib/transactionsQuery'

export async function fetch(
  ids: string[],
  range: number,
  first: number = 20,
  skip: number = 0,
) {
  const timestamp = moment().subtract(range, 'days').unix()
  let transactionsResponse

  transactionsResponse = await Api().post(
    '',
    transactionsQuery(ids, timestamp, first, skip),
  )

  return transactionsResponse.data.data.nameSignalTransactions
}
