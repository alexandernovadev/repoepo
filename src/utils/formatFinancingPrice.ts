import { Currencies, priceFormatter } from './formatPrice'

export const formatFinancingPrice = (
  n: number,
  currency: Currencies
): string => {
  return priceFormatter(n, currency, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}
