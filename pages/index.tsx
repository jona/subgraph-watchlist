import { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import numeral from 'numeral'
import moment from 'moment'

import { Api } from '../lib/api'
import { subgraphWatchQuery } from '../lib/subgraphWatchQuery'
import { subgraphListQuery } from '../lib/subgraphListQuery'
import { subgraphTransactionsQuery } from '../lib/subgraphTransactionsQuery'

import { useInterval } from '../hooks/useInterval'

export default function Home({ subgraphs, subgraphList, transactions }) {
  const [data, setData] = useState({
    lastUpdated: Date.now(),
    subgraphs,
    subgraphList,
    transactions,
  })

  useInterval(async () => {
    const responses = await Promise.all(
      subgraphWatchQuery.map(async subgraph => {
        const response = await Api().post('', subgraph)
        return response.data.data.subgraph
      }),
    )

    const transactions = await Promise.all(
      subgraphTransactionsQuery.map(async transaction => {
        const response = await Api().post('', transaction)
        return response.data.data
      }),
    )

    const response = await Api().post('', subgraphListQuery)

    setData({
      lastUpdated: Date.now(),
      subgraphs: responses,
      subgraphList: response.data.data.subgraphs,
      transactions: transactions,
    })
  }, 20000)

  return (
    <div className={styles.container}>
      <Head>
        <title>Subgraph Watchlist</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Subgraph Watchlist</h1>

        <div className={styles.lastUpdated}>
          <strong>Last updated</strong>: {formatDate(data.lastUpdated)}
        </div>
        <div className={styles.grid}>
          <div className={styles.leftGrid}>{render(data.subgraphs)}</div>
          <div className={styles.rightGrid}>
            <div className={styles.card}>
              <h2 className={styles.signalChangesHeader}>Signal Changes</h2>
              {renderChanges(data.transactions)}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function renderChanges(nameTransactions) {
  let sorted = []

  nameTransactions.map(transactions => {
    transactions.nameSignalTransactions.map(transaction => {
      sorted.push(transaction)
    })
  })

  sorted = sorted.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1)).reverse()

  return sorted.map(transaction => {
    return (
      <div key={transaction.id} className={styles.transaction}>
        <div className={styles.transactionType}>{transaction.type}</div>
        <div>
          {formatGrt(transaction.tokens, '0,0.0000')}{' '}
          <span className={styles.subtext}>GRT</span>
        </div>
        <div className={styles.transactionSubgraph}>
          {transaction.subgraph.displayName}
        </div>
      </div>
    )
  })
}

function render(subgraphs) {
  return subgraphs.map(subgraph => {
    return (
      <div key={subgraphs.id} className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>{subgraph.displayName}</h2>
          <div className={styles.headerSignal}>
            {formatGrt(subgraph.currentSignalledTokens)}
          </div>
        </div>
        <div className={styles.cardProperties}>
          <div className={styles.property}>
            <div>
              <strong>Signal Value</strong>
            </div>
            <div>
              {formatGrt(
                subgraph.currentVersion.subgraphDeployment.signalledTokens,
              )}
            </div>
          </div>
          <div className={styles.property}>
            <div>
              <strong>Price per share</strong>
            </div>
            <div>
              {numeral(
                subgraph.currentVersion.subgraphDeployment.pricePerShare,
              ).format('0,0')}
            </div>
          </div>
          <div className={styles.property}>
            <div>
              <strong>Curators</strong>
            </div>
            <div>{subgraph.nameSignalCount}</div>
          </div>
        </div>
        {/* <div className={styles.curatorsContainer}>
          <h3>Top 5 curators</h3>
          {curators(subgraph)}
        </div> */}
        <div className={styles.cardFooter}>
          <strong>ID</strong>:{' '}
          <a
            href={`https://thegraph.com/explorer/subgraph?id=${subgraph.id}&view=Overview`}
            target="_blank"
            rel="noreferrer"
          >
            {subgraph.id}
          </a>
          {/* <h3>Owner</h3>
          <div className={styles.subtitle}>
            <strong>ID</strong>: {subgraph.owner.id}
          </div>
          <a
            className={styles.footerLink}
            href={`https://thegraph.com/explorer/profile?id=${subgraph.owner.id}&view=Overview`}
            target="_blank"
            rel="noreferrer"
          >
            Go to The Graph profile
          </a>
          <br />
          <a
            className={styles.footerLink}
            href={`https://etherscan.io/address/${subgraph.owner.id}`}
            target="_blank"
            rel="noreferrer"
          >
            Go to Etherscan.io
          </a> */}
        </div>
      </div>
    )
  })
}

function curators(subgraph) {
  return subgraph.nameSignals.map(nameSignal => {
    return (
      <div className={styles.curator} key={nameSignal.id}>
        Original: {formatGrt(nameSignal.signalledTokens)} - Current:{' '}
        {formatGrt(nameSignal.signalledTokens - nameSignal.unsignalledTokens)}
        <div>
          <a
            className={styles.footerLink}
            href={`https://thegraph.com/explorer/profile?id=${nameSignal.curator.id}&view=Overview`}
            target="_blank"
            rel="noreferrer"
          >
            The Graph profile
          </a>{' '}
          |{' '}
          <a
            className={styles.footerLink}
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
  return subgraphList.slice(0, 20).map(subgraph => {
    return (
      <div className={styles.subgraphListItem} key={subgraph.id}>
        <a
          href={`https://thegraph.com/explorer/subgraph?id=${subgraph.id}&view=Overview`}
          target="_blank"
          rel="noreferrer"
        >
          {subgraph.displayName}
        </a>
        <div className={styles.subgraphListItemSubtitle}>
          {formatGrt(subgraph.currentSignalledTokens)}
        </div>
      </div>
    )
  })
}

function formatDate(date) {
  return moment(date).format('MMMM Do YYYY, h:mm:ss a')
}

function formatGrt(grt, format = '0,0') {
  return (
    <span>
      {numeral(grt * 10 ** -18).format(format)}{' '}
      <span className={styles.subtext}>GRT</span>
    </span>
  )
}

export async function getStaticProps() {
  const subgraphs = await Promise.all(
    subgraphWatchQuery.map(async subgraph => {
      const response = await Api().post('', subgraph)
      return response.data.data.subgraph
    }),
  )

  const transactions = await Promise.all(
    subgraphTransactionsQuery.map(async transaction => {
      const response = await Api().post('', transaction)
      return response.data.data
    }),
  )

  const response = await Api().post('', subgraphListQuery)

  return {
    props: {
      subgraphs: subgraphs,
      subgraphList: response.data.data.subgraphs,
      transactions: transactions,
    },
  }
}
