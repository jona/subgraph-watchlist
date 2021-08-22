// General
import { useState } from 'react'
import numeral from 'numeral'
import useSWR from 'swr'
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-moment'
import classNamesBind from 'classnames/bind'
import Select from 'react-select'
import moment from 'moment'
import { useQuery } from '@apollo/client'

// Styles
import styles from './styles.module.css'
const classNames = classNamesBind.bind(styles)

// Lib
import { formatDate } from '../../lib/formatDate'
import { styles as selectStyles } from '../../lib/select/styles'
import distinct from '../../lib/distinct'

// GraphQL
import { query as subgraphQuery } from '../../lib/graphQL/subgraph/single'
import { query as transactionsQuery } from '../../lib/graphQL/subgraph/transactions'

// Components
import GrtSubtext from '../GrtSubtext'

export interface OwnProps {
  id: string
  range: number
  removeFromWatchlist: (id: string) => void
  changeSubgraphRange: (id: string, event: any) => void
}

export default function Subgraph(
  this: any,
  { id, range, removeFromWatchlist, changeSubgraphRange }: OwnProps,
) {
  const [lastUpdated, setLastUpdated] = useState(Date.now())

  const timestamp = moment().subtract(range, 'days').unix()

  const { data: subgraphData } = useQuery(subgraphQuery, {
    variables: {
      id: id,
      firstSignals: 5,
      nameSignalsOrderBy: 'signalledTokens',
      nameSignalsOrderDirection: 'desc',
    },
    onCompleted: () => {
      setLastUpdated(Date.now())
    },
    pollInterval: 20000,
  })

  const { data: transactionData } = useQuery(transactionsQuery, {
    variables: {
      id: id,
      timestamp: timestamp,
      OrderBy: 'timestamp',
      OrderDirection: 'desc',
    },
  })

  if (!subgraphData || !transactionData) return emptySubgraph()

  const subgraph = subgraphData.subgraph
  const transactions = transactionData.nameSignalTransactions

  const renderTransactionChart = () => {
    const sorted = transactions
      .slice()
      .sort((a: any, b: any) => (a.timestamp > b.timestamp ? 1 : -1))
      .reverse()

    let signal = parseInt(subgraph.currentSignalledTokens)
    const transactionDataSet = []

    transactionDataSet.push(signal * 10 ** -18)

    sorted.forEach((transaction: { tokens: string; type: string }) => {
      const tokens = parseInt(transaction.tokens)

      if (transaction.type == 'MintNSignal') {
        signal = signal - tokens
      } else {
        signal = signal + tokens
      }
      transactionDataSet.push(signal * 10 ** -18)
    })

    const data = {
      // @ts-ignore
      labels: [...Array(transactionDataSet.length).keys()],
      datasets: [
        {
          label: 'Transactions',
          data: transactionDataSet.reverse(),
          fill: true,
          backgroundColor: 'rgb(13 6 72 / 88%)',
          borderColor: 'rgb(13 6 72 / 88%)',
          pointBorderWidth: '1px',
        },
      ],
    }

    const lineOptions = {
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

    const selectOptions = [
      { value: 1, label: 'Transactions for past day' },
      { value: 3, label: 'Transactions for past 3 days' },
      { value: 7, label: 'Transactions for past 7 days' },
      { value: 14, label: 'Transactions for past 14 days' },
      { value: 30, label: 'Transactions for past 30 days' },
      { value: 60, label: 'Transactions for past 60 days' },
      { value: 90, label: 'Transactions for past 90 days' },
    ]

    const selectedOption = selectOptions.find(option => {
      return option.value == range
    })

    const LineChart = () => (
      <>
        <div className={classNames('chartContainer')}>
          <Select
            styles={selectStyles}
            onChange={changeSubgraphRange.bind(this, subgraph.id)}
            options={selectOptions}
            defaultValue={selectedOption}
          />
          <Line
            height={120}
            data={data}
            options={lineOptions}
            className={classNames('chart')}
          />
        </div>
      </>
    )
    return LineChart()
  }

  function emptySubgraph() {
    return (
      <div className={classNames('emptySubgraph', 'card')}>
        <div>Loading...</div>
      </div>
    )
  }

  function renderStats() {
    const burnCount = transactions.filter((transaction: any) => {
      return transaction.type === 'BurnNSignal'
    }).length
    const mintCount = transactions.filter((transaction: any) => {
      return transaction.type === 'MintNSignal'
    }).length

    const curatorCount = transactions
      .map((transaction: any) => {
        return transaction.signer.id
      })
      .filter(distinct).length

    const total = burnCount + mintCount

    let profitCount = 0
    const burnReducer = (accumulator: number, transaction: any) => {
      if (transaction.type === 'BurnNSignal') {
        profitCount += 1
        return accumulator + parseInt(transaction.tokens)
      } else {
        return accumulator
      }
    }
    const sumOfBurnedTokens = transactions.reduce(burnReducer, 0)
    const averageProfitTaken = sumOfBurnedTokens / profitCount

    return (
      <div className={classNames('stats')}>
        <div className={classNames('stat', 'statTop')}>
          <h2 className={classNames('statHeader')}>Burn / Mint Ratio</h2>
          <div>
            {numeral(burnCount / total).format('0%')} /{' '}
            {numeral(mintCount / total).format('0%')}
          </div>
        </div>
        <div className={classNames('stat', 'statTop')}>
          <h2 className={classNames('statHeader')}>Unique Curators in Txns</h2>
          {curatorCount}
        </div>
        <div className={classNames('stat')}>
          <h2 className={classNames('statHeader')}>Average Burned per Txn</h2>
          <GrtSubtext grt={averageGrt('BurnNSignal')} />
        </div>
        <div className={classNames('stat')}>
          <h2 className={classNames('statHeader')}>Average Minted per Txn</h2>
          <GrtSubtext grt={averageGrt('MintNSignal')} />
        </div>
      </div>
    )
  }

  // #####################################
  // Helper functions
  // #####################################
  function averageGrt(type: string) {
    let count = 0

    const reducer = (accumulator: number, transaction: any) => {
      if (transaction.type === type) {
        count += 1
        return accumulator + parseInt(transaction.tokens)
      } else {
        return accumulator
      }
    }
    const sum = transactions.reduce(reducer, 0)
    const average = sum / count

    return average
  }

  // #####################################
  // Return
  // #####################################
  return (
    <div key={subgraph.id} className={classNames('card')}>
      <div className={classNames('cardHeader')}>
        <div>
          <h2>{subgraph.displayName}</h2>
          <div>{subgraph.currentVersion.label}</div>
        </div>
        <div className={classNames('headerSignal')}>
          <GrtSubtext grt={subgraph.currentSignalledTokens} />
          <div className={classNames('lastUpdated')}>
            {formatDate(lastUpdated)}
          </div>
        </div>
      </div>
      <div className={classNames('cardProperties')}>
        <div className={classNames('property')}>
          <h2>Indexer Stats</h2>
          <div>
            <strong>Indexer Rewards</strong>:{' '}
            <GrtSubtext
              grt={
                subgraph.currentVersion.subgraphDeployment.indexingRewardAmount
              }
            />
          </div>
          <div>
            <strong>Query Fees</strong>:{' '}
            <GrtSubtext
              grt={subgraph.currentVersion.subgraphDeployment.queryFeesAmount}
            />
          </div>
        </div>
        <div className={classNames('property')}>
          <h2>Curation Stats</h2>
          <div>
            <strong>Curator Rewards</strong>:{' '}
            <GrtSubtext
              grt={subgraph.currentVersion.subgraphDeployment.curatorFeeRewards}
            />
          </div>
          <div>
            <strong>Price per share</strong>:{' '}
            <GrtSubtext
              grt={subgraph.currentVersion.subgraphDeployment.pricePerShare}
              convert={false}
            />
          </div>
        </div>
        {/* <div className={classNames('property')}>
          <div>
            <strong>Curators</strong>: {subgraph.nameSignalCount}
          </div>
        </div> */}
      </div>
      {renderTransactionChart()}
      {renderStats()}
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
}
