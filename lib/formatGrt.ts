import numeral from 'numeral'

export function formatGrt(grt: string | number) {
  if (typeof grt === 'string') {
    grt = parseInt(grt)
  }

  return grt * 10 ** -18
}
