// General
import { useState } from 'react'
import numeral from 'numeral'
import useSWR from 'swr'
import { Bar } from 'react-chartjs-2'
import 'chartjs-adapter-moment'
import classNamesBind from 'classnames/bind'
import Select from 'react-select'
import moment from 'moment'

// Styles
import styles from './styles.module.css'
const classNames = classNamesBind.bind(styles)

// Lib
import { styles as selectStyles } from '../../lib/select/styles'
import { formatGrt } from '../../lib/formatGrt'

// Fetchers
import { fetch } from '../../fetchers/transactionPaginated'

export interface OwnProps {}

export default function Chart(this: any) {
  const [range, setRange] = useState(7)

  const { data } = useSWR(
    `transactions+${range}`,
    fetch.bind(this, range, 0, []),
  )

  const transactions = data

  // #####################################
  // Helper functions
  // #####################################
  const formatData = () => {
    if (!transactions) return

    let aggregate: any = {}

    transactions.forEach((transaction: any) => {
      const date = moment(transaction.timestamp * 1000).format('MM/DD/YY')

      if (!aggregate[date]) {
        aggregate[date] = {
          minted: 0,
          burned: 0,
        }
      }

      if (transaction.type == 'MintNSignal') {
        aggregate[date].minted += parseInt(transaction.tokens)
      } else if (transaction.type == 'BurnNSignal') {
        aggregate[date].burned += parseInt(transaction.tokens)
      }
    })

    return aggregate
  }

  // #####################################
  // Modify functions
  // #####################################
  const changeRange = (event: any) => {
    setRange(event.value)
  }

  // #####################################
  // Render functions
  // #####################################
  const renderTransactionChart = () => {
    const formattedData = formatData()

    const minted = []
    const burned = []
    for (const key in formattedData) {
      if (Object.prototype.hasOwnProperty.call(formattedData, key)) {
        minted.push(formatGrt(formattedData[key].minted))
        burned.push(formatGrt(formattedData[key].burned))
      }
    }

    const data = {
      labels: Object.keys(formattedData).reverse(),
      datasets: [
        {
          label: 'Minted',
          data: minted.reverse(),
          backgroundColor: 'rgb(13 6 72 / 88%)',
          borderColor: 'rgb(13 6 72 / 88%)',
        },
        {
          label: 'Burned',
          data: burned.reverse(),
          backgroundColor: '#6044d0',
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
            onChange={changeRange}
            options={selectOptions}
            defaultValue={selectedOption}
          />
          <Bar
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

  function renderLoadingState() {
    return (
      <div className={classNames('loading', 'card')}>
        <div>Loading...</div>
      </div>
    )
  }

  if (!transactions) return renderLoadingState()

  // #####################################
  // Return
  // #####################################
  return (
    <div className={classNames('card')}>
      <div className={classNames('cardHeader')}>
        <div>
          <h2>Total Minted / Burned</h2>
        </div>
      </div>
      {renderTransactionChart()}
    </div>
  )
}
