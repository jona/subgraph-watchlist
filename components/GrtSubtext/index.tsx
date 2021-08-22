import classNamesBind from 'classnames/bind'
import numeral from 'numeral'

import { convertGrt } from '../../lib/convertGrt'

// Styles
import styles from './styles.module.css'
const classNames = classNamesBind.bind(styles)

export interface OwnProps {
  grt: string | number
  convert?: boolean
  format?: string
}

export default function GrtSubtext({
  grt,
  convert = true,
  format = '0,0',
}: OwnProps) {
  let grtText = grt

  if (convert) {
    grtText = convertGrt(grtText, format)
  } else {
    if (typeof grtText === 'string') {
      grtText = parseInt(grtText)
    }

    grtText = numeral(grtText).format(format)
  }

  return (
    <span>
      {grtText} <span className={classNames('subtext')}>GRT</span>
    </span>
  )
}
