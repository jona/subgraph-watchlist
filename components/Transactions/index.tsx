// General
import { useState } from 'react'
import useSWR from 'swr'
import classNamesBind from 'classnames/bind'
import Select from 'react-select'

// Lib
import { formatDate } from '../../lib/formatDate'

// Styles
import styles from './styles.module.css'
const classNames = classNamesBind.bind(styles)

// Fetchers
import { fetch as fetchTransactions } from '../../fetchers/transactions'

// Components
import GrtSubtext from '../GrtSubtext'

import { styles as selectStyles } from '../../lib/select/styles'

export interface OwnProps {
  ids: string[]
}

export default function Transactions(this: any, { ids }: OwnProps) {
  const range = 14

  const [lastUpdated, setLastUpdated] = useState(Date.now())
  const [watchlistIds, setWatchlistIds] = useState(getDefaultWatchlistIds())

  const { data } = useSWR(
    `${watchlistIds}+${range}+transactions`,
    fetchTransactions.bind(this, watchlistIds, range, 100, 0),
    {
      refreshInterval: 20000,
      onSuccess: () => {
        setLastUpdated(Date.now())
      },
    },
  )

  // #####################################
  // Render functions
  // #####################################
  function renderlastUpdated() {
    if (!data || data.length == 0) {
      return null
    }

    return (
      <div className={classNames('lastUpdated')}>{formatDate(lastUpdated)}</div>
    )
  }

  function renderTransactions() {
    if (!data || data.length == 0) {
      return (
        <div className={classNames('emptyTransactions')}>
          No transactions yet
        </div>
      )
    }

    return data.map((transaction: any) => {
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
