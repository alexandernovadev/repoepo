import { SitesNames } from '../../types'

interface GetFontForSiteResult {
  preloadHref: string
  cssHref: string
  bodyClass: string
}

export const getFontForSite = (site: SitesNames): GetFontForSiteResult => {
  switch (site) {
    case SitesNames.WIGO_MOTORS:
      return {
        preloadHref: '/assets/fonts/Raleway-VF.woff2',
        cssHref: '/assets/styles/raleway.css',
        bodyClass: 'font-raleway'
      }

    case SitesNames.PORTILLO:
      return {
        preloadHref: '/assets/fonts/Exo-VF.woff2',
        cssHref: '/assets/styles/exo.css',
        bodyClass: 'font-exo'
      }
    case SitesNames.COSECHE:
      return {
        preloadHref: '/assets/fonts/Louis-Regular.ttf',
        cssHref: '/assets/styles/louis.css',
        bodyClass: 'font-louis'
      }

    default:
      return {
        preloadHref: '/assets/fonts/Montserrat-VF.woff2',
        cssHref: '/assets/styles/montserrat.css',
        bodyClass: 'font-montserrat'
      }
  }
}
