import { SitesNames } from '../types'

const countryDigitsRegex = /^\+?\d{3}/g
const numberBodyRegex = /\d{1,4}/g

const formatCountryDigits = (value: string) => {
  if (value[0] === '+') return `${value.slice(0, 3)} ${value[3]}`
  return `${value.slice(0, 2)} ${value[2]}`
}

const formatNumberBody = (value: string) => ` ${value}`

const formatChileanPhoneNumber = (value: string) => {
  let countryCode = ''
  let numberBody = ''
  if (value[0] === '+') {
    countryCode = value.slice(0, 4)
    numberBody = value.slice(4)
  } else {
    countryCode = value.slice(0, 3)
    numberBody = value.slice(3)
  }
  countryCode = countryCode.replace(countryDigitsRegex, formatCountryDigits)
  numberBody = numberBody.replace(numberBodyRegex, formatNumberBody)
  return `${countryCode}${numberBody}`
}

const formatPeruvianPhoneNumber = (value: string) =>
  value.replace(
    /(^\+?\d{1,2})|(\d{1,3})/g,
    (_, countryPrefix, body) => countryPrefix ?? ` ${body}`
  )

export const formatPhoneNumber = (value: string, site?: SitesNames) => {
  switch (site) {
    case SitesNames.WIGO_MOTORS:
      return formatPeruvianPhoneNumber(value)
    default:
      return formatChileanPhoneNumber(value)
  }
}
