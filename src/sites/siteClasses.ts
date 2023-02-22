import { SitesNames } from '../types'

export const sitePrimaryTextClass = (site: SitesNames) => {
  switch (site) {
    case SitesNames.COSECHE:
      return 'text-CO-primary-dark'
    case SitesNames.PORTILLO:
      return 'text-PO-primary-light'
    case SitesNames.WIGO_MOTORS:
      return 'text-gray-900'
    case SitesNames.SALAZAR_ISRAEL:
    default:
      return 'text-SI-primary-dark'
  }
}

export const siteImportantPrimaryTextClass = (site: SitesNames) => {
  switch (site) {
    case SitesNames.COSECHE:
      return '!text-CO-primary-dark'
    case SitesNames.PORTILLO:
      return '!text-PO-primary-light'
    case SitesNames.WIGO_MOTORS:
      return '!text-gray-900'
    case SitesNames.SALAZAR_ISRAEL:
    default:
      return '!text-SI-primary-dark'
  }
}

export const sitePrimaryHoverClass = (site: SitesNames) => {
  switch (site) {
    case SitesNames.COSECHE:
      return 'hover:text-CO-secondary-light'
    case SitesNames.PORTILLO:
      return 'hover:text-PO-primary-light'
    case SitesNames.SALAZAR_ISRAEL:
    default:
      return 'hover:text-SI-primary-dark'
  }
}
