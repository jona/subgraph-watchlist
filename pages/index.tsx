// General
import { useState } from 'react'
import Head from 'next/head'
import numeral from 'numeral'
import useSWR from 'swr'
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-moment'
import classNamesBind from 'classnames/bind'

// Styles
import styles from '../styles/Home.module.css'
const classNames = classNamesBind.bind(styles)

// Lib
import { Api } from '../lib/api'
import { subgraphSearchQuery } from '../lib/subgraphSearchQuery'
import { convertGrt } from '../lib/convertGrt'
import { formatDate } from '../lib/formatDate'
import { distinct } from '../lib/distinct'

// Fetchers
import { fetchData } from '../fetchers/subgraphData'

// Hooks
import { useInterval } from '../hooks/useInterval'

// Constants
const INTERVAL = 10000
const SIZE = 100

export default function Home() {
  // #####################################
  // Use hooks
  // #####################################
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  let [watchlist, setWatchlist] = useState([])
  let [state, setData] = useState({
    lastUpdated: Date.now(),
    subgraphs: [],
    subgraphList: [],
    transactions: [],
  })

  // Set watchlist from localstorage
  watchlist =
    watchlist.length === 0 ? getWatchlistFromLocalStorage() : watchlist

  // Initial fetch of subgraph data
  const { data } = useSWR(watchlist, fetchData.bind(this, SIZE))

  // If data comes back, ovveride values to state
  if (data) {
    state = {
      ...state,
      subgraphs: data.subgraphs,
      subgraphList: data.subgraphList,
      transactions: data.transactions,
    }
  }

  // Set interval to fetch data
  useInterval(async () => {
    if (watchlist.length === 0) return

    const data = await fetchData(50)

    setData({
      lastUpdated: Date.now(),
      subgraphs: data?.subgraphs,
      subgraphList: data?.subgraphList,
      transactions: data?.transactions,
    })
  }, INTERVAL)

  const [value, setValue] = useState('')

  // #####################################
  // CSS class definitions
  // #####################################
  const searchResultClasses = {
    searchResults: true,
    show: showSearchResults,
  }

  // #####################################
  // Render functions
  // #####################################
  function renderSearchResults() {
    const results = searchResults

    if (results.length == 0) {
      return <div>Searching...</div>
    }

    return results.map(result => {
      return (
        <div
          className={classNames('searchResult')}
          onClick={updateWatchlist.bind(this, result.id)}
          key={result.id}
        >
          {result.displayName}
          <span className={classNames('subtext')}>Click to add</span>
        </div>
      )
    })
  }

  function renderSubgraphs() {
    const subgraphs = state.subgraphs
    const transactions = state.transactions

    return subgraphs.map(subgraph => {
      return (
        <div key={subgraph.id} className={classNames('card')}>
          <div className={classNames('cardHeader')}>
            <h2>{subgraph.displayName}</h2>
            <div className={classNames('headerSignal')}>
              {formatGrt(subgraph.currentSignalledTokens)}
            </div>
          </div>
          <div className={classNames('cardProperties')}>
            <div className={classNames('property')}>
              <div>
                <strong>Signal Value</strong>
              </div>
              <div>
                {formatGrt(
                  subgraph.currentVersion.subgraphDeployment.signalledTokens,
                )}
              </div>
            </div>
            <div className={classNames('property')}>
              <div>
                <strong>Price per share</strong>
              </div>
              <div>
                {numeral(
                  subgraph.currentVersion.subgraphDeployment.pricePerShare,
                ).format('0,0')}
              </div>
            </div>
            <div className={classNames('property')}>
              <div>
                <strong>Curators</strong>
              </div>
              <div>{subgraph.nameSignalCount}</div>
            </div>
          </div>
          {renderTransactionChart(subgraph)}
          <div className={classNames('cardFooter')}>
            <strong>ID</strong>:{' '}
            <a
              href={`https://thegraph.com/explorer/subgraph?id=${subgraph.id}&view=Overview`}
              target="_blank"
              rel="noreferrer"
            >
              {subgraph.id}
            </a>
            <div
              className={classNames('removeSubgraphLink')}
              onClick={removeFromWatchlist.bind(this, subgraph.id)}
            >
              Remove from watchlist
            </div>
          </div>
        </div>
      )
    })
  }

  function renderTransactionChart(subgraph) {
    const nameTransactions = state.transactions

    let sorted = []

    nameTransactions.map(transactions => {
      transactions.nameSignalTransactions.map(transaction => {
        if (transaction.subgraph.id == subgraph.id) sorted.push(transaction)
      })
    })

    sorted = sorted
      .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1))
      .reverse()

    let signal = parseInt(subgraph.currentSignalledTokens)
    const values = []

    values.push(signal * 10 ** -18)

    sorted.forEach(transaction => {
      const tokens = parseInt(transaction.tokens)

      if (transaction.type == 'MintNSignal') {
        signal = signal - tokens
      } else {
        signal = signal + tokens
      }
      values.push(signal * 10 ** -18)
    })

    const data = {
      labels: [...Array(SIZE + 1).keys()],
      datasets: [
        {
          label: 'Signal',
          data: values.reverse(),
          fill: true,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          borderColor: 'rgba(0, 0, 0, 0.75)',
        },
      ],
    }

    const options = {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
      animations: false,
    }

    const LineChart = () => (
      <>
        <div className={classNames('chartContainer')}>
          <h1>Past {SIZE} transactions</h1>
          <Line
            data={data}
            options={options}
            height="100"
            className={classNames('chart')}
          />
        </div>
      </>
    )
    return LineChart()
  }

  function renderChanges() {
    const nameTransactions = state.transactions
    let sorted = []

    nameTransactions.map(transactions => {
      transactions.nameSignalTransactions.slice(0, 4).map(transaction => {
        sorted.push(transaction)
      })
    })

    sorted = sorted
      .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1))
      .reverse()

    return sorted.map(transaction => {
      return (
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
              {formatGrt(transaction.tokens, '0,0.00')}
            </a>{' '}
          </div>
          <div className={classNames('transactionFooter')}>
            {formatDate(transaction.timestamp * 1000)}
          </div>
        </div>
      )
    })
  }

  function renderLogo() {
    return (
      <img
        className={classNames('logo')}
        src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjJweCIgaGVpZ2h0PSIyOHB4IiB2aWV3Qm94PSIwIDAgMjIgMjgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjQgKDY3Mzc4KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5GaWxsIDE5PC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IlN5bWJvbHMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJNZW51LS8tbm90LXNpZ25lZC1pbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTg4LjAwMDAwMCwgLTUyLjAwMDAwMCkiIGZpbGw9IiNGRkZGRkYiPgogICAgICAgICAgICA8cGF0aCBkPSJNOTcuMzMzMzAxOSw2Ny41NTU1MDMyIEM5My44OTY5NDk4LDY3LjU1NTUwMzIgOTEuMTExMTAwNiw2NC43Njk4NDI1IDkxLjExMTEwMDYsNjEuMzMzMzAxOSBDOTEuMTExMTAwNiw1Ny44OTY3NjEzIDkzLjg5Njk0OTgsNTUuMTExMTAwNiA5Ny4zMzMzMDE5LDU1LjExMTEwMDYgQzEwMC43Njk4NDMsNTUuMTExMTAwNiAxMDMuNTU1NTAzLDU3Ljg5Njc2MTMgMTAzLjU1NTUwMyw2MS4zMzMzMDE5IEMxMDMuNTU1NTAzLDY0Ljc2OTg0MjUgMTAwLjc2OTg0Myw2Ny41NTU1MDMyIDk3LjMzMzMwMTksNjcuNTU1NTAzMiBNOTcuMzMzMzAxOSw1MiBDMTAyLjQ4NzkyNCw1MiAxMDYuNjY2NjA0LDU2LjE3ODY3OTUgMTA2LjY2NjYwNCw2MS4zMzMzMDE5IEMxMDYuNjY2NjA0LDY2LjQ4NzkyNDMgMTAyLjQ4NzkyNCw3MC42NjY2MDM4IDk3LjMzMzMwMTksNzAuNjY2NjAzOCBDOTIuMTc4Njc5NSw3MC42NjY2MDM4IDg4LDY2LjQ4NzkyNDMgODgsNjEuMzMzMzAxOSBDODgsNTYuMTc4Njc5NSA5Mi4xNzg2Nzk1LDUyIDk3LjMzMzMwMTksNTIgWiBNMTA2LjIxMTA2Myw3MS4xMjIxNDQ0IEMxMDYuODE4NTc2LDcxLjcyOTY1NzUgMTA2LjgxODU3Niw3Mi43MTQ0NjIyIDEwNi4yMTEwNjMsNzMuMzIxOTc1MyBMOTkuOTg4NjczNCw3OS41NDQzNjUyIEM5OS4zODExNjAzLDgwLjE1MTg3ODMgOTguMzk2MzU1Niw4MC4xNTE4NzgzIDk3Ljc4ODg0MjUsNzkuNTQ0MzY1MiBDOTcuMTgxMzI5NCw3OC45MzY4NTIxIDk3LjE4MTMyOTQsNzcuOTUyMDQ3MyA5Ny43ODg4NDI1LDc3LjM0NDUzNDIgTDEwNC4wMTEyMzIsNzEuMTIyMTQ0NCBDMTA0LjYxODc0NSw3MC41MTQ2MzEzIDEwNS42MDM1NSw3MC41MTQ2MzEzIDEwNi4yMTEwNjMsNzEuMTIyMTQ0NCBaIE0xMDkuNzc3NzA0LDUzLjU1NTU1MDMgQzEwOS43Nzc3MDQsNTQuNDE0Nzc5NyAxMDkuMDgxMzg0LDU1LjExMTEwMDYgMTA4LjIyMjM0Myw1NS4xMTExMDA2IEMxMDcuMzYzMTEzLDU1LjExMTEwMDYgMTA2LjY2Njc5Miw1NC40MTQ3Nzk3IDEwNi42NjY3OTIsNTMuNTU1NTUwMyBDMTA2LjY2Njc5Miw1Mi42OTYzMjA5IDEwNy4zNjMxMTMsNTIgMTA4LjIyMjM0Myw1MiBDMTA5LjA4MTM4NCw1MiAxMDkuNzc3NzA0LDUyLjY5NjMyMDkgMTA5Ljc3NzcwNCw1My41NTU1NTAzIFoiIGlkPSJGaWxsLTE5Ij48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="
      />
    )
  }

  function renderCurators(subgraph) {
    return (
      <div className={classNames('curatorsContainer')}>
        <h3>Top 5 curators</h3>
        {curators(subgraph)}
      </div>
    )
  }

  function renderCuratorList(subgraph) {
    return subgraph.nameSignals.map(nameSignal => {
      return (
        <div className={classNames('curator')} key={nameSignal.id}>
          Original: {formatGrt(nameSignal.signalledTokens)} - Current:{' '}
          {formatGrt(nameSignal.signalledTokens - nameSignal.unsignalledTokens)}
          <div>
            <a
              className={classNames('footerLink')}
              href={`https://thegraph.com/explorer/profile?id=${nameSignal.curator.id}&view=Overview`}
              target="_blank"
              rel="noreferrer"
            >
              The Graph profile
            </a>{' '}
            |{' '}
            <a
              className={classNames('footerLink')}
              href={`https://etherscan.io/address/${nameSignal.curator.id}`}
              target="_blank"
              rel="noreferrer"
            >
              Etherscan.io
            </a>
          </div>
        </div>
      )
    })
  }

  function renderList(subgraphList) {
    return subgraphList.slice(0, 10).map(subgraph => {
      return (
        <div className={classNames('subgraphListItem')} key={subgraph.id}>
          <a
            href={`https://thegraph.com/explorer/subgraph?id=${subgraph.id}&view=Overview`}
            target="_blank"
            rel="noreferrer"
          >
            {subgraph.displayName}
          </a>{' '}
          {formatGrt(subgraph.currentSignalledTokens)}
        </div>
      )
    })
  }

  function renderOwner(subgraph) {
    return (
      <div>
        <h3>Owner</h3>
        <div className={classNames('subtitle')}>
          <strong>ID</strong>: {subgraph.owner.id}
        </div>
        <a
          className={classNames('footerLink')}
          href={`https://thegraph.com/explorer/profile?id=${subgraph.owner.id}&view=Overview`}
          target="_blank"
          rel="noreferrer"
        >
          Go to The Graph profile
        </a>
        <br />
        <a
          className={classNames('footerLink')}
          href={`https://etherscan.io/address/${subgraph.owner.id}`}
          target="_blank"
          rel="noreferrer"
        >
          Go to Etherscan.io
        </a>
      </div>
    )
  }

  // #####################################
  // Modify functions
  // #####################################
  function updateWatchlist(id, event) {
    let watchlist = window.localStorage.getItem('watchlist') || ''

    let watchlistArray = watchlist == '' ? [] : watchlist.split(',')
    watchlistArray.push(id)
    watchlistArray = watchlistArray.filter(distinct)

    window.localStorage.setItem('watchlist', watchlistArray.join(','))

    setWatchlist(watchlistArray)
    setShowSearchResults(false)
  }

  function removeFromWatchlist(idToRemove, event) {
    const filteredWatchlist = watchlist.filter(id => {
      return id != idToRemove
    })

    if (filteredWatchlist.length == 0) {
      window.localStorage.removeItem('watchlist')
    } else {
      window.localStorage.setItem('watchlist', filteredWatchlist.join(','))
    }

    setWatchlist(filteredWatchlist)
    setData({
      lastUpdated: Date.now(),
      subgraphs: [],
      subgraphList: [],
      transactions: [],
    })
  }

  function toggleShowSearchResults(toggle, event) {
    setShowSearchResults(toggle)
  }

  // #####################################
  // Getters
  // #####################################
  function getWatchlistFromLocalStorage() {
    if (typeof window === 'undefined') return []

    return window.localStorage.getItem('watchlist')?.split(',') || []
  }

  // #####################################
  // API calls
  // #####################################
  async function search(event) {
    if (event.key == 'Enter') {
      setSearchResults([])
      setShowSearchResults(true)

      const response = await Api().post(
        '',
        subgraphSearchQuery(event.target.value),
      )

      setSearchResults(response.data.data.subgraphSearch)
    }
  }

  // #####################################
  // Return
  // #####################################
  return (
    <div
      onClick={toggleShowSearchResults.bind(this, false)}
      className={classNames('container')}
    >
      <Head>
        <title>Subgraph Watchlist</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={classNames('main')}>
        <div className={classNames('title')}>
          {renderLogo()}
          <h1>Subgraph Watchlist</h1>
          <div className={classNames('lastUpdated')}>
            <strong>Updated</strong>: {formatDate(state.lastUpdated)}
          </div>
        </div>
        <div className={classNames('search')}>
          <input
            value={value}
            onChange={e => setValue(e.target.value)}
            className={classNames('searchBar')}
            placeholder="Search by name"
            onKeyUp={search.bind(this)}
          />
          <div className={classNames(searchResultClasses)}>
            {renderSearchResults()}
          </div>
        </div>
        <div className={classNames('grid')}>
          <div className={classNames('leftGrid')}>{renderSubgraphs()}</div>
          <div className={classNames('rightGrid')}>
            <div className={classNames('card')}>
              <h2 className={classNames('signalChangesHeader')}>
                Signal Changes
              </h2>
              {renderChanges()}
            </div>
          </div>
        </div>
      </main>
      {/* <div className={classNames('subgraphList')}>{renderList(data.subgraphList)}</div> */}
    </div>
  )
}

function signalType(type) {
  if (type == 'MintNSignal') {
    return <span className={classNames('transactionTypePlus')}>+</span>
  } else {
    return <span className={classNames('transactionTypeMinus')}>-</span>
  }
}

function formatGrt(grt, format = '0,0') {
  return (
    <span>
      {convertGrt(grt, format)}{' '}
      <span className={classNames('subtext')}>GRT</span>
    </span>
  )
}
