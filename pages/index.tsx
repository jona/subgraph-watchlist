import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { Api } from '../lib/api'
import { subgraphs } from '../lib/subgraphWatchQuery'
import { subgraphList } from '../lib/subgraphListQuery'

export default function Home({ subgraphs, subgraphList }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Subgraph Watchlist</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Subgraph Watchlist</h1>

        <div className={styles.grid}>
          <div className={styles.leftGrid}>{render(subgraphs)}</div>
          <div className={styles.rightGrid}>
            <div key={subgraphs.id} className={styles.card}>
              <h2>Top Signaled Subgraphs</h2>
              {renderList(subgraphList)}
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
            {Math.round(subgraph.currentSignalledTokens * 10 ** -18)}{' '}
            <span className={styles.subtext}>GRT</span>
          </div>
          <div className={styles.property}>
            <strong>Signal Value</strong>:{' '}
            {Math.round(
              subgraph.currentVersion.subgraphDeployment.signalledTokens *
                10 ** -18,
            )}{' '}
            <span className={styles.subtext}>GRT</span>
          </div>
          <div className={styles.property}>
            <strong>Price per share</strong>:{' '}
            {Math.round(
              subgraph.currentVersion.subgraphDeployment.pricePerShare,
            )}{' '}
            <span className={styles.subtext}>GRT</span>
          </div>
          <div className={styles.property}>
            <strong>Curators</strong>: {subgraph.nameSignals.length}
          </div>
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
          {Math.round(subgraph.currentSignalledTokens * 10 ** -18)}{' '}
          <span className={styles.subtext}>GRT</span>
        </div>
      </div>
    )
  })
}

export async function getStaticProps() {
  const responses = await Promise.all(
    subgraphs.map(async subgraph => {
      const response = await Api().post('', subgraph)
      return response.data.data.subgraph
    }),
  )

  const response = await Api().post('', subgraphList)

  return {
    props: {
      subgraphs: responses,
      subgraphList: response.data.data.subgraphs,
    },
  }
}
