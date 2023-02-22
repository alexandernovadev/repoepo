import { Price } from '../../types/contentful/car'
import { priceFormatter } from '../formatPrice'

export const getLowestPrice = (prices: Price[] | undefined) => {
  if (!prices || !prices[0]) {
    return null
  }

  const { listPrice, priceCC, priceSC, priceSP, priceOP, currency } = prices[0]

  let priceKey: keyof Price = 'listPrice'
  let mainPrice = listPrice ?? priceCC ?? priceSC ?? priceSP ?? priceOP ?? 0

  if (priceCC && priceCC < mainPrice) {
    mainPrice = priceCC
    priceKey = 'priceCC'
  }

  if (priceSC && priceSC < mainPrice) {
    mainPrice = priceSC
    priceKey = 'priceSC'
  }

  if (priceSP && priceSP < mainPrice) {
    mainPrice = priceSP
    priceKey = 'priceSP'
  }

  if (priceOP && priceOP < mainPrice) {
    mainPrice = priceOP
    priceKey = 'priceOP'
  }

  if (mainPrice === 0) {
    return null
  }

  const response = {
    price: priceFormatter(mainPrice, currency),
    secondPrice: '',
    priceKey
  }

  if (prices[1] && prices[1][priceKey]) {
    const secondPrice = prices[1][priceKey] as number
    const secondCurrency = prices[1].currency

    response.secondPrice = priceFormatter(secondPrice, secondCurrency)
  }

  return response
}
