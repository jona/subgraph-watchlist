import numeral from 'numeral'

export function convertGrt(grt: string | number, format = '0,0') {
  if (typeof grt === 'string') {
    grt = parseInt(grt)
  }

  return numeral(grt * 10 ** -18).format(format)
}
