import { SitesNames } from '../../types'

interface GetFaviconForSiteResult {
  faviconPng: string
  faviconSvg: string
}

export const getFaviconForSite = (
  site: SitesNames
): GetFaviconForSiteResult => {
  switch (site) {
    case SitesNames.WIGO_MOTORS:
      return {
        faviconPng: '/favicons/wigo.png',
        faviconSvg: '/favicons/wigo.svg'
      }

    case SitesNames.PORTILLO:
      return {
        faviconPng: '/favicons/portillo.png',
        faviconSvg: '/favicons/portillo.svg'
      }

    case SitesNames.SALAZAR_ISRAEL:
      return {
        faviconPng: '/favicons/salazarIsrael.png',
        faviconSvg: '/favicons/salazarIsrael.svg'
      }

    case SitesNames.COSECHE:
      return {
        faviconPng: '/favicons/coseche.png',
        faviconSvg: ''
      }

    default:
      return {
        faviconPng: '',
        faviconSvg: ''
      }
  }
}
