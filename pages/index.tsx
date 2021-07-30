import { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import numeral from 'numeral'
import moment from 'moment'
import { Line } from 'react-chartjs-2'

import { Api } from '../lib/api'
import { subgraphWatchQuery } from '../lib/subgraphWatchQuery'
import { subgraphListQuery } from '../lib/subgraphListQuery'
import { subgraphTransactionsQuery } from '../lib/subgraphTransactionsQuery'

import { useInterval } from '../hooks/useInterval'

const INTERVAL = 10000

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
  }, INTERVAL)

  return (
    <div className={styles.container}>
      <Head>
        <title>Subgraph Watchlist</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.title}>
          <img
            className={styles.logo}
            src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjJweCIgaGVpZ2h0PSIyOHB4IiB2aWV3Qm94PSIwIDAgMjIgMjgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjQgKDY3Mzc4KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5GaWxsIDE5PC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IlN5bWJvbHMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJNZW51LS8tbm90LXNpZ25lZC1pbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTg4LjAwMDAwMCwgLTUyLjAwMDAwMCkiIGZpbGw9IiNGRkZGRkYiPgogICAgICAgICAgICA8cGF0aCBkPSJNOTcuMzMzMzAxOSw2Ny41NTU1MDMyIEM5My44OTY5NDk4LDY3LjU1NTUwMzIgOTEuMTExMTAwNiw2NC43Njk4NDI1IDkxLjExMTEwMDYsNjEuMzMzMzAxOSBDOTEuMTExMTAwNiw1Ny44OTY3NjEzIDkzLjg5Njk0OTgsNTUuMTExMTAwNiA5Ny4zMzMzMDE5LDU1LjExMTEwMDYgQzEwMC43Njk4NDMsNTUuMTExMTAwNiAxMDMuNTU1NTAzLDU3Ljg5Njc2MTMgMTAzLjU1NTUwMyw2MS4zMzMzMDE5IEMxMDMuNTU1NTAzLDY0Ljc2OTg0MjUgMTAwLjc2OTg0Myw2Ny41NTU1MDMyIDk3LjMzMzMwMTksNjcuNTU1NTAzMiBNOTcuMzMzMzAxOSw1MiBDMTAyLjQ4NzkyNCw1MiAxMDYuNjY2NjA0LDU2LjE3ODY3OTUgMTA2LjY2NjYwNCw2MS4zMzMzMDE5IEMxMDYuNjY2NjA0LDY2LjQ4NzkyNDMgMTAyLjQ4NzkyNCw3MC42NjY2MDM4IDk3LjMzMzMwMTksNzAuNjY2NjAzOCBDOTIuMTc4Njc5NSw3MC42NjY2MDM4IDg4LDY2LjQ4NzkyNDMgODgsNjEuMzMzMzAxOSBDODgsNTYuMTc4Njc5NSA5Mi4xNzg2Nzk1LDUyIDk3LjMzMzMwMTksNTIgWiBNMTA2LjIxMTA2Myw3MS4xMjIxNDQ0IEMxMDYuODE4NTc2LDcxLjcyOTY1NzUgMTA2LjgxODU3Niw3Mi43MTQ0NjIyIDEwNi4yMTEwNjMsNzMuMzIxOTc1MyBMOTkuOTg4NjczNCw3OS41NDQzNjUyIEM5OS4zODExNjAzLDgwLjE1MTg3ODMgOTguMzk2MzU1Niw4MC4xNTE4NzgzIDk3Ljc4ODg0MjUsNzkuNTQ0MzY1MiBDOTcuMTgxMzI5NCw3OC45MzY4NTIxIDk3LjE4MTMyOTQsNzcuOTUyMDQ3MyA5Ny43ODg4NDI1LDc3LjM0NDUzNDIgTDEwNC4wMTEyMzIsNzEuMTIyMTQ0NCBDMTA0LjYxODc0NSw3MC41MTQ2MzEzIDEwNS42MDM1NSw3MC41MTQ2MzEzIDEwNi4yMTEwNjMsNzEuMTIyMTQ0NCBaIE0xMDkuNzc3NzA0LDUzLjU1NTU1MDMgQzEwOS43Nzc3MDQsNTQuNDE0Nzc5NyAxMDkuMDgxMzg0LDU1LjExMTEwMDYgMTA4LjIyMjM0Myw1NS4xMTExMDA2IEMxMDcuMzYzMTEzLDU1LjExMTEwMDYgMTA2LjY2Njc5Miw1NC40MTQ3Nzk3IDEwNi42NjY3OTIsNTMuNTU1NTUwMyBDMTA2LjY2Njc5Miw1Mi42OTYzMjA5IDEwNy4zNjMxMTMsNTIgMTA4LjIyMjM0Myw1MiBDMTA5LjA4MTM4NCw1MiAxMDkuNzc3NzA0LDUyLjY5NjMyMDkgMTA5Ljc3NzcwNCw1My41NTU1NTAzIFoiIGlkPSJGaWxsLTE5Ij48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="
          />
          <h1>Subgraph Watchlist</h1>
          <div className={styles.lastUpdated}>
            <strong>Updated</strong>: {formatDate(data.lastUpdated)}
          </div>
        </div>
        <div className={styles.grid}>
          <div className={styles.leftGrid}>
            {renderSubgraphs(data.subgraphs, data.transactions)}
          </div>
          <div className={styles.rightGrid}>
            <div className={styles.card}>
              <h2 className={styles.signalChangesHeader}>Signal Changes</h2>
              {renderChanges(data.transactions)}
            </div>
          </div>
        </div>
      </main>
      {/* <div className={styles.subgraphList}>{renderList(data.subgraphList)}</div> */}
    </div>
  )
}

function renderSubgraphs(subgraphs, transactions) {
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
        {renderTransactionChart(subgraph, transactions)}
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

function renderTransactionChart(subgraph, nameTransactions) {
  let sorted = []

  nameTransactions.map(transactions => {
    transactions.nameSignalTransactions.map(transaction => {
      if (transaction.subgraph.id == subgraph.id) sorted.push(transaction)
    })
  })

  sorted = sorted.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1)).reverse()

  let signal = parseInt(subgraph.currentSignalledTokens)
  const values = []
  let size = sorted.length

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
    labels: [...Array(size + 1).keys()],
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
      <div className={styles.chartContainer}>
        <h1>Past {size} transactions</h1>
        <Line
          data={data}
          options={options}
          height="100"
          className={styles.chart}
        />
      </div>
    </>
  )
  return LineChart()
}

function renderChanges(nameTransactions) {
  let sorted = []

  nameTransactions.map(transactions => {
    transactions.nameSignalTransactions.slice(0, 4).map(transaction => {
      sorted.push(transaction)
    })
  })

  sorted = sorted.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1)).reverse()

  return sorted.map(transaction => {
    return (
      <div key={transaction.id} className={styles.transaction}>
        <div className={styles.transactionType}>{transaction.type}</div>
        <div>
          <a
            className={styles.footerLink}
            href={`https://etherscan.io/address/${transaction.signer.id}`}
            target="_blank"
            rel="noreferrer"
          >
            {formatGrt(transaction.tokens, '0,0.00')}
          </a>{' '}
        </div>
        <div className={styles.transactionSubgraph}>
          {transaction.subgraph.displayName}
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
  return subgraphList.slice(0, 10).map(subgraph => {
    return (
      <div className={styles.subgraphListItem} key={subgraph.id}>
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

function formatDate(date) {
  return moment(date).format('MMMM Do YYYY, h:mm:ss a')
}

function formatGrt(grt, format = '0,0') {
  return (
    <span>
      {convertGrt(grt, format)} <span className={styles.subtext}>GRT</span>
    </span>
  )
}

function convertGrt(grt, format = '0,0') {
  return numeral(grt * 10 ** -18).format(format)
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
