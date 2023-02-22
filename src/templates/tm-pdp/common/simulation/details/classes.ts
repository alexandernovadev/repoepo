import { SitesNames } from '../../../../../types'

export const valueColor = (site: SitesNames) =>
  site === SitesNames.PORTILLO
    ? `text-${site}-primary-light`
    : `text-${site}-primary-dark`
