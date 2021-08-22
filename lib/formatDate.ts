import moment from 'moment'

export function formatDate(date: string | number) {
  return moment(date).format('MM/DD/YY, h:mm:ss a')
}
