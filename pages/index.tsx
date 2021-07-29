import { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import numeral from 'numeral'
import moment from 'moment'

import { Api } from '../lib/api'
import { subgraphWatchQuery } from '../lib/subgraphWatchQuery'
import { subgraphListQuery } from '../lib/subgraphListQuery'

import { useInterval } from '../hooks/useInterval'

export default function Home({ subgraphs, subgraphList }) {
  const [data, setData] = useState({
    lastUpdated: Date.now(),
    subgraphs,
    subgraphList,
  })

  useInterval(async () => {
    const responses = await Promise.all(
      subgraphWatchQuery.map(async subgraph => {
        const response = await Api().post('', subgraph)
        return response.data.data.subgraph
      }),
    )

    const response = await Api().post('', subgraphListQuery)

    setData({
      lastUpdated: Date.now(),
      subgraphs: responses,
      subgraphList: response.data.data.subgraphs,
    })
  }, 40000)

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
              <h2>Top Signaled Subgraphs</h2>
              {renderList(data.subgraphList)}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function render(subgraphs) {
  return subgraphs.map(subgraph => {
    return (
      <div key={subgraphs.id} className={styles.card}>
        <h2>{subgraph.displayName}</h2>
        <div className={styles.subtitle}>
          <strong>ID</strong>:{' '}
          <a
            href={`https://thegraph.com/explorer/subgraph?id=${subgraph.id}&view=Overview`}
            target="_blank"
            rel="noreferrer"
          >
            {subgraph.id}
          </a>
        </div>
        <div className={styles.cardProperties}>
          <div className={styles.property}>
            <strong>Signal</strong>:{' '}
            {numeral(subgraph.currentSignalledTokens * 10 ** -18).format('0,0')}{' '}
            <span className={styles.subtext}>GRT</span>
          </div>
          <div className={styles.property}>
            <strong>Signal Value</strong>:{' '}
            {numeral(
              subgraph.currentVersion.subgraphDeployment.signalledTokens *
                10 ** -18,
            ).format('0,0')}{' '}
            1<span className={styles.subtext}>GRT</span>
          </div>
          <div className={styles.property}>
            <strong>Price per share</strong>:{' '}
            {numeral(
              subgraph.currentVersion.subgraphDeployment.pricePerShare,
            ).format('0,0')}{' '}
            <span className={styles.subtext}>GRT</span>
          </div>
          <div className={styles.property}>
            <strong>Curators</strong>: {subgraph.nameSignalCount}
          </div>
        </div>
        <div className={styles.curatorsContainer}>
          <h3>Top 5 curators</h3>
          {curators(subgraph)}
        </div>
        <div className={styles.cardFooter}>
          <h3>Owner</h3>
          <div className={styles.subtitle}>
            <strong>ID</strong>: {subgraph.owner.id}
          </div>
          <a
            className={styles.footerLink}
            href={`https://thegraph.com/explorer/profile?id="${subgraph.owner.id}"&view=Overview`}
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
          </a>
        </div>
      </div>
    )
  })
}

function curators(subgraph) {
  return subgraph.nameSignals.map(nameSignal => {
    return (
      <div className={styles.curator} key={nameSignal.id}>
        {numeral(nameSignal.signalledTokens * 10 ** -18).format('0,0')}{' '}
        <span className={styles.subtext}>GRT</span>
        <div>
          <a
            className={styles.footerLink}
            href={`https://thegraph.com/explorer/profile?id="${nameSignal.curator.id}"&view=Overview`}
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
          {numeral(subgraph.currentSignalledTokens * 10 ** -18).format('0,0')}{' '}
          <span className={styles.subtext}>GRT</span>
        </div>
      </div>
    )
  })
}

function formatDate(date) {
  return moment(date).format('MMMM Do YYYY, h:mm:ss a')
}

export async function getStaticProps() {
  const responses = await Promise.all(
    subgraphWatchQuery.map(async subgraph => {
      const response = await Api().post('', subgraph)
      return response.data.data.subgraph
    }),
  )

  const response = await Api().post('', subgraphListQuery)

  return {
    props: {
      subgraphs: responses,
      subgraphList: response.data.data.subgraphs,
    },
  }
}
