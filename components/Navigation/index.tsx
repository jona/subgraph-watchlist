// General
import classNamesBind from 'classnames/bind'
import Link from 'next/link'

// Styles
import styles from './styles.module.css'
const classNames = classNamesBind.bind(styles)

export default function Navigation() {
  return (
    <ul className={classNames('container')}>
      <li>
        <Link href="/">Home</Link>
      </li>
      <li>
        <Link href="/subgraph-analytics">Subgraph Analytics</Link>
      </li>
    </ul>
  )
}
