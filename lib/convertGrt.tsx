import numeral from 'numeral'

export function convertGrt(grt, format = '0,0') {
  return numeral(grt * 10 ** -18).format(format)
}
