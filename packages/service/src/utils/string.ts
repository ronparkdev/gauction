const withComma = (x: number) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

const getReadablePrice = (price: number) => {
  const quotient = Math.floor(price / 10_000 / 10_000)
  const remainder = Math.floor((price / 10_000) % 10_000)
  if (quotient > 0) {
    return `${StringUtils.withComma(quotient)}억${remainder > 0 ? ` ${StringUtils.withComma(remainder)}만원` : ''}`
  }
  return `${StringUtils.withComma(remainder)}만원`
}

export const StringUtils = {
  withComma,
  getReadablePrice,
}
