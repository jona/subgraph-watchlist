// General
import { useState } from 'react'
import useSWR from 'swr'
import classNamesBind from 'classnames/bind'
import Select from 'react-select'
import moment from 'moment'

// Lib
import { formatDate } from '../../lib/formatDate'

// Styles
import styles from './styles.module.css'
const classNames = classNamesBind.bind(styles)

// GraphQL
import { query as allQuery } from '../../lib/graphQL/transaction/all'
import { query as bySubgraphQuery } from '../../lib/graphQL/transaction/bySubgraph'

// Components
import GrtSubtext from '../GrtSubtext'

import { styles as selectStyles } from '../../lib/select/styles'
import { useQuery } from '@apollo/client'

export interface OwnProps {
  ids: string[]
}

export default function Transactions(this: any, { ids }: OwnProps) {
  const range = 14

  const [lastUpdated, setLastUpdated] = useState(Date.now())
  const [watchlistIds, setWatchlistIds] = useState(getDefaultWatchlistIds())

  const first = 100
  const skip = 0
  const timestamp = moment().subtract(range, 'days').unix()

  let variables = null
  let query = null

  if (watchlistIds.length === 0) {
    variables = {
      first: first,
      skip: skip,
      timestamp: timestamp,
      OrderBy: 'timestamp',
      OrderDirection: 'desc',
    }
    query = allQuery
  } else {
    variables = {
      first: first,
      skip: skip,
      id: watchlistIds,
      timestamp: timestamp,
      OrderBy: 'timestamp',
      OrderDirection: 'desc',
    }
    query = bySubgraphQuery
  }

  const { data } = useQuery(query, {
    variables: variables,
    onCompleted: () => {
      setLastUpdated(Date.now())
    },
    pollInterval: 20000,
  })

  if (!data || data.length == 0) {
    return (
      <div className={classNames('emptyTransactions')}>No transactions yet</div>
    )
  }

  const transactions = data.nameSignalTransactions

  // #####################################
  // Render functions
  // #####################################
  function renderlastUpdated() {
    return (
      <div className={classNames('lastUpdated')}>{formatDate(lastUpdated)}</div>
    )
  }

  function renderTransactions() {
    return transactions.map((transaction: any) => {
      return (
        <>
          <div key={transaction.id} className={classNames('transaction')}>
            <div className={classNames('transactionHeader')}>
              {signalType(transaction.type)} {transaction.subgraph.displayName}
            </div>
            <div>
              <a
                className={classNames('footerLink')}
                href={`https://etherscan.io/address/${transaction.signer.id}`}
                target="_blank"
                rel="noreferrer"
              >
                <GrtSubtext grt={transaction.tokens} format={'0,0.00'} />
              </a>{' '}
            </div>
            <div className={classNames('transactionFooter')}>
              {formatDate(transaction.timestamp * 1000)}
            </div>
          </div>
        </>
      )
    })
  }

  // #####################################
  // Modify functions
  // #####################################
  function changeIds(event: any) {
    if (event.value == 1) {
      ids = []
    }

    window.localStorage.setItem('watchlistIds', JSON.stringify(ids))
    setWatchlistIds(ids)
  }

  // #####################################
  // Getters
  // #####################################
  function getDefaultWatchlistIds() {
    if (typeof window === 'undefined') return []

    const watchlistFromLocalStorage =
      window.localStorage.getItem('watchlistIds')

    if (watchlistFromLocalStorage) {
      return JSON.parse(watchlistFromLocalStorage)
    } else {
      return ids
    }
  }

  const selectOptions = [
    { value: 1, label: 'All transactions' },
    { value: 2, label: 'Watchlist transactions' },
  ]

  const selectedOption =
    watchlistIds.length === 0 ? selectOptions[0] : selectOptions[1]

  // #####################################
  // Return
  // #####################################
  return (
    <>
      <div className={classNames('signalChangesHeader')}>
        <h2>Signal Changes</h2>
        {renderlastUpdated()}
      </div>
      <Select
        className={classNames('select')}
        styles={selectStyles}
        onChange={changeIds.bind(this)}
        options={selectOptions}
        defaultValue={selectedOption}
      />
      {renderTransactions()}
    </>
  )
}

function signalType(type: string) {
  if (type == 'MintNSignal') {
    return <span className={classNames('transactionTypePlus')}>+</span>
  } else {
    return <span className={classNames('transactionTypeMinus')}>-</span>
  }
}
