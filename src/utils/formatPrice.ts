export const pesoFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP'
})

export enum Currencies {
  USD = 'USD',
  CLP = 'CLP',
  PEN = 'PEN'
}

export const CurrencyLocales: Record<Currencies, string> = {
  [Currencies.USD]: 'en-US',
  [Currencies.CLP]: 'es-CL',
  [Currencies.PEN]: 'es-PE'
}

export const defaultCurrencyOptions: Record<
  Currencies,
  Intl.NumberFormatOptions
> = {
  [Currencies.CLP]: {},
  [Currencies.USD]: {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  },
  [Currencies.PEN]: {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }
}

export const priceFormatter = (
  price: number,
  currency: Currencies,
  options?: Intl.NumberFormatOptions
) => {
  const formatter = new Intl.NumberFormat(CurrencyLocales[currency], {
    style: 'currency',
    currency: currency ?? Currencies.CLP,
    ...(options ?? defaultCurrencyOptions[currency])
  })

  const value = formatter.format(price).replace(/\s/g, '')

  if (currency === Currencies.USD) return `USD ${value}`
  return value
}
