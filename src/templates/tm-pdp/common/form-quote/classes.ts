import { SitesNames } from '../../../../types'

export const getTextColorForSite = (site: SitesNames) => {
  switch (site) {
    case SitesNames.PORTILLO:
      return `text-${site}-primary-light`

    case SitesNames.WIGO_MOTORS:
      return `text-${site}-secondary-dark`

    default:
      return `text-${site}-primary-dark`
  }
}
