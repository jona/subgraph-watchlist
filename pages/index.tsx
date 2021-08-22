// General
import { useState } from 'react'
import 'chartjs-adapter-moment'
import classNamesBind from 'classnames/bind'

// Styles
import styles from './styles.module.css'
const classNames = classNamesBind.bind(styles)

// Lib
import { Api } from '../lib/api'
import { subgraphSearchQuery } from '../lib/subgraphSearchQuery'

// Components
import Subgraph from '../components/Subgraph'
import Transactions from '../components/Transactions'
import GrtSubtext from '../components/GrtSubtext'
import Header from '../components/Header'
import Head from '../components/Head'

export default function Home(this: any) {
  // #####################################
  // Use hooks
  // #####################################
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  let [watchlist, setWatchlist] = useState([])

  // Set watchlist from localstorage
  watchlist = getWatchlistFromLocalStorage()

  const subgraphIds = watchlist.map((subgraph: any) => {
    return subgraph.id
  })

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
  const renderSearchResults = () => {
    const results = searchResults

    if (results.length == 0) {
      return <div>Searching...</div>
    }

    return results.map((result: any) => {
      return (
        <div
          className={classNames('searchResult')}
          onClick={() => {
            updateWatchlist(result.id)
          }}
          key={result.id}
        >
          {result.displayName}
          <span className={classNames('clickToAdd')}>Click to add</span>
        </div>
      )
    })
  }

  function renderSubgraphs() {
    if (watchlist.length == 0) {
      return (
        <div className={classNames('card', 'emptySubgraphList')}>
          Search for a subgraph above to add to your watchlist
        </div>
      )
    }

    return watchlist.map((item: any) => {
      return (
        <Subgraph
          key={item.id}
          id={item.id}
          range={item.range}
          removeFromWatchlist={removeFromWatchlist}
          changeSubgraphRange={changeSubgraphRange}
        />
      )
    })
  }

  function renderList(subgraphList: any) {
    return subgraphList.slice(0, 10).map((subgraph: any) => {
      return (
        <div className={classNames('subgraphListItem')} key={subgraph.id}>
          <a
            href={`https://thegraph.com/explorer/subgraph?id=${subgraph.id}&view=Overview`}
            target="_blank"
            rel="noreferrer"
          >
            {subgraph.displayName}
          </a>{' '}
          <GrtSubtext grt={subgraph.currentSignalledTokens} />
        </div>
      )
    })
  }

  function renderOwner(subgraph: any) {
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
  function updateWatchlist(id: string) {
    let watchlist = window.localStorage.getItem('watchlist') || ''

    let watchlistArray = watchlist == '' ? [] : JSON.parse(watchlist)
    watchlistArray.push({
      id: id,
      range: 7,
    })
    watchlistArray = watchlistArray.filter(
      (v: any, i: any, a: any) => a.findIndex((t: any) => t.id === v.id) === i,
    )

    window.localStorage.setItem('watchlist', JSON.stringify(watchlistArray))

    setWatchlist(watchlistArray)
    setShowSearchResults(false)
  }

  function removeFromWatchlist(idToRemove: string) {
    const filteredWatchlist = watchlist.filter((item: any) => {
      return item.id != idToRemove
    })

    if (filteredWatchlist.length == 0) {
      window.localStorage.removeItem('watchlist')
    } else {
      window.localStorage.setItem(
        'watchlist',
        JSON.stringify(filteredWatchlist),
      )
    }

    setWatchlist(filteredWatchlist)
  }

  function toggleShowSearchResults(toggle: boolean) {
    setShowSearchResults(toggle)
  }

  function changeSubgraphRange(id: string, event: any) {
    const updatedWatchlist: any = watchlist.map((item: any) => {
      if (item.id == id) {
        item.range = event.value
      }

      return item
    })

    setWatchlist(updatedWatchlist)
    window.localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist))
  }

  // #####################################
  // Getters
  // #####################################
  function getWatchlistFromLocalStorage() {
    if (typeof window === 'undefined') return []

    if (watchlist.length > 0) return watchlist

    const watchlistFromLocalStorage =
      window.localStorage.getItem('watchlist') || ''

    return watchlistFromLocalStorage == ''
      ? []
      : JSON.parse(watchlistFromLocalStorage)
  }

  // #####################################
  // API calls
  // #####################################
  async function search(event: any) {
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
      onClick={() => {
        toggleShowSearchResults(false)
      }}
      className={classNames('container')}
    >
      <Head />

      <Header />
      <main className={classNames('main')}>
        <div className={classNames('search')}>
          <input
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
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
              <Transactions ids={subgraphIds} />
            </div>
          </div>
        </div>
      </main>
      {/* <div className={classNames('subgraphList')}>{renderList(data.subgraphList)}</div> */}
    </div>
  )
}
