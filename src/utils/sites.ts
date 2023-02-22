import { SitesNames } from '../types'

export const getCompanyId = (site: SitesNames) => {
  switch (site) {
    case SitesNames.SALAZAR_ISRAEL:
      return 1
    case SitesNames.PORTILLO:
      return 19
    case SitesNames.WIGO_MOTORS:
      return 30
    case SitesNames.COSECHE:
      return 23
  }

  return 1
}

export const getCompanyRequestHeader = (site: SitesNames) => ({
  companyId: getCompanyId(site)
})
