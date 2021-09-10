const withComma = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export const StringUtils = {
  withComma,
}
