import classNamesBind from 'classnames/bind'

// Styles
import styles from './styles.module.css'
const classNames = classNamesBind.bind(styles)

// Components
import Header from '../../components/Header'
import Head from '../../components/Head'
import Chart from '../../components/Chart'

export default function Curators() {
  return (
    <div>
      <Head />

      <Header />
      <main className={classNames('main')}>
        <Chart />
      </main>
    </div>
  )
}
