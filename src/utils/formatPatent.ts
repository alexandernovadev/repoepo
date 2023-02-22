import { SitesNames } from '../types'

export const patentRegex = /^[A-Z]{2}([A-Z]{2}|[0-9]{2})[0-9]{2}$/i

export const formatPatent = (patent = '', site: SitesNames) => {
  switch (site) {
    case SitesNames.SALAZAR_ISRAEL:
      return patent.replace(/\w{2}(?!$)/g, (value) => `${value} `)
    case SitesNames.WIGO_MOTORS:
      return patent.replace(/\w{3}(?!$)/g, (value) => `${value} `)
    default:
      return patent.replace(/\w{2}(?!$)/g, (value) => `${value} `)
  }
}
